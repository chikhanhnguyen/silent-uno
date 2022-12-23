"use strict";

const revenir_carte_plateau = function (partie) {
	let length = partie.cartes_sur_plateau.length;
	if (length >= 2) {
		let temporaryValue = partie.cartes_sur_plateau[length - 1];
		partie.cartes_sur_plateau[length - 1] = partie.cartes_sur_plateau[length - 2];
		partie.cartes_sur_plateau[length - 2] = temporaryValue;
	} else {
		partie.cartes_sur_plateau.push(partie.cartes_a_tirer[0]);
		partie.cartes_a_tirer.splice(0, 1);
	}
}

module.exports = revenir_carte_plateau;
