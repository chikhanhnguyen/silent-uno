"use strict";

const changer_le_tour = function (partie, equipe) {
	let equipe_inactive; // l'equipe qui doit être inactive dans le prochain tour

	if (equipe !== "") {
		equipe_inactive = equipe;
	} else {
		equipe_inactive = partie.equipe_active;
	}

	if (equipe_inactive === "bleu") {
		partie.equipe_active = "rouge";
	} else {
		partie.equipe_active = "bleu";
	}

	// mettre à jour le starting time
	partie.equipeActiveStartingTime = new Date().toString();
}

module.exports = changer_le_tour;
