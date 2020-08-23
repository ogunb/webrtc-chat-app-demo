import WebSocket from "ws";

import { message } from "../types/message";
import { messageTypes } from "../enums/message";

import { sendMessage } from "../helpers/index";

import { createUser, getUserByName, getUserById } from "./userDb";
import {
  user,
  connectionOfferRequest,
  connectionAnswerRequest,
  connectionCandidateRequest,
  userId,
} from "./types/user";

import {
  sendNotOnlineMessage,
  throwLoginException,
} from "./helpers/userHelpers";

const connectedUsers: Map<string, WebSocket> = new Map();

export async function handleUserLogin(ws: WebSocket, { name, password }: user) {
  let user = await getUserByName(name);

  if (!user) {
    if (!password) {
      throw {
        type: messageTypes.LOGIN,
        success: false,
        content: "Password is required.",
      };
    }

    user = await createUser({ name, password });
  }

  if (user.password !== password) {
    throw {
      type: messageTypes.LOGIN,
      success: false,
      content: "Password is not correct.",
    };
  }

  if (connectedUsers.has(user._id)) {
    throw {
      type: messageTypes.LOGIN,
      success: false,
      content: "User is already online.",
    };
  }

  const onlineUsers: user[] = await getAllOnlineUsers();
  connectedUsers.set(user._id, ws);

  sendMessage(ws, {
    type: messageTypes.LOGIN,
    success: true,
    content: {
      user: {
        name: user.name,
        _id: user._id,
      },
      onlineUsers,
    },
  });

  ws.on("close", () => handleUserLogout(user._id));
  return user;
}

async function getAllOnlineUsers(): Promise<user[]> {
  return new Promise((resolve) => {
    const onlineUsers: user[] = [];

    if (connectedUsers.size === 0 ) {
      resolve(onlineUsers);
      return;
    }

    connectedUsers.forEach(async (_, id) => {
      const user = await getUserById(id);
      if (!user) return;

      onlineUsers.push({ name: user.name, _id: user._id });

      if (onlineUsers.length === connectedUsers.size) {
        resolve(onlineUsers)
      }
    });
  });
}

export function handleUserLogout(userId: userId) {
  const userConnection = connectedUsers.get(userId);
  userConnection.terminate();
  connectedUsers.delete(userId);

  sendMessageToOnlineUsers(
    { _id: null, name: null },
    {
      type: messageTypes.USER_LEFT,
      content: {
        userId: userId,
      },
    }
  );
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
    throwLoginException();
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
    sendNotOnlineMessage(recipientConnection);
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
    throwLoginException();
  }

  const sender = await getUserById(to);
  const senderConnection = connectedUsers.get(sender._id);
  if (!senderConnection) {
    sendNotOnlineMessage(senderConnection);
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

export async function sendConnectionCandidate({
  from,
  candidate,
  to,
}: connectionCandidateRequest) {
  if (from._id === to) return;

  const userConnection = connectedUsers.get(from._id);
  if (!userConnection) {
    throwLoginException();
  }

  const recipient = await getUserById(to);
  const recipientConnection = connectedUsers.get(recipient._id);
  if (!recipientConnection) {
    sendNotOnlineMessage(recipientConnection);
    return;
  }

  sendMessage(recipientConnection, {
    type: messageTypes.ICE_CANDIDATE,
    content: {
      candidate,
      user: from,
    },
  });
}
