import express from "express";
import WebSocket from "ws";
import http from "http";

import messageHandler from "./messageHandler";
import { messageTypes } from "./enums/message";

import { sendMessage } from "./helpers";

const app = express();
const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
   ws.on("message", (json: string) => {
    messageHandler(ws, json).catch((err) => sendMessage(ws, err));
  });

  sendMessage(ws, {
    type: messageTypes.CONNECT,
    success: true,
    content: "Connected",
  });
});

server.listen(PORT, () => {
  console.log(`WSS running on port: ${PORT}`);
});
