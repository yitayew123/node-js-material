// ============================================================
// timers-demo.js
// Demonstrates Node's timer APIs — the glue of async scheduling.
//
// WHY TIMERS MATTER:
//   Node runs your JavaScript on ONE thread. Timers let you
//   defer work, run it later, or run it repeatedly WITHOUT
//   blocking the event loop. They are the foundation of
//   polling, retries, heartbeats, and scheduled jobs.
//
// FOUR TIMER FUNCTIONS COVERED:
//   1. process.nextTick()   → run RIGHT AFTER the current operation
//   2. setImmediate()       → run in the "check" phase of the loop
//   3. setTimeout(fn, ms)   → run ONCE after a delay
//   4. setInterval(fn, ms)  → run REPEATEDLY every N ms
//
// ORDERING (from fastest to slowest):
//   process.nextTick  >  Promise.then  >  setImmediate  >  setTimeout
//
// RUN:
//     node timers-demo.js
//
// NO INSTALLATION:
//   These are built-in — no require, no npm install.
// ============================================================

console.log("Attendance System Started");
// ↑ Runs FIRST — this is synchronous code.

// ============================================================
// 1. process.nextTick(callback)
//
// WHAT IT DOES:
//   Queues a callback to run after the CURRENT operation
//   completes — but BEFORE the event loop continues to I/O.
//
// WHEN TO USE:
//   - When you must finish a synchronous operation cleanly
//     before any async work begins.
//   - To defer something "just barely" — e.g., to allow
//     listeners to be attached before an event fires.
//
// DANGER:
//   nextTick callbacks run BEFORE I/O and before setImmediate.
//   Recursive nextTick calls can STARVE the event loop and
//   freeze your app. Use sparingly.
// ============================================================
process.nextTick(() => {
  console.log("Checking Student Records...");
});
// ↑ Runs immediately after the current synchronous block finishes.

// ============================================================
// 2. setImmediate(callback)
//
// WHAT IT DOES:
//   Queues a callback to run in the "check" phase of the
//   event loop — AFTER I/O events have been processed.
//
// WHEN TO USE:
//   - When you want to defer work but let I/O happen first.
//   - Preferred over setTimeout(fn, 0) when you truly just
//     want "run this next".
//
// NOTE:
//   In the main module (top-level code), the ORDER between
//   setImmediate and setTimeout(fn, 0) is NON-DETERMINISTIC.
//   Inside an I/O callback, setImmediate ALWAYS runs first.
// ============================================================
setImmediate(() => {
  console.log("Preparing Attendance Report...");
});
// ↑ Runs in the check phase — after nextTick, before the timer queue.

// ============================================================
// 3. setTimeout(callback, delayMs)
//
// WHAT IT DOES:
//   Runs the callback ONCE after AT LEAST `delayMs` milliseconds.
//
// "AT LEAST" is important:
//   The delay is a MINIMUM, not a guarantee. If the event loop
//   is busy, the callback may fire later — never earlier.
//
// WHEN TO USE:
//   - Delayed actions (show a reminder, expire a session)
//   - Polling with backoff
//   - Debouncing user input
//
// CANCELLING:
//   const id = setTimeout(fn, ms);
//   clearTimeout(id);   // cancels before it fires
// ============================================================
setTimeout(() => {
  console.log("Reminder: Submit Attendance!");
}, 3000);
// ↑ Runs ONCE, ~3 seconds after program start.

// ============================================================
// 4. setInterval(callback, delayMs)
//
// WHAT IT DOES:
//   Runs the callback REPEATEDLY every `delayMs` milliseconds
//   until you call clearInterval().
//
// WHEN TO USE:
//   - Heartbeats / keep-alives
//   - Periodic polling (every 5s check a queue)
//   - Countdown timers, progress indicators
//
// DANGER — ALWAYS CLEAR IT:
//   Forgetting clearInterval keeps the process alive forever
//   and leaks memory. The callback keeps running even after
//   you no longer care.
// ============================================================
let count = 0;

const attendanceMonitor = setInterval(() => {
  count++; // increment counter

  console.log(`Attendance Check ${count}`); // log each tick

  if (count === 5) {
    // 5th tick → stop the loop.
    clearInterval(attendanceMonitor);

    console.log("Attendance Monitoring Stopped");
  }
}, 1000);
// ↑ Runs every 1 second, stops after 5 ticks (~5 seconds total).
