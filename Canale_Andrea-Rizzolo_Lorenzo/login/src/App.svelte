<script>
  import { Router, Route, Link } from "svelte-navigator";
  import index from "./index.svelte";
  import login from "./login.svelte";

</script>

<Router>
  <header>
    <h1>Login page</h1>
    <nav>
      <Link to="index">Home</Link>
      <Link to="login">Login</Link>
    </nav>
  </header>
  <main>
	<Route path="index/*indexRoute" component={index} />
  <Route path="login/*loginRoute" component={login} />
  </main>
</Router>

<style>
	:global(:target) {

	background-color: papayawhip;}
</style>
