'use strict';

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

const TypedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);
const TypedArrayConstructor = Object.getPrototypeOf(Uint8Array);

const typedArrayTypes = [
  Int8Array, Uint8Array, Uint8ClampedArray,
  Int16Array, Uint16Array,
  Int32Array, Uint32Array,
  BigInt64Array, BigUint64Array,
  Float32Array, Float64Array,
];

if (typeof Float16Array !== 'undefined') {
  typedArrayTypes.push(Float16Array);
}

function isTypedArray(value) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

function isDataView(value) {
  return value instanceof DataView;
}

function isArrayBuffer(value) {
  try {
    Reflect.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get.call(value);
    return true;
  } catch {
    return false;
  }
}

function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBuffer === 'undefined') return false;
  try {
    Reflect.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'byteLength').get.call(value);
    return true;
  } catch {
    return false;
  }
}

function isDetached(ab) {
  return ab.byteLength === 0 && !isSharedArrayBuffer(ab) &&
    (() => { try { new Uint8Array(ab); return false; } catch { return true; } })();
}

function validateIntegralNumber(value, defaultValue) {
  if (value === undefined) return defaultValue;
  if (typeof value !== 'number') throw new TypeError('Expected a number');
  if (Number.isNaN(value)) throw new RangeError('Value must not be NaN');
  if (Math.trunc(value) !== value) throw new RangeError('Value must be an integer');
  return value;
}

function getOptionsObject(options) {
  if (options === undefined) return Object.create(null);
  if (options === null || typeof options !== 'object') {
    throw new TypeError('Options must be an object');
  }
  return options;
}

function getConcatenationSources(arrayList) {
  let totalByteLength = 0;
  const sources = [];

  for (const item of arrayList) {
    if (isTypedArray(item)) {
      if (isDetached(item.buffer)) throw new TypeError('TypedArray is detached');
      const byteLen = item.byteLength;
      sources.push({ buffer: item.buffer, byteOffset: item.byteOffset, byteLength: byteLen });
      totalByteLength += byteLen;
      if (totalByteLength > MAX_SAFE) throw new RangeError('Total byte length exceeds maximum');
    } else if (isDataView(item)) {
      if (isDetached(item.buffer)) throw new TypeError('DataView buffer is detached');
      const byteLen = item.byteLength;
      sources.push({ buffer: item.buffer, byteOffset: item.byteOffset, byteLength: byteLen });
      totalByteLength += byteLen;
      if (totalByteLength > MAX_SAFE) throw new RangeError('Total byte length exceeds maximum');
    } else if (isArrayBuffer(item) || isSharedArrayBuffer(item)) {
      if (!isSharedArrayBuffer(item) && isDetached(item)) {
        throw new TypeError('ArrayBuffer is detached');
      }
      const byteLen = item.byteLength;
      sources.push({ buffer: item, byteOffset: 0, byteLength: byteLen });
      totalByteLength += byteLen;
      if (totalByteLength > MAX_SAFE) throw new RangeError('Total byte length exceeds maximum');
    } else {
      throw new TypeError('Items must be ArrayBuffer, SharedArrayBuffer, TypedArray, or DataView');
    }
  }

  return { sources, totalByteLength };
}

function copySourcesToBuffer(dest, sources) {
  const destView = new Uint8Array(dest);
  let writeOffset = 0;

  for (const source of sources) {
    const remaining = dest.byteLength - writeOffset;
    if (remaining <= 0) break;
    const count = Math.min(source.byteLength, remaining);
    const srcView = new Uint8Array(source.buffer, source.byteOffset, count);
    destView.set(srcView, writeOffset);
    writeOffset += count;
  }
}

function validateByteLength(lengthOption) {
  let newByteLength;
  if (lengthOption !== undefined) {
    newByteLength = validateIntegralNumber(lengthOption, 0);
    if (newByteLength < 0) throw new RangeError('Length must not be negative');
    if (newByteLength > MAX_SAFE) throw new RangeError('Length exceeds maximum');
  }
  return newByteLength;
}

// %TypedArray%.concat
function typedArrayConcat(items, length) {
  const C = this;
  if (typeof C !== 'function') throw new TypeError('Constructor must be a function');
  if (!typedArrayTypes.includes(C)) throw new TypeError('Not a TypedArray constructor');

  const arrayList = [...items];

  let newLength;
  if (length !== undefined) {
    newLength = validateIntegralNumber(length, 0);
    if (newLength < 0) throw new RangeError('Length must not be negative');
    if (newLength > MAX_SAFE) throw new RangeError('Length exceeds maximum');
  }

  let totalLength = 0;
  for (const item of arrayList) {
    if (!isTypedArray(item)) throw new TypeError('All items must be TypedArrays');
    if (item.constructor !== C) throw new TypeError('All items must be the same TypedArray type');
    if (isDetached(item.buffer)) throw new TypeError('TypedArray is detached');
    totalLength += item.length;
    if (totalLength > MAX_SAFE) throw new RangeError('Total length exceeds maximum');
  }

  if (newLength === undefined) newLength = totalLength;

  const result = new C(newLength);
  let writeOffset = 0;
  for (const item of arrayList) {
    const remaining = newLength - writeOffset;
    if (remaining <= 0) break;
    const count = Math.min(item.length, remaining);
    result.set(item.subarray(0, count), writeOffset);
    writeOffset += count;
  }

  return result;
}

// ArrayBuffer.concat
function arrayBufferConcat(items, options) {
  const arrayList = [...items];
  const opts = getOptionsObject(options);
  const newByteLength = validateByteLength(opts.length);
  const resizable = !!opts.resizable;
  const immutable = !!opts.immutable;

  if (resizable && immutable) {
    throw new TypeError('resizable and immutable are mutually exclusive');
  }

  const { sources, totalByteLength } = getConcatenationSources(arrayList);
  const byteLength = newByteLength !== undefined ? newByteLength : totalByteLength;

  let result;
  if (resizable) {
    const maxByteLength = byteLength;
    const actualByteLength = Math.min(totalByteLength, maxByteLength);
    result = new ArrayBuffer(actualByteLength, { maxByteLength });
  } else {
    result = new ArrayBuffer(byteLength);
  }

  copySourcesToBuffer(result, sources);

  if (immutable && typeof result.transferToImmutable === 'function') {
    result = result.transferToImmutable();
  }

  return result;
}

// SharedArrayBuffer.concat
function sharedArrayBufferConcat(items, options) {
  if (typeof SharedArrayBuffer === 'undefined') {
    throw new TypeError('SharedArrayBuffer is not available');
  }

  const arrayList = [...items];
  const opts = getOptionsObject(options);
  const newByteLength = validateByteLength(opts.length);
  const growable = !!opts.growable;

  const { sources, totalByteLength } = getConcatenationSources(arrayList);
  const byteLength = newByteLength !== undefined ? newByteLength : totalByteLength;

  let result;
  if (growable) {
    const maxByteLength = byteLength;
    const actualByteLength = Math.min(totalByteLength, maxByteLength);
    result = new SharedArrayBuffer(actualByteLength, { maxByteLength });
  } else {
    result = new SharedArrayBuffer(byteLength);
  }

  copySourcesToBuffer(result, sources);
  return result;
}

// Install
for (const TA of typedArrayTypes) {
  if (!TA.concat) {
    Object.defineProperty(TA, 'concat', {
      value: typedArrayConcat,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}

if (!ArrayBuffer.concat) {
  Object.defineProperty(ArrayBuffer, 'concat', {
    value: arrayBufferConcat,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

if (typeof SharedArrayBuffer !== 'undefined' && !SharedArrayBuffer.concat) {
  Object.defineProperty(SharedArrayBuffer, 'concat', {
    value: sharedArrayBufferConcat,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
