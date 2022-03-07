<script context="module">
	export const prerender = true;
</script>

<script>
	import Counter from '$lib/Counter.svelte';
import { create_out_transition } from 'svelte/internal';
	let user=''
	function creo(cartelle) {
		document.getElementById("cartelle").innerHTML=""
		for (let index = 0; index < cartelle.length; index++) {
			var para = document.createElement("p");
			var node = document.createTextNode(cartelle[index]);
			para.appendChild(node);
			if(cartelle[index].split(".")[1]==null){
				var img=document.createElement("img");
				img.src="folder@1x.png"
				para.appendChild(img)
			}else{
				var img=document.createElement("img");
				img.src="file.png"
				para.appendChild(img)
			}
			var element = document.getElementById("cartelle");
				element.appendChild(para);
		}
	}
	function create() {
		var host = location.protocol + '//' + location.hostname;
    fetch(host+ ":3001/folder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        user: user,
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => creo(json))
	}
	function neu() {
		var host = location.protocol + '//' + location.hostname;
    fetch(host+ ":3001/newfolder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        user: user,
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => creo(json))
create()
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<img src="./folder@1x.png" width="32" on:click={create}/>
<img src="./folder@1x.png" width="32" on:click={neu}/>
<input bind:value={user} placeholder="enter your user">
<h1>{user}</h1>
<div id="cartelle">

</div>
<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
