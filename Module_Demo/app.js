// ============================================================
// app.js
// ENTRY POINT — combines BUILT-IN and LOCAL modules.
//
// RUN:
//     node app.js
//
// WHAT THIS FILE DEMONSTRATES:
//   1. Importing built-in modules (os, path) → no install
//   2. Importing local modules (./student, ./calculator)
//   3. Using destructuring to pick specific exports
//   4. Calling functions and printing results
// ============================================================

// ------------------------------------------------------------
// BUILT-IN MODULE IMPORTS
// No path prefix → Node knows to load these from its core.
// ------------------------------------------------------------
const os = require("os"); // OS info: platform, memory, CPUs
const path = require("path"); // cross-platform path helpers

// ------------------------------------------------------------
// LOCAL MODULE IMPORTS
// "./" prefix → Node treats these as files in this folder.
// We use destructuring to grab only what we need.
// ------------------------------------------------------------
const { getStudent } = require("./student");
//            ↑ picks the getStudent function from the exported object
//              (we could also have picked `student` directly)

const { calculateAverage } = require("./calculator");
//            ↑ picks the calculateAverage function

// ------------------------------------------------------------
// DATA PREPARATION
// Fetch the student, then prepare an array of scores.
// ------------------------------------------------------------

// Get the student record from the local module.
const student = getStudent();
// e.g., { name: "Abebe", course: "Node.js", score: 85 }

// Sample scores — in a real app these would come from a DB or API.
const scores = [80, 85, 90];

// Compute the average using the calculator module.
const average = calculateAverage(scores);
// → (80 + 85 + 90) / 3 = 85

// ------------------------------------------------------------
// OUTPUT
// Console log for each result so students can see them clearly.
// ------------------------------------------------------------

console.log("Student:", student.name);
// → Student: Abebe

console.log("Course:", student.course);
// → Course: Node.js

console.log("Average:", average);
// → Average: 85

// ------------------------------------------------------------
// BUILT-IN MODULE DEMO
// Show two simple uses: os.platform() and path.join().
// ------------------------------------------------------------

console.log("Platform:", os.platform());
// → Platform: darwin (macOS) / win32 (Windows) / linux

// path.join builds a safe path using the correct separator
// for the current OS ("/" on Linux/macOS, "\" on Windows).
console.log("Data File:", path.join("data", "students.json"));
// → Data File: data/students.json  (macOS/Linux)
// → Data File: data\students.json  (Windows)




