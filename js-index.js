var nameInput = document.getElementById("name-input"),
	messageInput = document.getElementById("message-input");

function handleKeyUp(e) {
	if (e.keyCode === 13) {
		sendMessage();
	}
}
function sendMessage() {
	var name = nameInput.value.trim(),
		message = messageInput.value.trim();

	if (!name)
		return alert("Please fill in the name");

	if (!message)
		return alert("Please write a message");

	var ajax = new XMLHttpRequest();
	ajax.open("POST", "php-send-message.php", true);
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	ajax.send("name=" + name + "&message=" + message);

	messageInput.value = "";
}

// web sockets
window.WebSocket = window.WebSocket || window.MozWebSocket;

var connection = new WebSocket('ws://localhost:8080');
var connectingSpan = document.getElementById("connecting");
connection.onopen = function () {
	connectingSpan.style.display = "none";
};
connection.onerror = function (error) {
	connectingSpan.innerHTML = "Error occured";
};
connection.onmessage = function (message) {
	var data = JSON.parse(message.data);

	var div = document.createElement("div");
	var author = document.createElement("span");
		author.className = "author";
		author.innerHTML = data.name;
	var message = document.createElement("span");
		message.className = "messsage-text";
		message.innerHTML = data.message;

	div.appendChild(author);
	div.appendChild(message);

	document.getElementById("message-box").appendChild(div);

}
