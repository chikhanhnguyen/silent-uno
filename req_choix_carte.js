"use strict";
  
const fs = require("fs");

const choisir_carte = require("./fct_choisir_carte.js");
const afficher_table = require("./fct_afficher_table.js");

const choix_carte = function (req, res, query) {
    let page;
	
    let pseudo = query.pseudo;
    let position_choisie_carte = query.position_carte;
	// ETAPE 1: écrire le choix de ce joueur dans "partie/choix_equipe_active/pseudo.json"
	choisir_carte(pseudo, position_choisie_carte);
	
	// ETAPE 2: afficher table
	let partie;
    let contenu;
    contenu = fs.readFileSync("partie/partie.json", "utf-8");
    partie = JSON.parse(contenu);
    let equipe = partie.joueurs[pseudo];
	let marqueurs = afficher_table(partie, pseudo, equipe, position_choisie_carte);

	// ETAPE 3
    page = fs.readFileSync('modele_choix_carte.html', 'utf-8');
    marqueurs.pseudo = pseudo;
    marqueurs.position_carte = position_choisie_carte;

    page = page.supplant(marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = choix_carte;



