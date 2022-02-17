<script>
  import { Router, Route, Link } from "svelte-navigator";
  export let loginRoute;
  let user = ''
	let pass = ''
  let pass2=''
	let result = null
  let registra=""
  let nascosto="hidden"
  let logtext="Login"
  let regnas=""
  let funzione=doPost
  function registrapage(){
    nascosto=""
    logtext="Registrati"
    funzione=regpost
    regnas="hidden"
  }
	async function doPost () {
    var host = location.protocol + '//' + location.hostname;
    alert(host)
    fetch(host+ ":3000/login", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        username: user,
        password: pass
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => console.log('Response', json))
	}
async function regpost () {
  var host =location.protocol + '//' + location.hostname;
  if(pass==pass2){
    fetch(host+":3000/register", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        username: user,
        password: pass
      })),
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
})
.then(response => response.json())
.then(json => console.log('Response', json))
}else{
  alert("Le password non corrispondono")
}
}
</script>
<div class="Blog" id="login">
<input bind:value={user} placeholder="Inserisci la tua email"/>
<input bind:value={pass} placeholder="Inserisci la tua password"/>
<input bind:value={pass2} hidden="{nascosto}" placeholder="Conferma la tua password" />
<button type="button" on:click={funzione} >
	{logtext}
</button>
<button type="button" on:click={registrapage} hidden="{regnas}">
  Registrati
</button>
</div>
<style>
  
</style>

