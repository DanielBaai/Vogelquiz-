// vraagA1.js

// Initialiseer quizgegevens als ze nog niet bestaan of als gebruiker van eindpagina komt
if (!localStorage.getItem('quizVogels') || localStorage.getItem('fromEindPage') === 'true') {
    const shuffle = [...vogelGeluiden].sort(() => 0.5 - Math.random());
    const selectie = shuffle.slice(0, 20); // pak 20 unieke vogels
    localStorage.setItem('quizVogels', JSON.stringify(selectie));
    localStorage.setItem('huidigeVraagNummer', 1);
    localStorage.setItem('score', 0);
    localStorage.removeItem('fromEindPage'); // reset vlag
}

// Laad gegevens voor deze vraag
const quizVogels = JSON.parse(localStorage.getItem('quizVogels'));
const huidigeVraagNummer = parseInt(localStorage.getItem('huidigeVraagNummer')) || 1;
const gekozenVogel = quizVogels[huidigeVraagNummer - 1];
const juisteAntwoord = gekozenVogel.naam;

// Kies 3 unieke foute antwoorden
let fouteAntwoorden = [];
while (fouteAntwoorden.length < 3) {
    const random = vogelGeluiden[Math.floor(Math.random() * vogelGeluiden.length)];
    if (random.naam !== juisteAntwoord && !fouteAntwoorden.includes(random.naam)) {
        fouteAntwoorden.push(random.naam);
    }
}

// Combineer juiste en foute antwoorden, en schud ze
const antwoorden = [juisteAntwoord, ...fouteAntwoorden].sort(() => 0.5 - Math.random());

// Audio instellen
document.getElementById('audioSource').src = gekozenVogel.bestand;
document.getElementById('audioPlayer').load();

// Antwoordknoppen vullen
document.getElementById('antwoord1').textContent = antwoorden[0];
document.getElementById('antwoord2').textContent = antwoorden[1];
document.getElementById('antwoord3').textContent = antwoorden[2];
document.getElementById('antwoord4').textContent = antwoorden[3];

// Click handlers
document.getElementById('antwoord1').onclick = () => controleerAntwoord(antwoorden[0]);
document.getElementById('antwoord2').onclick = () => controleerAntwoord(antwoorden[1]);
document.getElementById('antwoord3').onclick = () => controleerAntwoord(antwoorden[2]);
document.getElementById('antwoord4').onclick = () => controleerAntwoord(antwoorden[3]);

function controleerAntwoord(antwoord) {
    const huidigeScore = parseInt(localStorage.getItem('score')) || 0;
    const nieuweScore = antwoord === juisteAntwoord ? huidigeScore + 1 : huidigeScore;
    localStorage.setItem('score', nieuweScore);

    const gekozenVogels = JSON.parse(localStorage.getItem('gekozenVogels')) || [];

    gekozenVogels.push({
        vraagNummer: huidigeVraagNummer,
        audio: gekozenVogel.bestand,
        juisteAntwoord: juisteAntwoord,
        gekozenAntwoord: antwoord
    });

    localStorage.setItem('gekozenVogels', JSON.stringify(gekozenVogels));

    if (antwoord === juisteAntwoord) {
        window.location.href = `goedA.html?vraagNummer=${huidigeVraagNummer}`;
    } else {
        window.location.href = `foutA.html?vraagNummer=${huidigeVraagNummer}`;
    }
}

// Toon score
const score = parseInt(localStorage.getItem('score')) || 0;
document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
