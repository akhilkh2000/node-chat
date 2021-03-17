const socket = io(); //connect to socket

//event acknowledgments
//server(emit) -> client(recieve) -- ACK -> server
// client(emit) -> server(recieve) -- ACK -> client

//elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButtom = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
	"#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
//Options
//to parse the query string from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const autoscroll = () => {
	// decide if we actually should autoscroll

	// new message element
	const $newMessage = $messages.lastElementChild;

	const newMesssageStyles = getComputedStyle($newMessage); //get styles in key value pairs
	const newMessageMargin = parseInt(newMesssageStyles.marginBottom);
	// height of new message
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

	//visible height of view
	const visibleHeight = $messages.offsetHeight;

	//total container height
	const containerHeight = $messages.scrollHeight;

	//how far down are we scrolled
	const scrollOffset = $messages.scrollTop + visibleHeight;

	if (containerHeight - newMessageHeight <= scrollOffset) {
		//autoscroll only when the user was at the bottom when new messages were coming
		$messages.scrollTop = $messages.scrollHeight;
	}
};
// event on every new message from anyone
socket.on("message", (msg) => {
	//render when a new message comes in
	const html = Mustache.render(messageTemplate, {
		username: msg.username,
		message: msg.text,
		createdAt: moment(msg.createdAt).format("HH:mm"),
	});
	//insert into div for messages
	$messages.insertAdjacentHTML("beforeend", html);
	autoscroll();
	console.log(msg);
});

socket.on("locationMessage", (locObject) => {
	console.log(locObject);

	const html = Mustache.render(locationMessageTemplate, {
		username: locObject.username,
		url: locObject.url,
		createdAt: moment(locObject.createdAt).format("HH:mm"),
	});
	$messages.insertAdjacentHTML("beforeend", html);
	autoscroll();
});

socket.on("roomChanged", ({ room, users }) => {
	// console.log(room);
	// console.log(users);
	const html = Mustache.render(sidebarTemplate, {
		room,
		users,
	});
	$sidebar.innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
	e.preventDefault(); //to prevent default refresh
	$messageFormButtom.setAttribute("disabled", "disabled"); //disable it for time until message is sent
	const message = e.target.elements.message.value;
	// console.log(message);
	//sends a callback function so that the server can call in to ack the client
	socket.emit("sendMessage", message, (msgFromserver) => {
		//we reenable our button in our ACK callback
		$messageFormButtom.removeAttribute("disabled");
		// clear input
		$messageFormInput.value = "";
		$messageFormInput.focus(); //to re focus cursor on input
		//event ACK
		console.log("message from server - " + msgFromserver);
	});
});

$locationButton.addEventListener("click", () => {
	if (!navigator.geolocation) {
		//no support for this in the browser
		return alert("Geolocation is not supported by your browser!");
	}

	//disable button while location is being fetched and sent
	$locationButton.setAttribute("disabled", "disabled");

	navigator.geolocation.getCurrentPosition((position) => {
		console.log(position);
		const lat = position.coords.latitude;
		const long = position.coords.longitude;
		const location = { lat, long };
		socket.emit("sendLocation", location, (msgFromserver) => {
			//re enable button once location sent
			$locationButton.removeAttribute("disabled");
			console.log("message from server -", msgFromserver);
		});
	});
});

//when user wants to join room
socket.emit("join", { username, room }, (err) => {
	if (err) {
		alert(err);
		location.href = "/"; // REDIRECT USER
	}
});
