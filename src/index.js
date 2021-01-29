const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server running on ${port}!`);
	}
});
