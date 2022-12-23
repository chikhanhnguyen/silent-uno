"use strict";
  
const fs = require("fs");
require('remedial');

const trait = function (req, res, query) {

    let marqueurs;
    let page;
	let contenu_fichier;
	let listeAttente = [];
	let i;
	
	//Part 1 : Supprimer le joueur de la liste d'attente

	//Lis le fichier attente.json
	contenu_fichier = fs.readFileSync("attente.json", 'utf-8');

	listeAttente = JSON.parse(contenu_fichier);
	
	for(i = 0; i < listeAttente.length; i++) {
		if (listeAttente[i].pseudo === query.pseudo) {
			listeAttente.splice(i, 1);
		}
	}
	
	contenu_fichier = JSON.stringify(listeAttente);
	
	fs.writeFileSync("attente.json", contenu_fichier, 'utf-8');
	
	//Part 2 : On réaffiche la page accueil membre
 	
	//Lis le fichier 
    page = fs.readFileSync('modele_accueil_membre.html', 'utf-8');
	
    marqueurs = {};

	marqueurs.pseudo = query.pseudo;
    page = page.supplant(marqueurs);
	
	//Affiche la page sur le nav
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = trait;
