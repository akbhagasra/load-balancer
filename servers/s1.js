const express = require("express");
const app = express();
const port = process.argv[2];

app.get("/", (req, res) => {
  res.send("Hello from backend server");
});

app.get("/ping", (req, res) => {
  res.send("Running...");
});

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
  //   console.log(process.argv[3]);
});
