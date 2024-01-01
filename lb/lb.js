const express = require("express");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
const port = 80;
const backendServers = [
  createProxyMiddleware({
    target: "http://localhost:8081",
    changeOrigin: true,
  }),
  createProxyMiddleware({
    target: "http://localhost:8082",
    changeOrigin: true,
  }),
  createProxyMiddleware({
    target: "http://localhost:8083",
    changeOrigin: true,
  }),
];

app.use(express.text());

app.get("/", (req, res) => {
  const selectedMiddleware = backendServers[0];
  selectedMiddleware(req, res, (err) => {
    if (err) {
      console.error("Error forwarding request:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(port, () => {
  console.log(`Load balancer started on port: ${port}`);
});
