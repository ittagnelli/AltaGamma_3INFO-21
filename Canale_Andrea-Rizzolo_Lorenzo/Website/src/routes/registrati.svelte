<link rel="stylesheet" type="text/css" href="login.css">
<link rel="stylesheet" type="text/css" href="start.css">
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> 
<div id="piani" >
    
        <div class="accesso" align="center">
          <input bind:value={user} type="text" class="accesso2" placeholder="Inserisci la tua email"/> 
          <input type="password" bind:value={pass} class="accesso2" placeholder="Inserisci la tua password"/>
          <input type="password" bind:value={pass2} class="accesso2" placeholder="Conferma la tua password" />
          <br>
        </div>
     
    <form action="">
      <p>Seleziona un piano per utenti</p>
      <div class="spazio">
          <input type="radio" id="100"  name="size" value="size">
          <span>100 GB | 0,99&euro<span class="mese">/mese</span> |  9,99&euro<span class="mese">/anno</span></span>
      </div>
      <div class="spazio">
          <input type="radio" id="500"  name="size" value="size">
          <span>500 GB | 4,99&euro<span class="mese">/mese</span> | 51.99&euro<span class="mese">/anno</span></span>
      </div>
      <div class="spazio">
          <input type="radio" id="1000"  name="size" value="size">
          <span>1 TB | 6,99&euro<span class="mese">/mese</span> | 79,99&euro<span class="mese">/anno</span></span>
      </div> 
      <div class="spazio">
          <input type="radio" id="2000"  name="size" value="size">
          <span>2 TB | 8,99&euro<span class="mese">/mese</span> | 92,99&euro<span class="mese">/anno</span></span>
      </div>
      <p>Seleziona un piano Business</p>
      <div class="spazio">
          <input type="radio" id="1"  name="size" value="size">
          <span>1 TB | 6,99&euro<span class="mese">/mese</span> |  49,99&euro<span class="mese">/anno</span></span>
      </div>
      <div class="spazio">
          <input type="radio" id="5"  name="size" value="size">
          <span>5 TB | 19,99&euro<span class="mese">/mese</span> | 179.99&euro<span class="mese">/anno</span></span>
      </div>
      <div class="spazio">
          <input type="radio" id="10"  name="size" value="size">
          <span>10 TB | 39,99&euro<span class="mese">/mese</span> | 439,99&euro<span class="mese">/anno</span></span>
      </div> 
      <div class="spazio">
          <input type="radio" id="10000"  name="size" value="size">
          <span>100 TB | 399,99&euro<span class="mese">/mese</span> | 4799,99&euro<span class="mese">/anno</span></span>
      </div>

  </form>
    <form action="">
      <p>Seleziona il tipo di pagamento</p>
      <div class="spazio">
          <input type="radio" id="anno"  name="pag" value="pag">
          <span>Pagamento annuale</span>
      </div>
      <div class="spazio">
          <input type="radio" id="mese"  name="pag" value="pag">
      <span>Pagamento mensile</span>
      </div>
  </form>
    <form action="">
      <p>Seleziona il metodo di pagamento</p>
      <div class="spazio">
          <input type="radio" id="cc"  name="met" value="met">
      <span>Carta di credito</span>
      </div>
      <div class="spazio">
          <input type="radio" id="paypal"  name="met" value="met">
      <span>PayPal</span>
      </div>
      <div class="spazio">
          <input type="radio" id="crypto"  name="met" value="met">
      <span>Crypto</span>
      </div>
      <div class="spazio">
          <input type="radio" id="bonifico"  name="met" value="met">
      <span>Bonifico bancario</span>
      </div>
    </form>
    <div align="center">
      <button type="button" id="reg" class="regi" on:click={regpost}>
        Conferma la registrazione
      </button>
    </div>
</div>

<script>

    function reg(){
      window.location.href="/registrati"
    }
    function checkr(resp) {
      if(resp.status==0){
        alert("L'account è già esistente")
      }else{
        alert("Registrazione avvennuta con successo")
        window.location.href="/login"
      }
    }
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
      fetch("http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/login", {
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
    }else if(document.getElementById("1").checked==true){
      pianosel.push("1TB")
    }else if(document.getElementById("5").checked==true){
      pianosel.push("5TB")
    }else if(document.getElementById("10").checked==true){
      pianosel.push("10TB")
    }else if(document.getElementById("10000").checked==true){
      pianosel.push("100TB")
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
      console.log(pianosel[0])
      console.log(pianosel[1])
      console.log(pianosel[2])
      fetch("http://ec2-15-160-169-49.eu-south-1.compute.amazonaws.com:3001/register", {
        
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
  .then(json => checkr(json))
  }else{
    alert("Le password non corrispondono")
  }
  }
  
  </script>
