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
		car=prompt("Inserire il nome della cartella che si vuole creare:")
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
<div><img id="cartest" class="icone"	 src="./add_folder-removebg-preview.png" width="32" on:click|preventDefault={event => neu(event.path[0].id)}/>
</div><!--crea cartella-->
<div>
<img class="icone" id="cartest" src="./remove_folder-removebg-preview.png" width="32" on:click={removefolder}/>
</div><!--rimuovi cartella-->
<div class="carte">
{#each cartelle as file}
{#if file.split(".")[1] == null}
<img src="folder-removebg-preview.png" class="folderd"/>
<span>{file}</span><br>
{:else}
<a href={"http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/" + user + '/' + file}><img src="file-removebg-preview.png" class="folderd"/></a>
<span>{file}</span><br>
{/if}
{/each}

</div>
<form ref='uploadForm'
      id='uploadForm'
      action='http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/upload'
      method='post'
      encType="multipart/form-data"
	  on:submit={sub}>
      <input type="file" class="file" name="sampleFile" />
		<input type="hidden" name="user" value={user} /><br>
		<input type='submit'class="up" value='Upload files' />
    </form>
<style global>
	@import 'filepond/dist/filepond.css';
@import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

</style>
