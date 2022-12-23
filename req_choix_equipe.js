"use strict";

const fs = require("fs");

const commencer_jeu = require("./fct_commencer_jeu.js");
const req_chat = require("./req_chat.js");

const choixEquipe  = function (req, res, query) {
	let commencerJeu = false;

	let marqueurs = {};
    let page;
	let contenuFichier;
	let listeAttente;

	const maxJoueurParEquipe = 2;  
	const eBleu = 'bleu'; 
	const eRouge = 'rouge'; 
	//
	contenuFichier = fs.readFileSync('attente.json', 'utf-8');
	listeAttente = JSON.parse(contenuFichier);

	// Etape 1: CHERCHE SI LE JOUEUR EST DEJA EN ATTENTE
    let trouve = false;
    let j = 0;
    while (j < listeAttente.length && trouve === false) {
        if (listeAttente[j].pseudo === query.pseudo) {
            trouve = true;
        }
        j++;
    }

	let monIndice = j - 1; 

	if (trouve === false) {
		marqueurs.erreur = "ERREUR : VOUS N'ETES PAS DANS LA LISTE DES JOUEURS ACTUELS !";
		marqueurs.pseudo = query.pseudo;	
		page = fs.readFileSync('modele_erreur.html', 'utf-8');
		page = page.supplant(marqueurs);
	} else {
		// Etape 2: setter l'equipe du joueur
		let monEquipe;

		let nbRouge = 0;
		let nbBleu = 0;

		// Etape 2.1: verifie nombre de joueurs de chaque equipe 
		let i;
		for (i = 0; i < listeAttente.length; i++)
		{
			if (listeAttente[i].equipe == eBleu)
			{
				nbBleu += 1;
			} else if (listeAttente[i].equipe == eRouge) {
				nbRouge += 1;
			}	
		}

		if (!listeAttente[monIndice].equipe) // chua chon equipe
		{
			if (nbBleu >= maxJoueurParEquipe) {
				monEquipe = eRouge;
			} else if (nbRouge >= maxJoueurParEquipe) {
				monEquipe = eBleu;
			} else {
				monEquipe = query.equipe;
			}

			// update attente.json
			listeAttente[monIndice].equipe = monEquipe;
			contenuFichier = JSON.stringify(listeAttente);
			fs.writeFileSync("attente.json", contenuFichier, 'utf-8');
		} else if (query.equipe) { // da chon equipe va chon lai them lan nua
			monEquipe = listeAttente[monIndice].equipe;
			if (query.equipe != monEquipe)
			{
				if (query.equipe == eBleu  && nbBleu < maxJoueurParEquipe) {
					monEquipe = query.equipe;
				} else if (query.equipe == eRouge && nbRouge < maxJoueurParEquipe) {
					monEquipe = query.equipe;
				}
			}

			// update attente.json
			listeAttente[monIndice].equipe = monEquipe;
			contenuFichier = JSON.stringify(listeAttente);
			fs.writeFileSync("attente.json", contenuFichier, 'utf-8');
		}

		// Etape 3: change/update html
		page = fs.readFileSync('modele_choix_equipe.html', 'utf-8');
		
		marqueurs.pseudo = query.pseudo;

		marqueurs['rougeJoueur1'] = "";
		marqueurs['rougeJoueur2'] = "";
		marqueurs['bleuJoueur1'] = "";
		marqueurs['bleuJoueur2'] = "";

		let k;
		let indiceBleu = 1;
		let indiceRouge = 1;
		for (k = 0; k < listeAttente.length; k++)
		{
			let joueur = listeAttente[k];
			if (joueur.equipe == eRouge)
			{
				marqueurs[eRouge + 'Joueur' + String(indiceRouge)] = joueur.pseudo;
				indiceRouge += 1;
			} else if (joueur.equipe == eBleu)
			{
				marqueurs[eBleu + 'Joueur' + String(indiceBleu)] = joueur.pseudo;
				indiceBleu += 1;
			}
		}

		if (indiceBleu > maxJoueurParEquipe && indiceRouge > maxJoueurParEquipe) {
			commencerJeu = true;
		}

		page = page.supplant(marqueurs);
	}

	if (commencerJeu) {
		commencer_jeu(listeAttente, query.pseudo);
		// attendre 3s pour distribuer les cartes
		setTimeout(function() {req_chat(req, res, query);}, 3000);
	} else {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write(page);
		res.end();
	}
};

module.exports = choixEquipe;
