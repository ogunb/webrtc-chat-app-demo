<script>
  import { NotificationDisplay } from "@beyonk/svelte-notifications";
  import { login } from "../services/chat";
  import { user } from "../store";

  let me;
  user.subscribe((data) => {
    me = data;
  });

  let username = "";
  let password = "";

  function handleLogin() {
    login({ username, password });

    username = "";
    password = "";
  }
</script>

<main>
  <form on:submit|preventDefault={handleLogin}>
    <label>
      Username:
      <input type="text" placeholder="Username" bind:value={username} />
    </label>
    <label>
      Password:
      <input type="password" placeholder="Password" bind:value={password} />
    </label>
    <button>CONNECT</button>
  </form>

  <p>{JSON.stringify(me)}</p>
</main>
