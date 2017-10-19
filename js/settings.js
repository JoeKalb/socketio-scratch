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

getJson(location.origin + '/globals').then((res) => {
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
	nameInput = document.getElementById("nameInput");
	document.getElementById("nameInput").style.borderColor = "green";
	document.getElementById("nameInput").style.borderStyle = "solid";
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
	document.getElementById("login").style.backgroundColor = divBackground;
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

function openSideBar(nav, navItems) {
	document.getElementById(nav).style.width = "250px";
	document.getElementById(navItems).style.visibility = "visible";
	document.getElementById("chatContainer").style.left = "250px";
}

function closeSideBar(nav, navItems) {
	document.getElementById(nav).style.width = "0";
	document.getElementById(navItems).style.visibility = "hidden";
	document.getElementById("chatContainer").style.left = "0px";
}

function clearContents(element) {
	if (!hasText) element.value = '';
}

async function checkForENV() {
	try{
		let promise = await fetch(location.origin + "/live");
		let current = await promise.json();
		if(current.status === "local"){
			console.log("Currently Running local env.");
			return false;
		} else if (current.status === "live") {
			let twitchHRef = document.getElementById("twitchATag");
			twitchHRef.href = twitchHRef.href.replace("http://localhost:3000/", current.env_uri).replace("swy6o3hxxnevxwuwu0vrlah2dm1io9", current.env_client_id);
			twitchHeaders.Client-ID = current.env_client_id;
			return false;
		} else{
			console.log("Something went wrong on the environment check...");
			return false;
		}
	}
	catch(err) {
		console.log("Currently using local env: " + err);
	}
}
