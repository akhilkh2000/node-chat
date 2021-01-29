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

let count = 0;
io.on("connection", (socket) => {
	//socket object contains info about the socket created by that client on the server
	socket.emit("countUpdated", count); //send count
	console.log("New web socket connection");

	socket.on("increment", () => {
		count++;
		//socket.emit only emits the event to that particular socket , not all the clients connected to that socket
		//socket.emit("countUpdated", count);
		io.emit("countUpdated", count);
	});
});

server.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server running on ${port}!`);
	}
});
