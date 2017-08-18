/*
	This has to do with all of the settings of the current user.
	There are currently only 6 and that took well over 100 lines of code...
*/

// get initial emotes from twitch emotes api
function getJson(urlValue) {
	return fetch(urlValue).then((res) => {
		if (res.ok) return res.json(); 
		else reject(new Error('error'));
	}, error => {
		reject(new Error(error.message))
	})
}

getJson(location + 'globals').then((res) => { 
	localEmotes = res; 
});

// initial document setting
document.getElementById("nameInput").value = user;
document.getElementById("currentIcon").className = iconValue;
document.getElementById("currentIcon").style.color = iconColor;
// needs to run once so it only needs one click to work on initial load
toggleMenu("settingsDiv");
toggleDarkMode();
 
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
	document.getElementById("nameInput").style.color = color;
}

function toggleTimeStamp() {
	let elements = document.getElementsByClassName("timeClass");
	let currentMessages = document.getElementsByClassName("messageClass");
	if (timeStamp) {
		for (let i = 0; i < currentMessages.length; i++) {
			currentMessages[i].removeChild(currentMessages[i].firstChild);
		}
		timeStamp = false;
	} else {
		for (let i = 0; i < currentMessages.length; i++) {
			let messageTime = currentMessages[i].id;
			currentMessages[i].insertBefore(appendTime(messageTime), currentMessages[i].firstChild);
		}
		timeStamp = true;
	}
}

function toggleDarkMode() {
	let currentBackground = document.body.style.backgroundColor;
	let messageText = document.getElementsByClassName("textClass");
	let settingsLabels = document.getElementsByClassName("settingsLabel");
	if (currentBackground === "white") {
		setColors("#1e1e1e", "#D3D3D3", "#282828");
		changePrevTextColor(messageText, "#D3D3D3");
		changePrevTextColor(settingsLabels, "#D3D3D3");
	} else {
		setColors("white", "black", "#D3D3D3");
		changePrevTextColor(messageText, "black");
		changePrevTextColor(settingsLabels, "black");
	}
}

function changePrevTextColor(elements, color) {
	for (let i = 0; i < elements.length; i++) {
			elements[i].style.color = color;
		}
}

function setColors(background, text, divBackground) {
	document.body.style.backgroundColor = background;
	document.getElementById("m").style.backgroundColor = background;
	document.getElementById("footer").style.backgroundColor = divBackground;
	document.getElementById("roomName").style.backgroundColor = divBackground;
	document.getElementById("addEmote").style.backgroundColor = divBackground;
	document.getElementById("roomName").style.color = text;
	document.getElementById("setting").style.backgroundColor = divBackground;
	document.getElementById("settingsDiv").style.backgroundColor = divBackground;
	document.getElementById("m").style.color = text;
	messageColor = text;
}

function toggleMenu(id) {
	let div = document.getElementById(id);
	if (div.style.display === 'none') {
		div.style.display = 'block';
	} else {
		div.style.display = 'none';
	}
}

function openSideBar() {
	document.getElementById("leftNav").style.width = "250px";
	document.getElementById("leftNavItems").style.visibility = "visible";
}

function closeSideBar() {
	document.getElementById("leftNav").style.width = "0";
	document.getElementById("leftNavItems").style.visibility = "hidden";
}

function clearContents(element) {
	if (!hasText) element.value = '';	
}

