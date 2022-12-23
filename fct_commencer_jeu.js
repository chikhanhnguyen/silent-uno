"use strict";

const fs = require("fs");
const distribuer_cartes = require("./fct_distribuer_cartes");

const commencer_jeu = function (liste_attente, pseudo) {
    if (liste_attente[0].pseudo === pseudo) {
        distribuer_cartes();
    }
}

module.exports = commencer_jeu;
