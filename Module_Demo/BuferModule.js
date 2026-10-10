// ============================================================
// buffer-demo.js
// Demonstrates Node's GLOBAL `Buffer` class.
//
// WHY BUFFERS MATTER:
//   JavaScript strings are UTF-16 text. Files, sockets, and
//   images are BINARY bytes. Buffer is Node's way to hold raw
//   binary data outside the V8 heap — used by streams, fs,
//   crypto, HTTP, and image processing.
//
// KEY FACTS:
//   - Buffer is a GLOBAL — you do NOT need to require() it.
//   - It extends Uint8Array — an array of bytes (0–255).
//   - Buffers are FIXED in size once created.
//   - When you read a file, you get a Buffer (not a string).
//
// WHAT THIS FILE COVERS:
//   1.  Buffer.from(string)      → create a buffer from text
//   2.  Buffer.concat([...])     → join multiple buffers
//   3.  buffer.toString()        → decode back to text
//   4.  buffer.length            → byte length
//   5.  buffer.toString("base64")→ encode as Base64
//   6.  Buffer.alloc(n)          → create a fixed-size buffer
//   7.  source.copy(target)      → copy bytes into another buffer
//   8.  buffer.slice(a, b)       → extract a sub-buffer
//   9.  Buffer.compare(a, b)     → compare two buffers
//  10.  fs.readFile → data       → read a file as a Buffer
//
// RUN:
//     node buffer-demo.js
//
// REQUIREMENTS:
//   Create a file `student.txt` in the same folder with any text.
//
// NO INSTALLATION:
//   Buffer is global; fs is built-in. No npm install needed.
// ============================================================

const fs = require("fs");

// ============================================================
// 1. CREATE BUFFERS FROM STRINGS — Buffer.from(str[, encoding])
//
// UTF-8 is the default encoding when you pass a string.
// "John " has 5 characters → 5 bytes in UTF-8.
// The trailing space is intentional (we'll concatenate later).
// ============================================================
const firstName = Buffer.from("John ");

// Another buffer with "Doe" (3 bytes in UTF-8).
const lastName = Buffer.from("Doe");

// ============================================================
// 2. CONCATENATE BUFFERS — Buffer.concat([buf1, buf2, ...])
//
// Joins multiple buffers end-to-end into ONE new buffer.
// Result length = sum of all input lengths (5 + 3 = 8 bytes).
//
// This is the standard way to combine binary chunks — used
// everywhere in stream handling.
// ============================================================
const fullName = Buffer.concat([firstName, lastName]);

// ============================================================
// 3. DECODE BUFFER TO STRING — buffer.toString([encoding])
//
// Default encoding is "utf8". Without this call, console.log
// would show raw byte values like <Buffer 4a 6f 68 6e ...>.
// ============================================================
console.log("Student Name:", fullName.toString());
// → Student Name: John Doe

// ============================================================
// 4. BUFFER LENGTH — buffer.length
//
// Returns the number of BYTES, not characters.
// For ASCII text they are the same, but for emoji/multibyte
// characters (e.g. "é", "汉", "😀") they are NOT.
//
// Example: "😀" is 1 character but 4 bytes in UTF-8.
// ============================================================
console.log("Buffer Length:", fullName.length);
// → Buffer Length: 8

// ============================================================
// 5. BASE64 ENCODING — buffer.toString("base64")
//
// Encodes the raw bytes into a text-safe string using the
// Base64 alphabet (A–Z, a–z, 0–9, +, /, and = padding).
//
// Common uses:
//   - Embedding images in HTML/CSS data URLs
//   - Sending binary over JSON
//   - HTTP Basic Authentication headers
//
// Other useful encodings: "hex", "ascii", "utf8", "latin1".
// ============================================================
console.log("Base64:", fullName.toString("base64"));
// → Base64: Sm9obiBEb2U=

// ============================================================
// 6. ALLOCATE A NEW BUFFER — Buffer.alloc(size)
//
// Creates a buffer of `size` bytes, initialized to ZERO.
// (Compare with Buffer.allocUnsafe(n), which is faster but
// contains garbage memory — never use it for sensitive data.)
//
// Buffers are FIXED SIZE — you cannot grow them later.
// ============================================================
const copiedBuffer = Buffer.alloc(fullName.length);

// ============================================================
// 7. COPY BYTES — source.copy(target[, targetStart])
//
// Copies the entire content of `fullName` into `copiedBuffer`.
// After this call, both buffers contain the same 8 bytes.
// ============================================================
fullName.copy(copiedBuffer);

console.log("Copied:", copiedBuffer.toString());
// → Copied: John Doe

// ============================================================
// 8. SLICE A BUFFER — buffer.slice(start, end)
//
// Returns a VIEW into the same memory (not a copy).
//   start → included
//   end   → excluded (like Array.prototype.slice)
//
// Here: bytes 0..3 → "John"
//
// ⚠️  Because slice() shares memory, modifying the slice
// ALSO modifies the original buffer. Use Buffer.from(buf)
// if you need a true independent copy.
// ============================================================
const firstPart = fullName.slice(0, 4);

console.log("Sliced:", firstPart.toString());
// → Sliced: John

// ============================================================
// 9. COMPARE BUFFERS — Buffer.compare(a, b)
//
// Returns a number indicating the sort order:
//    -1  → a comes BEFORE b (a is smaller)
//     0  → a and b are identical
//     1  → a comes AFTER b (a is larger)
//
// Comparison is done byte-by-byte, like sorting strings.
//
// Here fullName === copiedBuffer, so the result is 0.
// ============================================================
const compareResult = Buffer.compare(fullName, copiedBuffer);

console.log("Compare Result:", compareResult);
// → Compare Result: 0

// ============================================================
// 10. READ A FILE AS A BUFFER — fs.readFile(path, cb)
//
// When you do not pass an encoding (like "utf8"), Node returns
// the file's contents as a Buffer.
//
// `data` here is a Buffer, NOT a string.
//   - data.length        → byte size of the file
//   - data.toString()    → decoded as UTF-8 text
//
// This is why large-file processing uses streams: readFile
// loads the WHOLE file into a single buffer.
// ============================================================
fs.readFile("student.txt", (err, data) => {
  // Always check err first.
  if (err) {
    console.log("File Error:", err.message);
    return;
  }

  console.log("\nFile Content:");
  // Convert the Buffer back to a UTF-8 string for printing.
  console.log(data.toString());
});
