import { sendMessage, listenEvent, removeEvent } from './socket';
import { user, isSocketOpen, onlineUsers } from '../store';
import { LOGIN, CONNECT, USER_JOINED, USER_LEFT } from '../enums/messageTypes';
import notification from './notification';
import eventEmitter from './eventEmitter';

export function initChat() {
  listenEvent("closed", () => isSocketOpen.set(false));

  listenEvent('message', async (data) => {
    switch (data.type) {
      case CONNECT:
        handleConnectEvent(data)
        break;

      case LOGIN:
        handleLoginEvent(data)
        break;

      case USER_JOINED:
        handleUserJoin(data);
        break;

      // case CONNECTION_OFFER:
      //   await offerConnection(content);
      //   break;

      // case CONNECTION_ANSWER:
      //   await answerConnection(content);
      //   break;

      // case ICE_CANDIDATE:
      //   await sendConnectionCandidate(content);
      //   break;

      case USER_LEFT:
        handleUserLeft(data);
        break;

      default:
        console.error(data);
    }
  });
}

function handleConnectEvent(data) {
  isSocketOpen.set(true)
  eventEmitter.emit(CONNECT, data)
}

function handleLoginEvent(data) {
  const { success, content } = data;

  if (!success) {
    notification.error(content);
    return;
  }

  user.set(content.user);
  onlineUsers.set(content.onlineUsers);
  eventEmitter.emit(LOGIN, data);
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

export function login({ username, password }) {
  const userData = { name: username, password };
  sendMessage({ type: LOGIN, content: userData });
}
