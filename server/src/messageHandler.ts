import WebSocket from "ws";

import { message } from "./types/message";
import { messageTypes } from "./enums/message";

import {
  handleUserLogin,
  sendMessageToOnlineUsers,
  offerConnection,
  answerConnection,
  sendConnectionCandidate,
  handleUserLogout,
} from "./user";

const parseMessage = (json: string): message => {
  try {
    const data = JSON.parse(json);
    return data;
  } catch {
    throw {
      type: messageTypes.ERROR,
      success: false,
      content: "Not a valid JSON.",
    };
  }
};

export default async function messageHandler(ws: WebSocket, json: string) {
  const { type, content } = parseMessage(json);

  switch (type) {
    case messageTypes.LOGIN:
      {
        const newUser = await handleUserLogin(ws, content);

        sendMessageToOnlineUsers(newUser, {
          type: messageTypes.USER_JOINED,
          content: { name: newUser.name, _id: newUser._id },
        });
      }
      break;

    case messageTypes.CONNECTION_OFFER:
      await offerConnection(content);
      break;

    case messageTypes.CONNECTION_ANSWER:
      await answerConnection(content);
      break;

    case messageTypes.ICE_CANDIDATE:
      await sendConnectionCandidate(content);
      break;

    case messageTypes.USER_LEFT:
      handleUserLogout(content);
      break;

    default:
      throw {
        type: messageTypes.ERROR,
        success: false,
        content: "Not a valid type.",
      };
  }
}
