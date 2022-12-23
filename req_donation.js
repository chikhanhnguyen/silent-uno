"use strict";
  
const fs = require("fs");

const donation  = function (req, res, query) {

    let marqueurs;
    let page;
	let listeDonateurs;
	let contenu_fichier;
	let nomDonateurs = [];

	const maxDonateurs = 10;

    page = fs.readFileSync('modele_donation.html', 'utf-8');
	marqueurs = {};
	marqueurs.erreur = "";
	marqueurs.pseudo = query.pseudo;
	
	contenu_fichier = fs.readFileSync("data/donateurs.json", 'utf-8');
    listeDonateurs = JSON.parse(contenu_fichier);
	
	let i;

	for (i=0; i< Math.min(maxDonateurs, listeDonateurs.length); i++) {
		nomDonateurs.push("<li/>" + listeDonateurs[i].pseudo)
	}
    
	marqueurs.donateurs = "<ul/>" + nomDonateurs.join("");
	
	page = page.supplant(marqueurs);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = donation;

