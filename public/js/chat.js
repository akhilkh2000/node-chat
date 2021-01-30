const socket = io();

document.getElementById("message-form").addEventListener("submit", (e) => {
	e.preventDefault(); //to prevent default refresh
	const message = e.target.elements.message.value;
	// console.log(message);
	socket.emit("sendMessage", message);
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
		socket.emit("sendLocation", location);
	});
});
