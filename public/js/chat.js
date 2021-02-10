const socket = io(); //connect to socket

//event acknowledgments
//server(emit) -> client(recieve) -- ACK -> server
// client(emit) -> server(recieve) -- ACK -> client

document.getElementById("message-form").addEventListener("submit", (e) => {
	e.preventDefault(); //to prevent default refresh
	const message = e.target.elements.message.value;
	// console.log(message);
	//sends a callback function so that the server can call in to ack the client
	socket.emit("sendMessage", message, (msgFromserver) => {
		//event ACK
		console.log("message from server - " + msgFromserver);
	});
});
socket.on("message", (msg) => {
	console.log(msg);
});

document.querySelector("#send-location").addEventListener("click", () => {
	if (!navigator.geolocation) {
		//no support for this in the browser
		return alert("Geolocation is not supported by your browser!");
	}

	navigator.geolocation.getCurrentPosition((position) => {
		console.log(position);
		const lat = position.coords.latitude;
		const long = position.coords.longitude;
		const location = { lat, long };
		socket.emit("sendLocation", location, (msgFromserver) => {
			console.log("message from server -", msgFromserver);
		});
	});
});
