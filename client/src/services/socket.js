import { ERROR } from "../enums/messageTypes";

const { BASE_URL } = process.env;
const socket = new WebSocket(BASE_URL);

function parseMessage(json) {
  try {
    const data = JSON.parse(json.data);
    return data;
  } catch {
    return {
      type: ERROR,
      success: false,
      content: "Not a valid JSON.",
    };
  }
}

export function getSocket() {
  return socket;
}

export function isSocketReady() {
  return socket.readyState !== 0;
}

export function listenEvent(event, callback) {
  const listenerCallback = (json) => {
    const data = parseMessage(json);
    callback(data);
  }

  socket.addEventListener(event, listenerCallback);

  return listenerCallback;
}

export function removeEvent(event, listener) {
  socket.removeEventListener(event, listener);
}

export function sendMessage(data) {
  socket.send(JSON.stringify(data));
}