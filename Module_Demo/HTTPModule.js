// ============================================================
// server.js
// A minimal HTTP server using Node's BUILT-IN `http` module.
//
// WHAT IT DOES:
//   - Starts a server on port 3000.
//   - Responds with JSON to two routes:
//       GET /           → welcome message
//       GET /students   → list of students
//   - Returns 404 JSON for anything else.
//
// NO INSTALLATION NEEDED:
//   `http` is a built-in module — it ships with Node.js.
//
// RUN:
//     node server.js
//
// TEST IN BROWSER OR TERMINAL:
//     http://localhost:3000/
//     http://localhost:3000/students
//     curl http://localhost:3000/students
// ============================================================

// ------------------------------------------------------------
// IMPORT THE BUILT-IN HTTP MODULE
// No path prefix → Node loads it from its core.
// `http` gives us createServer() to build a web server.
// ------------------------------------------------------------
const http = require("http");

// ------------------------------------------------------------
// IN-MEMORY DATA
// A static array acting as our "database" for this demo.
// In a real app this would come from MongoDB, PostgreSQL, etc.
// Because it's in memory, restarting the server resets it.
// ------------------------------------------------------------
const students = [
  {
    id: 1,
    name: "Abebe",
    course: "Node.js",
  },
  {
    id: 2,
    name: "Kebede",
    course: "MongoDB",
  },
];

// ------------------------------------------------------------
// CREATE THE SERVER
// http.createServer(callback) returns a Server object.
// The callback runs ONCE PER REQUEST with two arguments:
//   req → IncomingMessage (request data: method, url, headers)
//   res → ServerResponse (methods to send data back)
//
// This callback is called the "request handler".
// ------------------------------------------------------------
const server = http.createServer((req, res) => {
  // ----------------------------------------------------------
  // Set a default response header.
  // We tell the client the body will be JSON.
  // setHeader() sets ONE header; we can call it once here and
  // override it later with writeHead() if needed.
  // ----------------------------------------------------------
  res.setHeader("Content-Type", "application/json");

  // ==========================================================
  // ROUTE 1 — GET /students
  // Returns the full list of students as JSON.
  //
  // ROUTING LOGIC:
  //   - Check method (GET, POST, ...) to avoid matching
  //     a POST request to the same URL.
  //   - Check url string to match the exact path.
  //   - For larger apps use Express or a router library.
  // ==========================================================
  if (req.method === "GET" && req.url === "/students") {
    // Send status code 200 (OK).
    res.writeHead(200);

    // JSON.stringify turns the array into a JSON string,
    // which is what res.end() expects to send.
    res.end(JSON.stringify(students));

    // `return` stops the function so no other route runs.
    return;
  }

  // ==========================================================
  // ROUTE 2 — GET /
  // Root route — a simple welcome message.
  // Demonstrates that JSON responses can also be plain objects.
  // ==========================================================
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);

    // An object literal → stringified into JSON.
    res.end(
      JSON.stringify({
        message: "Welcome to Student API",
      }),
    );

    return;
  }

  // ==========================================================
  // FALLBACK — unknown routes
  // Any request that did not match the routes above lands here.
  // Standard HTTP behavior: respond with 404 Not Found.
  // We still return JSON so clients get a consistent format.
  // ==========================================================
  res.writeHead(404);

  res.end(
    JSON.stringify({
      message: "Route not found",
    }),
  );
});

// ------------------------------------------------------------
// START THE SERVER
// server.listen(port, callback):
//   - Binds the server to TCP port 3000.
//   - The callback runs ONCE when the server is ready.
//   - Visit http://localhost:3000 in a browser to test.
//
// PORT CHOICE:
//   3000 is a common dev default. Change to 8080, 5000, etc.
//   if 3000 is already in use (EADDRINUSE error).
//
// STOP THE SERVER:
//   Press Ctrl + C in the terminal.
// ------------------------------------------------------------
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
