<script>
  import { NotificationDisplay } from "@beyonk/svelte-notifications";

  import Login from "./views/Login.svelte";

  import { isSocketOpen } from "./store";
  import { initChat } from "./services/chat";

  let isSocketReady;
  isSocketOpen.subscribe((value) => (isSocketReady = value));
  initChat();
</script>

<NotificationDisplay />

{#if !isSocketReady}
  <p>loading...</p>
{:else}
  <Login />
{/if}
