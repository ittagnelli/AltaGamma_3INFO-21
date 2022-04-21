<script>
	import { onMount } from 'svelte';
	import { initializeApp } from 'firebase/app';
	import { getAnalytics } from 'firebase/analytics';
	const firebaseConfig = {
		apiKey: 'AIzaSyBioONyAerrMYuFaJ4ZyPqTLgkaB1yX-f8',
		authDomain: 'thecloud-dfa66.firebaseapp.com',
		projectId: 'thecloud-dfa66',
		storageBucket: 'thecloud-dfa66.appspot.com',
		messagingSenderId: '729172823487',
		appId: '1:729172823487:web:1d2a25f04c1dd0ff59250a',
		measurementId: 'G-VSHZ3EM6T0'
	};
	onMount(() => {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
	});

	import Login from './login.svelte';
</script>

<svelte:head>
	<title>TheCloud.com</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<script src="./particles.js"></script>
	<script src="./app.js"></script>
	<link rel="stylesheet" type="text/css" href="start.css" />
</svelte:head>

<header>
	<nav>
		<ul>
			<li>
				Servizi
				<div class="card1">
					<div class="cardstyle">
						THECLOUD ti permette di creare delle cartelle e di aprirle ovunque, basta creare una
						stanza. &egrave gestibile <br />
						a proprio piacimento, in oltre &egrave protetta dal nome della stanza e da una password.
						<br />
						Dentro si possono aggiungere o trasferire cartelle e file.
					</div>
				</div>
			</li>
			<li>
				Assistenza
				<div class="card2">
					<div class="cardstyle">
						Il nostro servizio di assistenza per qualsiasi problema &egrave aperto h24 tutta la
						settimana.
					</div>
				</div>
			</li>
			<li>
				contatti
				<div class="card3">
					<div class="cardstyle">
						Tel: &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mail:
					</div>
				</div>
			</li>
		</ul>
	</nav>
</header>
<h1 class="piani-title">PIANI DI ABBONAMENTO</h1>
<!--<marquee class="piani_marquee" direction="up" scrolldelay="200">PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIANI</marquee>-->
<div align="center" class="tab">
	<table>
		<thead>
			<script>
				function business() {
					alert(
						"Nell'area Business puoi mettere date di scadenza ai Files,in caso di certificati e allo scadere ci saranno dei messaggi di avviso nell'app. Tutti i prezzi sono esclusi di iva."
					);
				}
				function utenti() {
					alert(
						"Nell'area per Utenti puoi salvare i tuoi file in tutta comodità, condividerli e modificarli a tuo piacimento."
					);
				}
			</script>

			<th>PIANO&nbsp;UTENTI&nbsp;<span class="info"><span onclick="utenti()">INFO</span> </span></th
			><th class="centro" />
			<th
				>PIANO&nbsp;BUSINESS&nbsp;<span class="info"
					><span onclick="business()">INFO</span>
				</span></th
			>
		</thead>
		<tbody>
			<tr>
				<td class="utenti"
					><span class="title-span"
						><span class="spazi">100 GB</span> | 1,49&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;14,99&#8364<span
							class="mese">/anno</span
						></span
					></td
				><td class="centro" />
				<td class="bus"
					><span class="title-span"
						><span class="spazi">1 TB</span> | 5,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;49,99&#8364<span
							class="mese">/anno</span
						></span
					></td
				>
			</tr>
			<tr>
				<td class="utenti"
					><span class="title-span"
						><span class="spazi">300 GB</span> | 2,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;29,99&#8364<span
							class="mese">/anno</span
						></span
					></td
				><td class="centro" />
				<td class="bus"
					><span class="title-span"
						><span class="spazi">3 TB</span> | 14,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;144,99&#8364<span
							class="mese">/anno</span
						></span
					></td
				>
			</tr>
			<tr>
				<td class="utenti"
					><span class="title-span"
						><span class="spazi">500 GB</span> | 4,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;44,99&#8364<span
							class="mese">/anno</span
						>
					</span></td
				><td class="centro" />
				<td class="bus"
					><span class="title-span"
						><span class="spazi">5 TB</span> | 19,99&#8364; <span class="mese">/mese</span>&nbsp;|&nbsp;179,99&#8364<span
							class="mese">/anno</span
						>
					</span></td
				>
			</tr>
			<tr>
				<td class="utenti"
					><span class="title-span"
						><span class="spazi">1 TB</span> | 6,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;69,99&#8364<span
							class="mese">/anno</span
						>
					</span></td
				><td class="centro" />
				<td class="bus"
					><span class="title-span"
						><span class="spazi">10 TB</span> | 39,99&#8364; <span class="mese">/mese</span>&nbsp;|&nbsp;439,99&#8364<span
							class="mese">/anno</span
						>
					</span></td
				>
			</tr>
			<tr>
				<td class="utenti"
					><span class="title-span"
						><span class="spazi">2 TB</span> | 8,99&#8364;<span class="mese">/mese</span>&nbsp;|&nbsp;94,99&#8364<span
							class="mese">/anno</span
						>
					</span></td
				><td class="centro" />
				<td class="bus"
					><span class="title-span"
						><span class="spazi">100 TB</span> | 399,99&#8364; <span class="mese">/mese</span>&nbsp;|&nbsp;4799,99&#8364<span
							class="mese">/anno</span
						>
					</span></td
				>
			</tr>
		</tbody>
	</table>
</div>

<div align="center">
	<div class="testo">
		<p class="det">
			<strong>THECLOUD</strong> si occupa di creare cartelle virtuali, nelle quali ogni utente
			pu&ograve; salvare file o qualsiasi <br /> altro contenuto. Crea le tue cartelle accessibili ovunque,
			in totale sicurezza.
		</p>
	</div>
</div>

<div class="infodue" />

<p align="center" class="tutorial">Video tutorial sul funzionamento del sito</p>

<div align="center">
	<video width="800" height="400" controls>
		<source src="video.mp4" type="video/mp4" />
	</video>
</div>
<footer>
	&copy;TheCloud.com <br>
	Istituto Internazionale Edoardo Agnelli.
</footer>