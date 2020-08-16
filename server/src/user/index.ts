import WebSocket from "ws";

import { message } from "../types/message";
import { messageTypes } from "../enums/message";

import { sendMessage } from "../helpers/index";

import { createUser, getUserByName, getUserById } from "./userDb";
import {
  user,
  connectionOfferRequest,
  connectionAnswerRequest,
} from "./types/user";

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
    content: {
      name: user.name,
      _id: user._id,
    },
  });

  return user;
}

export async function sendMessageToOnlineUsers(op: user, message: message) {
  connectedUsers.forEach((ws, _id) => {
    if (_id === op._id) {
      return;
    }

    sendMessage(ws, message);
  });
}

export async function offerConnection({
  from,
  offer,
  to,
}: connectionOfferRequest) {
  if (from._id === to) return;

  const userConnection = connectedUsers.get(from._id);
  if (!userConnection) {
    throw {
      type: messageTypes.ERROR,
      success: false,
      content: "Login first.",
    };
  }

  const recipient = await getUserById(to);
  if (!recipient) {
    sendMessage(userConnection, {
      type: messageTypes.ERROR,
      success: false,
      content: "Could not find requested user.",
    });

    return;
  }

  const recipientConnection = connectedUsers.get(recipient._id);
  if (!recipientConnection) {
    sendMessage(userConnection, {
      type: messageTypes.ERROR,
      success: false,
      content: "Requested user is not online.",
    });

    return;
  }

  sendMessage(recipientConnection, {
    type: messageTypes.CONNECTION_OFFER,
    content: {
      offer,
      user: from,
    },
  });
}

export async function answerConnection({
  from,
  answer,
  to,
}: connectionAnswerRequest) {
  if (from._id === to) return;

  const userConnection = connectedUsers.get(from._id);
  if (!userConnection) {
    throw {
      type: messageTypes.ERROR,
      success: false,
      content: "Login first.",
    };
  }

  const sender = await getUserById(to);
  const senderConnection = connectedUsers.get(sender._id);
  if (!senderConnection) {
    sendMessage(userConnection, {
      type: messageTypes.ERROR,
      success: false,
      content: "User is no longer online.",
    });

    return;
  }

  sendMessage(senderConnection, {
    type: messageTypes.CONNECTION_ANSWER,
    content: {
      answer,
      user: from,
    },
  });
}
