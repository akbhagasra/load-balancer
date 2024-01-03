const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const proxy = require("http-proxy-middleware");
const port = 80;
let currentServer = 0;

const backendServers = [
  {
    host: "localhost",
    port: 8081,
  },
  {
    host: "localhost",
    port: 8082,
  },
  {
    host: "localhost",
    port: 8083,
  },
];

let healthyServers = [];
const proxyOptions = {
  target: "",
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader("X-Special-Proxy-Header", "foobar");
  },
  logLevel: "debug",
};

router.all("*", (req, res) => {
  const server = nextServer();
  if (!server) {
    res.status(500).send("No healthy server");
  }

  proxyOptions.target = `http://${server.host}:${server.port}`;
  const middleware = proxy.createProxyMiddleware(proxyOptions);

  middleware(req, res, (err) => {
    if (err) {
      console.error("Error forwarding request:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

const nextServer = () => {
  let healthyCount = healthyServers.length;
  let server = null;
  if (healthyCount) {
    server = healthyServers[currentServer % healthyCount];
    currentServer = (currentServer + 1) % healthyCount;
  }
  return server;
};

const healthChecker = async () => {
  console.log("Health Check");
  let healthy = [];
  for (let server of backendServers) {
    try {
      const resp = await axios.get(`http://${server.host}:${server.port}/ping`);
      if (resp.status === 200) {
        healthy.push(server);
      } else {
        console.error("Unhealthy server:", server);
      }
    } catch (err) {
      console.error("Unhealthy server:", server);
    }
  }
  healthyServers = healthy;
};
healthChecker();

app.use("/", router);
app.listen(port, () => {
  console.log(`Load balancer started on port: ${port}`);
  setInterval(healthChecker, 5000);
});
