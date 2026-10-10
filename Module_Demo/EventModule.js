// ============================================================
// events-demo.js
// Demonstrates Node's BUILT-IN `events` module — the EventEmitter.
//
// WHY EVENTEMITTER MATTERS:
//   Node.js is event-driven at its core. Almost everything you
//   use (HTTP servers, streams, sockets, databases) extends
//   EventEmitter. Understanding it unlocks the whole ecosystem.
//
// KEY IDEA — PUB/SUB:
//   - An "emitter" is an object that publishes named events.
//   - "Listeners" subscribe to those events by name.
//   - When the emitter emits an event, EVERY listener for that
//     event runs, in the order they were registered.
//
// WHAT THIS FILE COVERS:
//   1. emitter.once()   → listener that runs ONCE, then removes itself
//   2. emitter.on()     → listener that runs every time
//   3. Multiple listeners for the same event
//   4. Named function as listener (so it can be removed)
//   5. The special "error" event
//   6. emitter.emit()   → fire an event
//   7. emitter.listenerCount() → how many listeners exist
//   8. emitter.off()    → remove a specific listener
//
// RUN:
//     node events-demo.js
//
// NO INSTALLATION:
//   `events` ships with Node.js — no npm install needed.
// ============================================================

// ------------------------------------------------------------
// IMPORT THE BUILT-IN EVENTS MODULE
// No path prefix → Node loads it from its core.
// The module exports a class called `EventEmitter`.
// ------------------------------------------------------------
const EventEmitter = require("events");

// ------------------------------------------------------------
// CREATE AN EMITTER INSTANCE
// `emitter` is our private event bus. It has methods to
// register listeners (on, once) and fire events (emit).
//
// In a real app you might extend EventEmitter on your own
// class, or use one shared instance as an app-wide event bus.
// ------------------------------------------------------------
const emitter = new EventEmitter();

// ============================================================
// 1. ONE-TIME STARTUP EVENT — emitter.once()
//
// once(eventName, listener) registers a listener that runs
// EXACTLY ONCE, then is automatically removed.
//
// Use it for:
//   - Application startup
//   - Initialization steps
//   - First-time-only notifications
// ============================================================
emitter.once("start", () => {
  console.log("Student Management System Started");
  // After this line runs once, the "start" listener is gone.
  // Emitting "start" again later would do nothing.
});

// ============================================================
// 2. MULTIPLE LISTENERS FOR THE SAME EVENT
//
// You can attach any number of listeners to one event name.
// When emitted, they run in REGISTRATION ORDER (FIFO).
//
// This is the essence of pub/sub: the emitter does not care
// who listens — it just fires the event.
// ============================================================

// ----- Listener A: display student info -----
emitter.on("studentRegistered", (name, course) => {
  // Extra arguments passed to emit() arrive here as-is.
  console.log(`Student: ${name}`);
  console.log(`Course: ${course}`);
});

// ----- Listener B: simulate saving to a database -----
// Note: no parameters needed — this listener ignores the
// arguments and just performs a side effect.
emitter.on("studentRegistered", () => {
  console.log("Registration saved to database");
});

// ============================================================
// 3. NAMED FUNCTION AS LISTENER
//
// Using a named function (instead of an inline arrow) is
// REQUIRED when you later want to remove the listener with
// emitter.off(). Anonymous functions cannot be removed.
// ============================================================
function loginListener(name) {
  console.log(`${name} logged in successfully`);
}

emitter.on("login", loginListener);

// ============================================================
// 4. THE SPECIAL "error" EVENT
//
// If an EventEmitter emits "error" and NO listener is attached,
// Node THROWS the error and crashes the process.
//
// ALWAYS attach an "error" listener to any EventEmitter you
// create — even if it just logs the message.
// ============================================================
emitter.on("error", (err) => {
  console.log("Error:", err.message);
});

// ============================================================
// 5. EMIT EVENTS — emitter.emit(eventName, ...args)
//
// emit() fires the event. Every listener registered for that
// name runs SYNCHRONOUSLY, one after another.
//
// Any extra arguments after the event name are passed to
// each listener.
// ============================================================

// ----- Fire the one-time "start" event -----
emitter.emit("start");
// → "Student Management System Started"

// ----- Fire "studentRegistered" with two arguments -----
// BOTH listeners run: the info printer + the DB saver.
emitter.emit("studentRegistered", "John Doe", "Node.js Development");
// → "Student: John Doe"
// → "Course: Node.js Development"
// → "Registration saved to database"

// ----- Fire "login" -----
emitter.emit("login", "John Doe");
// → "John Doe logged in successfully"

// ============================================================
// 6. COUNT LISTENERS — emitter.listenerCount(eventName)
//
// Returns the number of listeners currently attached to an
// event. Useful for debugging and health checks.
// ============================================================
console.log("\nLogin Listeners:", emitter.listenerCount("login"));
// → Login Listeners: 1

// ============================================================
// 7. REMOVE A LISTENER — emitter.off(eventName, listener)
//
// off() is an alias for removeListener().
// You MUST pass the SAME function reference that you used
// in .on() — this is why we used the named `loginListener`
// instead of an inline arrow function.
// ============================================================
emitter.off("login", loginListener);

console.log("Login Listeners After Removal:", emitter.listenerCount("login"));
// → Login Listeners After Removal: 0

// ----- Fire "login" again — nothing happens now -----
emitter.emit("login", "John Doe");
// (no output — the listener was removed)

// ============================================================
// 8. EMIT THE ERROR EVENT
//
// Because we attached an "error" listener earlier, this does
// NOT crash the process. Without that listener, Node would
// throw and the program would terminate immediately.
// ============================================================
emitter.emit("error", new Error("Database Connection Failed"));
// → "Error: Database Connection Failed"
