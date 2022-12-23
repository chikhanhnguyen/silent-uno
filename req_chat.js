"use strict";
  
const fs = require("fs");

const afficher_table = require("./fct_afficher_table.js");
const ajouter_chat_message = require("./fct_ajouter_chat_message.js");

const req_en_jeu = require("./req_en_jeu.js");

const maxViewTime = 10000; // en millisecondes
const maxChatTime = 30000; // en millisecondes

const chat = function (req, res, query) {
    let page;
	
    let pseudo = query.pseudo;
    let message = query.message;

    // ETAPE 1: lire "partie.json"
	let partie;
    let contenu;
    contenu = fs.readFileSync("partie/partie.json", "utf-8");
    partie = JSON.parse(contenu);
    let equipe = partie.joueurs[pseudo];
    let marqueurs;
    
    // ETAPE 2: verifier si le chat est terminé
    let chatInfo;
    contenu = fs.readFileSync("partie/chat_info.json", "utf-8");
    chatInfo = JSON.parse(contenu);
    
    let now = new Date();
    let startingTime = new Date(chatInfo.startingTime).getTime();
    if (now.getTime() > startingTime + maxViewTime) {
        marqueurs = afficher_table(partie, pseudo, equipe, "", true);
        if (now.getTime() > startingTime + maxChatTime + maxViewTime) {
            setTimeout(function() {req_en_jeu(req, res, query);}, 500);
        } else {
            // ETAPE 3:
            let listeChat;
            contenu = fs.readFileSync(`partie/chat_${equipe}.json`, "utf-8");
            listeChat = JSON.parse(contenu);
            if (message) {
                ajouter_chat_message(listeChat, pseudo, message);
                fs.writeFileSync(`partie/chat_${equipe}.json`, JSON.stringify(listeChat), "utf-8");
            }

            // ETAPE 4
            marqueurs.tempsReste = String(Math.round((startingTime + maxChatTime + maxViewTime - now.getTime()) / 1000));
            marqueurs.pseudo = pseudo;
            page = fs.readFileSync('modele_chat.html', 'utf-8');
    
            page = page.supplant(marqueurs);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(page);
            res.end();
        }
    } else {
        marqueurs = afficher_table(partie, pseudo, equipe, "view_plateau_statique", false);
        marqueurs.tempsReste = String(Math.round((startingTime + maxViewTime - now.getTime()) / 1000));
        marqueurs.pseudo = pseudo;
        page = fs.readFileSync('modele_view_plateau.html', 'utf-8');

        page = page.supplant(marqueurs);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(page);
        res.end();
    }
};

//--------------------------------------------------------------------------

module.exports = chat;



