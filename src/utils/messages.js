const { text } = require("express");

const generateMessage = (username, text) => {
	return {
		username,
		text: text,
		createdAt: new Date().getTime(),
	};
};
const generateLocationMessage = (username, locationUrl) => {
	return {
		username,
		url: locationUrl,
		createdAt: new Date().getTime(),
	};
};
module.exports = {
	generateMessage,
	generateLocationMessage,
};
