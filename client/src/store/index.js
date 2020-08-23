import { writable } from 'svelte/store';

export const isSocketOpen = writable(false);
export const user = writable({});
