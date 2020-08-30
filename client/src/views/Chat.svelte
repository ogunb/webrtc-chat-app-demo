<script>
  import eventEmitter from "../services/eventEmitter";
  import { sendMessage } from "../services/socket";

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

  let messages = {};
  let currentMessage = "";
  let isConnecting = false;

  function selectUser(selectedUser) {
    isConnecting = true;
    chattingWith.set(selectedUser);
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
    } finally {
      isConnecting = false;
    }
  }

  function createDataChannel() {
    let newDataChannel = $connection.createDataChannel("messenger");
    newDataChannel.addEventListener("message", (...args) => {
      eventEmitter.emit(DATA_CHANNEL_MESSAGE, ...args);
    });
    dataChannel.set(newDataChannel);
  }

  function sendPartnerMessage(message) {
    const timeStamp = Date.now();
    const text = { timeStamp, message, user: $user.name };
    console.log(text);
  }

  function handleDataChannelMessageReceived(event) {
    if (!messages[$chattingWith.name]) {
      messages[$chattingWith.name] = [];
    }

    messages[$chattingWith.name].push(event.data);
  }

  eventEmitter.subscribe(
    DATA_CHANNEL_MESSAGE,
    handleDataChannelMessageReceived
  );
</script>

<h3>Online Users</h3>
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
  <h1>{$chattingWith.name}</h1>
  <p style="font-size: 80px">{JSON.stringify(messages)}</p>
  <button on:click={sendPartnerMessage}>send message</button>
{/if}
