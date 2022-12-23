const fs = require("fs");
require('remedial');

const contacter = function (req, res, query) {
    let marqueurs;
    let page;

    page = fs.readFileSync('modele_contacter.html', 'utf-8');
	
	marqueurs = {};
	if (query.envoyer === "true") {
    	marqueurs.envoyer = "Envoyé !";
	} else {
		marqueurs.envoyer = "";
	}
	page = page.supplant(marqueurs);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = contacter;



