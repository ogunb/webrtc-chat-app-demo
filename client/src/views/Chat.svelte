<script>
  import { user, onlineUsers } from "../store";

  let me;
  user.subscribe((value) => (me = value));
  let users;
  onlineUsers.subscribe(value => (users = value));
</script>

<p>{JSON.stringify(users)}</p>
