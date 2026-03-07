# Comprehensive Test Cases

**Spec version**: `060d39f`
**Generated**: 2026-03-07
**Total assertions**: ~350

Test cases for `%TypedArray%.concat`, `ArrayBuffer.concat`, and `SharedArrayBuffer.concat`.

### Identifier Convention

Each checkbox line has a unique identifier in the form `[section.subsection.number]`, e.g. `[2.1.1]`.

Where a test case is preceded by a "For each ..." qualifier (e.g. "For each TypedArray type"), each variation is referenced by appending a lowercase letter suffix following the order in which the items appear in the qualifier list.

---

## 1. `%TypedArray%.concat` — Receiver Validation

### 1.1 Invalid `this` value (not a constructor)

- [ ] [1.1.1] `%TypedArray%.concat.call(undefined, [])` → TypeError
- [ ] [1.1.2] `%TypedArray%.concat.call(null, [])` → TypeError
- [ ] [1.1.3] `%TypedArray%.concat.call({}, [])` → TypeError
- [ ] [1.1.4] `%TypedArray%.concat.call(42, [])` → TypeError
- [ ] [1.1.5] `%TypedArray%.concat.call('string', [])` → TypeError
- [ ] [1.1.6] `%TypedArray%.concat.call(true, [])` → TypeError
- [ ] [1.1.7] `%TypedArray%.concat.call(Symbol(), [])` → TypeError
- [ ] [1.1.8] `%TypedArray%.concat.call(() => {}, [])` → TypeError (arrow function is callable but IsConstructor is false)

### 1.2 Constructor not in Table 70

- [ ] [1.2.1] `%TypedArray%.concat.call(Array, [])` → TypeError (Array is a constructor but does not appear in Table 70)
- [ ] [1.2.2] `%TypedArray%.concat.call(Object, [])` → TypeError
- [ ] [1.2.3] `%TypedArray%.concat.call(function(){}, [])` → TypeError (custom constructor, not in Table 70)

### 1.3 Valid TypedArray constructors

For each TypedArray constructor (`Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float16Array`, `Float32Array`, `Float64Array`, `BigInt64Array`, `BigUint64Array`):

- [ ] [1.3.1] `<Constructor>.concat([])` does not throw (valid receiver, empty items)

---

## 2. `%TypedArray%.concat` — Items Validation

### 2.1 Items is not iterable

- [ ] [2.1.1] `Uint8Array.concat(undefined)` → TypeError
- [ ] [2.1.2] `Uint8Array.concat(null)` → TypeError
- [ ] [2.1.3] `Uint8Array.concat(42)` → TypeError
- [ ] [2.1.4] `Uint8Array.concat({})` → TypeError (plain object, no `Symbol.iterator`)
- [ ] [2.1.5] `Uint8Array.concat('hello')` → TypeError (string is iterable but items should be TypedArrays; the string chars will fail `ValidateTypedArray`)
- [ ] [2.1.6] `Uint8Array.concat({ [Symbol.iterator]: null })` → TypeError (`GetMethod` returns *undefined* when property is *null*)

### 2.2 Items iterable throws during iteration

- [ ] [2.2.1] Items iterable whose `Symbol.iterator` method throws → error propagates
- [ ] [2.2.2] Items iterable whose iterator's `next()` throws → error propagates

### 2.3 Item is not a TypedArray (`ValidateTypedArray` fails)

- [ ] [2.3.1] `Uint8Array.concat([new ArrayBuffer(4)])` → TypeError
- [ ] [2.3.2] `Uint8Array.concat([new DataView(new ArrayBuffer(4))])` → TypeError
- [ ] [2.3.3] `Uint8Array.concat([{}])` → TypeError
- [ ] [2.3.4] `Uint8Array.concat([42])` → TypeError
- [ ] [2.3.5] `Uint8Array.concat([null])` → TypeError
- [ ] [2.3.6] `Uint8Array.concat([undefined])` → TypeError
- [ ] [2.3.7] `Uint8Array.concat([[1, 2, 3]])` → TypeError (plain Array)

### 2.4 Item is a TypedArray with a detached buffer

- [ ] [2.4.1] Single detached TypedArray in items → TypeError from `ValidateTypedArray`
  ```js
  const a = new Uint8Array(4);
  a.buffer.transfer();
  Uint8Array.concat([a]) // → TypeError
  ```
- [ ] [2.4.2] First item valid, second item detached → TypeError on second item
  ```js
  const a = new Uint8Array([1, 2]);
  const b = new Uint8Array(4);
  b.buffer.transfer();
  Uint8Array.concat([a, b]) // → TypeError
  ```

### 2.5 Item is a different TypedArray type (`[[TypedArrayName]]` mismatch)

- [ ] [2.5.1] `Uint8Array.concat([new Int8Array([1, 2])])` → TypeError
- [ ] [2.5.2] `Uint8Array.concat([new Uint16Array([1, 2])])` → TypeError
- [ ] [2.5.3] `Uint8Array.concat([new Float64Array([1, 2])])` → TypeError
- [ ] [2.5.4] `Uint8Array.concat([new BigInt64Array([1n, 2n])])` → TypeError
- [ ] [2.5.5] `Uint8Array.concat([new Uint8ClampedArray([1, 2])])` → TypeError (Uint8ClampedArray !== Uint8Array)
- [ ] [2.5.6] `Int32Array.concat([new Uint32Array([1, 2])])` → TypeError
- [ ] [2.5.7] `BigInt64Array.concat([new BigUint64Array([1n, 2n])])` → TypeError
- [ ] [2.5.8] Mixed valid and invalid: `Uint8Array.concat([new Uint8Array([1]), new Int16Array([2])])` → TypeError on second item

### 2.6 Valid same-type items

For each TypedArray type (`Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float16Array`, `Float32Array`, `Float64Array`):

- [ ] [2.6.1] `<Type>.concat([new <Type>([1, 2]), new <Type>([3, 4])])` → `<Type> [1, 2, 3, 4]`

For each BigInt type (`BigInt64Array`, `BigUint64Array`):

- [ ] [2.6.2] `<Type>.concat([new <Type>([1n, 2n]), new <Type>([3n, 4n])])` → `<Type> [1n, 2n, 3n, 4n]`

---

## 3. `%TypedArray%.concat` — Length Parameter Validation (`ValidateIntegralNumber`)

### 3.1 Length not provided (defaults to total)

- [ ] [3.1.1] `Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4])])` → `Uint8Array [1, 2, 3, 4]` (length 4)
- [ ] [3.1.2] `Uint8Array.concat([])` → `Uint8Array []` (length 0)

### 3.2 Length is `undefined` (same as not provided)

- [ ] [3.2.1] `Uint8Array.concat([new Uint8Array([1, 2])], undefined)` → `Uint8Array [1, 2]`

### 3.3 Length is non-Number → TypeError

- [ ] [3.3.1] `Uint8Array.concat([], 'hello')` → TypeError
- [ ] [3.3.2] `Uint8Array.concat([], {})` → TypeError
- [ ] [3.3.3] `Uint8Array.concat([], true)` → TypeError
- [ ] [3.3.4] `Uint8Array.concat([], null)` → TypeError
- [ ] [3.3.5] `Uint8Array.concat([], Symbol())` → TypeError
- [ ] [3.3.6] `Uint8Array.concat([], 1n)` → TypeError

### 3.4 Length is NaN → RangeError

- [ ] [3.4.1] `Uint8Array.concat([], NaN)` → RangeError

### 3.5 Length is non-integral → RangeError

- [ ] [3.5.1] `Uint8Array.concat([], 1.5)` → RangeError
- [ ] [3.5.2] `Uint8Array.concat([], 0.1)` → RangeError
- [ ] [3.5.3] `Uint8Array.concat([], Infinity)` → RangeError
- [ ] [3.5.4] `Uint8Array.concat([], -Infinity)` → RangeError

### 3.6 Length is negative → RangeError

- [ ] [3.6.1] `Uint8Array.concat([], -1)` → RangeError
- [ ] [3.6.2] `Uint8Array.concat([], -100)` → RangeError

### 3.7 Length exceeds 2^53 - 1 → RangeError

- [ ] [3.7.1] `Uint8Array.concat([], 2 ** 53)` → RangeError
- [ ] [3.7.2] `Uint8Array.concat([], Number.MAX_SAFE_INTEGER + 1)` → RangeError

### 3.8 Length is -0 (treated as 0)

- [ ] [3.8.1] `Uint8Array.concat([new Uint8Array([1, 2])], -0)` → `Uint8Array []` (ℝ(-0) is 0, truncates to empty)

### 3.9 Valid length values

- [ ] [3.9.1] `Uint8Array.concat([new Uint8Array([1, 2])], 0)` → `Uint8Array []` (truncated to 0)
- [ ] [3.9.2] `Uint8Array.concat([new Uint8Array([1, 2])], 1)` → `Uint8Array [1]` (truncated to 1)
- [ ] [3.9.3] `Uint8Array.concat([new Uint8Array([1, 2])], 2)` → `Uint8Array [1, 2]` (exact)
- [ ] [3.9.4] `Uint8Array.concat([new Uint8Array([1, 2])], 5)` → `Uint8Array [1, 2, 0, 0, 0]` (zero-filled)

---

## 4. `%TypedArray%.concat` — Overflow Check on `totalLength`

### 4.1 Total length exceeds 2^53 - 1

- [ ] [4.1.1] Concatenating items whose combined element lengths exceed 2^53 - 1 → RangeError
- [ ] [4.1.2] Overflow check is per-item (fails as soon as running total exceeds limit, not after entire loop)

Note: In practice, creating TypedArrays large enough to trigger this is implementation-limited. These tests may need to be adapted based on available memory.

---

## 5. `%TypedArray%.concat` — Basic Concatenation

### 5.1 Two arrays

For each non-BigInt type (`Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float16Array`, `Float32Array`, `Float64Array`):

- [ ] [5.1.1] `<Type>.concat([new <Type>([1, 2, 3]), new <Type>([4, 5, 6])])` → `<Type> [1, 2, 3, 4, 5, 6]`

For each BigInt type (`BigInt64Array`, `BigUint64Array`):

- [ ] [5.1.2] `<Type>.concat([new <Type>([1n, 2n, 3n]), new <Type>([4n, 5n, 6n])])` → `<Type> [1n, 2n, 3n, 4n, 5n, 6n]`

### 5.2 Three or more arrays

- [ ] [5.2.1] `Uint8Array.concat([new Uint8Array([1]), new Uint8Array([2]), new Uint8Array([3])])` → `Uint8Array [1, 2, 3]`
- [ ] [5.2.2] `Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4]), new Uint8Array([5, 6]), new Uint8Array([7, 8])])` → `Uint8Array [1, 2, 3, 4, 5, 6, 7, 8]`

### 5.3 Single array

- [ ] [5.3.1] `Uint8Array.concat([new Uint8Array([1, 2, 3])])` → `Uint8Array [1, 2, 3]` (copy of the input)
- [ ] [5.3.2] Result is a new TypedArray (not the same object):
  ```js
  const a = new Uint8Array([1, 2, 3]);
  const b = Uint8Array.concat([a]);
  b !== a // → true
  b.buffer !== a.buffer // → true
  ```

### 5.4 Empty items list

- [ ] [5.4.1] `Uint8Array.concat([])` → `Uint8Array []` (length 0)
- [ ] [5.4.2] Result has a fresh ArrayBuffer:
  ```js
  const result = Uint8Array.concat([]);
  result.byteLength === 0 // → true
  result.buffer instanceof ArrayBuffer // → true
  ```

### 5.5 Items containing zero-length TypedArrays

- [ ] [5.5.1] `Uint8Array.concat([new Uint8Array([]), new Uint8Array([1, 2])])` → `Uint8Array [1, 2]`
- [ ] [5.5.2] `Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([])])` → `Uint8Array [1, 2]`
- [ ] [5.5.3] `Uint8Array.concat([new Uint8Array([]), new Uint8Array([])])` → `Uint8Array []`
- [ ] [5.5.4] `Uint8Array.concat([new Uint8Array([1]), new Uint8Array([]), new Uint8Array([2])])` → `Uint8Array [1, 2]`

### 5.6 Result TypedArray type matches constructor

- [ ] [5.6.1] `Float64Array.concat([new Float64Array([1.5, 2.5])])` → result is a `Float64Array`, not `Uint8Array`
- [ ] [5.6.2] `BigInt64Array.concat([new BigInt64Array([1n])])` → result is a `BigInt64Array`

---

## 6. `%TypedArray%.concat` — Truncation and Zero-Fill

### 6.1 Truncation (length < totalLength)

- [ ] [6.1.1] `Uint8Array.concat([new Uint8Array([1, 2, 3, 4, 5])], 3)` → `Uint8Array [1, 2, 3]`
- [ ] [6.1.2] `Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4])], 3)` → `Uint8Array [1, 2, 3]` (truncates mid-second-array)
- [ ] [6.1.3] `Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4])], 2)` → `Uint8Array [1, 2]` (truncates at boundary)
- [ ] [6.1.4] `Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4]), new Uint8Array([5, 6])], 1)` → `Uint8Array [1]` (third array entirely skipped)
- [ ] [6.1.5] `Uint8Array.concat([new Uint8Array([1, 2, 3])], 0)` → `Uint8Array []`

### 6.2 Zero-fill (length > totalLength)

- [ ] [6.2.1] `Uint8Array.concat([new Uint8Array([1, 2])], 5)` → `Uint8Array [1, 2, 0, 0, 0]`
- [ ] [6.2.2] `Uint8Array.concat([], 3)` → `Uint8Array [0, 0, 0]` (no items, all zero-filled)
- [ ] [6.2.3] `Int32Array.concat([new Int32Array([1])], 4)` → `Int32Array [1, 0, 0, 0]`
- [ ] [6.2.4] `Float64Array.concat([new Float64Array([1.5])], 3)` → `Float64Array [1.5, 0, 0]`
- [ ] [6.2.5] `BigInt64Array.concat([new BigInt64Array([1n])], 3)` → `BigInt64Array [1n, 0n, 0n]`

### 6.3 Exact length

- [ ] [6.3.1] `Uint8Array.concat([new Uint8Array([1, 2, 3])], 3)` → `Uint8Array [1, 2, 3]` (same as no length)

---

## 7. `%TypedArray%.concat` — Element Value Preservation

### 7.1 Boundary values per type

- [ ] [7.1.1] `Int8Array.concat([new Int8Array([-128, 127])])` → `Int8Array [-128, 127]`
- [ ] [7.1.2] `Uint8Array.concat([new Uint8Array([0, 255])])` → `Uint8Array [0, 255]`
- [ ] [7.1.3] `Uint8ClampedArray.concat([new Uint8ClampedArray([0, 255])])` → `Uint8ClampedArray [0, 255]`
- [ ] [7.1.4] `Int16Array.concat([new Int16Array([-32768, 32767])])` → `Int16Array [-32768, 32767]`
- [ ] [7.1.5] `Uint16Array.concat([new Uint16Array([0, 65535])])` → `Uint16Array [0, 65535]`
- [ ] [7.1.6] `Int32Array.concat([new Int32Array([-2147483648, 2147483647])])` → `Int32Array [-2147483648, 2147483647]`
- [ ] [7.1.7] `Uint32Array.concat([new Uint32Array([0, 4294967295])])` → `Uint32Array [0, 4294967295]`
- [ ] [7.1.8] `BigInt64Array.concat([new BigInt64Array([-9223372036854775808n, 9223372036854775807n])])` → preserves values
- [ ] [7.1.9] `BigUint64Array.concat([new BigUint64Array([0n, 18446744073709551615n])])` → preserves values

### 7.2 Floating-point special values

- [ ] [7.2.1] `Float64Array.concat([new Float64Array([NaN, Infinity, -Infinity, -0, 0])])` → preserves all special values
- [ ] [7.2.2] `Float32Array.concat([new Float32Array([NaN, Infinity, -Infinity])])` → preserves all special values
- [ ] [7.2.3] `Float64Array.concat([new Float64Array([NaN]), new Float64Array([Infinity])])` → `Float64Array [NaN, Infinity]`

---

## 8. `ArrayBuffer.concat` — Items Validation

### 8.1 Items is not iterable

- [ ] [8.1.1] `ArrayBuffer.concat(undefined)` → TypeError
- [ ] [8.1.2] `ArrayBuffer.concat(null)` → TypeError
- [ ] [8.1.3] `ArrayBuffer.concat(42)` → TypeError
- [ ] [8.1.4] `ArrayBuffer.concat({})` → TypeError
- [ ] [8.1.5] `ArrayBuffer.concat({ [Symbol.iterator]: null })` → TypeError (`GetMethod` returns *undefined* when property is *null*)

### 8.2 Items iterable throws during iteration

- [ ] [8.2.1] Items iterable whose `Symbol.iterator` method throws → error propagates
- [ ] [8.2.2] Items iterable whose iterator's `next()` throws → error propagates

### 8.3 Item is not an ArrayBuffer, TypedArray, or DataView

- [ ] [8.3.1] `ArrayBuffer.concat([42])` → TypeError
- [ ] [8.3.2] `ArrayBuffer.concat([{}])` → TypeError
- [ ] [8.3.3] `ArrayBuffer.concat(['string'])` → TypeError
- [ ] [8.3.4] `ArrayBuffer.concat([null])` → TypeError
- [ ] [8.3.5] `ArrayBuffer.concat([undefined])` → TypeError
- [ ] [8.3.6] `ArrayBuffer.concat([[1, 2, 3]])` → TypeError (plain Array)

### 8.4 Item is a SharedArrayBuffer (accepted)

- [ ] [8.4.1] `ArrayBuffer.concat([new SharedArrayBuffer(4)])` → works (SharedArrayBuffer is accepted; result is an ArrayBuffer)
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([1, 2, 3, 4]);
  const result = ArrayBuffer.concat([sab]);
  result.byteLength // → 4
  result instanceof ArrayBuffer // → true
  result instanceof SharedArrayBuffer // → false
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```
- [ ] [8.4.2] Mix of ArrayBuffer and SharedArrayBuffer:
  ```js
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([1, 2]);
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([3, 4]);
  const result = ArrayBuffer.concat([ab, sab]);
  result.byteLength // → 4
  result instanceof ArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```

### 8.5 Item is a detached ArrayBuffer

- [ ] [8.5.1] Detached ArrayBuffer → TypeError
  ```js
  const ab = new ArrayBuffer(4);
  ab.transfer();
  ArrayBuffer.concat([ab]) // → TypeError
  ```

### 8.6 Item is a TypedArray with a detached buffer

- [ ] [8.6.1] TypedArray whose buffer has been detached → TypeError from `ValidateTypedArray`

### 8.7 Item is a DataView that is out of bounds

- [ ] [8.7.1] DataView over a resizable ArrayBuffer that has been shrunk below the view's range → TypeError from `IsViewOutOfBounds`

### 8.8 Mixed valid item types

- [ ] [8.8.1] `ArrayBuffer.concat([new ArrayBuffer(2), new Uint8Array([1, 2]), new DataView(new ArrayBuffer(3))])` → ArrayBuffer of byteLength 7
- [ ] [8.8.2] First item valid, second item invalid → TypeError on second item
- [ ] [8.8.3] Mix of all four input types:
  ```js
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([1, 2]);
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([3, 4]);
  const u8 = new Uint8Array([5, 6]);
  const dv = new DataView(new ArrayBuffer(2));
  new Uint8Array(dv.buffer).set([7, 8]);
  const result = ArrayBuffer.concat([ab, sab, u8, dv]);
  result.byteLength // → 8
  result instanceof ArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6, 7, 8]
  ```

---

## 9. `ArrayBuffer.concat` — Options Validation

### 9.1 Options is `undefined` or not provided

- [ ] [9.1.1] `ArrayBuffer.concat([new ArrayBuffer(4)])` → works, no options
- [ ] [9.1.2] `ArrayBuffer.concat([new ArrayBuffer(4)], undefined)` → works, same as no options

### 9.2 Options is not an object

- [ ] [9.2.1] `ArrayBuffer.concat([], 42)` → TypeError from `GetOptionsObject`
- [ ] [9.2.2] `ArrayBuffer.concat([], 'string')` → TypeError
- [ ] [9.2.3] `ArrayBuffer.concat([], true)` → TypeError
- [ ] [9.2.4] `ArrayBuffer.concat([], null)` → TypeError (*null* is not *undefined* and not an Object)

### 9.3 Length option validation

#### 9.3.1 Non-Number length → TypeError

- [ ] [9.3.1.1] `ArrayBuffer.concat([], { length: 'hello' })` → TypeError
- [ ] [9.3.1.2] `ArrayBuffer.concat([], { length: {} })` → TypeError
- [ ] [9.3.1.3] `ArrayBuffer.concat([], { length: true })` → TypeError
- [ ] [9.3.1.4] `ArrayBuffer.concat([], { length: Symbol() })` → TypeError
- [ ] [9.3.1.5] `ArrayBuffer.concat([], { length: 1n })` → TypeError

#### 9.3.2 NaN / non-integral / Infinity → RangeError

- [ ] [9.3.2.1] `ArrayBuffer.concat([], { length: NaN })` → RangeError
- [ ] [9.3.2.2] `ArrayBuffer.concat([], { length: 1.5 })` → RangeError
- [ ] [9.3.2.3] `ArrayBuffer.concat([], { length: Infinity })` → RangeError
- [ ] [9.3.2.4] `ArrayBuffer.concat([], { length: -Infinity })` → RangeError

#### 9.3.3 Negative length → RangeError

- [ ] [9.3.3.1] `ArrayBuffer.concat([], { length: -1 })` → RangeError
- [ ] [9.3.3.2] `ArrayBuffer.concat([], { length: -100 })` → RangeError

#### 9.3.4 Length exceeds 2^53 - 1 → RangeError

- [ ] [9.3.4.1] `ArrayBuffer.concat([], { length: 2 ** 53 })` → RangeError
- [ ] [9.3.4.2] `ArrayBuffer.concat([], { length: Number.MAX_SAFE_INTEGER + 1 })` → RangeError

#### 9.3.5 Length is -0 (treated as 0)

- [ ] [9.3.5.1] `ArrayBuffer.concat([new ArrayBuffer(4)], { length: -0 })` → ArrayBuffer of byteLength 0

#### 9.3.6 Length is `undefined` (same as not provided)

- [ ] [9.3.6.1] `ArrayBuffer.concat([new ArrayBuffer(4)], { length: undefined })` → byteLength 4 (defaults to total)

### 9.4 Resizable and immutable options

- [ ] [9.4.1] `ArrayBuffer.concat([], { resizable: true, immutable: true })` → TypeError (mutually exclusive)
- [ ] [9.4.2] `ArrayBuffer.concat([], { resizable: true, immutable: false })` → works
- [ ] [9.4.3] `ArrayBuffer.concat([], { resizable: false, immutable: true })` → works
- [ ] [9.4.4] `ArrayBuffer.concat([], { resizable: false, immutable: false })` → works (default behavior)

### 9.5 Resizable and immutable are coerced via `ToBoolean`

- [ ] [9.5.1] `ArrayBuffer.concat([], { resizable: 1 })` → result is resizable (truthy)
- [ ] [9.5.2] `ArrayBuffer.concat([], { resizable: 0 })` → result is not resizable (falsy)
- [ ] [9.5.3] `ArrayBuffer.concat([], { resizable: '' })` → result is not resizable (falsy)
- [ ] [9.5.4] `ArrayBuffer.concat([], { resizable: 'yes' })` → result is resizable (truthy)
- [ ] [9.5.5] `ArrayBuffer.concat([], { immutable: 1 })` → result is immutable (truthy)
- [ ] [9.5.6] `ArrayBuffer.concat([], { immutable: 0 })` → result is not immutable (falsy)
- [ ] [9.5.7] `ArrayBuffer.concat([], { resizable: null })` → result is not resizable (falsy)
- [ ] [9.5.8] `ArrayBuffer.concat([], { immutable: undefined })` → result is not immutable (falsy)

---

## 10. `ArrayBuffer.concat` — Overflow Check on `totalByteLength`

### 10.1 Total byte length exceeds 2^53 - 1

- [ ] [10.1.1] Concatenating items whose combined byte lengths exceed 2^53 - 1 → RangeError
- [ ] [10.1.2] Overflow check is per-item (fails as soon as running total exceeds limit)
- [ ] [10.1.3] Overflow check applies regardless of which item type triggers it (ArrayBuffer, TypedArray, or DataView)

Note: As with §4, creating buffers large enough to trigger this may be implementation-limited.

---

## 11. `ArrayBuffer.concat` — Basic Concatenation

### 11.1 ArrayBuffer inputs

- [ ] [11.1.1] Two ArrayBuffers:
  ```js
  const ab1 = new ArrayBuffer(4);
  new Uint8Array(ab1).set([1, 2, 3, 4]);
  const ab2 = new ArrayBuffer(4);
  new Uint8Array(ab2).set([5, 6, 7, 8]);
  const result = ArrayBuffer.concat([ab1, ab2]);
  // result.byteLength === 8
  // new Uint8Array(result) → [1, 2, 3, 4, 5, 6, 7, 8]
  ```
- [ ] [11.1.2] Single ArrayBuffer → copy of the input (new buffer, not same object)
- [ ] [11.1.3] Three or more ArrayBuffers → concatenated in order

### 11.2 TypedArray inputs (viewed portion only)

- [ ] [11.2.1] Full-buffer TypedArray:
  ```js
  const u8 = new Uint8Array([1, 2, 3, 4]);
  const result = ArrayBuffer.concat([u8]);
  // result.byteLength === 4
  ```
- [ ] [11.2.2] TypedArray with byte offset:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const view = new Uint8Array(ab, 2, 3); // views bytes [3, 4, 5]
  const result = ArrayBuffer.concat([view]);
  // result.byteLength === 3
  // new Uint8Array(result) → [3, 4, 5]
  ```
- [ ] [11.2.3] Multi-byte element TypedArray (only viewed portion bytes):
  ```js
  const i32 = new Int32Array([1, 2]); // 8 bytes
  const result = ArrayBuffer.concat([i32]);
  // result.byteLength === 8
  ```
- [ ] [11.2.4] TypedArray with non-zero offset and multi-byte elements:
  ```js
  const ab = new ArrayBuffer(16);
  const view = new Int32Array(ab, 4, 2); // 8 bytes starting at offset 4
  const result = ArrayBuffer.concat([view]);
  // result.byteLength === 8
  ```

### 11.3 DataView inputs (viewed portion only)

- [ ] [11.3.1] Full-buffer DataView:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const dv = new DataView(ab);
  const result = ArrayBuffer.concat([dv]);
  // result.byteLength === 4
  ```
- [ ] [11.3.2] DataView with byte offset and length:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const dv = new DataView(ab, 2, 3); // views bytes [3, 4, 5]
  const result = ArrayBuffer.concat([dv]);
  // result.byteLength === 3
  // new Uint8Array(result) → [3, 4, 5]
  ```

### 11.4 Mixed input types

- [ ] [11.4.1] ArrayBuffer + TypedArray + DataView:
  ```js
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([1, 2]);
  const u8 = new Uint8Array([3, 4]);
  const dv = new DataView(new ArrayBuffer(2));
  new Uint8Array(dv.buffer).set([5, 6]);
  const result = ArrayBuffer.concat([ab, u8, dv]);
  // result.byteLength === 6
  // new Uint8Array(result) → [1, 2, 3, 4, 5, 6]
  ```

### 11.5 Empty inputs

- [ ] [11.5.1] `ArrayBuffer.concat([])` → ArrayBuffer of byteLength 0
- [ ] [11.5.2] `ArrayBuffer.concat([new ArrayBuffer(0)])` → ArrayBuffer of byteLength 0
- [ ] [11.5.3] `ArrayBuffer.concat([new ArrayBuffer(0), new ArrayBuffer(0)])` → ArrayBuffer of byteLength 0
- [ ] [11.5.4] `ArrayBuffer.concat([new ArrayBuffer(0), new Uint8Array([1, 2])])` → byteLength 2

### 11.6 Result is always a new ArrayBuffer

- [ ] [11.6.1] Result is not the same object as any input:
  ```js
  const ab = new ArrayBuffer(4);
  const result = ArrayBuffer.concat([ab]);
  result !== ab // → true
  ```

---

## 12. `ArrayBuffer.concat` — Truncation and Zero-Fill

### 12.1 Truncation (length < totalByteLength)

- [ ] [12.1.1] `ArrayBuffer.concat([new ArrayBuffer(8)], { length: 4 })` → byteLength 4
- [ ] [12.1.2] Truncation mid-second-item:
  ```js
  const ab1 = new ArrayBuffer(4);
  new Uint8Array(ab1).set([1, 2, 3, 4]);
  const ab2 = new ArrayBuffer(4);
  new Uint8Array(ab2).set([5, 6, 7, 8]);
  const result = ArrayBuffer.concat([ab1, ab2], { length: 6 });
  // new Uint8Array(result) → [1, 2, 3, 4, 5, 6]
  ```
- [ ] [12.1.3] Truncation to 0: `ArrayBuffer.concat([new ArrayBuffer(4)], { length: 0 })` → byteLength 0

### 12.2 Zero-fill (length > totalByteLength)

- [ ] [12.2.1] `ArrayBuffer.concat([new ArrayBuffer(4)], { length: 8 })` → byteLength 8, last 4 bytes are 0
- [ ] [12.2.2] `ArrayBuffer.concat([], { length: 4 })` → byteLength 4, all bytes 0
- [ ] [12.2.3] Verify zero-fill bytes are actually 0:
  ```js
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([0xFF, 0xFF]);
  const result = ArrayBuffer.concat([ab], { length: 4 });
  const u8 = new Uint8Array(result);
  // u8[0] === 0xFF, u8[1] === 0xFF, u8[2] === 0, u8[3] === 0
  ```

### 12.3 Exact length

- [ ] [12.3.1] `ArrayBuffer.concat([new ArrayBuffer(4)], { length: 4 })` → byteLength 4 (same as no length)

---

## 13. `ArrayBuffer.concat` — Resizable Option

### 13.1 Basic resizable result

- [ ] [13.1.1] Resizable with explicit length:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)], { resizable: true, length: 16 });
  result.resizable // → true
  result.byteLength // → 4 (actual data)
  result.maxByteLength // → 16
  ```
- [ ] [13.1.2] Resizable result can be grown:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)], { resizable: true, length: 16 });
  result.resize(8);
  result.byteLength // → 8
  ```
- [ ] [13.1.3] Resizable result can be shrunk:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)], { resizable: true, length: 16 });
  result.resize(2);
  result.byteLength // → 2
  ```

### 13.2 Resizable without explicit length (maxByteLength = totalByteLength)

- [ ] [13.2.1] `ArrayBuffer.concat([new ArrayBuffer(4)], { resizable: true })` → `byteLength === 4`, `maxByteLength === 4` (buffer already at max)
- [ ] [13.2.2] Can be shrunk but not grown beyond totalByteLength:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)], { resizable: true });
  result.resize(2); // works
  result.resize(5); // → RangeError (exceeds maxByteLength)
  ```

### 13.3 Resizable with length less than totalByteLength

- [ ] [13.3.1] `maxByteLength` is `length`, `byteLength` is clamped:
  ```js
  const ab1 = new ArrayBuffer(4);
  const ab2 = new ArrayBuffer(4);
  const result = ArrayBuffer.concat([ab1, ab2], { resizable: true, length: 6 });
  result.byteLength // → 6 (clamped: min(8, 6))
  result.maxByteLength // → 6
  ```

### 13.4 Resizable with length greater than totalByteLength

- [ ] [13.4.1] `byteLength` equals total data, `maxByteLength` equals `length`:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)], { resizable: true, length: 32 });
  result.byteLength // → 4 (actual data)
  result.maxByteLength // → 32 (room to grow)
  ```

### 13.5 Data integrity in resizable result

- [ ] [13.5.1] Source data is correctly copied into resizable result:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const result = ArrayBuffer.concat([ab], { resizable: true, length: 16 });
  new Uint8Array(result, 0, 4) // → [1, 2, 3, 4]
  ```

---

## 14. `ArrayBuffer.concat` — Immutable Option

Note: These tests depend on the [Immutable ArrayBuffer proposal](https://github.com/tc39/proposal-immutable-arraybuffer).

### 14.1 Basic immutable result

- [ ] [14.1.1] `ArrayBuffer.concat([new ArrayBuffer(4)], { immutable: true })` → result has `immutable === true`
- [ ] [14.1.2] Immutable result cannot be resized → TypeError
- [ ] [14.1.3] Immutable result cannot be detached/transferred → TypeError

### 14.2 Data integrity in immutable result

- [ ] [14.2.1] Source data is correctly copied before immutability is applied:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const result = ArrayBuffer.concat([ab], { immutable: true });
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```

### 14.3 Immutable with explicit length

- [ ] [14.3.1] Truncation: `ArrayBuffer.concat([new ArrayBuffer(8)], { immutable: true, length: 4 })` → immutable, byteLength 4
- [ ] [14.3.2] Zero-fill: `ArrayBuffer.concat([new ArrayBuffer(4)], { immutable: true, length: 8 })` → immutable, byteLength 8

### 14.4 Immutable with empty inputs

- [ ] [14.4.1] `ArrayBuffer.concat([], { immutable: true })` → immutable ArrayBuffer of byteLength 0

---

## 15. `ArrayBuffer.concat` — Overflow Check on `totalByteLength`

Covered in §10. Included here as a cross-reference.

---

## 16. Evaluation Order and Observable Side Effects

### 16.1 `%TypedArray%.concat` evaluation order

- [ ] [16.1.1] `this` validation occurs before items iteration:
  ```js
  let iteratorCalled = false;
  const items = { [Symbol.iterator]() { iteratorCalled = true; return [][Symbol.iterator](); } };
  try { %TypedArray%.concat.call(42, items); } catch(e) {}
  iteratorCalled // → false
  ```
- [ ] [16.1.2] Items iteration (step 6) occurs before length validation (step 8):
  ```js
  let iteratorCalled = false;
  const items = { [Symbol.iterator]() { iteratorCalled = true; return [][Symbol.iterator](); } };
  try { Uint8Array.concat(items, NaN); } catch(e) {}
  iteratorCalled // → true (items iterated before length is checked)
  ```

- [ ] [16.1.3] Length validation (step 8) occurs before individual item validation (step 10). Items are collected first, then length is checked, then each item is validated:
  ```js
  // 'bad' fails ValidateIntegralNumber at step 8 before items are validated at step 10
  Uint8Array.concat([42], 'bad') // → TypeError from length validation ('bad' is not a Number)
  ```

- [ ] [16.1.4] Length range check occurs before item type checking:
  ```js
  Uint8Array.concat([new Int16Array([1])], -1) // → RangeError (from length, not TypeError from type mismatch)
  ```

### 16.2 `ArrayBuffer.concat` evaluation order

- [ ] [16.2.1] Items iteration (steps 1���3) occurs before options processing (step 4+):
  ```js
  let iteratorCalled = false;
  const items = { [Symbol.iterator]() { iteratorCalled = true; return [][Symbol.iterator](); } };
  try { ArrayBuffer.concat(items, 42); } catch(e) {} // options type check error at step 4
  iteratorCalled // → true (items iterated at step 3, before options checked at step 4)
  ```
- [ ] [16.2.2] Options processing (steps 4–10) occurs before item validation (step 11, `GetConcatenationSources`):
  ```js
  const detached = new ArrayBuffer(4);
  detached.transfer();
  ArrayBuffer.concat([detached], { length: 'bad' }) // → TypeError from length validation (step 8)
  ```
- [ ] [16.2.3] `resizable`/`immutable` mutual exclusion check (step 10) occurs before item validation (step 11):
  ```js
  const detached = new ArrayBuffer(4);
  detached.transfer();
  ArrayBuffer.concat([detached], { resizable: true, immutable: true }) // → TypeError (mutual exclusion)
  ```

### 16.3 `SharedArrayBuffer.concat` evaluation order

- [ ] [16.3.1] Items iteration (steps 1–3) occurs before options processing (step 4+):
  ```js
  let iteratorCalled = false;
  const items = { [Symbol.iterator]() { iteratorCalled = true; return [][Symbol.iterator](); } };
  try { SharedArrayBuffer.concat(items, 42); } catch(e) {} // options type check error at step 4
  iteratorCalled // → true (items iterated at step 3, before options checked at step 4)
  ```
- [ ] [16.3.2] Options processing (steps 4–9) occurs before item validation (step 10, `GetConcatenationSources`):
  ```js
  const detached = new ArrayBuffer(4);
  detached.transfer();
  SharedArrayBuffer.concat([detached], { length: 'bad' }) // → TypeError from length validation (step 7)
  ```

### 16.4 Items iterator with side effects

- [ ] [16.4.1] `%TypedArray%.concat`: Custom iterable that tracks iteration count → all items collected before any validation
- [ ] [16.4.2] `ArrayBuffer.concat`: Custom iterable that tracks iteration count → all items collected before any validation
- [ ] [16.4.3] `SharedArrayBuffer.concat`: Custom iterable that tracks iteration count → all items collected before any validation

---

## 17. Property and Prototype

### 17.1 `%TypedArray%.concat` method existence

- [ ] [17.1.1] `typeof Uint8Array.concat` → `'function'`
- [ ] [17.1.2] `Uint8Array.concat === Int32Array.concat` → true (shared on %TypedArray%)

### 17.2 `%TypedArray%.concat` method properties

- [ ] [17.2.1] `Uint8Array.concat.length` → 1 (one required parameter: `items`)
- [ ] [17.2.2] `Uint8Array.concat.name` → `'concat'`

### 17.3 `ArrayBuffer.concat` method existence

- [ ] [17.3.1] `typeof ArrayBuffer.concat` → `'function'`

### 17.4 `ArrayBuffer.concat` method properties

- [ ] [17.4.1] `ArrayBuffer.concat.length` → 1 (one required parameter: `items`)
- [ ] [17.4.2] `ArrayBuffer.concat.name` → `'concat'`

### 17.5 `SharedArrayBuffer.concat` method existence

- [ ] [17.5.1] `typeof SharedArrayBuffer.concat` → `'function'`

### 17.6 `SharedArrayBuffer.concat` method properties

- [ ] [17.6.1] `SharedArrayBuffer.concat.length` → 1 (one required parameter: `items`)
- [ ] [17.6.2] `SharedArrayBuffer.concat.name` → `'concat'`

### 17.7 Not enumerable

- [ ] [17.7.1] `Object.getOwnPropertyDescriptor(Uint8Array, 'concat').enumerable` → false
- [ ] [17.7.2] `Object.getOwnPropertyDescriptor(ArrayBuffer, 'concat').enumerable` → false
- [ ] [17.7.3] `Object.getOwnPropertyDescriptor(SharedArrayBuffer, 'concat').enumerable` → false

### 17.8 Configurable and writable

- [ ] [17.8.1] `Object.getOwnPropertyDescriptor(Uint8Array, 'concat').configurable` → true
- [ ] [17.8.2] `Object.getOwnPropertyDescriptor(Uint8Array, 'concat').writable` → true
- [ ] [17.8.3] `Object.getOwnPropertyDescriptor(ArrayBuffer, 'concat').configurable` → true
- [ ] [17.8.4] `Object.getOwnPropertyDescriptor(ArrayBuffer, 'concat').writable` → true
- [ ] [17.8.5] `Object.getOwnPropertyDescriptor(SharedArrayBuffer, 'concat').configurable` → true
- [ ] [17.8.6] `Object.getOwnPropertyDescriptor(SharedArrayBuffer, 'concat').writable` → true

---

## 18. Resizable ArrayBuffer Considerations

The key invariant is that only the **current** `byteLength` of a resizable ArrayBuffer is used, never the `maxByteLength`. For TypedArray views over resizable buffers, only the currently-visible elements are copied. The `maxByteLength` capacity beyond `byteLength` is uninitialized memory and must never be included.

### 18.1 `%TypedArray%.concat` — Only current elements are copied (not max capacity)

- [ ] [18.1.1] Auto-length TypedArray over a resizable buffer — copies only current elements, not max capacity:
  ```js
  const rab = new ArrayBuffer(4, { maxByteLength: 32 });
  const u8 = new Uint8Array(rab); // auto-length, tracks byteLength
  u8.set([1, 2, 3, 4]);
  const result = Uint8Array.concat([u8]);
  result.length // → 4 (not 32)
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```
- [ ] [18.1.2] Fixed-length TypedArray over a resizable buffer — copies only the fixed element count:
  ```js
  const rab = new ArrayBuffer(16, { maxByteLength: 64 });
  new Uint8Array(rab).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const u8 = new Uint8Array(rab, 0, 4); // fixed-length: 4 elements
  const result = Uint8Array.concat([u8]);
  result.length // → 4 (not 16 or 64)
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```
- [ ] [18.1.3] Two auto-length TypedArrays over resizable buffers with different current sizes:
  ```js
  const rab1 = new ArrayBuffer(3, { maxByteLength: 100 });
  const rab2 = new ArrayBuffer(2, { maxByteLength: 200 });
  const a = new Uint8Array(rab1);
  const b = new Uint8Array(rab2);
  a.set([1, 2, 3]);
  b.set([4, 5]);
  const result = Uint8Array.concat([a, b]);
  result.length // → 5 (3 + 2, not 100 + 200)
  new Uint8Array(result) // → [1, 2, 3, 4, 5]
  ```
- [ ] [18.1.4] Auto-length TypedArray after the buffer has been grown — copies only the pre-growth data region:
  ```js
  const rab = new ArrayBuffer(4, { maxByteLength: 32 });
  const u8 = new Uint8Array(rab);
  u8.set([1, 2, 3, 4]);
  rab.resize(16); // grow to 16 bytes; u8.length is now 16
  const result = Uint8Array.concat([u8]);
  result.length // → 16 (auto-length tracks current byteLength)
  // First 4 bytes are [1,2,3,4], remaining 12 are 0 (zero-initialized by resize)
  ```
- [ ] [18.1.5] Auto-length TypedArray after the buffer has been shrunk — copies only the post-shrink elements:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 32 });
  const u8 = new Uint8Array(rab);
  u8.set([1, 2, 3, 4, 5, 6, 7, 8]);
  rab.resize(3); // shrink to 3 bytes; u8.length is now 3
  const result = Uint8Array.concat([u8]);
  result.length // → 3
  new Uint8Array(result) // → [1, 2, 3]
  ```
- [ ] [18.1.6] Multi-byte element TypedArray (Int32Array) over resizable buffer — element count reflects current byteLength / elementSize:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 64 });
  const i32 = new Int32Array(rab); // auto-length: 2 elements (8 / 4)
  i32.set([100, 200]);
  const result = Int32Array.concat([i32]);
  result.length // → 2 (not 64 / 4 = 16)
  new Int32Array(result) // → [100, 200]
  ```

### 18.2 `%TypedArray%.concat` — Resizable buffer edge cases

- [ ] [18.2.1] Fixed-length TypedArray whose resizable buffer has been shrunk below the fixed range → TypeError from `ValidateTypedArray`:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 16 });
  const u8 = new Uint8Array(rab, 0, 8); // fixed-length: 8
  rab.resize(4); // shrink below the fixed range
  Uint8Array.concat([u8]) // → TypeError (TypedArray is out of bounds)
  ```
- [ ] [18.2.2] Fixed-length TypedArray with byteOffset, buffer shrunk below offset → TypeError:
  ```js
  const rab = new ArrayBuffer(16, { maxByteLength: 32 });
  const u8 = new Uint8Array(rab, 8, 4); // offset 8, length 4
  rab.resize(4); // shrink below the offset
  Uint8Array.concat([u8]) // → TypeError (out of bounds)
  ```
- [ ] [18.2.3] Auto-length TypedArray over a buffer resized to 0 → copies zero elements:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 16 });
  const u8 = new Uint8Array(rab);
  u8.set([1, 2, 3, 4, 5, 6, 7, 8]);
  rab.resize(0);
  const result = Uint8Array.concat([u8]);
  result.length // → 0
  ```

### 18.3 `ArrayBuffer.concat` — Only current byteLength is copied (not maxByteLength)

- [ ] [18.3.1] Resizable ArrayBuffer passed directly — copies current byteLength, ignores maxByteLength:
  ```js
  const rab = new ArrayBuffer(4, { maxByteLength: 64 });
  new Uint8Array(rab).set([1, 2, 3, 4]);
  const result = ArrayBuffer.concat([rab]);
  result.byteLength // → 4 (not 64)
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```
- [ ] [18.3.2] Two resizable ArrayBuffers — total byteLength is sum of current byteLengths:
  ```js
  const rab1 = new ArrayBuffer(3, { maxByteLength: 100 });
  const rab2 = new ArrayBuffer(2, { maxByteLength: 200 });
  new Uint8Array(rab1).set([1, 2, 3]);
  new Uint8Array(rab2).set([4, 5]);
  const result = ArrayBuffer.concat([rab1, rab2]);
  result.byteLength // → 5 (not 300)
  new Uint8Array(result) // → [1, 2, 3, 4, 5]
  ```
- [ ] [18.3.3] Resizable ArrayBuffer after grow — copies the grown size (including zero-initialized region):
  ```js
  const rab = new ArrayBuffer(4, { maxByteLength: 32 });
  new Uint8Array(rab).set([1, 2, 3, 4]);
  rab.resize(8); // grow; bytes 4-7 are zero-initialized
  const result = ArrayBuffer.concat([rab]);
  result.byteLength // → 8
  new Uint8Array(result) // → [1, 2, 3, 4, 0, 0, 0, 0]
  ```
- [ ] [18.3.4] Resizable ArrayBuffer after shrink — copies only the post-shrink bytes:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 32 });
  new Uint8Array(rab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  rab.resize(3);
  const result = ArrayBuffer.concat([rab]);
  result.byteLength // → 3
  new Uint8Array(result) // → [1, 2, 3]
  ```
- [ ] [18.3.5] Resizable ArrayBuffer resized to 0 — contributes 0 bytes:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 16 });
  rab.resize(0);
  const result = ArrayBuffer.concat([rab, new ArrayBuffer(2)]);
  result.byteLength // → 2
  ```

### 18.4 `ArrayBuffer.concat` — TypedArray/DataView over resizable buffers (viewed portion only)

- [ ] [18.4.1] Auto-length TypedArray over resizable buffer — only current viewed bytes:
  ```js
  const rab = new ArrayBuffer(4, { maxByteLength: 64 });
  new Uint8Array(rab).set([10, 20, 30, 40]);
  const u8 = new Uint8Array(rab); // auto-length
  const result = ArrayBuffer.concat([u8]);
  result.byteLength // → 4 (not 64)
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [18.4.2] Fixed-length TypedArray with offset over resizable buffer:
  ```js
  const rab = new ArrayBuffer(16, { maxByteLength: 64 });
  new Uint8Array(rab).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const u8 = new Uint8Array(rab, 4, 4); // bytes 4-7: [5, 6, 7, 8]
  const result = ArrayBuffer.concat([u8]);
  result.byteLength // → 4 (not 64 or 16)
  new Uint8Array(result) // → [5, 6, 7, 8]
  ```
- [ ] [18.4.3] Auto-length DataView over resizable buffer:
  ```js
  const rab = new ArrayBuffer(4, { maxByteLength: 64 });
  new Uint8Array(rab).set([10, 20, 30, 40]);
  const dv = new DataView(rab); // auto-length
  const result = ArrayBuffer.concat([dv]);
  result.byteLength // → 4 (not 64)
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [18.4.4] Fixed-length DataView with offset over resizable buffer:
  ```js
  const rab = new ArrayBuffer(16, { maxByteLength: 64 });
  new Uint8Array(rab).set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const dv = new DataView(rab, 4, 4); // bytes 4-7
  const result = ArrayBuffer.concat([dv]);
  result.byteLength // → 4
  new Uint8Array(result) // → [5, 6, 7, 8]
  ```
- [ ] [18.4.5] Multi-byte element TypedArray over resizable buffer — byte length is element count × element size:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 64 });
  const i32 = new Int32Array(rab); // 2 elements, 8 bytes
  i32.set([100, 200]);
  const result = ArrayBuffer.concat([i32]);
  result.byteLength // → 8 (not 64)
  ```
- [ ] [18.4.6] Fixed-length TypedArray whose resizable buffer was shrunk below range → TypeError:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 16 });
  const u8 = new Uint8Array(rab, 0, 8);
  rab.resize(4);
  ArrayBuffer.concat([u8]) // → TypeError (ValidateTypedArray: out of bounds)
  ```
- [ ] [18.4.7] Fixed-length DataView whose resizable buffer was shrunk below range → TypeError:
  ```js
  const rab = new ArrayBuffer(8, { maxByteLength: 16 });
  const dv = new DataView(rab, 0, 8);
  rab.resize(4);
  ArrayBuffer.concat([dv]) // → TypeError (IsViewOutOfBounds)
  ```

### 18.5 Mixed resizable and fixed-size inputs

- [ ] [18.5.1] `%TypedArray%.concat` with a mix of resizable-backed and fixed-backed TypedArrays:
  ```js
  const rab = new ArrayBuffer(3, { maxByteLength: 100 });
  new Uint8Array(rab).set([1, 2, 3]);
  const resizableView = new Uint8Array(rab);
  const fixedView = new Uint8Array([4, 5]);
  const result = Uint8Array.concat([resizableView, fixedView]);
  result.length // → 5
  new Uint8Array(result) // → [1, 2, 3, 4, 5]
  ```
- [ ] [18.5.2] `ArrayBuffer.concat` with resizable ArrayBuffer, fixed ArrayBuffer, and TypedArray over resizable:
  ```js
  const rab = new ArrayBuffer(2, { maxByteLength: 100 });
  new Uint8Array(rab).set([1, 2]);
  const fixed = new ArrayBuffer(2);
  new Uint8Array(fixed).set([3, 4]);
  const rab2 = new ArrayBuffer(2, { maxByteLength: 200 });
  new Uint8Array(rab2).set([5, 6]);
  const view = new Uint8Array(rab2);
  const result = ArrayBuffer.concat([rab, fixed, view]);
  result.byteLength // → 6 (2 + 2 + 2, not 100 + 2 + 200)
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6]
  ```

---

## 19. Items Iterable Variations

Both `%TypedArray%.concat` and `ArrayBuffer.concat` accept any iterable for the `items` parameter.

### 19.1 `%TypedArray%.concat` iterable types

- [ ] [19.1.1] Plain Array: `Uint8Array.concat([new Uint8Array([1]), new Uint8Array([2])])` → works
- [ ] [19.1.2] Generator:
  ```js
  function* gen() { yield new Uint8Array([1]); yield new Uint8Array([2]); }
  Uint8Array.concat(gen()) // → Uint8Array [1, 2]
  ```
- [ ] [19.1.3] Set:
  ```js
  const a = new Uint8Array([1]);
  const b = new Uint8Array([2]);
  Uint8Array.concat(new Set([a, b])) // → Uint8Array [1, 2]
  ```
- [ ] [19.1.4] Custom iterable:
  ```js
  const items = {
    [Symbol.iterator]() {
      let i = 0;
      const arrays = [new Uint8Array([1]), new Uint8Array([2])];
      return { next() { return i < arrays.length ? { value: arrays[i++], done: false } : { done: true }; } };
    }
  };
  Uint8Array.concat(items) // → Uint8Array [1, 2]
  ```

### 19.2 `ArrayBuffer.concat` iterable types

- [ ] [19.2.1] Plain Array: `ArrayBuffer.concat([new ArrayBuffer(2), new ArrayBuffer(2)])` → works
- [ ] [19.2.2] Generator:
  ```js
  function* gen() { yield new ArrayBuffer(2); yield new Uint8Array([1, 2]); }
  ArrayBuffer.concat(gen()) // → ArrayBuffer of byteLength 4
  ```
- [ ] [19.2.3] Set of mixed types:
  ```js
  ArrayBuffer.concat(new Set([new ArrayBuffer(2), new Uint8Array([1, 2]), new DataView(new ArrayBuffer(2))]))
  // → ArrayBuffer of byteLength 6
  ```

---

## 20. `%TypedArray%.concat` — Copy Loop Edge Cases

### 20.1 Short-circuit when result is full

- [ ] [20.1.1] With `length: 0`, no items are copied even if present:
  ```js
  const a = new Uint8Array([1, 2, 3]);
  const result = Uint8Array.concat([a], 0);
  result.length // → 0
  ```
- [ ] [20.1.2] With `length: 2` and items totalling 6 elements, only the first 2 elements are in the result:
  ```js
  const result = Uint8Array.concat([new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])], 2);
  // result → Uint8Array [1, 2]
  ```

### 20.2 Items spanning the truncation boundary

- [ ] [20.2.1] Truncation splits an item's elements:
  ```js
  const result = Uint8Array.concat([new Uint8Array([1, 2]), new Uint8Array([3, 4, 5])], 4);
  // result → Uint8Array [1, 2, 3, 4] (second item truncated from 3 elements to 2)
  ```

### 20.3 Items where some contribute zero elements

- [ ] [20.3.1] Mix of empty and non-empty items:
  ```js
  const result = Uint8Array.concat([new Uint8Array([]), new Uint8Array([1]), new Uint8Array([]), new Uint8Array([2])]);
  // result → Uint8Array [1, 2]
  ```

---

## 21. `ArrayBuffer.concat` — Copy Loop Edge Cases

### 21.1 Short-circuit when result is full

- [ ] [21.1.1] With `length: 0`, no bytes are copied:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)], { length: 0 });
  result.byteLength // → 0
  ```
- [ ] [21.1.2] With `length: 2` and items totalling 8 bytes, only the first 2 bytes are in the result

### 21.2 Copy spans multiple items

- [ ] [21.2.1] Three items, truncation in the middle of the second:
  ```js
  const ab1 = new ArrayBuffer(3);
  new Uint8Array(ab1).set([1, 2, 3]);
  const ab2 = new ArrayBuffer(3);
  new Uint8Array(ab2).set([4, 5, 6]);
  const ab3 = new ArrayBuffer(3);
  new Uint8Array(ab3).set([7, 8, 9]);
  const result = ArrayBuffer.concat([ab1, ab2, ab3], { length: 5 });
  // new Uint8Array(result) → [1, 2, 3, 4, 5]
  ```

### 21.3 Zero-length items in the mix

- [ ] [21.3.1] `ArrayBuffer.concat([new ArrayBuffer(0), new ArrayBuffer(4), new ArrayBuffer(0)])` → byteLength 4, data from the middle item

---

## 22. `ArrayBuffer.concat` — Immutable + Resizable Interaction

### 22.1 Mutually exclusive

- [ ] [22.1.1] `{ resizable: true, immutable: true }` → TypeError
- [ ] [22.1.2] `{ resizable: true, immutable: false }` → resizable result (no error)
- [ ] [22.1.3] `{ resizable: false, immutable: true }` → immutable result (no error)
- [ ] [22.1.4] Neither provided → default (non-resizable, non-immutable)

### 22.2 Truthy combinations via ToBoolean

- [ ] [22.2.1] `{ resizable: 1, immutable: 1 }` → TypeError (both truthy)
- [ ] [22.2.2] `{ resizable: 'yes', immutable: 'yes' }` → TypeError (both truthy)
- [ ] [22.2.3] `{ resizable: 1, immutable: 0 }` → works (resizable)
- [ ] [22.2.4] `{ resizable: 0, immutable: 1 }` → works (immutable)

---

## 23. Same Underlying Buffer / Overlapping Views

### 23.1 `%TypedArray%.concat` — Multiple views of the same buffer

- [ ] [23.1.1] Two TypedArrays backed by the same ArrayBuffer at different offsets:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const a = new Uint8Array(ab, 0, 4); // [1, 2, 3, 4]
  const b = new Uint8Array(ab, 4, 4); // [5, 6, 7, 8]
  Uint8Array.concat([a, b]) // → Uint8Array [1, 2, 3, 4, 5, 6, 7, 8]
  ```
- [ ] [23.1.2] Same TypedArray passed twice:
  ```js
  const a = new Uint8Array([1, 2]);
  Uint8Array.concat([a, a]) // → Uint8Array [1, 2, 1, 2]
  ```
- [ ] [23.1.3] Overlapping views:
  ```js
  const ab = new ArrayBuffer(6);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6]);
  const a = new Uint8Array(ab, 0, 4); // [1, 2, 3, 4]
  const b = new Uint8Array(ab, 2, 4); // [3, 4, 5, 6]
  Uint8Array.concat([a, b]) // → Uint8Array [1, 2, 3, 4, 3, 4, 5, 6]
  ```

### 23.2 `ArrayBuffer.concat` — Same buffer via different views

- [ ] [23.2.1] Two TypedArrays viewing different parts of the same buffer:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const a = new Uint8Array(ab, 0, 4);
  const b = new Uint8Array(ab, 4, 4);
  const result = ArrayBuffer.concat([a, b]);
  // new Uint8Array(result) → [1, 2, 3, 4, 5, 6, 7, 8]
  ```
- [ ] [23.2.2] Same ArrayBuffer passed twice as direct item:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const result = ArrayBuffer.concat([ab, ab]);
  // new Uint8Array(result) → [1, 2, 3, 4, 1, 2, 3, 4]
  ```
- [ ] [23.2.3] TypedArray and DataView viewing the same buffer:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const u8 = new Uint8Array(ab, 0, 2);
  const dv = new DataView(ab, 2, 2);
  const result = ArrayBuffer.concat([u8, dv]);
  // new Uint8Array(result) → [1, 2, 3, 4]
  ```

---

## 24. Large-Scale and Stress Tests

### 24.1 Many items

- [ ] [24.1.1] `Uint8Array.concat` with 1000 single-element TypedArrays → result has 1000 elements in correct order
- [ ] [24.1.2] `ArrayBuffer.concat` with 1000 single-byte ArrayBuffers → result has byteLength 1000

### 24.2 Large individual items

- [ ] [24.2.1] `Uint8Array.concat` with a single 1MB TypedArray → result matches
- [ ] [24.2.2] `ArrayBuffer.concat` with two 1MB ArrayBuffers → result has byteLength 2MB, data correct

### 24.3 Combination of many small and few large

- [ ] [24.3.1] Mix of 100-byte and 1-byte items → total length and data are correct

---

## 25. Tamper Resistance — Overridden Properties and Prototype Pollution

The spec algorithms read internal slots (`[[ArrayLength]]`, `[[ByteLength]]`, `[[ByteOffset]]`, `[[ViewedArrayBuffer]]`, `[[TypedArrayName]]`, `[[ArrayBufferData]]`, `[[ArrayBufferByteLength]]`) and use abstract operations (`TypedArrayLength`, `TypedArrayByteLength`, `ValidateTypedArray`, etc.) that bypass JavaScript-visible property access. These tests verify that overriding or shadowing properties has no observable effect on the result.

### 25.1 `%TypedArray%.concat` — Overridden TypedArray properties

#### 25.1.1 Overridden `.length` on items

- [ ] [25.1.1.1] `Object.defineProperty` to increase `.length`:
  ```js
  const u8 = new Uint8Array([1, 2, 3]);
  Object.defineProperty(u8, 'length', { value: 100 });
  const result = Uint8Array.concat([u8]);
  result.length // → 3 (uses [[ArrayLength]], not .length)
  new Uint8Array(result) // → [1, 2, 3]
  ```
- [ ] [25.1.1.2] `Object.defineProperty` to decrease `.length`:
  ```js
  const u8 = new Uint8Array([1, 2, 3, 4, 5]);
  Object.defineProperty(u8, 'length', { value: 1 });
  const result = Uint8Array.concat([u8]);
  result.length // → 5 (uses [[ArrayLength]], not .length)
  ```
- [ ] [25.1.1.3] `.length` set to 0 on non-empty TypedArray:
  ```js
  const u8 = new Uint8Array([1, 2, 3]);
  Object.defineProperty(u8, 'length', { value: 0 });
  const result = Uint8Array.concat([u8]);
  result.length // → 3
  ```

#### 25.1.2 Overridden `.byteLength` on items

- [ ] [25.1.2.1] Overridden `.byteLength` on TypedArray item:
  ```js
  const u8 = new Uint8Array([1, 2, 3]);
  Object.defineProperty(u8, 'byteLength', { value: 100 });
  const result = Uint8Array.concat([u8]);
  result.length // → 3 (not influenced by fake byteLength)
  ```

#### 25.1.3 Overridden `.byteOffset` on items

- [ ] [25.1.3.1] Overridden `.byteOffset` on TypedArray item:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const u8 = new Uint8Array(ab, 2, 3); // views [3, 4, 5]
  Object.defineProperty(u8, 'byteOffset', { value: 0 });
  const result = Uint8Array.concat([u8]);
  // result → Uint8Array [3, 4, 5] (uses [[ByteOffset]], not .byteOffset)
  ```

#### 25.1.4 Overridden `.buffer` on items

- [ ] [25.1.4.1] Overridden `.buffer` pointing to a different ArrayBuffer:
  ```js
  const u8 = new Uint8Array([1, 2, 3]);
  const fakeBuffer = new ArrayBuffer(100);
  Object.defineProperty(u8, 'buffer', { value: fakeBuffer });
  const result = Uint8Array.concat([u8]);
  result.length // → 3 (uses [[ViewedArrayBuffer]], not .buffer)
  new Uint8Array(result) // → [1, 2, 3]
  ```

#### 25.1.5 Overridden `Symbol.iterator` on items array (not on TypedArray items themselves)

- [ ] [25.1.5.1] Items array with overridden `Symbol.iterator` that yields extra items:
  ```js
  const a = new Uint8Array([1, 2]);
  const items = [a];
  items[Symbol.iterator] = function*() { yield a; yield a; yield a; };
  const result = Uint8Array.concat(items);
  result.length // → 6 (iterator is respected for the items iterable)
  new Uint8Array(result) // → [1, 2, 1, 2, 1, 2]
  ```

### 25.2 `%TypedArray%.concat` — Overridden constructor properties

#### 25.2.1 Overridden `Symbol.species` or `@@species`

- [ ] [25.2.1.1] The spec uses `_C_` directly (the `this` value) without consulting `Symbol.species`. Overriding `Symbol.species` should have no effect:
  ```js
  class MyUint8Array extends Uint8Array {}
  Object.defineProperty(Uint8Array, Symbol.species, { value: MyUint8Array });
  const result = Uint8Array.concat([new Uint8Array([1, 2])]);
  result.constructor // → Uint8Array (not MyUint8Array; species is not consulted)
  ```

### 25.3 `ArrayBuffer.concat` — Overridden ArrayBuffer properties

#### 25.3.1 Overridden `.byteLength` on ArrayBuffer items

- [ ] [25.3.1.1] `Object.defineProperty` to increase `.byteLength`:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  Object.defineProperty(ab, 'byteLength', { value: 100 });
  const result = ArrayBuffer.concat([ab]);
  result.byteLength // → 4 (uses [[ArrayBufferByteLength]], not .byteLength)
  ```
- [ ] [25.3.1.2] `Object.defineProperty` to decrease `.byteLength`:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  Object.defineProperty(ab, 'byteLength', { value: 1 });
  const result = ArrayBuffer.concat([ab]);
  result.byteLength // → 4
  ```

#### 25.3.2 Overridden properties on TypedArray items (used in ArrayBuffer.concat)

- [ ] [25.3.2.1] Overridden `.byteLength` on TypedArray passed to `ArrayBuffer.concat`:
  ```js
  const u8 = new Uint8Array([1, 2, 3, 4]);
  Object.defineProperty(u8, 'byteLength', { value: 100 });
  const result = ArrayBuffer.concat([u8]);
  result.byteLength // → 4 (uses TypedArrayByteLength, not .byteLength)
  ```
- [ ] [25.3.2.2] Overridden `.byteOffset` on TypedArray passed to `ArrayBuffer.concat`:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const u8 = new Uint8Array(ab, 4, 4); // views [5, 6, 7, 8]
  Object.defineProperty(u8, 'byteOffset', { value: 0 });
  const result = ArrayBuffer.concat([u8]);
  new Uint8Array(result) // → [5, 6, 7, 8] (uses [[ByteOffset]], not .byteOffset)
  ```
- [ ] [25.3.2.3] Overridden `.buffer` on TypedArray passed to `ArrayBuffer.concat`:
  ```js
  const u8 = new Uint8Array([1, 2, 3]);
  const fakeBuffer = new ArrayBuffer(100);
  new Uint8Array(fakeBuffer).fill(0xFF);
  Object.defineProperty(u8, 'buffer', { value: fakeBuffer });
  const result = ArrayBuffer.concat([u8]);
  new Uint8Array(result) // → [1, 2, 3] (uses [[ViewedArrayBuffer]], not .buffer)
  ```

#### 25.3.3 Overridden properties on DataView items

- [ ] [25.3.3.1] Overridden `.byteLength` on DataView:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const dv = new DataView(ab);
  Object.defineProperty(dv, 'byteLength', { value: 100 });
  const result = ArrayBuffer.concat([dv]);
  result.byteLength // → 4 (uses GetViewByteLength, not .byteLength)
  ```
- [ ] [25.3.3.2] Overridden `.byteOffset` on DataView:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const dv = new DataView(ab, 4, 4); // views [5, 6, 7, 8]
  Object.defineProperty(dv, 'byteOffset', { value: 0 });
  const result = ArrayBuffer.concat([dv]);
  new Uint8Array(result) // → [5, 6, 7, 8] (uses [[ByteOffset]], not .byteOffset)
  ```
- [ ] [25.3.3.3] Overridden `.buffer` on DataView:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const dv = new DataView(ab);
  Object.defineProperty(dv, 'buffer', { value: new ArrayBuffer(100) });
  const result = ArrayBuffer.concat([dv]);
  new Uint8Array(result) // → [1, 2, 3, 4] (uses [[ViewedArrayBuffer]], not .buffer)
  ```

### 25.4 `ArrayBuffer.concat` — Overridden options object accessors

- [ ] [25.4.1] Options object with getter on `length` that has side effects:
  ```js
  let callCount = 0;
  const opts = { get length() { callCount++; return 4; } };
  ArrayBuffer.concat([new ArrayBuffer(2)], opts);
  callCount // → 1 (Get is called once for "length")
  ```
- [ ] [25.4.2] Options object with getter on `resizable` that throws:
  ```js
  const opts = { get resizable() { throw new Error('boom'); } };
  ArrayBuffer.concat([], opts) // → Error('boom')
  ```
- [ ] [25.4.3] Options object with getter on `immutable` that throws:
  ```js
  const opts = { resizable: false, get immutable() { throw new Error('boom'); } };
  ArrayBuffer.concat([], opts) // → Error('boom')
  ```
- [ ] [25.4.4] Options with `length` getter that modifies items (items already collected):
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const opts = {
    get length() {
      // Items were already collected via IteratorToList before options are read
      ab.transfer(); // detach the buffer
      return 8;
    }
  };
  // Items are iterated at step 1, options read at step 2+
  // But item validation happens at step 10+ (after options), so detachment
  // will be caught during validation
  ArrayBuffer.concat([ab], opts) // → TypeError (detached buffer)
  ```

### 25.5 Prototype pollution

- [ ] [25.5.1] Poisoned `TypedArray.prototype.length` does not affect result:
  ```js
  const origDesc = Object.getOwnPropertyDescriptor(Uint8Array.prototype.__proto__, 'length');
  try {
    Object.defineProperty(Uint8Array.prototype.__proto__, 'length', { get() { return 9999; } });
    const result = Uint8Array.concat([new Uint8Array([1, 2, 3])]);
    result.length // → 3 (internal slot, not prototype getter)
  } finally {
    Object.defineProperty(Uint8Array.prototype.__proto__, 'length', origDesc);
  }
  ```
- [ ] [25.5.2] Poisoned `ArrayBuffer.prototype.byteLength` does not affect result:
  ```js
  const origDesc = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength');
  try {
    Object.defineProperty(ArrayBuffer.prototype, 'byteLength', { get() { return 9999; } });
    const ab = new ArrayBuffer(4);
    new Uint8Array(ab).set([1, 2, 3, 4]);
    const result = ArrayBuffer.concat([ab]);
    result.byteLength // → 4
  } finally {
    Object.defineProperty(ArrayBuffer.prototype, 'byteLength', origDesc);
  }
  ```
- [ ] [25.5.3] Poisoned `Object.prototype[Symbol.iterator]` does not affect items that are already iterable:
  ```js
  Object.prototype[Symbol.iterator] = function*() { yield new Uint8Array([99]); };
  try {
    const result = Uint8Array.concat([new Uint8Array([1, 2])]);
    // Array's own Symbol.iterator is used, not Object.prototype's
    new Uint8Array(result) // → [1, 2]
  } finally {
    delete Object.prototype[Symbol.iterator];
  }
  ```

### 25.6 Subclass shenanigans

- [ ] [25.6.1] Calling `concat` on a subclass constructor → TypeError (subclass does not appear in Table 70):
  ```js
  class MyUint8 extends Uint8Array {}
  MyUint8.concat([new Uint8Array([1, 2])]) // → TypeError
  // MyUint8 is a constructor but step 2 checks if `this` appears in the
  // Constructor column of Table 70. Only intrinsic constructors are listed.
  ```
- [ ] [25.6.2] Item is a subclass instance:
  ```js
  class MyUint8 extends Uint8Array { constructor(...args) { super(...args); } }
  const a = new MyUint8([1, 2, 3]);
  // a has [[TypedArrayName]] === "Uint8Array"
  const result = Uint8Array.concat([a]);
  result.length // → 3 (ValidateTypedArray passes, [[TypedArrayName]] matches)
  ```

---

## 26. Missing Arguments and Default Behavior

### 26.1 `%TypedArray%.concat` called with no arguments

- [ ] [26.1.1] `Uint8Array.concat()` → TypeError (`items` is `undefined`, which has no `Symbol.iterator`)

### 26.2 `ArrayBuffer.concat` called with no arguments

- [ ] [26.2.1] `ArrayBuffer.concat()` → TypeError (`items` is `undefined`)

### 26.3 `SharedArrayBuffer.concat` called with no arguments

- [ ] [26.3.1] `SharedArrayBuffer.concat()` → TypeError (`items` is `undefined`)

### 26.4 Result buffer properties

- [ ] [26.4.1] `%TypedArray%.concat` result buffer is not resizable:
  ```js
  const result = Uint8Array.concat([new Uint8Array([1, 2])]);
  result.buffer.resizable // → false
  ```
- [ ] [26.4.2] `ArrayBuffer.concat` result is not resizable by default:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)]);
  result.resizable // → false
  ```
- [ ] [26.4.3] `ArrayBuffer.concat` result is not immutable by default:
  ```js
  const result = ArrayBuffer.concat([new ArrayBuffer(4)]);
  result.immutable // → false (or undefined, depending on immutable proposal)
  ```
- [ ] [26.4.4] `SharedArrayBuffer.concat` result is not growable by default:
  ```js
  const result = SharedArrayBuffer.concat([new SharedArrayBuffer(4)]);
  result.growable // → false
  ```

---

## 27. Cross-Type Buffer Inputs

All three methods accept inputs backed by either ArrayBuffer or SharedArrayBuffer. `ArrayBuffer.concat` and `SharedArrayBuffer.concat` accept both ArrayBuffer and SharedArrayBuffer directly. The return type is always determined by which method is called, not by the input types.

### 27.1 `%TypedArray%.concat` — Items backed by SharedArrayBuffer

- [ ] [27.1.1] TypedArray over SharedArrayBuffer is a valid item (no TypeError):
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([1, 2, 3, 4]);
  const u8 = new Uint8Array(sab);
  const result = Uint8Array.concat([u8]);
  result.length // → 4
  new Uint8Array(result) // → [1, 2, 3, 4] (subject to races if another agent writes concurrently)
  ```
- [ ] [27.1.2] Two TypedArrays over the same SharedArrayBuffer:
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([1, 2, 3, 4]);
  const a = new Uint8Array(sab, 0, 2);
  const b = new Uint8Array(sab, 2, 2);
  const result = Uint8Array.concat([a, b]);
  result.length // → 4
  ```
- [ ] [27.1.3] Result buffer is a regular (non-shared) ArrayBuffer even when inputs are SharedArrayBuffer-backed:
  ```js
  const sab = new SharedArrayBuffer(4);
  const u8 = new Uint8Array(sab);
  const result = Uint8Array.concat([u8]);
  result.buffer instanceof ArrayBuffer // → true
  result.buffer instanceof SharedArrayBuffer // → false
  ```
- [ ] [27.1.4] Mix of ArrayBuffer-backed and SharedArrayBuffer-backed TypedArrays:
  ```js
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([1, 2]);
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([3, 4]);
  const result = Uint8Array.concat([new Uint8Array(ab), new Uint8Array(sab)]);
  result.length // → 4
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```

### 27.2 `ArrayBuffer.concat` — SharedArrayBuffer and SAB-backed view inputs

- [ ] [27.2.1] SharedArrayBuffer directly as item:
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([10, 20, 30, 40]);
  const result = ArrayBuffer.concat([sab]);
  result.byteLength // → 4
  result instanceof ArrayBuffer // → true
  result instanceof SharedArrayBuffer // → false
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [27.2.2] TypedArray over SharedArrayBuffer as item:
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([10, 20, 30, 40]);
  const u8 = new Uint8Array(sab);
  const result = ArrayBuffer.concat([u8]);
  result.byteLength // → 4
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [27.2.3] DataView over SharedArrayBuffer as item:
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([10, 20, 30, 40]);
  const dv = new DataView(sab);
  const result = ArrayBuffer.concat([dv]);
  result.byteLength // → 4
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [27.2.4] Mix of ArrayBuffer, SharedArrayBuffer, TypedArray, and DataView:
  ```js
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([1, 2]);
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([3, 4]);
  const u8 = new Uint8Array([5, 6]);
  const result = ArrayBuffer.concat([ab, sab, u8]);
  result.byteLength // → 6
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6]
  ```
- [ ] [27.2.5] Result is always an ArrayBuffer regardless of input types:
  ```js
  const sab = new SharedArrayBuffer(4);
  const result = ArrayBuffer.concat([sab]);
  result instanceof SharedArrayBuffer // → false
  result instanceof ArrayBuffer // → true
  ```

### 27.3 `SharedArrayBuffer.concat` — ArrayBuffer and AB-backed view inputs

- [ ] [27.3.1] ArrayBuffer directly as item:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([10, 20, 30, 40]);
  const result = SharedArrayBuffer.concat([ab]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [27.3.2] TypedArray over ArrayBuffer as item:
  ```js
  const u8 = new Uint8Array([10, 20, 30, 40]);
  const result = SharedArrayBuffer.concat([u8]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [10, 20, 30, 40]
  ```
- [ ] [27.3.3] DataView over ArrayBuffer as item:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([10, 20, 30, 40]);
  const dv = new DataView(ab);
  const result = SharedArrayBuffer.concat([dv]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  ```
- [ ] [27.3.4] Mix of SharedArrayBuffer, ArrayBuffer, TypedArray, and DataView:
  ```js
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([1, 2]);
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([3, 4]);
  const u8 = new Uint8Array([5, 6]);
  const result = SharedArrayBuffer.concat([sab, ab, u8]);
  result.byteLength // → 6
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6]
  ```
- [ ] [27.3.5] Result is always a SharedArrayBuffer regardless of input types:
  ```js
  const ab = new ArrayBuffer(4);
  const result = SharedArrayBuffer.concat([ab]);
  result instanceof SharedArrayBuffer // → true
  ```
- [ ] [27.3.6] Detached ArrayBuffer as direct item → TypeError:
  ```js
  const ab = new ArrayBuffer(4);
  ab.transfer();
  SharedArrayBuffer.concat([ab]) // → TypeError
  ```

### 27.4 Concurrent modification of SharedArrayBuffer during copy

`CopyDataBlockBytes` operates on the raw underlying data blocks without snapshotting. When a source is backed by a SharedArrayBuffer, another agent (Worker) may modify the data concurrently during the copy. The result may contain a mix of old and new values. These tests verify that concurrent writes do not cause crashes or undefined behavior, and that the result is a valid buffer containing *some* permutation of the written bytes.

#### 27.4.1 `%TypedArray%.concat` — Concurrent write from a Worker

- [ ] [27.4.1.1] Worker writes to SharedArrayBuffer while main thread calls `Uint8Array.concat`:
  ```js
  // Setup: SharedArrayBuffer with known initial values
  const sab = new SharedArrayBuffer(1024);
  const u8 = new Uint8Array(sab);
  u8.fill(0xAA);

  // Worker that continuously writes 0xBB to the buffer
  const workerCode = `
    onmessage = function(e) {
      const u8 = new Uint8Array(e.data);
      for (let i = 0; i < 1000000; i++) {
        for (let j = 0; j < u8.length; j++) u8[j] = 0xBB;
      }
      postMessage('done');
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  worker.postMessage(sab);

  // Main thread: concat while worker is writing
  const result = Uint8Array.concat([u8]);

  // Assertions:
  result.length // → 1024
  result.buffer instanceof ArrayBuffer // → true (not SharedArrayBuffer)
  result.buffer.resizable // → false
  // Each byte in result is either 0xAA or 0xBB (no torn or invalid values for byte-sized elements)
  for (const byte of result) {
    assert(byte === 0xAA || byte === 0xBB);
  }
  worker.terminate();
  ```

- [ ] [27.4.1.2] Result is a snapshot (modifications to SAB after concat don't affect result):
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([1, 2, 3, 4]);
  const u8 = new Uint8Array(sab);
  const result = Uint8Array.concat([u8]);
  // Modify SAB after concat
  new Uint8Array(sab).fill(0xFF);
  new Uint8Array(result) // → [1, 2, 3, 4] (result is independent of SAB)
  ```

#### 27.4.2 `ArrayBuffer.concat` — Concurrent write from a Worker

- [ ] [27.4.2.1] Worker writes to SharedArrayBuffer while main thread calls `ArrayBuffer.concat` with a SAB input:
  ```js
  const sab = new SharedArrayBuffer(1024);
  const u8 = new Uint8Array(sab);
  u8.fill(0xAA);

  const workerCode = `
    onmessage = function(e) {
      const u8 = new Uint8Array(e.data);
      for (let i = 0; i < 1000000; i++) {
        for (let j = 0; j < u8.length; j++) u8[j] = 0xBB;
      }
      postMessage('done');
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  worker.postMessage(sab);

  const result = ArrayBuffer.concat([sab]);

  result.byteLength // → 1024
  result instanceof ArrayBuffer // → true
  result instanceof SharedArrayBuffer // → false
  // Each byte is either 0xAA or 0xBB
  const resultView = new Uint8Array(result);
  for (const byte of resultView) {
    assert(byte === 0xAA || byte === 0xBB);
  }
  worker.terminate();
  ```

- [ ] [27.4.2.2] Worker writes to SharedArrayBuffer while main thread calls `ArrayBuffer.concat` with a DataView over SAB:
  ```js
  const sab = new SharedArrayBuffer(1024);
  new Uint8Array(sab).fill(0xAA);
  const dv = new DataView(sab);

  // (Same worker pattern as 27.4.2.1)
  // ...
  const result = ArrayBuffer.concat([dv]);
  result.byteLength // → 1024
  // Each byte is either 0xAA or 0xBB
  ```

#### 27.4.3 `SharedArrayBuffer.concat` — Concurrent write from a Worker

- [ ] [27.4.3.1] Worker writes to source SharedArrayBuffer while main thread calls `SharedArrayBuffer.concat`:
  ```js
  const sab = new SharedArrayBuffer(1024);
  new Uint8Array(sab).fill(0xAA);

  const workerCode = `
    onmessage = function(e) {
      const u8 = new Uint8Array(e.data);
      for (let i = 0; i < 1000000; i++) {
        for (let j = 0; j < u8.length; j++) u8[j] = 0xBB;
      }
      postMessage('done');
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  worker.postMessage(sab);

  const result = SharedArrayBuffer.concat([sab]);

  result.byteLength // → 1024
  result instanceof SharedArrayBuffer // → true
  result !== sab // → true (new buffer)
  // Each byte is either 0xAA or 0xBB
  const resultView = new Uint8Array(result);
  for (const byte of resultView) {
    assert(byte === 0xAA || byte === 0xBB);
  }
  worker.terminate();
  ```

#### 27.4.4 Multi-byte element tearing

- [ ] [27.4.4.1] Concurrent write to a SharedArrayBuffer-backed `Int32Array` may produce torn reads for multi-byte elements:
  ```js
  // CopyDataBlockBytes copies raw bytes. If another agent writes a 4-byte value
  // non-atomically (or even atomically) while we copy byte-by-byte, the result
  // may contain partial writes (torn values).
  const sab = new SharedArrayBuffer(4);
  const i32 = new Int32Array(sab);
  Atomics.store(i32, 0, 0x11223344);

  // Worker that repeatedly writes 0xAABBCCDD
  const workerCode = `
    onmessage = function(e) {
      const i32 = new Int32Array(e.data);
      for (let i = 0; i < 1000000; i++) {
        Atomics.store(i32, 0, 0xAABBCCDD);
        Atomics.store(i32, 0, 0x11223344);
      }
      postMessage('done');
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  worker.postMessage(sab);

  const result = Int32Array.concat([i32]);
  result.length // → 1
  // result[0] might be 0x11223344, 0xAABBCCDD, or a torn combination
  // The key assertion: no crash, result is a valid Int32Array of length 1
  worker.terminate();
  ```

Note: Multi-byte tearing behavior is implementation-defined. The tests above assert structural validity (correct length, correct buffer type) rather than specific data values, since the exact bytes observed during a race are nondeterministic.

### 27.5 Concurrent grow of growable SharedArrayBuffer during concat

When a source is a growable SharedArrayBuffer (or a view over one), another agent may call `grow()` concurrently. The byte length is snapshotted during the validation loop with `~seq-cst~` ordering. The copy loop uses the snapshotted length from the `_sources_` record, not a fresh read. The underlying Shared Data Block is always allocated at `maxByteLength`, so `CopyDataBlockBytes` always reads from valid memory regardless of concurrent grows.

#### 27.5.1 Direct growable SAB input — concurrent grow during concat

- [ ] [27.5.1.1] Another thread grows the SAB between validation and copy — result uses snapshotted length:
  ```js
  const gsab = new SharedArrayBuffer(4, { maxByteLength: 1024 });
  new Uint8Array(gsab).set([1, 2, 3, 4]);

  // Worker that grows the buffer
  const workerCode = `
    onmessage = function(e) {
      const gsab = e.data;
      // Spin briefly then grow
      for (let i = 0; i < 100; i++) {}
      gsab.grow(512);
      postMessage('done');
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  worker.postMessage(gsab);

  const result = ArrayBuffer.concat([gsab]);

  // result.byteLength is either 4 (snapshotted before grow) or 512 (snapshotted after grow)
  // but is always one consistent value — never partially grown
  assert(result.byteLength === 4 || result.byteLength === 512);
  // The first 4 bytes are [1, 2, 3, 4] regardless
  const view = new Uint8Array(result);
  assert(view[0] === 1 && view[1] === 2 && view[2] === 3 && view[3] === 4);
  worker.terminate();
  ```

- [ ] [27.5.1.2] Same test with `SharedArrayBuffer.concat`:
  ```js
  const gsab = new SharedArrayBuffer(4, { maxByteLength: 1024 });
  new Uint8Array(gsab).set([1, 2, 3, 4]);

  // (Same worker pattern — grows gsab to 512)
  // ...
  const result = SharedArrayBuffer.concat([gsab]);

  assert(result.byteLength === 4 || result.byteLength === 512);
  result instanceof SharedArrayBuffer // → true
  result !== gsab // → true
  worker.terminate();
  ```

#### 27.5.2 Auto-length TypedArray over growable SAB — concurrent grow

- [ ] [27.5.2.1] Auto-length TypedArray snapshotted via `ValidateTypedArray` with `~seq-cst~`; concurrent grow may or may not be visible:
  ```js
  const gsab = new SharedArrayBuffer(4, { maxByteLength: 1024 });
  new Uint8Array(gsab).set([1, 2, 3, 4]);
  const u8 = new Uint8Array(gsab); // auto-length, tracks byteLength

  // Worker grows the buffer
  // ...
  const result = Uint8Array.concat([u8]);

  // result.length is snapshotted — either 4 (before grow) or grown size (after grow)
  // No crash, result is a valid Uint8Array
  assert(result.length >= 4);
  assert(result[0] === 1 && result[1] === 2 && result[2] === 3 && result[3] === 4);
  ```

#### 27.5.3 Multiple growable SABs — each snapshotted independently

- [ ] [27.5.3.1] Two growable SABs, one grown concurrently — each length is snapshotted independently at validation time:
  ```js
  const gsab1 = new SharedArrayBuffer(4, { maxByteLength: 1024 });
  const gsab2 = new SharedArrayBuffer(4, { maxByteLength: 1024 });
  new Uint8Array(gsab1).set([1, 2, 3, 4]);
  new Uint8Array(gsab2).set([5, 6, 7, 8]);

  // Worker grows gsab1 to 100 bytes
  // ...

  const result = ArrayBuffer.concat([gsab1, gsab2]);

  // gsab1's snapshotted length is either 4 or 100 (depending on race)
  // gsab2's snapshotted length is always 4 (not grown)
  // Total is either 8 or 104
  assert(result.byteLength === 8 || result.byteLength === 104);
  ```

#### 27.5.4 Grow does not affect already-snapshotted length

- [ ] [27.5.4.1] If grow happens after validation but before copy, the snapshotted length is used — no extra bytes are copied:
  ```js
  // This is a logical assertion about the algorithm, not easily testable with
  // precise timing, but structural tests confirm that:
  // - The copy loop uses _source_.[[ByteLength]] from the validation snapshot
  // - CopyDataBlockBytes reads exactly that many bytes
  // - The underlying Shared Data Block memory is valid at any offset < maxByteLength
  // - Therefore the copy is always safe, even if grow() is called concurrently
  ```

Note: The exact length snapshotted depends on thread scheduling and is nondeterministic. Tests assert structural validity (no crash, valid buffer type, consistent byte values within snapshotted range) rather than specific timing outcomes.

---

## 28. DataView with Detached Buffer

- [ ] [28.1.1] DataView whose underlying buffer has been detached in `ArrayBuffer.concat` → TypeError:
  ```js
  const ab = new ArrayBuffer(4);
  const dv = new DataView(ab);
  ab.transfer();
  ArrayBuffer.concat([dv]) // → TypeError (IsViewOutOfBounds returns true for detached buffers)
  ```
- [ ] [28.1.2] DataView whose underlying buffer has been detached in `SharedArrayBuffer.concat` → TypeError:
  ```js
  const ab = new ArrayBuffer(4);
  const dv = new DataView(ab);
  ab.transfer();
  SharedArrayBuffer.concat([dv]) // → TypeError
  ```

---

## 29. Immutable ArrayBuffer as Input

Note: Depends on the [Immutable ArrayBuffer proposal](https://github.com/tc39/proposal-immutable-arraybuffer).

- [ ] [29.1.1] Immutable ArrayBuffer as direct item in `ArrayBuffer.concat`:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const immutableAb = ab.transferToImmutable();
  const result = ArrayBuffer.concat([immutableAb]);
  result.byteLength // → 4
  new Uint8Array(result) // → [1, 2, 3, 4]
  // immutableAb is not detached, not shared → accepted
  ```
- [ ] [29.1.2] Immutable ArrayBuffer as input, mutable result by default:
  ```js
  const immutableAb = new ArrayBuffer(4).transferToImmutable();
  const result = ArrayBuffer.concat([immutableAb]);
  result.immutable // → false (default, result is mutable)
  ```
- [ ] [29.1.3] TypedArray view over immutable ArrayBuffer as item in `%TypedArray%.concat`:
  ```js
  // Note: TypedArrays over immutable buffers are read-only but valid
  // ValidateTypedArray should pass (buffer is not detached)
  ```
- [ ] [29.1.4] Immutable ArrayBuffer as direct item in `SharedArrayBuffer.concat`:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const immutableAb = ab.transferToImmutable();
  const result = SharedArrayBuffer.concat([immutableAb]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```

---

## 30. Options Property Access Order

### 30.1 `ArrayBuffer.concat` options access order

The spec reads options properties in order: `length` (step 5a), `resizable` (step 5b), `immutable` (step 5c). Observable via getters.

- [ ] [30.1.1] Options property access order is `length`, then `resizable`, then `immutable`:
  ```js
  const order = [];
  const opts = {
    get length() { order.push('length'); return undefined; },
    get resizable() { order.push('resizable'); return false; },
    get immutable() { order.push('immutable'); return false; },
  };
  ArrayBuffer.concat([], opts);
  order // → ['length', 'resizable', 'immutable']
  ```
- [ ] [30.1.2] If `length` getter throws, `resizable` and `immutable` are never accessed:
  ```js
  const order = [];
  const opts = {
    get length() { throw new Error('length'); },
    get resizable() { order.push('resizable'); return false; },
    get immutable() { order.push('immutable'); return false; },
  };
  try { ArrayBuffer.concat([], opts); } catch(e) {}
  order // → [] (resizable and immutable never read)
  ```
- [ ] [30.1.3] If `resizable` getter throws, `immutable` is never accessed:
  ```js
  const order = [];
  const opts = {
    get length() { order.push('length'); return undefined; },
    get resizable() { throw new Error('resizable'); },
    get immutable() { order.push('immutable'); return false; },
  };
  try { ArrayBuffer.concat([], opts); } catch(e) {}
  order // → ['length'] (immutable never read)
  ```

### 30.2 `SharedArrayBuffer.concat` options access order

The spec reads options properties in order: `length` (step 5a), `growable` (step 5b). Observable via getters.

- [ ] [30.2.1] Options property access order is `length`, then `growable`:
  ```js
  const order = [];
  const opts = {
    get length() { order.push('length'); return undefined; },
    get growable() { order.push('growable'); return false; },
  };
  SharedArrayBuffer.concat([], opts);
  order // → ['length', 'growable']
  ```
- [ ] [30.2.2] If `length` getter throws, `growable` is never accessed:
  ```js
  const order = [];
  const opts = {
    get length() { throw new Error('length'); },
    get growable() { order.push('growable'); return false; },
  };
  try { SharedArrayBuffer.concat([], opts); } catch(e) {}
  order // → [] (growable never read)
  ```

---

## 31. Boundary Values for Length / Overflow Checks

### 31.1 `Number.MAX_SAFE_INTEGER` as length (exactly 2^53 - 1)

- [ ] [31.1.1] `Uint8Array.concat([], Number.MAX_SAFE_INTEGER)` → accepted (does not throw RangeError from overflow check); will likely throw from `AllocateTypedArrayBuffer` due to implementation memory limits
- [ ] [31.1.2] `ArrayBuffer.concat([], { length: Number.MAX_SAFE_INTEGER })` → accepted (does not throw from overflow check); will likely throw from `AllocateArrayBuffer`
- [ ] [31.1.3] `SharedArrayBuffer.concat([], { length: Number.MAX_SAFE_INTEGER })` → accepted (does not throw from overflow check); will likely throw from `AllocateSharedArrayBuffer`

### 31.2 Overflow check with explicit length provided

- [ ] [31.2.1] Explicit `length` is small, but `totalLength` overflows → RangeError from overflow check even though `newLength` is small:
  ```js
  // If we could create TypedArrays whose combined lengths exceed 2^53 - 1,
  // the overflow check on totalLength would fire even with length: 5
  // This is because totalLength is computed unconditionally before newLength is used
  ```

### 31.3 `length` of exactly 0 with items

- [ ] [31.3.1] `Uint8Array.concat([new Uint8Array([1, 2, 3])], 0)` → empty TypedArray, items still validated:
  ```js
  // Even though the result is empty, all items are validated (ValidateTypedArray, type check)
  Uint8Array.concat([new Int16Array([1])], 0) // → TypeError (type mismatch, not silently skipped)
  ```
- [ ] [31.3.2] `ArrayBuffer.concat([new SharedArrayBuffer(4)], { length: 0 })` → empty ArrayBuffer (SharedArrayBuffer accepted, result truncated to 0 bytes)

---

## 32. `SharedArrayBuffer.concat` — Items Validation

### 32.1 Items is not iterable

- [ ] [32.1.1] `SharedArrayBuffer.concat(undefined)` → TypeError
- [ ] [32.1.2] `SharedArrayBuffer.concat(null)` → TypeError
- [ ] [32.1.3] `SharedArrayBuffer.concat(42)` → TypeError
- [ ] [32.1.4] `SharedArrayBuffer.concat({})` → TypeError
- [ ] [32.1.5] `SharedArrayBuffer.concat({ [Symbol.iterator]: null })` → TypeError (`GetMethod` returns *undefined* when property is *null*)

### 32.2 Items iterable throws during iteration

- [ ] [32.2.1] Items iterable whose `Symbol.iterator` method throws → error propagates
- [ ] [32.2.2] Items iterable whose iterator's `next()` throws → error propagates

### 32.3 Item is not an ArrayBuffer, SharedArrayBuffer, TypedArray, or DataView

- [ ] [32.3.1] `SharedArrayBuffer.concat([42])` → TypeError
- [ ] [32.3.2] `SharedArrayBuffer.concat([{}])` → TypeError
- [ ] [32.3.3] `SharedArrayBuffer.concat(['string'])` → TypeError
- [ ] [32.3.4] `SharedArrayBuffer.concat([null])` → TypeError
- [ ] [32.3.5] `SharedArrayBuffer.concat([undefined])` → TypeError
- [ ] [32.3.6] `SharedArrayBuffer.concat([[1, 2, 3]])` → TypeError (plain Array)

### 32.4 Item is a detached ArrayBuffer

- [ ] [32.4.1] Detached ArrayBuffer → TypeError:
  ```js
  const ab = new ArrayBuffer(4);
  ab.transfer();
  SharedArrayBuffer.concat([ab]) // → TypeError
  ```

### 32.5 Item is a TypedArray with a detached buffer

- [ ] [32.5.1] TypedArray whose buffer has been detached → TypeError from `ValidateTypedArray`

### 32.6 Item is a DataView that is out of bounds

- [ ] [32.6.1] DataView over a resizable ArrayBuffer that has been shrunk below the view's range → TypeError from `IsViewOutOfBounds`

### 32.7 Mixed valid item types

- [ ] [32.7.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(2), new Uint8Array([1, 2]), new DataView(new ArrayBuffer(3))])` → SharedArrayBuffer of byteLength 7
- [ ] [32.7.2] `SharedArrayBuffer.concat([new ArrayBuffer(2), new SharedArrayBuffer(2)])` → SharedArrayBuffer of byteLength 4
- [ ] [32.7.3] First item valid, second item invalid → TypeError on second item

---

## 33. `SharedArrayBuffer.concat` — Options Validation

### 33.1 Options is `undefined` or not provided

- [ ] [33.1.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)])` → works, no options
- [ ] [33.1.2] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], undefined)` → works, same as no options

### 33.2 Options is not an object

- [ ] [33.2.1] `SharedArrayBuffer.concat([], 42)` → TypeError from `GetOptionsObject`
- [ ] [33.2.2] `SharedArrayBuffer.concat([], 'string')` → TypeError
- [ ] [33.2.3] `SharedArrayBuffer.concat([], true)` → TypeError
- [ ] [33.2.4] `SharedArrayBuffer.concat([], null)` → TypeError (*null* is not *undefined* and not an Object)

### 33.3 Length option validation

#### 33.3.1 Non-Number length → TypeError

- [ ] [33.3.1.1] `SharedArrayBuffer.concat([], { length: 'hello' })` → TypeError
- [ ] [33.3.1.2] `SharedArrayBuffer.concat([], { length: {} })` → TypeError
- [ ] [33.3.1.3] `SharedArrayBuffer.concat([], { length: true })` → TypeError
- [ ] [33.3.1.4] `SharedArrayBuffer.concat([], { length: Symbol() })` → TypeError
- [ ] [33.3.1.5] `SharedArrayBuffer.concat([], { length: 1n })` → TypeError

#### 33.3.2 NaN / non-integral / Infinity → RangeError

- [ ] [33.3.2.1] `SharedArrayBuffer.concat([], { length: NaN })` → RangeError
- [ ] [33.3.2.2] `SharedArrayBuffer.concat([], { length: 1.5 })` → RangeError
- [ ] [33.3.2.3] `SharedArrayBuffer.concat([], { length: Infinity })` → RangeError
- [ ] [33.3.2.4] `SharedArrayBuffer.concat([], { length: -Infinity })` → RangeError

#### 33.3.3 Negative length → RangeError

- [ ] [33.3.3.1] `SharedArrayBuffer.concat([], { length: -1 })` → RangeError
- [ ] [33.3.3.2] `SharedArrayBuffer.concat([], { length: -100 })` → RangeError

#### 33.3.4 Length exceeds 2^53 - 1 → RangeError

- [ ] [33.3.4.1] `SharedArrayBuffer.concat([], { length: 2 ** 53 })` → RangeError
- [ ] [33.3.4.2] `SharedArrayBuffer.concat([], { length: Number.MAX_SAFE_INTEGER + 1 })` → RangeError

#### 33.3.5 Length is -0 (treated as 0)

- [ ] [33.3.5.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { length: -0 })` → SharedArrayBuffer of byteLength 0

#### 33.3.6 Length is `undefined` (same as not provided)

- [ ] [33.3.6.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { length: undefined })` → byteLength 4 (defaults to total)

### 33.4 Growable option

- [ ] [33.4.1] `SharedArrayBuffer.concat([], { growable: true })` → result is growable
- [ ] [33.4.2] `SharedArrayBuffer.concat([], { growable: false })` → result is not growable (default behavior)

### 33.5 Growable is coerced via `ToBoolean`

- [ ] [33.5.1] `SharedArrayBuffer.concat([], { growable: 1 })` → result is growable (truthy)
- [ ] [33.5.2] `SharedArrayBuffer.concat([], { growable: 0 })` → result is not growable (falsy)
- [ ] [33.5.3] `SharedArrayBuffer.concat([], { growable: '' })` → result is not growable (falsy)
- [ ] [33.5.4] `SharedArrayBuffer.concat([], { growable: 'yes' })` → result is growable (truthy)
- [ ] [33.5.5] `SharedArrayBuffer.concat([], { growable: null })` → result is not growable (falsy)
- [ ] [33.5.6] `SharedArrayBuffer.concat([], { growable: undefined })` → result is not growable (falsy)

### 33.6 No `immutable` option

- [ ] [33.6.1] `SharedArrayBuffer.concat([], { immutable: true })` → `immutable` option is ignored (SharedArrayBuffer has no immutable concept); result is a normal SharedArrayBuffer

---

## 34. `SharedArrayBuffer.concat` — Overflow Check on `totalByteLength`

### 34.1 Total byte length exceeds 2^53 - 1

- [ ] [34.1.1] Concatenating items whose combined byte lengths exceed 2^53 - 1 → RangeError
- [ ] [34.1.2] Overflow check is per-item (fails as soon as running total exceeds limit)
- [ ] [34.1.3] Overflow check applies regardless of which item type triggers it (SharedArrayBuffer, ArrayBuffer, TypedArray, or DataView)

Note: As with §4 and §10, creating buffers large enough to trigger this may be implementation-limited.

---

## 35. `SharedArrayBuffer.concat` — Basic Concatenation

### 35.1 SharedArrayBuffer inputs

- [ ] [35.1.1] Two SharedArrayBuffers:
  ```js
  const sab1 = new SharedArrayBuffer(4);
  new Uint8Array(sab1).set([1, 2, 3, 4]);
  const sab2 = new SharedArrayBuffer(4);
  new Uint8Array(sab2).set([5, 6, 7, 8]);
  const result = SharedArrayBuffer.concat([sab1, sab2]);
  result.byteLength // → 8
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6, 7, 8]
  ```
- [ ] [35.1.2] Single SharedArrayBuffer → copy (new buffer, not same object)
- [ ] [35.1.3] Three or more SharedArrayBuffers → concatenated in order

### 35.2 ArrayBuffer inputs

- [ ] [35.2.1] ArrayBuffer as input, result is SharedArrayBuffer:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const result = SharedArrayBuffer.concat([ab]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```

### 35.3 TypedArray inputs (viewed portion only)

- [ ] [35.3.1] Full-buffer TypedArray:
  ```js
  const u8 = new Uint8Array([1, 2, 3, 4]);
  const result = SharedArrayBuffer.concat([u8]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  ```
- [ ] [35.3.2] TypedArray with byte offset:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const view = new Uint8Array(ab, 2, 3); // views bytes [3, 4, 5]
  const result = SharedArrayBuffer.concat([view]);
  result.byteLength // → 3
  new Uint8Array(result) // → [3, 4, 5]
  ```
- [ ] [35.3.3] Multi-byte element TypedArray:
  ```js
  const i32 = new Int32Array([1, 2]); // 8 bytes
  const result = SharedArrayBuffer.concat([i32]);
  result.byteLength // → 8
  ```

### 35.4 DataView inputs (viewed portion only)

- [ ] [35.4.1] Full-buffer DataView:
  ```js
  const ab = new ArrayBuffer(4);
  new Uint8Array(ab).set([1, 2, 3, 4]);
  const dv = new DataView(ab);
  const result = SharedArrayBuffer.concat([dv]);
  result.byteLength // → 4
  result instanceof SharedArrayBuffer // → true
  ```
- [ ] [35.4.2] DataView with byte offset and length:
  ```js
  const ab = new ArrayBuffer(8);
  new Uint8Array(ab).set([1, 2, 3, 4, 5, 6, 7, 8]);
  const dv = new DataView(ab, 2, 3);
  const result = SharedArrayBuffer.concat([dv]);
  result.byteLength // → 3
  new Uint8Array(result) // → [3, 4, 5]
  ```

### 35.5 Mixed input types

- [ ] [35.5.1] SharedArrayBuffer + ArrayBuffer + TypedArray + DataView:
  ```js
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([1, 2]);
  const ab = new ArrayBuffer(2);
  new Uint8Array(ab).set([3, 4]);
  const u8 = new Uint8Array([5, 6]);
  const dv = new DataView(new ArrayBuffer(2));
  new Uint8Array(dv.buffer).set([7, 8]);
  const result = SharedArrayBuffer.concat([sab, ab, u8, dv]);
  result.byteLength // → 8
  result instanceof SharedArrayBuffer // → true
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6, 7, 8]
  ```

### 35.6 Empty inputs

- [ ] [35.6.1] `SharedArrayBuffer.concat([])` → SharedArrayBuffer of byteLength 0
- [ ] [35.6.2] `SharedArrayBuffer.concat([new SharedArrayBuffer(0)])` → SharedArrayBuffer of byteLength 0
- [ ] [35.6.3] `SharedArrayBuffer.concat([new SharedArrayBuffer(0), new SharedArrayBuffer(0)])` → SharedArrayBuffer of byteLength 0

### 35.7 Result is always a new SharedArrayBuffer

- [ ] [35.7.1] Result is not the same object as any input:
  ```js
  const sab = new SharedArrayBuffer(4);
  const result = SharedArrayBuffer.concat([sab]);
  result !== sab // → true
  ```

---

## 36. `SharedArrayBuffer.concat` — Truncation and Zero-Fill

### 36.1 Truncation (length < totalByteLength)

- [ ] [36.1.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(8)], { length: 4 })` → byteLength 4
- [ ] [36.1.2] Truncation mid-second-item:
  ```js
  const sab1 = new SharedArrayBuffer(4);
  new Uint8Array(sab1).set([1, 2, 3, 4]);
  const sab2 = new SharedArrayBuffer(4);
  new Uint8Array(sab2).set([5, 6, 7, 8]);
  const result = SharedArrayBuffer.concat([sab1, sab2], { length: 6 });
  new Uint8Array(result) // → [1, 2, 3, 4, 5, 6]
  ```
- [ ] [36.1.3] Truncation to 0: `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { length: 0 })` → byteLength 0

### 36.2 Zero-fill (length > totalByteLength)

- [ ] [36.2.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { length: 8 })` → byteLength 8, last 4 bytes are 0
- [ ] [36.2.2] `SharedArrayBuffer.concat([], { length: 4 })` → byteLength 4, all bytes 0
- [ ] [36.2.3] Verify zero-fill bytes are actually 0:
  ```js
  const sab = new SharedArrayBuffer(2);
  new Uint8Array(sab).set([0xFF, 0xFF]);
  const result = SharedArrayBuffer.concat([sab], { length: 4 });
  const u8 = new Uint8Array(result);
  // u8[0] === 0xFF, u8[1] === 0xFF, u8[2] === 0, u8[3] === 0
  ```

### 36.3 Exact length

- [ ] [36.3.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { length: 4 })` → byteLength 4 (same as no length)

---

## 37. `SharedArrayBuffer.concat` — Growable Option

### 37.1 Basic growable result

- [ ] [37.1.1] Growable with explicit length:
  ```js
  const result = SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { growable: true, length: 16 });
  result.growable // → true
  result.byteLength // → 4 (actual data)
  result.maxByteLength // → 16
  ```
- [ ] [37.1.2] Growable result can be grown:
  ```js
  const result = SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { growable: true, length: 16 });
  result.grow(8);
  result.byteLength // → 8
  ```

### 37.2 Growable without explicit length (maxByteLength = totalByteLength)

- [ ] [37.2.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { growable: true })` → `byteLength === 4`, `maxByteLength === 4` (buffer already at max)

### 37.3 Growable with length less than totalByteLength

- [ ] [37.3.1] `maxByteLength` is `length`, `byteLength` is clamped:
  ```js
  const sab1 = new SharedArrayBuffer(4);
  const sab2 = new SharedArrayBuffer(4);
  const result = SharedArrayBuffer.concat([sab1, sab2], { growable: true, length: 6 });
  result.byteLength // → 6 (clamped: min(8, 6))
  result.maxByteLength // → 6
  ```

### 37.4 Growable with length greater than totalByteLength

- [ ] [37.4.1] `byteLength` equals total data, `maxByteLength` equals `length`:
  ```js
  const result = SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { growable: true, length: 32 });
  result.byteLength // → 4 (actual data)
  result.maxByteLength // → 32 (room to grow)
  ```

### 37.5 Data integrity in growable result

- [ ] [37.5.1] Source data is correctly copied into growable result:
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([1, 2, 3, 4]);
  const result = SharedArrayBuffer.concat([sab], { growable: true, length: 16 });
  new Uint8Array(result, 0, 4) // → [1, 2, 3, 4]
  ```

---

## 38. `SharedArrayBuffer.concat` — Growable SharedArrayBuffer Inputs

### 38.1 Only current byteLength is copied (not maxByteLength)

- [ ] [38.1.1] Growable SharedArrayBuffer passed directly — copies current byteLength, ignores maxByteLength:
  ```js
  const gsab = new SharedArrayBuffer(4, { maxByteLength: 64 });
  new Uint8Array(gsab).set([1, 2, 3, 4]);
  const result = SharedArrayBuffer.concat([gsab]);
  result.byteLength // → 4 (not 64)
  new Uint8Array(result) // → [1, 2, 3, 4]
  ```
- [ ] [38.1.2] Two growable SharedArrayBuffers — total is sum of current byteLengths:
  ```js
  const gsab1 = new SharedArrayBuffer(3, { maxByteLength: 100 });
  const gsab2 = new SharedArrayBuffer(2, { maxByteLength: 200 });
  new Uint8Array(gsab1).set([1, 2, 3]);
  new Uint8Array(gsab2).set([4, 5]);
  const result = SharedArrayBuffer.concat([gsab1, gsab2]);
  result.byteLength // → 5 (not 300)
  new Uint8Array(result) // → [1, 2, 3, 4, 5]
  ```

### 38.2 Growable SharedArrayBuffer after grow

- [ ] [38.2.1] After grow — copies the grown size (including zero-initialized region):
  ```js
  const gsab = new SharedArrayBuffer(4, { maxByteLength: 32 });
  new Uint8Array(gsab).set([1, 2, 3, 4]);
  gsab.grow(8);
  const result = SharedArrayBuffer.concat([gsab]);
  result.byteLength // → 8
  new Uint8Array(result) // → [1, 2, 3, 4, 0, 0, 0, 0]
  ```

### 38.3 TypedArray/DataView over growable SharedArrayBuffer

- [ ] [38.3.1] Auto-length TypedArray over growable SharedArrayBuffer:
  ```js
  const gsab = new SharedArrayBuffer(4, { maxByteLength: 64 });
  new Uint8Array(gsab).set([10, 20, 30, 40]);
  const u8 = new Uint8Array(gsab); // auto-length
  const result = SharedArrayBuffer.concat([u8]);
  result.byteLength // → 4 (not 64)
  ```
- [ ] [38.3.2] Fixed-length TypedArray over growable SharedArrayBuffer:
  ```js
  const gsab = new SharedArrayBuffer(16, { maxByteLength: 64 });
  const u8 = new Uint8Array(gsab, 0, 4); // fixed-length: 4 elements
  new Uint8Array(gsab).set([1, 2, 3, 4]);
  const result = SharedArrayBuffer.concat([u8]);
  result.byteLength // → 4
  ```

---

## 39. `SharedArrayBuffer.concat` — Copy Loop Edge Cases

### 39.1 Short-circuit when result is full

- [ ] [39.1.1] With `length: 0`, no bytes are copied:
  ```js
  const result = SharedArrayBuffer.concat([new SharedArrayBuffer(4)], { length: 0 });
  result.byteLength // → 0
  ```
- [ ] [39.1.2] With `length: 2` and items totalling 8 bytes, only the first 2 bytes are in the result

### 39.2 Copy spans multiple items

- [ ] [39.2.1] Three items, truncation in the middle of the second:
  ```js
  const sab1 = new SharedArrayBuffer(3);
  new Uint8Array(sab1).set([1, 2, 3]);
  const sab2 = new SharedArrayBuffer(3);
  new Uint8Array(sab2).set([4, 5, 6]);
  const sab3 = new SharedArrayBuffer(3);
  new Uint8Array(sab3).set([7, 8, 9]);
  const result = SharedArrayBuffer.concat([sab1, sab2, sab3], { length: 5 });
  new Uint8Array(result) // → [1, 2, 3, 4, 5]
  ```

### 39.3 Zero-length items in the mix

- [ ] [39.3.1] `SharedArrayBuffer.concat([new SharedArrayBuffer(0), new SharedArrayBuffer(4), new SharedArrayBuffer(0)])` → byteLength 4

---

## 40. `SharedArrayBuffer.concat` — Tamper Resistance

### 40.1 Overridden `.byteLength` on SharedArrayBuffer items

- [ ] [40.1.1] `Object.defineProperty` to increase `.byteLength`:
  ```js
  const sab = new SharedArrayBuffer(4);
  new Uint8Array(sab).set([1, 2, 3, 4]);
  Object.defineProperty(sab, 'byteLength', { value: 100 });
  const result = SharedArrayBuffer.concat([sab]);
  result.byteLength // → 4 (uses [[ArrayBufferByteLength]], not .byteLength)
  ```

### 40.2 Overridden properties on TypedArray items

- [ ] [40.2.1] Overridden `.byteLength` on TypedArray passed to `SharedArrayBuffer.concat`:
  ```js
  const u8 = new Uint8Array([1, 2, 3, 4]);
  Object.defineProperty(u8, 'byteLength', { value: 100 });
  const result = SharedArrayBuffer.concat([u8]);
  result.byteLength // → 4
  ```

### 40.3 Overridden options object accessors

- [ ] [40.3.1] Options object with getter on `length` that has side effects:
  ```js
  let callCount = 0;
  const opts = { get length() { callCount++; return 4; } };
  SharedArrayBuffer.concat([new SharedArrayBuffer(2)], opts);
  callCount // → 1
  ```
- [ ] [40.3.2] Options object with getter on `growable` that throws:
  ```js
  const opts = { get growable() { throw new Error('boom'); } };
  SharedArrayBuffer.concat([], opts) // → Error('boom')
  ```

### 40.4 Prototype pollution

- [ ] [40.4.1] Poisoned `SharedArrayBuffer.prototype.byteLength` does not affect result:
  ```js
  const origDesc = Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'byteLength');
  try {
    Object.defineProperty(SharedArrayBuffer.prototype, 'byteLength', { get() { return 9999; } });
    const sab = new SharedArrayBuffer(4);
    new Uint8Array(sab).set([1, 2, 3, 4]);
    const result = SharedArrayBuffer.concat([sab]);
    result.byteLength // → 4
  } finally {
    Object.defineProperty(SharedArrayBuffer.prototype, 'byteLength', origDesc);
  }
  ```

---

## 41. `SharedArrayBuffer.concat` — Items Iterable Variations

- [ ] [41.1.1] Plain Array: `SharedArrayBuffer.concat([new SharedArrayBuffer(2), new SharedArrayBuffer(2)])` → works
- [ ] [41.1.2] Generator:
  ```js
  function* gen() { yield new SharedArrayBuffer(2); yield new Uint8Array([1, 2]); }
  SharedArrayBuffer.concat(gen()) // → SharedArrayBuffer of byteLength 4
  ```
- [ ] [41.1.3] Set of mixed types:
  ```js
  SharedArrayBuffer.concat(new Set([new SharedArrayBuffer(2), new Uint8Array([1, 2]), new DataView(new ArrayBuffer(2))]))
  // → SharedArrayBuffer of byteLength 6
  ```
