import { writable, readable } from 'svelte/store';
import { getRTCConfig } from '../helpers';

export const isSocketOpen = writable(false);
export const user = writable({});
export const onlineUsers = writable([]);
export const chattingWith = writable({});

export const connection = readable(new RTCPeerConnection(getRTCConfig()));
export const dataChannel = writable(null);
