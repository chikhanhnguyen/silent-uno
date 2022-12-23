"use strict";

const shuffle = require("./fct_shuffle_array.js");

const tirer_une_carte = function (partie) {
	let carte;
	if (partie.cartes_a_tirer.length > 0) {
		carte = partie.cartes_a_tirer[0];
		partie.cartes_a_tirer.splice(0, 1);
	} else {
		// TODO: s'il y a pas assez de carte à tirer ? re-prendre les cartes sur le plateau ?
		let length = partie.cartes_sur_plateau.length;
		if (length >= 3) {
			let i;
			for (i = 0; i < length - 2; i++) {
				partie.cartes_a_tirer.push(partie.cartes_sur_plateau[i]);
			}
			partie.cartes_sur_plateau.splice(0, length - 2);
			shuffle(partie.cartes_a_tirer)
		}
		//
		carte = partie.cartes_a_tirer[0];
		partie.cartes_a_tirer.splice(0, 1);
	}

	return carte;
}

module.exports = tirer_une_carte;
