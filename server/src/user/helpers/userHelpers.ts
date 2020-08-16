import WebSocket from "ws";
import { messageTypes } from "../../enums/message";
import { sendMessage } from "../../helpers";

export function throwLoginException() {
  throw {
    type: messageTypes.ERROR,
    success: false,
    content: "Login first.",
  };
}

export function sendNotOnlineMessage(connection: WebSocket) {
  sendMessage(connection, {
    type: messageTypes.ERROR,
    success: false,
    content: "User is no longer online.",
  });
}
