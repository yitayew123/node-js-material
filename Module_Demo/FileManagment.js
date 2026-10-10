// ============================================================
// fs-demo.js
// Demonstrates Node's BUILT-IN `fs` and `path` modules.
//
// WHAT IT DOES (step by step):
//   1. Create a folder         → fs.mkdir
//   2. Write a file            → fs.writeFile
//   3. Append text to the file → fs.appendFile
//   4. Read the file           → fs.readFile
//   5. Rename the file         → fs.rename
//   6. List folder contents    → fs.readdir
//   7. Delete the file         → fs.unlink
//   8. Delete the folder       → fs.rm
//
// KEY CONCEPT — CALLBACKS:
//   Every fs method here uses the "callback style":
//     fs.method(args..., (err, result) => { ... })
//   The callback runs AFTER the operation finishes.
//   Because each step waits for the previous one, the
//   callbacks nest deeper and deeper — this is called
//   "callback hell" or the "pyramid of doom".
//
// MODERN ALTERNATIVE:
//   Use `fs.promises` with async/await to avoid nesting.
//   (See the "Promise version" at the bottom of this file.)
//
// RUN:
//     node fs-demo.js
//
// NO INSTALLATION:
//   `fs` and `path` ship with Node.js — no npm install needed.
// ============================================================

// ------------------------------------------------------------
// BUILT-IN MODULE IMPORTS
// No path prefix → Node loads these from its core.
//   fs   → file system operations (read, write, delete, …)
//   path → cross-platform path helpers (join, resolve, …)
// ------------------------------------------------------------
const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------
// PATHS
// We use path.join() instead of string concatenation.
// WHY?
//   - macOS/Linux:  "students/student.txt"
//   - Windows:      "students\\student.txt"
//   path.join picks the correct separator automatically.
// ------------------------------------------------------------
const folder = "students"; // folder to create
const filePath = path.join(folder, "student.txt"); // path inside it
const renamedPath = path.join(folder, "student-record.txt"); // new name later

// ============================================================
// STEP 1 — CREATE THE DIRECTORY
// fs.mkdir(path, options, callback)
//   path       → folder to create
//   options    → { recursive: true } creates parent folders
//                if they don't exist and does not error if the
//                folder already exists
//   callback   → (err) => { ... }  err is null on success
// ============================================================
fs.mkdir(folder, { recursive: true }, (err) => {
  // Error handling — always check err first.
  if (err) {
    console.log("Directory Error:", err.message);
    return;
  }

  console.log("Directory Created");

  // ==========================================================
  // STEP 2 — WRITE A FILE
  // fs.writeFile(file, data, callback)
  //   file     → path to write
  //   data     → string or Buffer to write (OVERWRITES the file)
  //   callback → (err) => { ... }
  // ==========================================================
  fs.writeFile(filePath, "Student: John Doe", (err) => {
    if (err) {
      console.log("Write Error:", err.message);
      return;
    }

    console.log("File Created");

    // ========================================================
    // STEP 3 — APPEND DATA
    // fs.appendFile(file, data, callback)
    //   Adds `data` to the END of the file.
    //   If the file does not exist, it is created.
    //   "\n" inserts a newline before the new text.
    // ========================================================
    fs.appendFile(filePath, "\nCourse: Node.js", (err) => {
      if (err) {
        console.log("Append Error:", err.message);
        return;
      }

      console.log("Data Appended");

      // ======================================================
      // STEP 4 — READ THE FILE
      // fs.readFile(file, encoding, callback)
      //   encoding "utf8" → returns a string
      //   without it     → returns a Buffer (raw bytes)
      //   callback       → (err, data) => { ... }
      // ======================================================
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.log("Read Error:", err.message);
          return;
        }

        console.log("\nFile Content:");
        console.log(data);

        // ====================================================
        // STEP 5 — RENAME THE FILE
        // fs.rename(oldPath, newPath, callback)
        //   Renames or MOVES a file/folder.
        //   Here we just change the name inside the same folder.
        // ====================================================
        fs.rename(filePath, renamedPath, (err) => {
          if (err) {
            console.log("Rename Error:", err.message);
            return;
          }

          console.log("File Renamed");

          // ==================================================
          // STEP 6 — READ THE DIRECTORY
          // fs.readdir(folder, callback)
          //   Returns an array of names inside the folder.
          //   callback → (err, files) => { ... }
          //   `files` is an array of strings (not full paths).
          // ==================================================
          fs.readdir(folder, (err, files) => {
            if (err) {
              console.log("Directory Read Error:", err.message);
              return;
            }

            console.log("\nDirectory Contents:");
            console.log(files);

            // ================================================
            // STEP 7 — DELETE THE FILE
            // fs.unlink(file, callback)
            //   Removes a file. "unlink" is the POSIX name.
            //   NOTE: unlink cannot delete directories —
            //   use fs.rmdir or fs.rm for that.
            // ================================================
            fs.unlink(renamedPath, (err) => {
              if (err) {
                console.log("Delete File Error:", err.message);
                return;
              }

              console.log("File Deleted");

              // ==============================================
              // STEP 8 — DELETE THE DIRECTORY
              // fs.rm(folder, options, callback)
              //   { recursive: true } deletes the folder AND
              //   everything inside it.
              //   Safer alternative: fs.rmdir() only removes
              //   EMPTY folders.
              // ==============================================
              fs.rm(folder, { recursive: true }, (err) => {
                if (err) {
                  console.log("Directory Delete Error:", err.message);
                  return;
                }

                console.log("Directory Deleted");
              });
            });
          });
        });
      });
    });
  });
});
