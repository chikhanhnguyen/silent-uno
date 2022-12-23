"use strict";

const ajouter_chat_message = function (chat, pseudo, message) {
	let newChat = {};
	newChat.pseudo = pseudo;
	newChat.message = message;
	chat.push(newChat);
}

module.exports = ajouter_chat_message;
