<script>
  import { login } from "../services/chat";
  import eventEmitter from "../services/eventEmitter";
  import { LOGIN } from "../enums/messageTypes";

  let username = "";
  let password = "";
  let isLoggingIn = false;

  function handleLogin() {
    isLoggingIn = true;
    login({ username, password });

    function loggedIn({ success }) {
      if (success) {
        username = "";
        password = "";
      }

      isLoggingIn = false;
      unsub();
    }

    const unsub = eventEmitter.subscribe(LOGIN, loggedIn);
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
    <button disabled={isLoggingIn}>CONNECT</button>
  </form>
</main>
