# TypedArray, ArrayBuffer, and SharedArrayBuffer Concatenation

ECMAScript Proposal for TypedArray, ArrayBuffer, and SharedArrayBuffer concatenation

This proposal is currently [stage 1](https://github.com/tc39/proposals/blob/master/README.md) of the [process](https://tc39.github.io/process-document/).

## Problem

ECMAScript should provide native methods for concatenating TypedArrays and ArrayBuffers that enable implementations to optimize through strategies that can avoid the current requirement of eagerly allocating and copying data into new buffers.

It is common for applications on the web (both browser and server side) to need to concatenate two or more TypedArray or ArrayBuffer instances as part of a data pipeline. Unfortunately, the mechanisms available for concatenation are difficult to optimize for performance. All require additional allocations and copying at inopportune times in the application.

A common example is a `WritableStream` instance that collects writes up to a defined threshold before passing those on in a single coalesced chunk. Server-side applications have typically relied on Node.js' `Buffer.concat` API, while browser applications have relied on either browser-compatible polyfills of `Buffer` or `TypedArray.prototype.set`.

```js
let buffers = [];
let size = 0;
new WritableStream({
  write(chunk) {
    buffers.push(chunk);
    size += chunk.length;
    if (size >= 4096) {
      flushBuffer(concat(buffers, size));
      buffers = [];
      size = 0;
    }
  }
});

function concat(buffers, size) {
  const dest = new Uint8Array(size);
  let offset = 0;
  for (const buffer of buffers) {
    dest.set(buffer, offset);
    offset += buffer.length;
  }
  return dest;
}
```

While these approaches work, they end up being difficult to optimize because they require potentially expensive allocations and data copying at inopportune times while processing the information. The `TypedArray.prototype.set` method does provide an approach for concatenation that is workable, but the way the algorithm is defined, there is no allowance given for implementation-defined optimization.

## Proposal

This proposal provides three complementary static methods for concatenation:

1. **`%TypedArray%.concat(items [, length])`** — element-oriented concatenation of same-type TypedArrays
2. **`ArrayBuffer.concat(items [, options])`** — byte-oriented concatenation returning an ArrayBuffer
3. **`SharedArrayBuffer.concat(items [, options])`** — byte-oriented concatenation returning a SharedArrayBuffer

All three methods afford implementations the ability to determine the most optimal approach, and optimal timing, for performing the allocations and copies, but no specific optimization is required.

`%TypedArray%.concat` accepts only TypedArrays of the same type as the constructor (e.g., all `Uint8Array` for `Uint8Array.concat`), though those TypedArrays may be backed by either an ArrayBuffer or a SharedArrayBuffer. `ArrayBuffer.concat` and `SharedArrayBuffer.concat` accept any mix of ArrayBuffer, SharedArrayBuffer, TypedArray, and DataView inputs — the return type is determined by which method is called, not by the input types.

### `%TypedArray%.concat(items [, length])`

Concatenates multiple TypedArrays of the same type into a new TypedArray.

```js
const enc = new TextEncoder();
const u8_1 = enc.encode('Hello ');
const u8_2 = enc.encode('World!');
const u8_3 = Uint8Array.concat([u8_1, u8_2]);
// u8_3 contains: Uint8Array [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]
```

- `items` — an iterable of TypedArray instances, all of the same type as the constructor.
- `length` (optional) — a non-negative integer specifying the element length of the result. If less than the total, the result is truncated. If greater, the result is zero-filled. Defaults to the sum of all input lengths.

All items must be TypedArrays of the same type as the constructor (e.g., all `Uint8Array` for `Uint8Array.concat`). A `TypeError` is thrown if any item is a different type. Items may be backed by either an ArrayBuffer or a SharedArrayBuffer.

A `TypeError` is thrown if any item is a detached TypedArray. A `RangeError` is thrown if the total element count exceeds 2<sup>53</sup> - 1.

```js
// Truncate to 5 elements
const truncated = Uint8Array.concat([u8_1, u8_2], 5);

// Zero-fill to 20 elements
const padded = Uint8Array.concat([u8_1, u8_2], 20);

// WritableStream coalescing example
let buffers = [];
let size = 0;
new WritableStream({
  write(chunk) {
    buffers.push(chunk);
    size += chunk.length;
    if (size >= 4096) {
      flushBuffer(Uint8Array.concat(buffers, size));
      buffers = [];
      size = 0;
    }
  }
});
```

The `concat` method is available on all TypedArray constructors:

```js
// Integer types
Int8Array.concat([new Int8Array([-1, 127]), new Int8Array([0, -128])]);
// → Int8Array [-1, 127, 0, -128]

Uint8Array.concat([new Uint8Array([0, 255]), new Uint8Array([128])]);
// → Uint8Array [0, 255, 128]

Uint8ClampedArray.concat([new Uint8ClampedArray([0, 255]), new Uint8ClampedArray([128])]);
// → Uint8ClampedArray [0, 255, 128]

Int16Array.concat([new Int16Array([-1, 32767]), new Int16Array([0])]);
// → Int16Array [-1, 32767, 0]

Uint16Array.concat([new Uint16Array([0, 65535]), new Uint16Array([256])]);
// → Uint16Array [0, 65535, 256]

Int32Array.concat([new Int32Array([-1, 2147483647]), new Int32Array([0])]);
// → Int32Array [-1, 2147483647, 0]

Uint32Array.concat([new Uint32Array([0, 4294967295]), new Uint32Array([256])]);
// → Uint32Array [0, 4294967295, 256]

// BigInt types
BigInt64Array.concat([new BigInt64Array([0n, -1n]), new BigInt64Array([9007199254740991n])]);
// → BigInt64Array [0n, -1n, 9007199254740991n]

BigUint64Array.concat([new BigUint64Array([0n, 1n]), new BigUint64Array([18446744073709551615n])]);
// → BigUint64Array [0n, 1n, 18446744073709551615n]

// Floating-point types
Float16Array.concat([new Float16Array([1.5, -0]), new Float16Array([Infinity, NaN])]);
// → Float16Array [1.5, -0, Infinity, NaN]

Float32Array.concat([new Float32Array([1.5, -0]), new Float32Array([Infinity, NaN])]);
// → Float32Array [1.5, -0, Infinity, NaN]

Float64Array.concat([new Float64Array([1.5, -0]), new Float64Array([Infinity, NaN])]);
// → Float64Array [1.5, -0, Infinity, NaN]
```

### `ArrayBuffer.concat(items [, options])`

Concatenates the byte contents of multiple ArrayBuffers, SharedArrayBuffers, TypedArrays, or DataViews into a new ArrayBuffer.

```js
const ab1 = new ArrayBuffer(4);
const ab2 = new ArrayBuffer(4);
const ab3 = ArrayBuffer.concat([ab1, ab2]);
// ab3.byteLength === 8
```

- `items` — an iterable of ArrayBuffer, SharedArrayBuffer, TypedArray, or DataView instances. For TypedArray and DataView inputs, only the viewed portion of the underlying buffer is included.
- `options` (optional) — an object with the following properties:
  - `length` — a non-negative integer specifying the byte length of the result. If less than the total input bytes, the result is truncated. If greater, the result is zero-filled. Defaults to the sum of all input byte lengths.
  - `resizable` — a boolean. If `true`, the result is a resizable ArrayBuffer where `length` specifies the maximum byte length (`maxByteLength`). The actual `byteLength` is the lesser of the total input bytes and `length`. Defaults to `false`.
  - `immutable` — a boolean. If `true`, the result is an immutable ArrayBuffer whose contents cannot be changed, resized, or detached. Defaults to `false`. *This option depends on the [Immutable ArrayBuffer proposal](https://github.com/tc39/proposal-immutable-arraybuffer).*

The `resizable` and `immutable` options are mutually exclusive. A `TypeError` is thrown if both are `true`.

A `TypeError` is thrown for detached buffers or out-of-bounds DataViews. A `RangeError` is thrown if the total byte count exceeds 2<sup>53</sup> - 1.

```js
// Mix of ArrayBuffer, TypedArray, and DataView inputs
const ab = new ArrayBuffer(4);
const u8 = new Uint8Array([1, 2, 3, 4]);
const dv = new DataView(new ArrayBuffer(2));
const result = ArrayBuffer.concat([ab, u8, dv]);
// result.byteLength === 10

// Truncate to 6 bytes
const truncated = ArrayBuffer.concat([ab, u8, dv], { length: 6 });

// Zero-fill to 16 bytes
const padded = ArrayBuffer.concat([ab, u8], { length: 16 });

// Create a resizable result with room to grow
const resizable = ArrayBuffer.concat([ab, u8], { resizable: true, length: 32 });
// resizable.byteLength === 8 (actual data)
// resizable.maxByteLength === 32 (can grow up to 32)

// Create an immutable result (requires Immutable ArrayBuffer proposal)
const immutable = ArrayBuffer.concat([ab, u8], { immutable: true });
// immutable.byteLength === 8
// immutable.immutable === true
```

### `SharedArrayBuffer.concat(items [, options])`

Concatenates the byte contents of multiple ArrayBuffers, SharedArrayBuffers, TypedArrays, or DataViews into a new SharedArrayBuffer.

```js
const sab1 = new SharedArrayBuffer(4);
const sab2 = new SharedArrayBuffer(4);
const sab3 = SharedArrayBuffer.concat([sab1, sab2]);
// sab3.byteLength === 8
```

- `items` — an iterable of ArrayBuffer, SharedArrayBuffer, TypedArray, or DataView instances. For TypedArray and DataView inputs, only the viewed portion of the underlying buffer is included.
- `options` (optional) — an object with the following properties:
  - `length` — a non-negative integer specifying the byte length of the result. If less than the total input bytes, the result is truncated. If greater, the result is zero-filled. Defaults to the sum of all input byte lengths.
  - `growable` — a boolean. If `true`, the result is a growable SharedArrayBuffer where `length` specifies the maximum byte length (`maxByteLength`). The actual `byteLength` is the lesser of the total input bytes and `length`. Defaults to `false`.

Note: The `immutable` option is not available for SharedArrayBuffers.

A `TypeError` is thrown for detached buffers or out-of-bounds DataViews. A `RangeError` is thrown if the total byte count exceeds 2<sup>53</sup> - 1.

```js
// Mix of SharedArrayBuffer, TypedArray, and DataView inputs
const sab = new SharedArrayBuffer(4);
const u8 = new Uint8Array([1, 2, 3, 4]);
const dv = new DataView(new ArrayBuffer(2));
const result = SharedArrayBuffer.concat([sab, u8, dv]);
// result.byteLength === 10

// Create a growable result with room to grow
const growable = SharedArrayBuffer.concat([sab, u8], { growable: true, length: 32 });
// growable.byteLength === 8 (actual data)
// growable.maxByteLength === 32 (can grow up to 32)
```

### Differences from `set`

Per the current definition of `TypedArray.prototype.set` in the language specification, the user code is responsible for allocating the destination `TypedArray` in advance along with calculating and updating the offset at which each copied segment should go. Allocations can be expensive and the book keeping can be cumbersome, particularly when there are multiple input `TypedArrays`. The `set` algorithm is also written such that each element of the copied `TypedArray` is copied to the destination one element at a time, with no affordance given to allow the implementation to determine an alternative, more optimal copy strategy.

### Why three methods?

`%TypedArray%.concat` operates at the TypedArray level — it is element-oriented, requires same-type inputs, and returns a TypedArray. This is the right level of abstraction when working with typed data (e.g., concatenating `Uint8Array` chunks in a stream).

`ArrayBuffer.concat` and `SharedArrayBuffer.concat` operate at the buffer level — they are byte-oriented, accept heterogeneous inputs (ArrayBuffer/SharedArrayBuffer, TypedArray, DataView), and return the appropriate buffer type. This is the right level of abstraction for controlling buffer properties like resizability/growability and immutability, which are concerns of the buffer, not the TypedArray.

`ArrayBuffer.concat` and `SharedArrayBuffer.concat` are separate methods because the return type differs and the available options differ (`immutable` is only available for ArrayBuffer, `growable` is only available for SharedArrayBuffer). This mirrors the existing separation between the `ArrayBuffer` and `SharedArrayBuffer` constructors in the language.
