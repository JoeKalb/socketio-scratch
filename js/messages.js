/*
	The following all have to do with the sending and recieving of messages.
	The top of this is how the messages will be built on the client side.
	The bottom defines the socket functions for the server listeners.
*/

// Emote finding and replacing
function findEmoteId(check) {
	if (localEmotes[check]) {
		let image = imageBuilder(emoteURL.replace("{image_id}", localEmotes[check].id));
		image.alt = check;
		image.title = check;
		return image;
	}
	if (localStorage.getItem(check)) {
		let image = imageBuilder(localStorage.getItem(check));
		image.alt = check;
		image.title = check;
		return image;
	}
	let word = document.createTextNode(check + " ");
	return word;
}

function imageBuilder(source) {
	let image = document.createElement("IMG");
	image.src = source;
	return image;
}

function replaceEmotes(text) {
	let words = text.split(' ');
	let result = document.createElement("SPAN");
	for(let i = 0; i < words.length; i++) {
		result.appendChild(findEmoteId(words[i]));
	}
	return result;
}

// Sending functions
function sendMessage() {
	if (user === "") {
		toggleMenu("settingsDiv");
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
	span.appendChild(appendName(message.user, message.nameColor));
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

function appendName(name, color) {
	let label = document.createElement("span");
	label.className = "nameClass";
	label.id = "nameId";
	label.innerHTML = " " + name + ": ";
	label.style.color = color;
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