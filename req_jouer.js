"use strict";

const fs = require("fs");
require("remedial");

const trait = function (req, res, query) {

	let page;
	let contenu_fichier;
	let addAttente;
	let listeAttente = [];
	let marqueurs;
	let i,j;
	let compteur;
	let trouve;

	contenu_fichier = fs.readFileSync("attente.json", 'utf-8');
	listeAttente = JSON.parse(contenu_fichier);
	
// CHERCHE SI LE JOUEUR EST DEJA EN ATTENTE
	trouve = false;
    j = 0;
	while (j < listeAttente.length && trouve === false) {
        if (listeAttente[j].pseudo === query.pseudo) {
            trouve = true;
        }
        j++;
	}
	
// SI JOUEUR EST PAS ATTENTE ALORS :
	if(trouve === false) {
		addAttente = {};
		addAttente.pseudo = query.pseudo;
		listeAttente[listeAttente.length] = addAttente;

		contenu_fichier = JSON.stringify(listeAttente);

		fs.writeFileSync("attente.json", contenu_fichier, 'utf-8');
	}
	
	query.nombre = listeAttente.length
	
	if (query.nombre === 4) {
		page = fs.readFileSync('modele_startGame.html', 'utf-8');	
	} else {
		page = fs.readFileSync('modele_attente.html', 'utf-8');
	}
	marqueurs = {};
	marqueurs.pseudo = query.pseudo;
	marqueurs.nombre = query.nombre;

	let k;
	let nomJoueurs = [];

    for (k=0; k < listeAttente.length; k++) {
        nomJoueurs.push("<li/>" + listeAttente[k].pseudo);
    }

    marqueurs.joueurs = "<ul/>" + nomJoueurs.join("");


	page = page.supplant(marqueurs);

	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();

}

module.exports = trait;
