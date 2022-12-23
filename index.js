"use strict";
  
const http = require("http");
const url = require("url");
let mon_serveur;
let port;

//-------------------------------------------------------------------------
// DECLARATION DES DIFFERENTS MODULES CORRESPONDANT A CHAQUE ACTION
//-------------------------------------------------------------------------

const req_commencer_fr = require("./req_commencer_fr.js");
const req_afficher_formulaire_inscription_fr = require("./req_afficher_formulaire_inscription_fr.js");
const req_inscrire_fr = require("./req_inscrire_fr.js");
const req_identifier_fr = require("./req_identifier_fr.js");
const req_statique = require("./req_statique.js");
const req_erreur = require("./req_erreur.js");
const req_contacter = require("./req_contacter.js");
const req_didacticiel = require("./req_didacticiel.js");
const req_donation = require("./req_donation.js");
const req_donner = require("./req_donner.js");
const req_compte = require("./req_compte.js");
const req_afficher_compte = require("./req_afficher_compte.js");
const req_afficher_accueil_membre = require("./req_afficher_accueil_membre.js");
const req_deconnexion = require("./req_deconnexion.js");
const req_jouer = require("./req_jouer.js");
const req_supprAttente = require("./req_supprAttente.js");
const req_choix_equipe = require("./req_choix_equipe.js");
const req_afficher_carte = require("./req_afficher_carte.js");
const req_afficher_tchat = require("./req_afficher_tchat.js");
const req_en_jeu = require("./req_en_jeu.js");
const req_choix_carte = require("./req_choix_carte.js");
const req_verifier_choix = require("./req_verifier_choix.js");
const req_chat = require("./req_chat.js");

//-------------------------------------------------------------------------
// FONCTION DE CALLBACK APPELLEE POUR CHAQUE REQUETE
//-------------------------------------------------------------------------

const traite_requete = function (req, res) {

    let requete;
    let pathname;
    let query;

    console.log("URL reçue : " + req.url);
    requete = url.parse(req.url, true);
    pathname = requete.pathname;
    query = requete.query;

    // ROUTEUR

    try {
        switch (pathname) {
            case '/':
            case '/req_commencer_fr':
                req_commencer_fr(req, res, query);
                break;
			case '/req_afficher_accueil_membre':
				req_afficher_accueil_membre(req, res, query);
				break;
			case '/req_jouer':
				req_jouer(req, res, query);
				break;
			case '/req_afficher_carte':
				req_afficher_carte(req, res, query);
				break;
			case '/req_afficher_tchat':
				req_afficher_tchat(req, res, query);
				break;
			case '/req_supprAttente':
                req_supprAttente(req, res, query);
                break;
			case '/req_compte':
				req_compte(req, res, query);
				break;
			case '/req_deconnexion':
				req_deconnexion(req, res, query);
				break;
			case '/req_afficher_compte':
				req_afficher_compte(req, res, query);
				break;
			case '/req_contacter':
				req_contacter(req, res, query);
				break;
            case '/req_didacticiel':
                req_didacticiel(req, res, query);
                break;
			case '/req_donation':
				req_donation(req, res, query);
				break;
			case '/req_donner':
				req_donner(req, res, query);
				break;
            case '/req_afficher_formulaire_inscription_fr':
                req_afficher_formulaire_inscription_fr(req, res, query);
                break;
            case '/req_inscrire_fr':
                req_inscrire_fr(req, res, query);
                break;
            case '/req_identifier_fr':
                req_identifier_fr(req, res, query);
                break;
			case '/req_choix_equipe':
                req_choix_equipe(req, res, query);
                break;
            case '/req_en_jeu':
                req_en_jeu(req, res, query);
                break;
			case '/req_choix_carte':
				req_choix_carte(req, res, query);
				break;
			case '/req_verifier_choix':
				req_verifier_choix(req, res, query);
                break;
            case '/req_chat':
				req_chat(req, res, query);
				break;
            default:
                req_statique(req, res, query);
                break;
        }
    } catch (e) {
        console.log('Erreur : ' + e.stack);
        console.log('Erreur : ' + e.message);
        //console.trace();
        req_erreur(req, res, query);
    }
};

//-------------------------------------------------------------------------
// CREATION ET LANCEMENT DU SERVEUR
//-------------------------------------------------------------------------

mon_serveur = http.createServer(traite_requete);
port = 5000;
console.log("Serveur en ecoute sur port " + port);
mon_serveur.listen(port);
