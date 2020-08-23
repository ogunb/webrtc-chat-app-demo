import { sendMessage, listenEvent, removeEvent } from './socket';
import { user, isSocketOpen } from '../store';
import { LOGIN, CONNECT } from '../enums/messageTypes';
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

      // case messageTypes.CONNECTION_OFFER:
      //   await offerConnection(content);
      //   break;

      // case messageTypes.CONNECTION_ANSWER:
      //   await answerConnection(content);
      //   break;

      // case messageTypes.ICE_CANDIDATE:
      //   await sendConnectionCandidate(content);
      //   break;

      // case messageTypes.USER_LEFT:
      //   handleUserLogout(content);
      //   break;

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
  const { type, success, content } = data;

  if (!success) {
    notification.error(content);
    return;
  }

  user.update(user => user = content);
  eventEmitter.emit(LOGIN, data);
}

export function login({ username, password }) {
  const userData = { name: username, password };
  sendMessage({ type: LOGIN, content: userData });
}
