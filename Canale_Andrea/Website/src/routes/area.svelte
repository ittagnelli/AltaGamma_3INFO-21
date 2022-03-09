<script context="module">
	export const prerender = true;
</script>

<script>
import { onMount } from "svelte";
	let user=''
	let name='/'
	try {
		const logged = localStorage.getItem('logged');
		user=localStorage.getItem('email')
    if(logged==null){
      window.location.href="/login"
    }
	} catch (error) {
		onMount(async () => {
			window.location.href="/login"
	});
		
	}

	
	function creo(cartelle) {
		console.log("Eccome")
		if(cartelle.status==500){
			alert("Cartella non trovata")
		}else if(cartelle.status==501){
			alert("Cartella esistente")
		}else{
			document.getElementById("cartelle").innerHTML=""
		for (let index = 0; index < cartelle.length; index++) {
			var para = document.createElement("p");
			var node = document.createTextNode(cartelle[index]);
			para.appendChild(node);
			if(cartelle[index].split(".")[1]==null){
				var img=document.createElement("img");
				img.src="folder@1x.png"
				img.id=cartelle[index]
				para.appendChild(img)
			}else{
				var img=document.createElement("img");
				img.src="file.png"
				img.id=cartelle[index]
				para.appendChild(img)
			}
			var element = document.getElementById("cartelle");
				element.appendChild(para);
		}
		}
	}
	function create(nome) {
		var host = location.protocol + '//' + location.hostname;
    fetch(host+ ":3001/folder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        user: user,
		cartella:nome,
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => creo(json))
	}
	function neu(nome) {
		
		var host = location.protocol + '//' + location.hostname;
    fetch(host+ ":3001/newfolder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        user: user,
		folder:prompt("Inserire il nome della cartella che si vuole create:"),
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => creo(json)) //
console.log(nome)
create(nome)
	}
	onMount(async () => {
			create(name)
	});
function sub() {
	alert("Caricamento in corso, attendere")
}
</script>

<svelte:head>
	<title>Home</title>
	<link rel="stylesheet" type="text/css" href="start.css">
</svelte:head>
<img src="./folder@1x.png" width="32" on:click|preventDefault={() => neu(this)}/>
<p>Crea cartella</p>
<div id="cartelle">

</div>
<form ref='uploadForm' 
      id='uploadForm' 
      action='http://localhost:3001/upload' 
      method='post' 
      encType="multipart/form-data"
	  on:submit={sub}>
        <input type="file" name="sampleFile" />
		<input type="hidden" name="user" value={user} />
		<input type='submit' value='Upload!' />
    </form>    
<style global>
	@import 'filepond/dist/filepond.css';
@import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

</style>
