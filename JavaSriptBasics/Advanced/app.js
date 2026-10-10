"use strict";

// ==========================================
// 1. IMPORT MODULES
// ==========================================

import {
  PASSING_SCORE,
  HIGH_ACHIEVER_SCORE,
  getGrade,
  getStatus,
  calculateAverage,
  updateStudent,
  getStudentSummary,
  createStudentCounter,
  createStudentGreeting,
  getPassedStudents,
  getFailedStudents,
  getHighAchievers,
  findStudentById,
  sortStudentsByScore,
  addStudent,
  exportStudentsToJSON,
  importStudentsFromJSON,
  formatStudentReport,
} from "./studentUtils.js";

// ==========================================
// 2. STUDENT DATA
// ==========================================

// Global-to-this-module scope: available in app.js.
const students = [
  {
    id: 1,
    name: "Abebe Kebede",
    department: "Software Engineering",
    score: 92,
    email: "abebe@example.com",
  },
  {
    id: 2,
    name: "Hana Alemu",
    department: "Computer Science",
    score: 84,
    email: "hana@example.com",
  },
  {
    id: 3,
    name: "Dawit Bekele",
    department: "Information Systems",
    score: 45,
    email: "dawit@example.com",
  },
  {
    id: 4,
    name: "Mekdes Tadesse",
    department: "Software Engineering",
    score: 76,
    email: "mekdes@example.com",
  },
  {
    id: 5,
    name: "Samuel Girma",
    department: "Computer Science",
    score: 88,
    email: "samuel@example.com",
  },
];

// ==========================================
// 3. SCOPE AND HOISTING
// ==========================================

function demonstrateScopeAndHoisting() {
  console.log("\n========== SCOPE AND HOISTING ==========");

  // Function declarations can be called before their definition.
  console.log("Hoisted function result:", getWelcomeMessage());

  function getWelcomeMessage() {
    return "Welcome to the Student Management System!";
  }

  // Block scope: this variable exists only inside this block.
  if (true) {
    let semester = "Semester 1";
    const academicYear = 2026;

    console.log("Semester:", semester);
    console.log("Academic year:", academicYear);
  }

  // Uncomment to see a ReferenceError:
  // console.log(semester);
}

// ==========================================
// 4. CLOSURES
// ==========================================

function demonstrateClosures() {
  console.log("\n========== CLOSURES ==========");

  // The counter remembers its own private count.
  const countStudents = createStudentCounter(students.length);

  console.log("Count after one addition:", countStudents());
  console.log("Count after another addition:", countStudents());

  // The greeting function remembers the name.
  const greetAbebe = createStudentGreeting("Abebe");

  console.log(greetAbebe());
}

// ==========================================
// 5. DESTRUCTURING AND SPREAD/REST
// ==========================================

function demonstrateDestructuringAndSpread() {
  console.log("\n========== DESTRUCTURING AND SPREAD ==========");

  // Array destructuring.
  const [firstStudent, secondStudent] = students;

  console.log("First student:", firstStudent.name);
  console.log("Second student:", secondStudent.name);

  // Object destructuring.
  const { name, score, department } = firstStudent;

  console.log("Name:", name);
  console.log("Score:", score);
  console.log("Department:", department);

  // Spread: create an updated copy of a student.
  const updatedStudent = updateStudent(firstStudent, {
    score: 98,
  });

  console.log("Original score:", firstStudent.score);
  console.log("Updated score:", updatedStudent.score);

  // Rest: calculate average for any number of scores.
  console.log("Average of three scores:", calculateAverage(80, 90, 100));

  // Default parameter and optional chaining.
  const studentWithOptionalData = {
    name: "Hana",
    profile: { email: "hana@example.com" },
  };

  const email = studentWithOptionalData.profile?.email ?? "No email available";

  console.log("Optional email:", email);
}

// ==========================================
// 6. ES6+ FEATURES AND STUDENT REPORTS
// ==========================================

function displayStudentReports(records) {
  console.log("\n========== STUDENT REPORTS ==========");

  // for...of iterates through array values.
  for (const student of records) {
    console.log(formatStudentReport(student));
  }
}

function demonstrateArrayMethods() {
  console.log("\n========== ARRAY METHODS ==========");

  // filter(): select matching students.
  const passed = getPassedStudents(students);
  const failed = getFailedStudents(students);
  const highAchievers = getHighAchievers(students);

  // map(): extract student names.
  const names = students.map((student) => student.name);

  // find(): retrieve one matching student.
  const foundStudent = findStudentById(students, 3);

  // sort(): rank students from highest to lowest score.
  const ranking = sortStudentsByScore(students);

  console.log(
    `Passing score: ${PASSING_SCORE}; High-achiever score: ${HIGH_ACHIEVER_SCORE}`,
  );

  console.log(
    "Passed:",
    passed.map((student) => student.name),
  );
  console.log(
    "Failed:",
    failed.map((student) => student.name),
  );
  console.log(
    "High achievers:",
    highAchievers.map((student) => student.name),
  );
  console.log("All names:", names);
  console.log("Student with ID 3:", foundStudent?.name ?? "Not found");

  console.log("Student ranking:");

  ranking.forEach((student, index) => {
    console.log(
      `${index + 1}. ${student.name} — ${student.score} (${getGrade(student.score)})`,
    );
  });
}

// ==========================================
// 7. SUMMARY AND TEMPLATE LITERALS
// ==========================================

function displaySummary(records) {
  console.log("\n========== CLASS SUMMARY ==========");

  const totalStudents = records.length;

  // reduce() calculates the total score.
  const totalScore = records.reduce(
    (total, student) => total + student.score,
    0,
  );

  const averageScore = totalStudents > 0 ? totalScore / totalStudents : 0;

  const highestScore = records.reduce(
    (highest, student) => Math.max(highest, student.score),
    0,
  );

  const lowestScore = records.length
    ? records.reduce(
        (lowest, student) => Math.min(lowest, student.score),
        records[0].score,
      )
    : 0;

  // Template literals format the output.
  console.log(`
Total students : ${totalStudents}
Passing        : ${getPassedStudents(records).length}
Failing         : ${getFailedStudents(records).length}
Class average  : ${averageScore.toFixed(2)}
Highest score  : ${highestScore}
Lowest score   : ${lowestScore}
`);
}

// ==========================================
// 8. ERROR HANDLING
// ==========================================

function demonstrateErrorHandling() {
  console.log("\n========== ERROR HANDLING ==========");

  try {
    // This record is invalid because the score is greater than 100.
    const invalidStudent = {
      id: 6,
      name: "Test Student",
      department: "Software Engineering",
      score: 120,
    };

    addStudent(students, invalidStudent);
  } catch (error) {
    // Handles validation errors.
    console.error("Could not add student:", error.message);
  } finally {
    // Runs whether an error occurred or not.
    console.log("Student validation operation completed.");
  }

  // A separate example: safely handle invalid JSON.
  try {
    JSON.parse("{invalid JSON}");
  } catch (error) {
    console.error("JSON parsing failed:", error.message);
  }
}

// ==========================================
// 9. CALLBACKS
// ==========================================

function getStudentWithCallback(id, callback) {
  // Simulate an asynchronous data lookup.
  setTimeout(() => {
    const student = findStudentById(students, id);

    if (!student) {
      callback(new Error(`Student with ID ${id} was not found.`), null);
      return;
    }

    callback(null, student);
  }, 300);
}

function demonstrateCallback() {
  console.log("\n========== CALLBACKS ==========");

  getStudentWithCallback(1, (error, student) => {
    if (error) {
      console.error(error.message);
      return;
    }

    console.log("Callback result:", student.name);
  });
}

// ==========================================
// 10. PROMISES
// ==========================================

function getStudentPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = findStudentById(students, id);

      if (!student) {
        reject(new Error(`Student with ID ${id} was not found.`));
        return;
      }

      resolve(student);
    }, 300);
  });
}

function demonstratePromise() {
  console.log("\n========== PROMISES ==========");

  getStudentPromise(2)
    .then((student) => {
      console.log("Promise result:", student.name);
      return student.score;
    })
    .then((score) => {
      console.log("Promise score:", score);
    })
    .catch((error) => {
      console.error("Promise error:", error.message);
    });
}

// ==========================================
// 11. ASYNC/AWAIT
// ==========================================

async function displayStudentAsync(id) {
  try {
    const student = await getStudentPromise(id);

    console.log("\n========== ASYNC/AWAIT ==========");
    console.log("Student:", student.name);
    console.log("Grade:", getGrade(student.score));
    console.log("Status:", getStatus(student.score));
  } catch (error) {
    console.error("Async operation failed:", error.message);
  } finally {
    console.log("Async student lookup completed.");
  }
}

// ==========================================
// 12. JSON EXPORT AND IMPORT
// ==========================================

function demonstrateJSON() {
  console.log("\n========== JSON PROCESSING ==========");

  // Convert a JavaScript array into a JSON string.
  const jsonText = exportStudentsToJSON(students);

  console.log("JSON preview:");
  console.log(jsonText.slice(0, 250) + "...");

  try {
    // Convert the JSON string back into JavaScript data.
    const importedStudents = importStudentsFromJSON(jsonText);

    console.log("Imported student count:", importedStudents.length);

    console.log("First imported student:", importedStudents[0].name);
  } catch (error) {
    console.error("JSON import failed:", error.message);
  }
}

// ==========================================
// 13. RUN THE APPLICATION
// ==========================================

async function main() {
  console.log("========================================");
  console.log(" JAVASCRIPT STUDENT MANAGEMENT SYSTEM");
  console.log("========================================");

  demonstrateScopeAndHoisting();
  demonstrateClosures();
  demonstrateDestructuringAndSpread();
  displayStudentReports(students);
  demonstrateArrayMethods();
  displaySummary(students);
  demonstrateErrorHandling();
  demonstrateCallback();
  demonstratePromise();
  demonstrateJSON();

  // Await the async example before main() finishes.
  await displayStudentAsync(4);

  // Demonstrate a missing student and async error handling.
  await displayStudentAsync(99);

  console.log("\n========== APPLICATION FINISHED ==========");
}

main().catch((error) => {
  console.error("Unexpected application error:", error);
});

async function demonstrateAPI() {
  console.log("\n========== EXTERNAL API ==========");

  try {
    // Request a sample user from a public demonstration API.
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    // fetch() does not reject automatically for HTTP 404 or 500.
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Convert the JSON response into a JavaScript object.
    const user = await response.json();

    // Destructure the returned object.
    const { id, name, email, address } = user;

    // Optional chaining safely accesses nested properties.
    const city = address?.city ?? "Unknown";

    console.log(`
API User ID : ${id}
Name        : ${name}
Email       : ${email}
City        : ${city}
`);
  } catch (error) {
    console.error("API request failed:", error.message);
  } finally {
    console.log("API request completed.");
  }
}
