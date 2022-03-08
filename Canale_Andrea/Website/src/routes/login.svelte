<link rel="stylesheet" type="text/css" href="login.css">
<link rel="stylesheet" type="text/css" href="start.css">
<div class="Blog" id="login" >
  <h1>PAGINA DI LOGIN</h1>
    <div class="accesso">
      <input bind:value={user} placeholder="Inserisci la tua email"/> 
      <input type="password" bind:value={pass} placeholder="Inserisci la tua password"/>
      <input type="password" bind:value={pass2} class="accesso2" hidden="{nascosto}" placeholder="Conferma la tua password" />
      <br>
    </div>
    <button type="button" class="acce" on:click={funzione} >
        {logtext}
    </button>
    <button type="button" id="reg" class="regi" on:click={reg}>
      Registrati
    </button>
</div>





  <script>
    function reg(){
      window.location.href="/registrati"
    }
    function area(stato) {
      if(stato==1){
        window.location.href="/area"
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
    
      async function doPost () {
        var host = location.protocol + '//' + location.hostname;
      fetch(host+ ":3001/login", {
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
  .then(json => area(json.status))
      }

  
  </script>