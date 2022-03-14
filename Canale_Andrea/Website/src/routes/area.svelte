<script context="module">
	export const prerender = true;
</script>

<script>
import { onMount } from "svelte";
import Menu from "../menu/CustomMenu.svelte";
	let user=''
	let name='/'
	let old='/'
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
				img.addEventListener("click", function(e){
					old=name
					name=name+e.path[0].id
					create(name)
				})
				para.appendChild(img)
			}else{
				var img=document.createElement("img");
				img.src="file.png"
				img.id=cartelle[index]
				img.addEventListener("click", function(e){
					console.log(e.path[0].id)
				})
				para.appendChild(img)
			}
			var element = document.getElementById("cartelle");
				element.appendChild(para);
		}
		}
	}
	function create(nome) {
		var host = location.protocol + '//' + location.hostname;
    fetch("http://ec2-15-160-195-204.eu-south-1.compute.amazonaws.com:3001/newfolder", {
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
    fetch("http://ec2-15-160-195-204.eu-south-1.compute.amazonaws.com:3001/folder", {
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
create('/'+nome)
	}
	function removefolder() {
		
		var host = location.protocol + '//' + location.hostname;
    fetch("http://ec2-15-160-195-204.eu-south-1.compute.amazonaws.com:3001/deletefolder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
		user:user,
		path:name
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => creo(json)) //
location.reload()
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
<Menu/>
<img id="cartest" src="./folder@1x.png" width="32" on:click|preventDefault={event => neu(event.path[0].id)}/>
<p>Crea cartella</p>
<img id="cartest" src="./folder@1x.png" width="32" on:click={removefolder}/>
<p>Rimuovi cartella</p>
<div id="cartelle">

</div>
<form ref='uploadForm' 
      id='uploadForm' 
      action='http://ec2-15-160-195-204.eu-south-1.compute.amazonaws.com:3001/upload' 
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
