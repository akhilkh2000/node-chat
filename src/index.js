const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
//refactoring done to create server in diff way to incorporate socket.io
const server = http.createServer(app);
const io = socketio(server); //create socketio server ( needs an http server as param)
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const { generateMessage } = require("./utils/messages");
//include public assets
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	//socket object contains info about the socket created by that client on the server

	console.log("New web socket connection");

	socket.emit("message", generateMessage("Welcome!"));

	//when send is clicked
	socket.on("sendMessage", (message, callback) => {
		io.emit("message", generateMessage(message));
		callback("delivered!"); //send ACK
	});

	//emits to all connected clients except the one who just joined
	socket.broadcast.emit("message", generateMessage("A new user has joined!"));

	socket.on("sendLocation", (location, callback) => {
		const locationUrl = `https://www.google.com/maps?q=${location.lat},${location.long}`;
		io.emit("locationMessage", locationUrl);
		callback("location-shared!");
	});
	socket.on("disconnect", () => {
		io.emit("message", generateMessage("A user has left the chat!"));
	});
});

server.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server running on ${port}!`);
	}
});
