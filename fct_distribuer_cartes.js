"use strict";

const fs = require("fs");
const shuffle = require("./fct_shuffle_array.js");

const nb_cartes_chaque_equipe = 6;

const distribuer_cartes = function () {
	let toutesCartes;
	let listeAttente;
    let joueurs = {};
	let partie = {};
	let contenu;

	contenu = fs.readFileSync("data/toutes_les_cartes.json", "utf-8");
	toutesCartes = JSON.parse(contenu);

    contenu = fs.readFileSync("attente.json", "utf-8");
	listeAttente = JSON.parse(contenu);
    
    // ETAPE 1: ajouter joueurs
	let i;
	let actionJoueurBleu;
	let actionJoueurRouge;
    for (i = 0; i < listeAttente.length; i++) {
		joueurs[listeAttente[i].pseudo] = listeAttente[i].equipe;
		if (listeAttente[i].equipe === "bleu") {
			actionJoueurBleu = listeAttente[i].pseudo;
		} else {
			actionJoueurRouge = listeAttente[i].pseudo;
		}
    }

	// ETAPE 2: melanger les cartes
	shuffle(toutesCartes);

	// ETAPE 3: distribuer les cartes à 2 équipes
	let bleuCartes = [];
    let rougeCartes = [];
	for (i=0; i < nb_cartes_chaque_equipe; i++) {
		bleuCartes.push(toutesCartes[0]);
		rougeCartes.push(toutesCartes[1]);
		toutesCartes.splice(0, 2);
	}

    partie.joueurs = joueurs;
	partie.equipe_active = "bleu";
	partie.bleu = {};
	partie.rouge = {};
	partie.bleu.cartes = bleuCartes;
	partie.bleu.action_joueur = actionJoueurBleu;
	partie.rouge.cartes = rougeCartes;
	partie.rouge.action_joueur = actionJoueurRouge;

	partie.cartes_sur_plateau = [toutesCartes[0]];
	toutesCartes.splice(0, 1);
	partie.cartes_a_tirer = toutesCartes;

	//
	partie.recommencer = false;
	
	contenu = JSON.stringify(partie);
	fs.writeFileSync("partie/partie.json", contenu, "utf-8");

	///////////////
	// initialiser chat box
	let chatInfo = {};
	chatInfo.startingTime = new Date().toString();
	fs.writeFileSync("partie/chat_info.json", JSON.stringify(chatInfo), "utf-8");
	fs.writeFileSync("partie/chat_bleu.json", "[]", "utf-8");
	fs.writeFileSync("partie/chat_rouge.json", "[]", "utf-8");
	///////////////
}

module.exports = distribuer_cartes;
