<script>
	import Menu from './Menu.svelte';
	import MenuOption from './MenuOption.svelte';
	import MenuDivider from './MenuDivider.svelte';
	import { tick } from 'svelte'
	
	import Icon from './Icon.svelte'
	
	let pos = { x: 0, y: 0 };
	let showMenu = false;
	
	async function onRightClick(e) {
		if (showMenu) {
			showMenu = false;
			await new Promise(res => setTimeout(res, 100));
		}
		
		pos = { x: e.clientX, y: e.clientY };
		showMenu = true;
	}
	
	function closeMenu() {
		showMenu = false;
	}
	import { onMount } from "svelte";
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
create('/'+nome)
	}
	function removefolder() {
		
		var host = location.protocol + '//' + location.hostname;
    fetch(host+ ":3001/deletefolder", {
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

{#if showMenu}
	<Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
		<MenuOption 
			on:click={event => neu(name)} 
			text="Crea cartella" />
		<MenuOption 
			on:click={removefolder} 
			text="Rimuovi cartella" />
	</Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />