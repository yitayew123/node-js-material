// ============================================================
// calculator.js
// LOCAL MODULE — reusable calculation helpers.
//
// KEY IDEAS:
//   - Contains PURE functions (same input → same output).
//   - No side effects, no external state — easy to test.
//   - Imported by app.js with require("./calculator").
//
// EXPORT STYLE USED HERE: "single named function in object"
//   - We wrap the function in an object so the importer
//     uses { calculateAverage } and future functions can be
//     added without breaking existing code.
// ============================================================

// ------------------------------------------------------------
// calculateAverage(scores)
// Returns the average of an array of numbers.
//
// HOW IT WORKS:
//   1. reduce() walks the array and accumulates a running sum.
//   2. The initial value passed to reduce is 0.
//   3. Divide the total by the number of scores.
//
// PARAMS:
//   scores (number[]) — array of numeric scores
//
// RETURNS:
//   number — the arithmetic mean (sum / count)
//
// EXAMPLE:
//   calculateAverage([80, 85, 90])  →  85
//
// NOTE:
//   Empty array → returns NaN (0 / 0). If that matters,
//   add a guard: if (scores.length === 0) return 0;
// ------------------------------------------------------------
function calculateAverage(scores) {
  // Sum all scores using reduce.
  // sum   → accumulator
  // score → current element
  // 0     → initial value of the accumulator
  const total = scores.reduce((sum, score) => sum + score, 0);

  // Average = total / number of items.
  return total / scores.length;
}

// ------------------------------------------------------------
// module.exports
// WHAT THIS DOES:
//   - Exposes calculateAverage to other files.
//
// SHAPE OF THE EXPORT:
//   { calculateAverage: [Function: calculateAverage] }
//
// HOW ANOTHER FILE USES IT:
//   const { calculateAverage } = require("./calculator");
//   calculateAverage([80, 85, 90]);   // → 85
//
// WHY AN OBJECT (not module.exports = calculateAverage)?
//   - Consistency with other local modules in this project.
//   - Easy to add new functions later (min, max, sum, ...)
//     without breaking existing imports.
// ------------------------------------------------------------
module.exports = {
  calculateAverage,
};
