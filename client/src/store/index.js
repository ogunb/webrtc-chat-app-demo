import { writable, readable } from 'svelte/store';

export const isSocketOpen = writable(false);
export const user = writable({});
export const onlineUsers = writable([]);
export const chattingWith = writable({});

export const connection = readable(new RTCPeerConnection());
export const dataChannel = writable(null);
