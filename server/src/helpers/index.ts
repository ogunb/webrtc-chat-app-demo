import WebSocket from "ws";
import { message } from "../types/message";

export function sendMessage(ws: WebSocket, data: message) {
  ws.send(JSON.stringify(data));
}
