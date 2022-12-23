"use strict";

const fs = require("fs");
require("remedial");

const afficher_table = require("./fct_afficher_table.js");
const choisir_carte = require("./fct_choisir_carte.js");
const changer_le_tour = require("./fct_changer_le_tour.js");
const get_carte_title = require("./fct_get_carte_title.js");
const revenir_carte_plateau = require("./fct_revenir_carte_plateau.js");

const maxTempsActif = 20000; // (en millisecondes)

const en_jeu = function (req, res, query) {
    let page;
	let partie;
	let contenu;
    let marqueurs;

	contenu = fs.readFileSync("partie/partie.json", "utf-8");
    partie = JSON.parse(contenu);
    
    let pseudo = query.pseudo;
    let equipe = partie.joueurs[pseudo];
    
    // verifier si une équipe a gagné
    if (partie.bleu.cartes.length === 0 || partie.rouge.cartes.length === 0) {
        marqueurs = {};
        if (partie[equipe].cartes.length === 0) {
            marqueurs.image_fin_jeu = "ressources/win.png";
            marqueurs.message1 = "Congratulation";
            marqueurs.message2 = "! Vous avez gagné !";
        } else {
            marqueurs.image_fin_jeu = "ressources/perdu.png";
            marqueurs.message1 = "Dommage";
            marqueurs.message2 = "! Vous avez perdu !";
        }
        page = fs.readFileSync('modele_fin_jeu.html', 'utf-8');
        // remettre la liste d'attente à vide
        fs.writeFileSync("attente.json", "[]", "utf-8");
        fs.writeFileSync("chat_bleu.json", "[]", "utf-8");
        fs.writeFileSync("chat_rouge.json", "[]", "utf-8");
        fs.writeFileSync("chat_info.json", "{}", "utf-8");
    } else {
        // verifier si c'est son tour
        if (equipe === partie.equipe_active) {
            if (query.passer_le_tour === "true") {
                // changer le tour
                changer_le_tour(partie, "");
                // comme c'est une carte spéciale (passer le tour), on met la clé "recommencer" à true
                partie.recommencer = true;
                // enregistrer la partie
                fs.writeFileSync('partie/partie.json', JSON.stringify(partie), 'utf-8');
                // page html
                marqueurs = afficher_table(partie, pseudo, equipe, "");
                page = fs.readFileSync('modele_jeu_passif.html', 'utf-8');
                marqueurs.message = "Veuillez attendre votre tour ...";
                marqueurs.passer_le_tour = "";
            } else {
                let carte_sur_plateau = partie.cartes_sur_plateau[partie.cartes_sur_plateau.length - 1];
                // si c'est une carte passer le tour
                // ici j'ai supposé que toutes les cartes spéciales (cad que numero >= 88) sont la carte de passer le tour
                // TODO: il faut qu'on prenne en compte les cartes changement de couleur, gold, ...
                if (carte_sur_plateau.numero >= 88 && !partie.recommencer) {
                    marqueurs = afficher_table(partie, pseudo, equipe, "passer_le_tour");
                    page = fs.readFileSync('modele_jeu_passif.html', 'utf-8');
                    marqueurs.message = `OUPS. Competiteur a pose une carte "${get_carte_title(carte_sur_plateau)}".`;
                    marqueurs.passer_le_tour = "&passer_le_tour=true";
                } else if (carte_sur_plateau.numero === 777 && partie.recommencer) {
                    marqueurs = afficher_table(partie, pseudo, equipe, "gold_carte");
                    if (pseudo === partie[equipe].action_joueur) {
                        partie.recommencer = false;
                        let nbCarteAJeter = Math.min(partie[equipe].cartes.length, 2);
                        partie[equipe].cartes.splice(0, nbCarteAJeter);
                        //
                        revenir_carte_plateau(partie);
                        changer_le_tour(partie, equipe);
                        // enregistrer la partie
                        fs.writeFileSync('partie/partie.json', JSON.stringify(partie), 'utf-8');
                    }
                    page = fs.readFileSync('modele_jeu_passif.html', 'utf-8');
                    marqueurs.message = "Veuillez attendre votre tour ...";
                    marqueurs.passer_le_tour = "";
                } else {
                    let now = new Date();
                    if (partie.equipeActiveStartingTime) {
                        let startingTime = new Date(partie.equipeActiveStartingTime).getTime();
                        if (now.getTime() > startingTime + maxTempsActif) {
                            // par défault, si le temps actif est passé, on considère que le joueur a choisi
                            // de tirer une nouvelle carte
                            let position_choisie_carte = "tirer";
                            choisir_carte(pseudo, position_choisie_carte);
                            marqueurs = afficher_table(partie, pseudo, equipe, position_choisie_carte);
                            marqueurs.position_carte = position_choisie_carte;
                            page = fs.readFileSync('modele_choix_carte.html', 'utf-8');
                        } else {
                            marqueurs = afficher_table(partie, pseudo, equipe, "");
                            page = fs.readFileSync('modele_jeu_actif.html', 'utf-8');
                            marqueurs.tempsReste = String(Math.round((startingTime + maxTempsActif - now.getTime()) / 1000));
                        }
                    } else {
                        marqueurs = afficher_table(partie, pseudo, equipe, "");
                        partie.equipeActiveStartingTime = now.toString();
                        marqueurs.tempsReste = String(Math.round(maxTempsActif / 1000));
                        // enregistrer la partie
                        fs.writeFileSync('partie/partie.json', JSON.stringify(partie), 'utf-8');
                        //
                        page = fs.readFileSync('modele_jeu_actif.html', 'utf-8');
                    }
                }
            }
        } else {
            page = fs.readFileSync('modele_jeu_passif.html', 'utf-8');
            marqueurs = afficher_table(partie, pseudo, equipe, "");
            marqueurs.message = "Veuillez attendre votre tour ...";
            marqueurs.passer_le_tour = "";
        }
    }
    
    // afficher
    marqueurs.pseudo = pseudo;
    page = page.supplant(marqueurs);

	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
}

module.exports = en_jeu;
