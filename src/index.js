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

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	//socket object contains info about the socket created by that client on the server

	console.log("New web socket connection");

	socket.emit("message", "Welcome!");
	socket.on("sendMessage", (message) => {
		io.emit("message", message);
	});

	//emits to all connected clients except the one who just joined
	socket.broadcast.emit("message", "A new user has joined!");

	socket.on("disconnect", () => {
		io.emit("message", "A user has left the chat!");
	});
});

server.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server running on ${port}!`);
	}
});
