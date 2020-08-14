import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();
const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const messageHandler = (message: String): void => {
  console.log(`New message: ${message}`);
};

wss.on("connection", (ws) => {
  ws.on("message", messageHandler);

  ws.send(
    JSON.stringify({
      type: "connect",
      message: `Connected: ${PORT}`,
    })
  );
});

server.listen(PORT, () => {
  console.log(`WSS running on port: ${PORT}`);
});
