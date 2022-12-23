"use strict";

const check_carte = function (carte, carte_plateau, recommencer) {
	if (recommencer) {
		switch (carte_plateau.numero) {
			case 22: // si la carte sur le plateau est "+2"
				if (carte.numero === carte_plateau.numero ||
					carte.couleur === carte_plateau.couleur ||
					carte.numero >= 44) {
					return true;
				}
				return false;
			default:
				return true;
		}
	}

	switch (carte_plateau.numero) {
		case 22: // si la carte sur le plateau est "+2"
			if (carte.numero === 22) {
				return true;
			}
			return false;
		case 44: // si la carte sur le plateau est "+4"
			if (carte.numero === 44) {
				return true;
			}
			return false;
		case 88:
		case 666:
		case 999:
		case 777:
			return false;
		default:
			if (carte.numero === carte_plateau.numero ||
				carte.couleur === carte_plateau.couleur ||
				carte.numero >= 44) {
				return true;
			}
			return false;
	}
}

module.exports = check_carte;
