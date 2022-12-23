"use strict";
  
const fs = require("fs");

const donner  = function (req, res, query) {
    let page;
	let contenu_fichier;
	let marqueurs;
	let listeDonateurs;

    page = fs.readFileSync('modele_donner.html', 'utf-8');
	contenu_fichier = fs.readFileSync("data/donateurs.json", 'utf-8');
	listeDonateurs = JSON.parse(contenu_fichier);
	
	let donateurActuel = {"pseudo": query.pseudo, "montant": query.montant};

	if (query.anonyme === "true") {
		donateurActuel.pseudo = "Anonyme";
	}

	if (query.montant === "autre") {
		donateurActuel.montant = query.montantAutre;
	}

	listeDonateurs.splice(0, 0, donateurActuel);
	
	contenu_fichier = JSON.stringify(listeDonateurs);
	
	fs.writeFileSync("data/donateurs.json", contenu_fichier, 'utf-8');
	
	marqueurs = {};
	marqueurs.pseudo = query.pseudo;
   	page = page.supplant(marqueurs);	

	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = donner;

