import { sendMessage, listenEvent } from './socket';
import { user, isSocketOpen, onlineUsers, connection, chattingWith, dataChannel } from '../store';
import { LOGIN, CONNECT, USER_JOINED, USER_LEFT, CONNECTION_OFFER, CONNECTION_ANSWER, ICE_CANDIDATE, ERROR } from '../enums/messageTypes';
import { DATA_CHANNEL_OPEN, DATA_CHANNEL_MESSAGE } from '../enums/dataChannelEvents';
import notification from './notification';
import eventEmitter from './eventEmitter';

let $user;
let $chattingWith;
let $connection;
user.subscribe(val => $user = val);
chattingWith.subscribe(val => $chattingWith = val);
connection.subscribe(val => {
  $connection = val

  $connection.addEventListener("icecandidate", ({ candidate }) => {
    if (candidate && !!$chattingWith._id) {
      sendMessage({
        type: ICE_CANDIDATE,
        content: {
          to: $chattingWith._id,
          candidate,
          from: $user,
        },
      });
    }
  })

  $connection.addEventListener("datachannel", (event) => {
    let receiveChannel = event.channel;

    receiveChannel.addEventListener("open", (...args) => {
      console.info("Data channel is open and ready to be used.");
      eventEmitter.emit(DATA_CHANNEL_OPEN, ...args);
    });

    receiveChannel.addEventListener("message", (...args) => {
      eventEmitter.emit(DATA_CHANNEL_MESSAGE, ...args);
    });

    dataChannel.set(receiveChannel);
  });
});

export function initChat() {
  listenEvent("closed", () => isSocketOpen.set(false));

  listenEvent('message', async (data) => {
    switch (data.type) {
      case CONNECT:
        handleConnectEvent(data)
        eventEmitter.emit(CONNECT, data);
        break;

      case LOGIN:
        handleLoginEvent(data)
        eventEmitter.emit(LOGIN, data);
        break;

      case USER_JOINED:
        handleUserJoin(data);
        eventEmitter.emit(USER_JOINED, data);
        break;

      case CONNECTION_OFFER:
        await handleConnectionOffer(data);
        eventEmitter.emit(CONNECTION_OFFER, data);
        break;

      case CONNECTION_ANSWER:
        await handleConnectionAnswer(data);
        eventEmitter.emit(CONNECTION_ANSWER, data);
        break;

      case ICE_CANDIDATE:
        await handleIceCandidate(data);
        eventEmitter.emit(ICE_CANDIDATE, data);
        break;

      case USER_LEFT:
        handleUserLeft(data);
        eventEmitter.emit(USER_LEFT, data);
        break;

      default:
        console.error(data);
        eventEmitter.emit(ERROR, data);
    }
  });
}

function handleConnectEvent(data) {
  isSocketOpen.set(true)
}

function handleLoginEvent(data) {
  const { success, content } = data;

  if (!success) {
    notification.error(content);
    return;
  }

  user.set(content.user);
  onlineUsers.set(content.onlineUsers);
}

function handleUserJoin({ content }) {
  onlineUsers.update(users => [...users, content]);
}

function handleUserLeft({ content }) {
  onlineUsers.update((users) => {
    const partedUserId = content.userId;
    const userIndex = users.findIndex(user => user._id === partedUserId);

    const newUsers = [...users];
    newUsers.splice(userIndex, 1);
    return newUsers;
  });
}

async function handleConnectionOffer({ content }) {
  try {
    const remoteDescription = new RTCSessionDescription(content.offer);
    await $connection.setRemoteDescription(remoteDescription);
    const answer = await $connection.createAnswer();
    $connection.setLocalDescription(answer);

    sendMessage({
      type: CONNECTION_ANSWER,
      content: {
        answer,
        from: $user,
        to: content.user._id,
      }
    })
  } catch (err) {
    console.error(err);
  }
  chattingWith.set(content.user);
}

async function handleConnectionAnswer({ content }) {
  const remoteDescription = new RTCSessionDescription(content.answer);
  await $connection.setRemoteDescription(remoteDescription);
}

async function handleIceCandidate({ content }) {
  const candidate = new RTCIceCandidate(content.candidate);
  await $connection.addIceCandidate(candidate);
}


export function login({ username, password }) {
  const userData = { name: username, password };
  sendMessage({ type: LOGIN, content: userData });
}
