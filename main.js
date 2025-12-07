//imports
const fs = require("node:fs");
const path = require("node:path");
const stream = require("node:stream");
const http = require("node:http");
//question 1
/* const filepath = path.resolve("./big.txt");
const readStream = fs.createReadStream(filepath, {
  encoding: "utf-8",
  highWaterMark: 512,
});
readStream.on("error", (error) => {
  console.error("Stream error:", error);
});
readStream.on("data", (chunk) => {
  console.log("========");
  console.log(chunk);
});
readStream.on("end", () => {
  console.log("Finished reading file");
});
 */
//question 2
/* const filepath2 = path.resolve("./destination.txt");
const writeStream = fs.WriteStream(filepath2);
const filepath = path.resolve("./big.txt");
const readStream = fs.createReadStream(filepath, {
  encoding: "utf-8",
  highWaterMark: 512,
});

readStream.on("data", (chunk) => {
  writeStream.write(chunk);
}); */

//question 3
/* const filepath = path.resolve("./big.txt");
const readStream = fs.createReadStream(filepath, {
  encoding: "utf-8",
  highWaterMark: 512,
});
const { createGzip } = require("node:zlib");

const zipfile = path.resolve("./zipfile.txt.gzip");
const makezip = fs.WriteStream(zipfile);
const zip = createGzip();

readStream.pipe(zip).pipe(makezip); */

//part 2
/* const json = path.resolve("./store.json");
const server = http.createServer((req, res) => {
  //console.log({ req });
  const { url, method } = req;
  //console.log({ url, method });
  const regex = /\/user\/\d+/;
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<h1>Welcome page </h1>");
    res.end;
  } else if (method === "POST" && url === "/user") {
    let body = "";

    // Collect the data chunks from the request
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // When all data is received
    req.on("end", () => {
      try {
        const userData = JSON.parse(body);

        // Read existing users
        let users = [];
        if (fs.existsSync("store.json")) {
          users = JSON.parse(fs.readFileSync("store.json", "utf8"));
        }

        // Add new user
        console.log({ users });
        const checkUnique = users.find((user) => user.email === userData.email);
        if (checkUnique) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify({
              error: "Already Registered",
              email: userData.email,
            })
          );
          res.end();
        } else {
          users.push(userData);

          // Save to file
          fs.writeFileSync("store.json", JSON.stringify(users, null, 2));

          res.writeHead(201, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "Done" }));
          res.end();
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ error: "Invalid data" }));
        res.end();
      }
    });
  } else if (method === "PATCH" && regex.test(url)) {
    const parts = url.split("/");
    const userId = parts[2];

    let users = [];
    if (fs.existsSync("store.json")) {
      users = JSON.parse(fs.readFileSync("store.json", "utf8"));
    }
    const finduser = users.findIndex((user) => user.id == userId);

    if (finduser === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          error: "No user with such id",
          id: userId,
        })
      );
      res.end();
    } else {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // When all data is received
      req.on("end", () => {
        const updatedData = JSON.parse(body);
        console.log(updatedData);
        if (updatedData.name) {
          users[finduser].name = updatedData.name;
        }
        if (updatedData.age) {
          users[finduser].age = updatedData.age;
        }
        if (updatedData.email) {
          users[finduser].email = updatedData.email;
        }

        fs.writeFileSync("store.json", JSON.stringify(users, null, 2));
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "updated sucessfully" }));
        res.end();
      });
    }
  } else if (method === "DELETE" && regex.test(url)) {
    const parts = url.split("/");
    const userId = parts[2];

    let users = [];
    if (fs.existsSync("store.json")) {
      users = JSON.parse(fs.readFileSync("store.json", "utf8"));
    }
    const finduser = users.findIndex((user) => user.id == userId);
    if (finduser === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          error: "No user with such id",
          id: userId,
        })
      );
      res.end();
    } else {
      users.splice(finduser, 1);
      fs.writeFileSync("store.json", JSON.stringify(users, null, 2));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "user deleted", UserId: userId }));
      res.end();
    }
  } else if (method === "GET" && url === "/user") {
    let users = [];
    if (fs.existsSync("store.json")) {
      users = JSON.parse(fs.readFileSync("store.json", "utf8"));
    }
    const response = {
      success: true,
      count: users.length,
      data: users,
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } else if (method === "GET" && regex.test(url)) {
    const parts = url.split("/");
    const userId = parts[2];

    let users = [];
    if (fs.existsSync("store.json")) {
      users = JSON.parse(fs.readFileSync("store.json", "utf8"));
    }
    const finduser = users.findIndex((user) => user.id == userId);

    if (finduser === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          error: "No user with such id",
          id: userId,
        })
      );
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users[finduser]));
    }
  } else {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("404 page not found");
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("server is running");
});

server.on("error", (error) => {
  console.log(error);
}); */

/*
part 3

Q1)
The Node.js Event Loop is a single-threaded, non-blocking, asynchronous runtime that enables 
Node.js to handle multiple concurrent operations without creating multiple threads.
 It continuously checks if there are pending operations in different queues and executes
  their callbacks when the call stack is empty.

Q2)Libuv is a multi-platform C library that provides Node.js with:
Event loop implementation
Asynchronous I/O operations (file system, network, etc.)
Thread pool for offloading CPU-intensive tasks
Abstracting OS-specific APIs for consistent cross-platform behavior

Q3)Node.js handles asynchronous operations:
Non-blocking system calls (using Libuv) for I/O operations
Event-driven architecture - operations complete without blocking the main thread
Callback registration - when an async operation starts, its callback is registered
Event Loop monitoring - Libuv notifies the event loop when operations complete
Callback execution - completed callbacks are queued and executed when the call stack is empty

Q4)Call Stack: LIFO structure that tracks function execution. Synchronous code executes here immediately.
Event Queue (Callback Queue): FIFO structure holding completed async operation callbacks (timers, I/O, etc.).
Event Loop: Coordinator that:
Monitors the call stack
When call stack is empty, moves callbacks from event queue to call stack
Prioritizes different queues (small work before big worl)


Q5)A set of worker threads (default: 4) managed by Libuv to handle CPU-intensive or 
blocking operations that cannot be done asynchronously. 
Set Thread Pool Size: Set the environment variable before starting Node.js:
UV_THREADPOOL_SIZE=8 node server.js
^^


Q6)Non-blocking Code: Async operations (I/O, network requests) are managed by Libuv, 
which uses OS kernels  or thread pool (for file I/O). The main thread continues execution,
 and callbacks run later by event loop.

Blocking Code: Synchronous operations ( JSON.parse, crypto.scryptSync)
 run on the main thread, blocking the event loop until completion. 
 No other operations can be processed during this time.


*/
