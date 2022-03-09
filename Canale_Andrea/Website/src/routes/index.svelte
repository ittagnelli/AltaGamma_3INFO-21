<svelte:head>
  <title>THECLOUD.com</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <script src="./particles.js"></script>
  <script src="./app.js"></script>
  <link rel="stylesheet" type="text/css" href="start.css">
  </svelte:head>
  <script>
import { onMount } from 'svelte'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBioONyAerrMYuFaJ4ZyPqTLgkaB1yX-f8",
  authDomain: "thecloud-dfa66.firebaseapp.com",
  projectId: "thecloud-dfa66",
  storageBucket: "thecloud-dfa66.appspot.com",
  messagingSenderId: "729172823487",
  appId: "1:729172823487:web:1d2a25f04c1dd0ff59250a",
  measurementId: "G-VSHZ3EM6T0"
};
onMount(() => {
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
})

    import Login from "./login.svelte";
  </script>
 
<header>
 <nav>
  <ul>
      <li>Servizi
              <div class="card1"> 
                  <div class="cardstyle">
                          THECLOUD ti permette di creare delle cartelle e di aprirle ovunque, basta creare una stanza. &egrave gestibile <br>
                          a proprio piacimento, in oltre &egrave protetta dal nome della stanza e da una password. <br>
                          Dentro si possono aggiungere o trasferire cartelle e file.
                  </div> 
              </div>
      </li>
      <li>Assistenza
          <div class="card2">
              <div class="cardstyle">
                  Il nostro servizio di assistenza per qualsiasi problema &egrave aperto h24 tutta la settimana.
              </div>
          </div>
          
      </li>
      <li>contatti
          <div class="card3">
              <div class="cardstyle">
                  Tel: 
                  &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  mail: 
              </div>
          </div>
      </li>
      
  </ul>
  </nav>
</header>
      <h1 class="piani-title">PIANI DI ABBONAMENTO</h1>
      <div align="center" class="tab">
          <table>
              <thead>
                  <th>PIANO&nbsp;UTENTI&nbsp;<span class="info"><a href="#">INFO</a>
                    <div class="infouno">
                        Nell'area per Utenti puoi salvare i tuoi<br>
                        file in tutta comodità, condividerli e<br>
                        modificarli a tuo piacimento.</div></span></th><th class="centro"></th>
                  <th>PIANO&nbsp;BUSINESS&nbsp;<span class="info" ><a href="#">INFO</a>
                    <div class="infouno">
                        Nell'area Business puoi mettere date di<br>
                        scadenza ai Files,in caso di certificati<br>
                        e allo scadere ci saranno dei messaggi <br>
                        di avviso dall'app.
                    </div></span></th>
              </thead>
              <tbody>
                  <tr>
                      <td class="utenti"><span class="title-span">100 GB | 0,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;9,99&#8364<span class="mese">/anno</span></span></td><td class="centro"></td>
                      <td class="bus"><span class="title-span">1 TB | 5,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;49,99&#8364<span class="mese">/anno</span></span></td>
                  </tr>
                  <tr>
                      <td class="utenti"><span class="title-span">500 GB | 4,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;44,99&#8364<span class="mese">/anno</span> </span></td><td class="centro"></td>
                      <td class="bus"><span class="title-span">5 TB | 19,99&#8364; <span class="mese">/mese</span>&nbsp;|&nbsp;179,99&#8364<span class="mese">/anno</span> </span></td>
                  </tr>
                  <tr>
                      <td class="utenti"><span class="title-span">1 TB | 6,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;79,99&#8364<span class="mese">/anno</span> </span></td><td class="centro"></td>
                      <td class="bus"><span class="title-span">10 TB | 39,99&#8364; <span class="mese">/mese</span>&nbsp;|&nbsp;439,99&#8364<span class="mese">/anno</span> </span></td>
                  </tr>
                  <tr>
                      <td class="utenti"><span class="title-span">2 TB | 8,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;94,99&#8364<span class="mese">/anno</span> </span></td><td class="centro"></td>
                      <td class="bus"><span class="title-span">100 TB | 399,99&#8364; <span class="mese">/mese</span>&nbsp;|&nbsp;4799,99&#8364<span class="mese">/anno</span> </span></td>
                  </tr>
              </tbody>
          </table>
      </div>
      
         
      <div align="center">
          <div class="testo">
              <p class="det"><strong>THECLOUD</strong> si occupa di creare cartelle virtuali, nelle quali ogni utente pu&ograve; salvare file o qualsiasi <br> altro contenuto.
              Crea le tue cartelle accessibili ovunque, in totale sicurezza.</p>    
      </div>
      
      </div>
      
      <div class="infodue">

      </div>

          <p align="center"><img src="img/fine.png" width="800" height="350" ></p>
          
          <p align="center" class="tutorial">Video tutorial sul funzionamento del sito</p>
  
          <div align="center">
              <video width="800" height="400" controls>
                  <source src="video.mp4" type="video/mp4">
              </video>
          </div>
     

 
