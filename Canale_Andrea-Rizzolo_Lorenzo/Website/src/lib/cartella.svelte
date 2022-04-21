<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	function clicked() {
		dispatch('pr', {
			text: file
		});
	}
    export let file;
</script>

<img id={file} src="folder-removebg-preview.png" class="folderd" on:click={clicked} />
<span>{file}</span><br />