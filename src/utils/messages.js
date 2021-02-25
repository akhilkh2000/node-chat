const { text } = require("express");

const generateMessage = (text) => {
	return {
		text: text,
		createdAt: new Date().getTime(),
	};
};
const generateLocationMessage = (locationUrl) => {
	return {
		url: locationUrl,
		createdAt: new Date().getTime(),
	};
};
module.exports = {
	generateMessage,
	generateLocationMessage,
};
