<script>
  import eventEmitter from "../services/eventEmitter";
  import { sendMessage } from "../services/socket";
  import { sendMessageToChannel } from "../services/chat";

  import { CONNECTION_OFFER, ICE_CANDIDATE } from "../enums/messageTypes";
  import {
    DATA_CHANNEL_MESSAGE,
    DATA_CHANNEL_OPEN,
  } from "../enums/dataChannelEvents";

  import {
    onlineUsers,
    chattingWith,
    user,
    dataChannel,
    connection,
  } from "../store";

  eventEmitter.subscribe(DATA_CHANNEL_OPEN, handleDataChannelReady);
  eventEmitter.subscribe(
    DATA_CHANNEL_MESSAGE,
    handleDataChannelMessageReceived
  );

  let messages = {};
  let currentMessage = "";
  let isConnecting = false;

  function selectUser(selectedUser) {
    isConnecting = true;
    currentMessage = "";

    chattingWith.set(selectedUser);

    if (!messages[$chattingWith.name]) {
      messages[$chattingWith.name] = [];
    }

    startConnection();
  }

  async function startConnection(name) {
    createDataChannel();

    try {
      const offer = await $connection.createOffer();
      await $connection.setLocalDescription(offer);

      sendMessage({
        type: CONNECTION_OFFER,
        content: {
          from: $user,
          offer: $connection.localDescription,
          to: $chattingWith._id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  function createDataChannel() {
    let newDataChannel = $connection.createDataChannel("messenger");
    newDataChannel.addEventListener("open", (...args) => {
      console.info("Data channel is open and ready to be used.");
      eventEmitter.emit(DATA_CHANNEL_OPEN, ...args);
    });
    newDataChannel.addEventListener("message", (...args) => {
      eventEmitter.emit(DATA_CHANNEL_MESSAGE, ...args);
    });
    dataChannel.set(newDataChannel);
  }

  function sendPartnerMessage(message) {
    if (!messages[$chattingWith.name]) {
      messages[$chattingWith.name] = [];
    }

    const timeStamp = Date.now();
    const text = { timeStamp, msg: currentMessage, from: $user.name };

    sendMessageToChannel(text);

    text.from = "ME";
    currentMessage = "";
    messages[$chattingWith.name] = [...messages[$chattingWith.name], text];
  }

  function handleDataChannelMessageReceived(event) {
    if (!messages[$chattingWith.name]) {
      messages[$chattingWith.name] = [];
    }

    messages[$chattingWith.name] = [
      ...messages[$chattingWith.name],
      JSON.parse(event.data),
    ];
  }

  function handleDataChannelReady() {
    isConnecting = false;
  }
</script>

<h3>Online Users - You are: {$user.name}</h3>
<ul>
  {#each $onlineUsers as user}
    <li>
      <a href={`#${user._id}`} on:click={selectUser(user)}>{user.name}</a>
    </li>
  {:else}
    <li>No online user.</li>
  {/each}
</ul>

<hr />

{#if isConnecting}
  <p>// connecting to {$chattingWith.name}...</p>
{:else if $chattingWith.name}
  {#if messages[$chattingWith.name] && messages[$chattingWith.name].length}
    {#each messages[$chattingWith.name] as message}
      <p>
        <i>{message.from}</i>
        - {message.msg} -
        <small>{new Date(message.timeStamp).toLocaleString('tr-TR')}</small>
      </p>
    {/each}
  {/if}

  <input type="text" bind:value={currentMessage} />
  <button on:click={sendPartnerMessage}>send message</button>
{/if}
