const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require("./utils/users");

const app = express();
//refactoring done to create server in diff way to incorporate socket.io
const server = http.createServer(app);
const io = socketio(server); //create socketio server ( needs an http server as param)
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const {
	generateMessage,
	generateLocationMessage,
} = require("./utils/messages");
//include public assets
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	//socket object contains info about the socket created by that client on the server

	//event when user joins room
	socket.on("join", ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room });

		if (error) {
			callback(error); // TO REDIRECT USER
			return;
		}

		socket.join(user.room);
		//welcome message
		socket.emit("message", generateMessage("Welcome!"));
		//emits to all connected clients except the one who just joined(in the current room)
		socket.broadcast
			.to(user.room)
			.emit("message", generateMessage(`${user.username} has joined!`));
		io.to(user.room).emit("roomChanged", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
		callback(); // CALL IT WITHOUT ERROR FOR NORMAL
	});

	//when send is clicked
	socket.on("sendMessage", (message, callback) => {
		const user = getUser(socket.id); //GET USER WHO SENT MESSAGE

		io.to(user.room).emit("message", generateMessage(user.username, message));
		callback("delivered!"); //send ACK
	});

	//SEND LOCATION
	socket.on("sendLocation", (location, callback) => {
		const user = getUser(socket.id);
		const locationUrl = `https://www.google.com/maps?q=${location.lat},${location.long}`;
		io.to(user.room).emit(
			"locationMessage",
			generateLocationMessage(user.username, locationUrl)
		);
		callback("location-shared!");
	});

	//DISCONNECT
	socket.on("disconnect", () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				generateMessage(`${user.username} has left!`)
			);
			io.to(user.room).emit("roomChanged", {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
		}
	});
});

server.listen(port, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Server running on ${port}!`);
	}
});
