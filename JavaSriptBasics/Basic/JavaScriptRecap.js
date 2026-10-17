// ============================================
// JavaScript Fundamentals Review
// Student Results Management System
// File: app.js
//
// PURPOSE:
//   A single-file review of core JavaScript concepts:
//     - Variables, data types, arrays, objects
//     - Functions, conditionals, loops
//     - Array methods (filter, map, find)
//     - Operators, comparison, logical expressions
//     - Program flow and console output
//
// RUN:
//     node app.js
//
// NO DEPENDENCIES — pure JavaScript, no npm install needed.
// ============================================

// "use strict" turns on strict mode:
//   - Prevents accidental globals (a = 1 without let/const throws)
//   - Disallows duplicate parameter names
//   - Turns silent errors into thrown errors
// Modern Node files should always include this line.
"use strict";

// ============================================
// 1. VARIABLES, DATA TYPES, ARRAYS, AND OBJECTS
// ============================================

// `const` → cannot be reassigned. Use it for anything that
// does not need to be reassigned later (the array itself).
// NOTE: `const` protects the BINDING, not the contents —
// we can still push/splice elements into the array.
const students = [
  // Each element is an object literal with 4 properties.
  // Objects group related data under named keys.
  {
    id: 1,
    name: "Abebe",
    department: "IT",
    score: 85,
  },
  {
    id: 2,
    name: "Hana",
    department: "IT",
    score: 45,
  },
  {
    id: 3,
    name: "Kebede",
    department: "Computer Science",
    score: 72,
  },
  {
    id: 4,
    name: "Almaz",
    department: "Computer Science",
    score: 92,
  },
  {
    id: 5,
    name: "Mekdes",
    department: "IT",
    score: 60,
  },
];

// `const` for values that never change.
const passingScore = 50; // score ≥ 50 → pass
const highAchieverScore = 80; // score ≥ 80 → high achiever

// `let` for values that may be reassigned later.
// Here: cached snapshot of the array length.
let totalStudents = students.length;

// ============================================
// 2. FUNCTION AND CONDITIONAL STATEMENTS
// ============================================

// getGrade(score) → returns a letter grade for a numeric score.
// Uses an if/else-if chain — evaluates top to bottom and stops
// at the FIRST true branch.
//
// BOUNDARIES:
//   90–100 → A
//   80–89  → B
//   70–79  → C
//   50–69  → D
//   0–49   → F
function getGrade(score) {
  if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else if (score >= 50) {
    return "D";
  } else {
    return "F";
  }
}

// ============================================
// 3. FUNCTION TO DETERMINE PASS OR FAIL
// ============================================

// getStatus(score) → "Pass" or "Fail".
// Uses the TERNARY operator: condition ? valueIfTrue : valueIfFalse
// Shorter than an if/else when there are only two outcomes.
function getStatus(score) {
  return score >= passingScore ? "Pass" : "Fail";
}

// ============================================
// 4. FUNCTION TO CALCULATE THE CLASS AVERAGE
// ============================================

// calculateAverage(records) → arithmetic mean of all scores.
//
// EDGE CASE HANDLED FIRST:
//   Empty array → return 0 (prevents 0/0 = NaN).
//
// LOOP STYLE:
//   `for...of` iterates over VALUES (the objects) — cleaner
//   than an index-based loop when we don't need indices.
function calculateAverage(records) {
  if (records.length === 0) {
    return 0;
  }

  let total = 0;

  // Accumulate every student's score.
  for (const student of records) {
    total += student.score; // shorthand for total = total + student.score
  }

  // Average = sum ÷ count.
  return total / records.length;
}

// ============================================
// 5. FUNCTION TO DISPLAY STUDENT REPORTS
// ============================================

// displayStudentReports(records) → prints one line per student.
//
// TEMPLATE LITERALS:
//   Backtick strings allow ${expression} interpolation —
//   easier to read than string concatenation with "+".
function displayStudentReports(records) {
  console.log("\n========== STUDENT RESULTS ==========");

  for (const student of records) {
    // Compute derived values once, reuse them below.
    const grade = getGrade(student.score);
    const status = getStatus(student.score);

    // Multi-line template literal split across lines for
    // readability; the "+" glues the pieces together.
    console.log(
      `${student.id}. ${student.name} | ` +
        `Department: ${student.department} | ` +
        `Score: ${student.score} | ` +
        `Grade: ${grade} | ` +
        `Status: ${status}`,
    );
  }
}

// ============================================
// 6. ARRAY METHODS: FILTER AND MAP
// ============================================

// filter(callback) → returns a NEW array containing only the
// elements for which the callback returns true. The original
// array is NOT modified (immutability).

// Students who passed (score ≥ 50).
const passedStudents = students.filter(
  (student) => student.score >= passingScore,
);

// Students who failed (score < 50).
const failedStudents = students.filter(
  (student) => student.score < passingScore,
);

// Students with high achievement (score ≥ 80).
const highAchievers = students.filter(
  (student) => student.score >= highAchieverScore,
);

// map(callback) → returns a NEW array with one result per
// element. Here: extract just the names.
const studentNames = students.map((student) => student.name);

// ============================================
// 7. FIND A STUDENT USING AN ID
// ============================================

// find(callback) → returns the FIRST element that matches,
// or `undefined` if nothing matches.
// Uses === (strict equality) to compare id types AND values.
function findStudentById(id) {
  return students.find((student) => student.id === id);
}

// ============================================
// 8. FIND THE HIGHEST AND LOWEST SCORES
// ============================================

// findHighestScore(records) → the student object with max score.
//
// ALGORITHM:
//   1. Start with the first record as the current "highest".
//   2. Compare each subsequent record; update when larger.
//   3. Return the winner.
function findHighestScore(records) {
  if (records.length === 0) {
    return null; // no data → signal with null
  }

  let highest = records[0];

  for (const student of records) {
    if (student.score > highest.score) {
      highest = student;
    }
  }

  return highest;
}

// findLowestScore(records) → same idea, inverted comparison.
function findLowestScore(records) {
  if (records.length === 0) {
    return null;
  }

  let lowest = records[0];

  for (const student of records) {
    if (student.score < lowest.score) {
      lowest = student;
    }
  }

  return lowest;
}

// ============================================
// 9. DISPLAY THE COMPLETE REPORT
// ============================================

// displaySummary() → prints totals and extremes for the class.
// Uses the pre-computed arrays (passedStudents, etc.) and
// helper functions above.
function displaySummary() {
  console.log("\n========== CLASS SUMMARY ==========");

  console.log("Total students:", totalStudents);
  console.log("Passed students:", passedStudents.length);
  console.log("Failed students:", failedStudents.length);
  console.log("High achievers:", highAchievers.length);

  // toFixed(2) → rounds to 2 decimal places for display.
  console.log("Class average:", calculateAverage(students).toFixed(2));

  const highest = findHighestScore(students);
  const lowest = findLowestScore(students);

  // Guard: only print if the helpers returned something.
  // (Prevents "Cannot read property 'name' of null".)
  if (highest !== null && lowest !== null) {
    console.log(`Highest score: ${highest.name} (${highest.score})`);

    console.log(`Lowest score: ${lowest.name} (${lowest.score})`);
  }

  // join(", ") → turns the array into a comma-separated string.
  console.log("Student names:", studentNames.join(", "));
}

// ============================================
// 10. SEARCH AND CONDITIONAL EXECUTION
// ============================================

// displayStudentById(id) → looks up one student and prints
// their full details, or a "not found" message.
//
// DEMONSTRATES:
//   - Calling a helper function (findStudentById)
//   - Truthy check: `if (student)` is true when the object
//     exists and false when it is `undefined`
function displayStudentById(id) {
  console.log("\n========== STUDENT SEARCH ==========");

  const student = findStudentById(id);

  if (student) {
    // Object exists → print all fields.
    console.log("Student found!");
    console.log("ID:", student.id);
    console.log("Name:", student.name);
    console.log("Department:", student.department);
    console.log("Score:", student.score);
    console.log("Grade:", getGrade(student.score));
    console.log("Status:", getStatus(student.score));
  } else {
    // find() returned undefined → no match.
    console.log("Student not found.");
  }
}

// ============================================
// 11. DEMONSTRATE OPERATORS
// ============================================

// demonstrateOperators() → showcases the main operator groups.
function demonstrateOperators() {
  console.log("\n========== OPERATOR EXAMPLES ==========");

  let bonus = 5;

  // Assignment operator: "bonus += 5" is shorthand for
  // "bonus = bonus + 5".
  bonus += 5;

  console.log("Bonus after increment:", bonus);

  // Arithmetic operators
  console.log("10 + 5 =", 10 + 5); // addition
  console.log("10 - 5 =", 10 - 5); // subtraction
  console.log("10 * 5 =", 10 * 5); // multiplication
  console.log("10 / 5 =", 10 / 5); // division
  console.log("10 % 3 =", 10 % 3); // modulo (remainder)

  // Comparison operators → always return a boolean.
  console.log("85 >= 50:", 85 >= 50); // greater than or equal
  console.log("85 === 85:", 85 === 85); // strict equality (type + value)

  // Logical operators:
  //   && (AND) → true only if BOTH sides are true
  //   || (OR)  → true if AT LEAST ONE side is true
  //   !  (NOT) → inverts a boolean
  console.log(
    "Passed and high-achieving:",
    85 >= passingScore && 85 >= highAchieverScore,
  );
}

// ============================================
// 12. DEMONSTRATE DATA TYPES
// ============================================

// demonstrateDataTypes() → shows the primitive types and
// uses `typeof` to inspect them.
//
// NOTE ON `typeof null`:
//   JavaScript has a long-standing bug where `typeof null`
//   returns "object". The code below shows this quirk.
function demonstrateDataTypes() {
  console.log("\n========== DATA TYPES ==========");

  const studentName = "Abebe"; // string
  const studentAge = 22; // number
  const isEnrolled = true; // boolean
  const optionalAddress = null; // null (intentional absence)
  let futureCourse; // undefined (declared, not assigned)

  console.log("Name:", studentName, "|", typeof studentName);
  console.log("Age:", studentAge, "|", typeof studentAge);
  console.log("Enrolled:", isEnrolled, "|", typeof isEnrolled);
  // ⚠️ typeof null === "object" — a JavaScript quirk.
  console.log("Address:", optionalAddress, "|", typeof optionalAddress);
  console.log("Future course:", futureCourse, "|", typeof futureCourse);

  // Arrays are technically objects, so typeof gives "object".
  // Array.isArray() is the correct way to detect arrays.
  console.log("Students is an array:", Array.isArray(students));
}

// ============================================
// 13. EXECUTE THE PROGRAM
// ============================================

// The calls below run top-to-bottom when the file executes.
// Order matters — later functions assume earlier ones are
// already declared (function declarations are hoisted, so
// this would work even if the order were reversed).

console.log("======================================");
console.log(" JAVASCRIPT FUNDAMENTALS REVIEW");
console.log(" Student Results Management System");
console.log("======================================");

demonstrateDataTypes(); // primitives + typeof
demonstrateOperators(); // arithmetic, comparison, logical
displayStudentReports(students); // one line per student
displaySummary(); // totals + extremes
displayStudentById(3); // found → full details
displayStudentById(10); // not found → message

console.log("\n========== END OF PROGRAM ==========");

console.log("\nThank you for reviewing JavaScript fundamentals!");
