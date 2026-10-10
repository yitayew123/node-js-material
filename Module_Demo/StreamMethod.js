// ============================================================
// streams-demo.js
// Demonstrates Node's BUILT-IN `stream` module.
//
// WHY STREAMS MATTER:
//   Reading a 1 GB file with fs.readFile loads the ENTIRE file
//   into memory before you can use it. Streams process data in
//   small chunks as they arrive — constant memory, faster start.
//
// FOUR STREAM TYPES IN NODE:
//   1. Readable   → data comes FROM (fs.createReadStream)
//   2. Writable   → data goes TO   (fs.createWriteStream)
//   3. Duplex     → both directions (TCP sockets)
//   4. Transform  → readable + writable, modifies data in flight
//
// WHAT THIS FILE DOES:
//   input.txt  ──►  [Readable]  ──►  [Transform: uppercase]
//                                        │
//                                        ▼
//                                   [Writable]  ──►  output.txt
//
// KEY METHODS USED:
//   fs.createReadStream(path)     → source stream
//   fs.createWriteStream(path)    → destination stream
//   new Transform({ transform })  → modify chunks on the way
//   .pipe(nextStream)             → connect streams together
//   .on("open" | "end" | "finish" | "error", fn) → lifecycle events
//
// RUN:
//     node streams-demo.js
//
// REQUIREMENTS:
//   A file named `input.txt` must exist in the same folder.
//   After running, `output.txt` is created with uppercase text.
// ============================================================

// ------------------------------------------------------------
// IMPORTS — BUILT-IN MODULES
//   fs     → file system (read/write files as streams)
//   stream → Stream base classes (Transform, Readable, etc.)
//
// No path prefix → these are built-in. No npm install needed.
// ------------------------------------------------------------
const fs = require("fs");
const { Transform } = require("stream");

// ============================================================
// 1. READABLE STREAM
//
// fs.createReadStream(path) opens the file and emits its
// contents in chunks (default 64 KB each).
//
// Events you can listen to:
//   "open"   → file handle opened
//   "data"   → a chunk arrived
//   "end"    → all chunks read
//   "error"  → something failed
//   "close"  → underlying handle closed
//
// NOTE: When you .pipe() a readable, it starts flowing
// automatically — you do not need to listen for "data"
// manually in that case.
// ============================================================
const readStream = fs.createReadStream("input.txt");

// ============================================================
// 2. WRITABLE STREAM
//
// fs.createWriteStream(path) creates (or truncates) the file
// and provides a place to write incoming chunks.
//
// Events:
//   "finish" → all data flushed and file closed
//   "error"  → something failed
//   "pipe"   → a readable started piping into it
//   "unpipe" → a source stopped piping
// ============================================================
const writeStream = fs.createWriteStream("output.txt");

// ============================================================
// 3. TRANSFORM STREAM
//
// A Transform is BOTH readable and writable: it receives
// chunks, modifies them, and pushes the results downstream.
//
// HOW THE transform() METHOD WORKS:
//   transform(chunk, encoding, callback)
//     chunk     → the incoming Buffer (one chunk of input)
//     encoding  → usually "buffer"; ignore for files
//     callback  → MUST be called when done so the next chunk
//                 can be processed (prevents "backpressure")
//
// Inside:
//   this.push(modified)  → send the new data downstream
//   callback()           → signal "done with this chunk"
//
// If you need to handle errors:
//   callback(new Error("msg"))
// ============================================================
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // chunk is a Buffer → convert to string, uppercase it.
    // this.push() emits the transformed data to the next pipe.
    this.push(chunk.toString().toUpperCase());

    // Signal that this chunk is fully processed.
    // Without calling callback(), the pipeline stalls.
    callback();
  },
});

// ============================================================
// 4. EVENT HANDLING
// Streams are EventEmitters — we attach lifecycle listeners.
// These are diagnostic hooks so you can see what happens.
// ============================================================

// ----- Readable: "open" fires when the file handle opens -----
readStream.on("open", () => {
  console.log("Reading Started");
});

// ----- Readable: "end" fires after the last chunk is read -----
readStream.on("end", () => {
  console.log("Reading Finished");
});

// ----- Writable: "finish" fires after all writes flush -----
// NOTE: "finish" (on the writable) is NOT the same as "end"
// (on the readable). Both fire, but at different times.
writeStream.on("finish", () => {
  console.log("Writing Finished");
});

// ----- Errors on the readable side -----
// If input.txt is missing, this fires with ENOENT.
readStream.on("error", (err) => {
  console.log("Read Error:", err.message);
});

// ----- Errors on the writable side -----
// e.g., disk full, permission denied.
writeStream.on("error", (err) => {
  console.log("Write Error:", err.message);
});

// ============================================================
// 5. PIPE THE PIPELINE
//
// .pipe() connects streams so that the OUTPUT of one becomes
// the INPUT of the next — like Unix pipes `cat a | tr A-Z`.
//
// DATA FLOW:
//   readStream  ──chunk──►  upperCaseTransform  ──chunk──►  writeStream
//
// .pipe() also handles BACKPRESSURE automatically:
//   if the destination is slow, the source is paused
//   until the destination drains. This is the whole point.
//
// The returned value of .pipe() is the destination stream,
// which is why we can chain .pipe().pipe().
// ============================================================
readStream.pipe(upperCaseTransform).pipe(writeStream);
