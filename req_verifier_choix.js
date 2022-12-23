"use strict";

const fs = require("fs");

const afficher_table = require("./fct_afficher_table.js");
const check_carte = require("./fct_check_carte.js");
const tirer_une_carte = require("./fct_tirer_une_carte.js");
const changer_le_tour = require("./fct_changer_le_tour.js");

const choix_dossier = "partie/choix_equipe_active/";

const verifier_choix = function (req, res, query) {
	let page;
	let contenu;
	let partie;
    
	// ETAPE 1: lire partie.json
    contenu = fs.readFileSync("partie/partie.json", "utf-8");
    partie = JSON.parse(contenu);
	let pseudo = query.pseudo;
	let equipe = partie.joueurs[pseudo];
	let position_choisie_carte = "";
	let message = "";
	
	if (equipe === partie.equipe_active) {
		// ETAPE 2: verifier si les 2 joueurs ont choisi leur carte
		let jsonFiles = fs.readdirSync(choix_dossier);

		if (jsonFiles.length < 2) {
			page = fs.readFileSync('modele_choix_carte.html', 'utf-8');
			message = "Veuillez attendre le choix de votre co-equipier";
			position_choisie_carte = query.position_carte;
		} else {
			// verifier si les 2 choix sont identique et que la carte choisie et soit le meme nombre soit la meme couleur
			let choix_joueur_1 = fs.readFileSync(choix_dossier + jsonFiles[0], "utf-8");
			let choix_joueur_2 = fs.readFileSync(choix_dossier + jsonFiles[1], "utf-8");

			if (choix_joueur_1 === choix_joueur_2) {
				if (choix_joueur_1 === "tirer") {
					if (partie.recommencer) {
						partie[equipe].cartes.push(tirer_une_carte(partie));
					} else {
						// verifier la carte actuelle sur le plateau
						let carte_plateau = partie.cartes_sur_plateau[partie.cartes_sur_plateau.length - 1];
						switch (carte_plateau.numero) {
							case 22: // si la carte sur le plateau est "+2"
								partie[equipe].cartes.push(tirer_une_carte(partie));
								partie[equipe].cartes.push(tirer_une_carte(partie));
								// recommencer
								partie.recommencer = true;
								break;
							case 44: // si la carte sur le plateau est "+4"
								partie[equipe].cartes.push(tirer_une_carte(partie));
								partie[equipe].cartes.push(tirer_une_carte(partie));
								partie[equipe].cartes.push(tirer_une_carte(partie));
								partie[equipe].cartes.push(tirer_une_carte(partie));
								// recommencer
								partie.recommencer = true;
								break;
							default:
								partie[equipe].cartes.push(tirer_une_carte(partie));
								break;
						}
					}
				} else {
					let position_carte = Number(choix_joueur_1);
					let position_carte_sur_plateau = partie.cartes_sur_plateau.length;
					
					let carte_a_poser = partie[equipe].cartes[position_carte];
					let carte_sur_plateau = partie.cartes_sur_plateau[position_carte_sur_plateau - 1];

					if (check_carte(carte_a_poser, carte_sur_plateau, partie.recommencer)) {
						partie[equipe].cartes.splice(position_carte, 1);
						partie.cartes_sur_plateau.push(carte_a_poser);
					}
					partie.recommencer = false;
				}
				//
				message = "Vous et votre co-equipier avez fait le meme choix."
			} else {
				// verifier la carte actuelle sur le plateau
				let carte_plateau = partie.cartes_sur_plateau[partie.cartes_sur_plateau.length - 1];
				switch (carte_plateau.numero) {
					case 22: // si la carte sur le plateau est "+2"
						partie[equipe].cartes.push(tirer_une_carte(partie));
						partie[equipe].cartes.push(tirer_une_carte(partie));
						// recommencer
						partie.recommencer = true;
						break;
					case 44: // si la carte sur le plateau est "+4"
						partie[equipe].cartes.push(tirer_une_carte(partie));
						partie[equipe].cartes.push(tirer_une_carte(partie));
						partie[equipe].cartes.push(tirer_une_carte(partie));
						partie[equipe].cartes.push(tirer_une_carte(partie));
						// recommencer
						partie.recommencer = true;
						break;
					default:
						message = "Vous et votre co-equipier n'avez pas fait le meme choix. Votre tour est passe."
						break;
				}
			}
			// changer le tour
			changer_le_tour(partie, equipe);

			// supprimer les 2 fichiers de choix
			let i;
			for (i = 0; i < jsonFiles.length; i++) {
				fs.unlinkSync(choix_dossier + jsonFiles[i]);
			}

			// mettre à jour le fichier partie.json
			partie.message_derniere_equipe = message;
			fs.writeFileSync("partie/partie.json", JSON.stringify(partie), "utf-8");
			page = fs.readFileSync('modele_jeu_passif.html', 'utf-8');
		}
	} else {
		page = fs.readFileSync('modele_jeu_passif.html', 'utf-8');
		if (partie.message_derniere_equipe) {
			message = partie.message_derniere_equipe;
		}
	}

	// ETAPE 3: afficher table
	let marqueurs = afficher_table(partie, pseudo, equipe, query.position_carte);
	marqueurs.pseudo = pseudo;
	marqueurs.passer_le_tour = "";
	marqueurs.message = message;
	marqueurs.position_carte = position_choisie_carte;

	page = page.supplant(marqueurs);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
}

module.exports = verifier_choix;
