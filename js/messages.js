/*
	The following all have to do with the sending and recieving of messages.
	The top of this is how the messages will be built on the client side.
	The bottom defines the socket functions for the server listeners.
*/

// Sending functions
function sendMessage() {
	if (user === "") {
		toggleSetting();
		// check if textarea have something written
		if (document.getElementById("m").value != "") hasText = true;
		return false;
	} else if (document.getElementById("m").value === "") {
		return false;
	}else {
		date = new Date();
		message.time = date.toTimeString();
		message.text = document.getElementById("m").value;
		message.user = user;
		message.nameColor = userColor;
		socket.emit('chat message', message);
		hasText = false;
		clearContents(document.getElementById("m"));
	}
}

// Building message client display
function appendMessage(message) {
	let span = document.createElement("span");
	span.className = "messageClass";
	span.id = message.time;
	if (timeStamp) span.appendChild(appendTime(message.time));
	if (iconValue != "")span.appendChild(appendIcon(iconValue));
	span.appendChild(appendName(message.user));
	span.appendChild(appendText(message.text));
	return span;
}

function appendIcon(iconName) {
	let icon = document.createElement("i");
	icon.className = iconName;
	icon.id = "iconId";
	icon.style.color = iconColor;
	return icon;
}

function appendName(name) {
	let label = document.createElement("span");
	label.className = "nameClass";
	label.id = "nameId";
	label.innerHTML = " " + name + ": ";
	label.style.color = userColor;
	return label;
}

function appendText(text) {
	let p = document.createElement("span");
	p.className = "textClass";
	text = replaceEmotes(text);
	p.style.color = messageColor;
	p.appendChild(text);
	return p;
}

function appendTime(currentTime) {
	let timeSpan = document.createElement("span");
	timeSpan.className = "timeClass";
	currentTime = currentTime.substring(0, 5);
	timeSpan.innerHTML = currentTime + " ";
	return timeSpan;
}

// sockets
socket.on('chat message', function(message) {
	let li = document.createElement("li");
	li.appendChild(appendMessage(message));
	list.appendChild(li);
	li.scrollIntoView();
});

socket.on('broadcast', function(message) {
	let li = document.createElement("li");
	li.style.color = "#696969";
	li.appendChild(document.createTextNode(message));
	list.appendChild(li);
});