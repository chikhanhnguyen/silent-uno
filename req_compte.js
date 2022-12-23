"use strict";

const fs = require("fs");

const trait = function (req, res, query) {

	let marqueurs;
	let page;
	let contenu_fichier;
	let listeMembres;
	let i,j;
	let trouve;

	contenu_fichier = fs.readFileSync("./data/membres.json", 'utf-8');
	listeMembres = JSON.parse(contenu_fichier);

	trouve = false;
	i = 0;
	while (i < listeMembres.length && trouve === false) {
    	if (listeMembres[i].pseudo === query.pseudo) {
        	if (listeMembres[i].password === query.ancien_mdp) {
            	trouve = true;
            }
        }
        i++;
    }
	
	if(trouve === false) {
		page = fs.readFileSync('modele_compte.html', 'utf-8');

		marqueurs = {};
		marqueurs.erreur = "ERREUR : Ancien mot de passe incorrect !";
		marqueurs.pseudo = query.pseudo;
		page = page.supplant(marqueurs);
	} else {
		page = fs.readFileSync('modele_compte.html', 'utf-8');
		
		marqueurs = {};
		marqueurs.erreur = "";
		marqueurs.pseudo = query.pseudo;
		page = page.supplant(marqueurs);

		if(query.new_mdp === query.confirm_mdp) {
			
			listeMembres[i-1].password = query.confirm_mdp;
			contenu_fichier = JSON.stringify(listeMembres);

			fs.writeFileSync("./data/membres.json", contenu_fichier, 'utf-8');
			
			page = fs.readFileSync('modele_compte.html', 'utf-8');

			marqueurs = {};
			
			marqueurs.erreur = "Le mot de passe a bien été modifié !";
			marqueurs.pseudo = query.pseudo;
			page = page.supplant(marqueurs);
		
		} else {
			page = fs.readFileSync('modele_compte.html', 'utf-8');

			marqueurs = {};
			marqueurs.erreur = "ERREUR : Le nouveau mot de passe et la confirmation du nouveau mot de passe ne sont pas cohérent !";
			marqueurs.pseudo = query.pseudo;
			page = page.supplant(marqueurs);
		}
	}
	
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
};

//-------------------------------------------------------------------

module.exports = trait;
