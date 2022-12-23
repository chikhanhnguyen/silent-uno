"use strict";
  
const fs = require("fs");
require('remedial');

const trait = function (req, res, query) {

    let marqueurs;
    let page;

    // AFFICHAGE DE LA modele_formulaire_inscription

    page = fs.readFileSync('modele_accueil.html', 'utf-8');

    marqueurs = {};
    marqueurs.erreur = "";
    marqueurs.pseudo = "";
    page = page.supplant(marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

//--------------------------------------------------------------------------

module.exports = trait;
