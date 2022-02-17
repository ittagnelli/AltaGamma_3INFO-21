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
<div id="piani" hidden={nascosto}>
  <form action="">
    <p>Seleziona il piano che vuoi acquistare</p>
    <input type="radio" id="100"  name="size" value="size">
    <label for="html">100GB | 0,99&euro; al mese/  9,99&euro; all'anno</label><br>
    <input type="radio" id="500"  name="size" value="size">
    <label for="css">500GB | 4,99&euro; al mese / 51.99&euro; all'anno</label><br>
    <input type="radio" id="1000"  name="size" value="size">
    <label for="javascript">1TB | 6,99&euro; al mese / 79,99&euro; all'anno</label>
    <input type="radio" id="2000"  name="size" value="size">
    <label for="javascript">2TB | 8,99&euro; al mese / 92,99&euro; all'anno</label>
  </form>
  <form action="">
    <p>Seleziona il tipo di pagamento</p>
    <input type="radio" id="anno"  name="pag" value="pag">
    <label for="html">Pagamento annuale</label><br>
    <input type="radio" id="mese"  name="pag" value="pag">
    <label for="css">Pagamento mensile</label><br>
  </form>
  <form action="">
    <p>Seleziona il metodo di pagamento</p>
    <input type="radio" id="cc"  name="met" value="met">
    <label for="html">Carta di credito</label><br>
    <input type="radio" id="paypal"  name="met" value="met">
    <label for="css">PayPal</label><br>
    <input type="radio" id="crypto"  name="met" value="met">
    <label for="css">Crypto</label><br>
    <input type="radio" id="bonifico"  name="met" value="met">
    <label for="css">Bonifico bancario</label><br>
  </form>
</div>
<style>

</style>

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
  let pianosel=[]
  let pag=""
  let funzione=doPost
  function registrapage(){
    nascosto=""
    logtext="Registrati"
    funzione=regpost
    regnas="hidden"
  }
	async function doPost () {
    var host = location.protocol + '//' + location.hostname;
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
  if(document.getElementById("100").checked==true){
    pianosel.push("100GB")
  }else if(document.getElementById("500").checked==true){
    pianosel.push("500GB")
  }else if(document.getElementById("1000").checked==true){
    pianosel.push("1000GB")
  }else if(document.getElementById("2000").checked==true){
    pianosel.push("2000GB")
  }
  if(document.getElementById("anno").checked==true){
    pianosel.push("anno")
  }else if(document.getElementById("mese").checked==true){
    pianosel.push("mese")
  }
  if(document.getElementById("cc").checked==true){
    pianosel.push("CC")
  }else if(document.getElementById("paypal").checked==true){
    pianosel.push("paypal")
  }else if(document.getElementById("crypto").checked==true){
    pianosel.push("crypto")
  }else if(document.getElementById("bonifico").checked==true){
    pianosel.push("bonifico")
  }
  if(pass==pass2){
    fetch(host+":3000/register", {
      method: 'post', // Default is 'get'
      body: (JSON.stringify({
        username: user,
        password: pass,
        piano:pianosel[0],
        pag:pianosel[1],
        met:pianosel[2]
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