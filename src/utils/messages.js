const { text } = require("express");

const generateMessage = (text) => {
	return {
		text: text,
		createdAt: new Date().getTime(),
	};
};

module.exports = {
	generateMessage,
};
