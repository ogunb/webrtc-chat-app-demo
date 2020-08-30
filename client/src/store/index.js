import { writable, readable } from 'svelte/store';

export const isSocketOpen = writable(false);
export const user = writable({});
export const onlineUsers = writable([]);
export const chattingWith = writable({});

const configuration = Object.freeze({
  iceServers: [{ url: "stun:stun.1.google.com:19302" }],
});

export const connection = readable(new RTCPeerConnection(configuration));
export const dataChannel = writable(null);
