"use strict";

const get_carte_title = function (carte) {
	switch (carte.numero) {
		case 22:
			return "Carte +2";
		case 44:
			return "Carte +4";
		case 88:
			return "Changement de couleur";
		case 666:
			return "UENO (Bloquer le tour)";
		case 777:
			return "NAGATSUKA (Moins 2 cartes)";
		case 999:
			return "ICHIDA (Changement de sens)";
		default:
			return "Carte normale";
	}
}

module.exports = get_carte_title;
