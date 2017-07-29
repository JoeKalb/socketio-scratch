let socket = io();
let list = document.getElementById("messages");
let user = "Joe";
let userColor = "black";
let date;
let hasText = false;
let iconValue = "";
let iconColor = "white";
let message = {
	user: "",
	text: "",
	time: ""
}

// initial document setting
document.getElementById("nameInput").value = user;
document.getElementById("currentIcon").className = iconValue;
document.getElementById("currentIcon").style.color = iconColor;
// needs to run once so it only needs one click to work on initial load
toggleSetting();

// Event Listeners
document.getElementById("m").addEventListener("keypress", function(e){
	let key = e.which || e.keyCode;
	if (key === 13 && e.value != "") {
		sendMessage();
		e.preventDefault();
	} else hasText = true;
});

document.getElementById("nameInput").addEventListener("keypress", function(e){
	let key = e.which || e.keyCode;
	if (key === 13 && e.value != "") {
		setName();
		toggleSetting();
	}
});

// Client Settings Functions
function setName() {
	user = document.getElementById("nameInput").value;
}

function setIcon(icon) {
	iconValue = icon;
	showIconChoice(icon);
}

function showIconChoice(icon) {
	document.getElementById("currentIcon").className = icon;
}

function setIconColor(color) {
	iconColor = color;
	document.getElementById("currentIcon").style.color = iconColor;
}

function setNameColor(color) {
	userColor = color;
}

function toggleSetting() {
	let div = document.getElementById("settingsDiv");
	if (div.style.display === 'none') {
		div.style.display = 'block';
	} else {
		div.style.display = 'none';
	}
}

function clearContents(element) {
	if (!hasText) element.value = '';	
}

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
	span.appendChild(appendTime(message.time));
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
	label.innerHTML = " " + name;
	label.style.color = userColor;
	return label;
}

function appendText(text) {
	let p = document.createElement("span");
	p.className = "textClass";
	p.innerHTML = ": " + text;
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
});

socket.on('broadcast', function(message) {
		let li = document.createElement("li");
		li.appendChild(document.createTextNode(message));
		list.appendChild(li);
});