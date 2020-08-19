<script>
  let username = "";
  let password = "";

  function handleLogin() {
    console.log({ username, password });
  }
</script>

<main>
  <form on:submit|preventDefault={handleLogin}>
    <label>
      Username:
      <input type="text" placeholder="Username" bind:value={username}/>
    </label>
    <label>
      Password:
      <input type="password" placeholder="Password" bind:value={password}/>
    </label>
    <button>CONNECT</button>
  </form>
</main>
