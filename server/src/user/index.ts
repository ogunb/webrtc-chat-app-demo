import WebSocket from "ws";

import { message } from "../types/message";
import { messageTypes } from "../enums/message";

import { sendMessage } from "../helpers/index";

import { createUser, getUserByName } from "./userDb";
import { user } from "./types/user";

const connectedUsers: Map<string, WebSocket> = new Map();

export async function handleUserLogin(ws: WebSocket, { name, password }: user) {
  let user = await getUserByName(name);

  if (!user) {
    user = await createUser({ name, password });
  }

  if (user.password !== password) {
    throw {
      type: messageTypes.LOGIN,
      success: false,
      content: "Password is not correct.",
    };
  }

  if (connectedUsers.get(user._id)) {
    throw {
      type: messageTypes.LOGIN,
      success: false,
      content: "User is already online.",
    };
  }

  connectedUsers.set(user._id, ws);

  sendMessage(ws, {
    type: messageTypes.LOGIN,
    success: true,
    content: "Login successful."
  })

  return user;
}

export async function sendMessageToOnlineUsers(
  op: user,
  message: message
) {
  connectedUsers.forEach((ws, _id) => {
    if (_id === op._id) {
      return;
    }

    sendMessage(ws, message)
  });
}
