<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header></Header>

<main>
	<slot />
</main>

<footer>
	<p>&copy;2022 THECLOUD</p>
</footer>

<style>
</style>
