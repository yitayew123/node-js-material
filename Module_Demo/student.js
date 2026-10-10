// ============================================================
// student.js
// LOCAL MODULE — stores a student record and exposes it.
//
// WHAT MAKES IT A "MODULE"?
//   - It is a .js file in the project folder.
//   - It EXPORTS values via module.exports.
//   - Other files load it with require("./student").
//   - No installation needed — it is part of your repo.
//
// EXPORT STYLE USED HERE: "mixed object export"
//   - We export BOTH the raw data (`student`) AND a getter
//     function (`getStudent`) in a single object.
// ============================================================

// ------------------------------------------------------------
// student
// A plain JavaScript object holding one student's information.
// Kept here (not in the consumer file) so the data lives in
// ONE place — change it here, everyone sees the update.
//
// FIELDS:
//   name   (string) — student's full name
//   course (string) — the course being taken
//   score  (number) — score on the course
// ------------------------------------------------------------
const student = {
  name: "Abebe",
  course: "Node.js",
  score: 85,
};

// ------------------------------------------------------------
// getStudent()
// Returns the student object.
//
// WHY A GETTER INSTEAD OF USING `student` DIRECTLY?
//   - Gives us a stable place to add logic later
//     (e.g., fetch from a database, filter fields).
//   - The consumer does not need to know HOW the data is
//     stored — only that they can ask for it.
//
// RETURNS:
//   object — the student record
// ------------------------------------------------------------
function getStudent() {
  return student;
}

// ------------------------------------------------------------
// module.exports
// WHAT THIS DOES:
//   - Attaches both values to the module's public API.
//   - Everything else stays private to this file.
//
// SHAPE OF THE EXPORT:
//   {
//     student:    { name: "Abebe", course: "Node.js", score: 85 },
//     getStudent: [Function: getStudent]
//   }
//
// HOW ANOTHER FILE USES IT:
//   const { getStudent } = require("./student");
//   const s = getStudent();
//   console.log(s.name);   // → Abebe
//
// OR:
//   const { student } = require("./student");
//   console.log(student.name);   // → Abebe
// ------------------------------------------------------------
module.exports = {
  student,
  getStudent,
};
