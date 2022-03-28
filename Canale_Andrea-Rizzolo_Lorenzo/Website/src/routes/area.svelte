<script context="module">
	export const prerender = true;
</script>

<script>
import { onMount } from "svelte";
import Menu from "../menu/CustomMenu.svelte";
	let user=''
	let name='/'
	let old='/'
	let car='/'
	let cartelle=[];
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


	/*function creo(cartelle) {
		if(cartelle.status==500){
			//alert("Cartella non trovata")
		}else if(cartelle.status==501){
			//alert("Cartella esistente")
		}else{
			document.getElementById("cartelle").innerHTML=""
		for (let index = 0; index < cartelle.length; index++) {
			var para = document.createElement("p");
			var node = document.createTextNode(cartelle[index]);
			para.appendChild(node);
			if(cartelle[index].split(".")[1]==null){
				var img=document.createElement("img");
				img.src="IMG-1783-removebg-preview.png"
				img.id=cartelle[index]
				img.className="folderd"
				img.addEventListener("click", function(e){
					old=name
					name=name+e.path[0].id
					create(name)
					console.log(e.path[0].id)
				})
				para.appendChild(img)
			}else{
				var img=document.createElement("img");
				img.src="file-removebg-preview.png"
				img.className="filed"
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
	}*/
	function create(nome) {
		console.log("nome:" + nome)
		var host = location.protocol + '//' + location.hostname;
    fetch("http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/folder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        user: user,
		folder:nome,
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => cartelle=json)
.then(ciro => console.log(ciro))

console.log("fatto")

	}
	function neu(nome) {
		car=prompt("Inserire il nome della cartella che si vuole create:")
		var host = location.protocol + '//' + location.hostname;
    fetch("http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/newfolder", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        user: user,
		folder:car,
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => cartelle=json) //
.then(ciro => console.log(ciro))

create(car)
console.log(car)
location.reload();
	}
	function removefolder() {
		if(name=="/"){
		alert("Non puoi eliminare la cartella principale");
		}else{
		
		var host = location.protocol + '//' + location.hostname;
    fetch("http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/deletefolder", {
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
.then(json => cartelle=json)
.then(ciro => console.log(ciro))

location.reload()
}
	}
	onMount(async () => {
	console.log(name)
			create(name)
	});
function sub() {
	alert("Caricamento in corso, attendere")
}
</script>

<svelte:head>
	<title>Home</title>
	<link rel="stylesheet" type="text/css" href="/start.css">
</svelte:head>
<Menu/>
<h1 class="tit">&nbsp;&nbsp;HOME</h1>
<div><img id="cartest" class="icone"	 src="./IMG-1783-removebg-preview.png" width="32" on:click|preventDefault={event => neu(event.path[0].id)}/>
</div><!--crea cartella-->
<div>
<img class="icone" id="cartest" src="./IMG-1783-removebg-preview.png" width="32" on:click={removefolder}/>
</div><!--rimuovi cartella-->

<div id="cartelle">
</div>
{#each cartelle as file}
<p>{file}</p>
{/each}
<form ref='uploadForm'
      id='uploadForm'
      action='http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/upload'
      method='post'
      encType="multipart/form-data"
	  on:submit={sub}>
      <input type="file" class="file" name="sampleFile" />
		<input type="hidden" name="user" value={user} /><br>
		<input type='submit' value='Upload!' />
    </form>
<style global>
	@import 'filepond/dist/filepond.css';
@import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

</style>
