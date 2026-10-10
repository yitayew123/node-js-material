"use strict";

// ==========================================
// 1. SCOPE AND CONSTANTS
// ==========================================

// Module scope: available throughout this file.
export const PASSING_SCORE = 50;
export const HIGH_ACHIEVER_SCORE = 85;

// ==========================================
// 2. FUNCTIONS AND CONDITIONAL LOGIC
// ==========================================

// Calculate a student's grade.
export function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= PASSING_SCORE) return "E";

  return "F";
}

// Return a pass/fail status.
export function getStatus(score) {
  return score >= PASSING_SCORE ? "Pass" : "Fail";
}

// Calculate average using rest parameters.
export function calculateAverage(...scores) {
  if (scores.length === 0) {
    return 0;
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

// ==========================================
// 3. DESTRUCTURING AND SPREAD
// ==========================================

// Create an updated student without modifying the original.
export function updateStudent(student, changes) {
  return {
    ...student,
    ...changes,
  };
}

// Extract useful information using object destructuring.
export function getStudentSummary(student) {
  const { id, name, department, score, email = "Not provided" } = student;

  return {
    id,
    name,
    department,
    score,
    email,
    grade: getGrade(score),
    status: getStatus(score),
  };
}

// ==========================================
// 4. CLOSURES
// ==========================================

// The returned function remembers the current count.
export function createStudentCounter(initialCount = 0) {
  let count = initialCount;

  return function () {
    count++;
    return count;
  };
}

// Create a function that remembers a student's name.
export function createStudentGreeting(name) {
  return function () {
    return `Welcome, ${name}!`;
  };
}

// ==========================================
// 5. ARRAY METHODS
// ==========================================

// Return students who passed.
export function getPassedStudents(students) {
  return students.filter((student) => student.score >= PASSING_SCORE);
}

// Return students who failed.
export function getFailedStudents(students) {
  return students.filter((student) => student.score < PASSING_SCORE);
}

// Return high-achieving students.
export function getHighAchievers(students) {
  return students.filter((student) => student.score >= HIGH_ACHIEVER_SCORE);
}

// Find a student by ID.
export function findStudentById(students, id) {
  return students.find((student) => student.id === id);
}

// Sort students by score without changing the original array.
export function sortStudentsByScore(students) {
  return [...students].sort((a, b) => b.score - a.score);
}

// ==========================================
// 6. ERROR HANDLING AND VALIDATION
// ==========================================

export function validateStudent(student) {
  // Check required fields.
  if (!student || typeof student !== "object") {
    throw new Error("Student must be a valid object.");
  }

  if (typeof student.name !== "string" || student.name.trim() === "") {
    throw new Error("Student name is required.");
  }

  if (
    typeof student.score !== "number" ||
    !Number.isFinite(student.score) ||
    student.score < 0 ||
    student.score > 100
  ) {
    throw new Error("Score must be a number between 0 and 100.");
  }

  if (!Number.isInteger(student.id) || student.id <= 0) {
    throw new Error("Student ID must be a positive integer.");
  }

  return true;
}

// Add a student without mutating the existing array.
export function addStudent(students, newStudent) {
  validateStudent(newStudent);

  if (findStudentById(students, newStudent.id)) {
    throw new Error(`Student ID ${newStudent.id} already exists.`);
  }

  // Spread creates a new array.
  return [...students, { ...newStudent }];
}

// ==========================================
// 7. JSON PROCESSING
// ==========================================

// Convert student data into a JSON string.
export function exportStudentsToJSON(students) {
  return JSON.stringify(students, null, 2);
}

// Convert a JSON string back into student objects.
export function importStudentsFromJSON(jsonText) {
  const parsedData = JSON.parse(jsonText);

  if (!Array.isArray(parsedData)) {
    throw new Error("JSON data must contain an array of students.");
  }

  // Validate each record before accepting the data.
  parsedData.forEach(validateStudent);

  // Reject duplicate IDs in imported data.
  const ids = parsedData.map((student) => student.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Imported data contains duplicate student IDs.");
  }

  return parsedData;
}

// ==========================================
// 8. TEMPLATE LITERALS AND REPORTING
// ==========================================

export function formatStudentReport(student) {
  const { id, name, department, score, email = "Not provided" } = student;

  return `
Student ID : ${id}
Name       : ${name}
Department : ${department}
Email      : ${email}
Score      : ${score}
Grade      : ${getGrade(score)}
Status     : ${getStatus(score)}
`;
}
