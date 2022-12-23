"use strict";

const check_carte = require("./fct_check_carte.js");

const get_carte_title = require("./fct_get_carte_title.js");

const construire_image_statique = function (hyper_lien, decaler, opacity, title) {
	let width = 8;
	let height = 11;

	if (opacity) {
		return `<img src="${hyper_lien}" style="width: ${width}vmin; height: ${height}vmin; opacity: 0.5;" title="${title}"/>`;
	}

	if (decaler) {
		return `<img src="${hyper_lien}" style="width: ${width}vmin; height: ${height}vmin; transform: translate(0px, -15%);" title="${title}" />`;
	}

	return `<img src="${hyper_lien}" style="width: ${width}vmin; height: ${height}vmin;" title="${title}" />`;
}

const construire_carte_statique = function(carte, decaler, opacity) {
	let numero = carte.numero;
	let couleur = carte.couleur;
	let title = get_carte_title(carte);
	return construire_image_statique(`ressources/cartes/${couleur}/${numero}${couleur}.png`, decaler, opacity, title);
}

const construire_carte_click = function (pseudo, carte, position_carte) {
	let image_statique = construire_carte_statique(carte, false, false);

	let image_click = `<a href="/req_choix_carte?pseudo=${pseudo}&position_carte=${position_carte}"> <div class="gradient-border"> ${image_statique} </div> </a>`;

	return image_click;
}

const afficher_table = function (partie, pseudo, equipe, position_choisie_carte, tous_dos = false) {
	let marqueurs = {};
	let cartes;
	let cartesOpponent;
	let autreEquipe;

	// dernière carte sur le plateau
	let carte_plateau = partie.cartes_sur_plateau[partie.cartes_sur_plateau.length - 1];

	//
	if (equipe === "bleu") {
		autreEquipe = "rouge";
	} else {
		autreEquipe = "bleu";
	}

	cartes = partie[equipe].cartes;
	cartesOpponent = partie[autreEquipe].cartes;
	//
	let i;
	let cartesHtml = [];
	let cartesOpponentHtml = [];
	let image;
	let imageDos = construire_image_statique("ressources/carte_de_dos.png", false, false);
	for (i = 0; i < cartes.length; i++) {
		if (tous_dos) {
			image = imageDos;
		} else {
			if (equipe === partie.equipe_active && position_choisie_carte === "") {
				if (check_carte(cartes[i], carte_plateau, partie.recommencer)) {
					image = construire_carte_click(pseudo, cartes[i], String(i));
				} else {
					image = construire_carte_statique(cartes[i], false, true);
				}
			} else {
				if (equipe === partie.equipe_active && String(i) === position_choisie_carte) {
					image = construire_carte_statique(cartes[i], true, false);
				} else {
					image = construire_carte_statique(cartes[i], false, false);
				}
			}
		}
		cartesHtml.push(image);
	}

	for (i = 0; i < cartesOpponent.length; i++) {
		cartesOpponentHtml.push(imageDos);
	}

	// construire valeurs pour les clés : "joueur1", "joueur2", "joueur3", "joueur4" dans la page html
	marqueurs["joueur1"] = pseudo;
	let index_autre_equipe = 3;
	let joueursEquipes = partie.joueurs;
	for (const joueur in joueursEquipes) {
		if (joueur !== pseudo) {
			if (joueursEquipes[joueur] === equipe) {
				marqueurs["joueur2"] = joueur;
			} else {
				marqueurs["joueur" + String(index_autre_equipe)] = joueur;
				index_autre_equipe += 1;
			}
		}
	}
	//
	marqueurs.equipe = equipe;
	marqueurs.autre_equipe = autreEquipe;
	marqueurs.cartes = cartesHtml.join(" ");
	marqueurs.cartes_opponent = cartesOpponentHtml.join(" ");
	if (tous_dos) {
		marqueurs.cartes_sur_plateau = imageDos;
	} else {
		marqueurs.cartes_sur_plateau = construire_carte_statique(carte_plateau, false, false);
	}

	if (equipe === partie.equipe_active && position_choisie_carte === "tirer") {
		marqueurs.carte_a_tirer = construire_image_statique("ressources/carte_de_dos.png", true, false);
	} else {
		marqueurs.carte_a_tirer = imageDos;
	}
	
	return marqueurs;
}

module.exports = afficher_table;
