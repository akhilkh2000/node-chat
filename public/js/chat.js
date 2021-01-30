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
