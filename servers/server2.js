const express = require("express");
const minimist = require("minimist");

const app = express();
const args = minimist(process.argv);
const port = args.p || 8082;

app.get("/", (req, res) => {
  console.log(`Received request from ${req.baseUrl}`);
  console.log(`${req.method} / ${req.httpVersion}`);
  console.log(`Host: ${req.hostname}`);
  console.log(`User-Agent: ${req.accepted}`);
  console.log("----------------------");
  res.send("Hello from backend server");
});

app.get("/ping", (req, res) => {
  res.status(500).send();
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
