"use strict";

const fs = require("fs");

const choisir_carte = function (pseudo, position_carte) {
	fs.writeFileSync(`partie/choix_equipe_active/${pseudo}.json`, position_carte, "utf-8");
}


module.exports = choisir_carte;

