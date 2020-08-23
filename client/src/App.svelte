<script>
  import { NotificationDisplay } from "@beyonk/svelte-notifications";

  import Login from "./views/Login.svelte";
  import Chat from "./views/Chat.svelte";

  import { isSocketOpen, user } from "./store";
  import { initChat } from "./services/chat";

  let isUserLoggedIn;
  user.subscribe((value) => (isUserLoggedIn = !!value._id));
  initChat();
</script>

<NotificationDisplay />

{#if !$isSocketOpen}
  <p>loading...</p>
{:else if isUserLoggedIn}
  <Chat />
{:else}
  <Login />
{/if}
