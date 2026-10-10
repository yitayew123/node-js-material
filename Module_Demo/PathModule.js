// ============================================================
// path-demo.js
// Demonstrates Node's BUILT-IN `path` module.
//
// WHY `path` MATTERS:
//   File paths differ across operating systems:
//     macOS / Linux → /Users/me/data/students/student.txt
//     Windows       → C:\Users\me\data\students\student.txt
//   The `path` module builds the correct path for whichever
//   OS the code is running on — no hardcoded slashes.
//
// WHAT THIS FILE COVERS:
//   1. path.join()      → build a path from segments
//   2. path.resolve()   → get an absolute path
//   3. path.basename()  → file name only
//   4. path.dirname()   → folder only
//   5. path.extname()   → file extension only
//   6. path.parse()     → break path into parts
//   7. path.format()    → rebuild path from parts
//   8. path.normalize() → clean up messy paths
//   9. __filename       → full path of the current file
//  10. __dirname        → folder containing the current file
//
// RUN:
//     node path-demo.js
//
// NO INSTALLATION:
//   `path` ships with Node.js — no npm install needed.
// ============================================================

// ------------------------------------------------------------
// IMPORT THE BUILT-IN PATH MODULE
// No path prefix → Node loads it from its core.
// ------------------------------------------------------------
const path = require("path");

// ============================================================
// STEP 1 — BUILD A PATH WITH path.join()
//
// path.join(...segments) joins segments with the OS-correct
// separator ("/" on macOS/Linux, "\" on Windows).
//
// We start from __dirname (folder of THIS file) so the path
// is always correct regardless of where Node is run from.
//
// Example result on macOS:
//   /Users/me/project/data/students/student.txt
// Example result on Windows:
//   C:\Users\me\project\data\students\student.txt
// ============================================================
const studentFile = path.join(
  __dirname, // folder containing this file
  "data", // subfolder
  "students", // subfolder
  "student.txt", // filename
);

console.log("Joined Path:");
console.log(studentFile);
// → /Users/me/project/data/students/student.txt

// ============================================================
// STEP 2 — CONVERT TO ABSOLUTE PATH WITH path.resolve()
//
// path.resolve(path) returns an absolute path.
//   - If the input is already absolute, returns it (cleaned).
//   - If the input is relative, resolves it from the
//     current working directory (or from earlier args).
//
// Difference from join:
//   join   → only joins segments (result can be relative)
//   resolve → always produces an absolute path
//
// In this case the path is already absolute (because
// __dirname is absolute), so the output looks the same.
// ============================================================
const absolutePath = path.resolve(studentFile);

console.log("\nAbsolute Path:");
console.log(absolutePath);
// → /Users/me/project/data/students/student.txt

// ============================================================
// STEP 3 — EXTRACT FILE INFORMATION
// Three single-purpose helpers extract one piece of the path.
// ============================================================

// path.basename() → the LAST segment (file name)
console.log("\nFile Name:");
console.log(path.basename(studentFile));
// → student.txt

// path.dirname() → everything BEFORE the last segment (folder)
console.log("\nDirectory:");
console.log(path.dirname(studentFile));
// → /Users/me/project/data/students

// path.extname() → extension WITH the dot (or "" if none)
console.log("\nExtension:");
console.log(path.extname(studentFile));
// → .txt

// ============================================================
// STEP 4 — BREAK A PATH INTO PARTS WITH path.parse()
//
// path.parse(path) returns an object with 5 properties:
//   root → "/"       (top of the file system)
//   dir  → "/a/b"    (folder path)
//   base → "x.txt"   (filename with extension)
//   ext  → ".txt"    (extension with dot)
//   name → "x"       (filename WITHOUT extension)
//
// Useful when you need to manipulate individual pieces
// (e.g., change extension from .txt → .md).
// ============================================================
const parsed = path.parse(studentFile);

console.log("\nParsed Path:");
console.log(parsed);
// → {
//     root: '/',
//     dir: '/Users/me/project/data/students',
//     base: 'student.txt',
//     ext: '.txt',
//     name: 'student'
//   }

// ============================================================
// STEP 5 — REBUILD A PATH WITH path.format()
//
// path.format(object) is the reverse of path.parse().
// Pass the SAME shape back in → get the original string.
//
// Common use case:
//   Take the parsed object, change one field, and rebuild.
//   Example:  parsed.ext = ".md"
//             path.format(parsed)  →  ".../student.md"
// ============================================================
const rebuiltPath = path.format(parsed);

console.log("\nRebuilt Path:");
console.log(rebuiltPath);
// → /Users/me/project/data/students/student.txt

// ============================================================
// STEP 6 — CLEAN UP MESSY PATHS WITH path.normalize()
//
// path.normalize() fixes:
//   - duplicate separators  (// → /)
//   - mixed separators      (\ and / on any OS)
//   - "." and ".." segments (resolves them logically)
//
// Useful when you receive a path from a user or a config
// file that might have sloppy slashes.
// ============================================================
const messyPath = "data//students///student.txt";

console.log("\nNormalized Path:");
console.log(path.normalize(messyPath));
// → data/students/student.txt   (on macOS/Linux)
// → data\students\student.txt   (on Windows)

// ============================================================
// STEP 7 — RUNTIME FILE INFORMATION
//
// Node injects two globals into EVERY CommonJS module:
//   __filename → absolute path of the CURRENT file
//   __dirname  → absolute path of the folder containing it
//
// These are NOT available in browsers and NOT in ES modules.
// They are the safest way to build paths relative to your code.
// ============================================================

// Full path of this file:
console.log("\nCurrent File:");
console.log(__filename);
// → /Users/me/project/path-demo.js

// Folder containing this file:
console.log("\nCurrent Directory:");
console.log(__dirname);
// → /Users/me/project
