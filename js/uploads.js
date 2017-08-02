// adding different streamer emotes and inner sidebar functions
function getStreamerData(name) {
	fetch(twitchUsersURL.replace('{name}', name), {
		headers: twitchHeaders
	}).then((res) => {
		return res.json();
	}).then((json) => {
		addStreamer(json);
	}).catch((err) => {
		console.log(err);
	})
}

function getStreamerInfo(id) {
	fetch(location + 'broadcaster/' + id).then((res) => {
		return res.json();
	}).then((json) => {
		addStreamerEmotes(json)
	}).catch((err) => {
		console.log(err);
	})
}

function findStreamer() {
	let streamer = document.getElementById("streamerInput").value;
	streamer = streamer.trim();
	streamer = streamer.split(' ').join('');
	getStreamerData(streamer);
	document.getElementById("streamerInput").value = '';
}

function addStreamer(data) {
	for(let i = 0; i < data._total; i++) {
		createListItem(data.users[i]);
		getStreamerInfo(data.users[i]._id);
	}
}

function createListItem(streamer) {
	let span = document.createElement("div");
	let img = document.createElement("img");
	let div = document.createElement("div");
	let a = document.createElement("a");
	span.id = streamer.name;
	span.className = "streamersClass";
	img.src = streamer.logo;
	img.title = streamer.display_name;
	img.style.width = "30%";
	img.style.height = "30%";
	a.innerHTML = "twitch.tv/" + streamer.name;
	a.href = a.innerHTML;
	a.style.color = "white";
	div.style.paddingLeft = "1px";
	div.appendChild(a);
	span.appendChild(img);
	span.appendChild(div);
	document.getElementById("streamersDiv").appendChild(span);
}

function addStreamerEmotes(streamerData) {
	let newEmotes = streamerData.emotes;
	let emoteNames = [];
	for (let i = 0; i < newEmotes.length; i++) {
		emoteNames.push(newEmotes[i].code);
		localEmotes[newEmotes[i].code] = {
			"id": newEmotes[i].id
		}
	}
	console.log("Emotes Added: " + emoteNames.join(', '));
}

// Uploading of tester emotes
function uploadImage() {
	let emoteFile = document.getElementById("emoteFile").value;
	let emoteName = document.getElementById("emoteName").value;
	let stored = storeLocally(emoteName, emoteFile);
	if (stored) {
		displayNewEmote(emoteName, emoteFile);
	} else console.log("Not able to store Image.");
}

function storeLocally(name, file) {
	if (name != '' && file != '') {
		let convertedFile = convertImageToBase64(file);
		localStorage.setItem(name, convertedFile);
		return true;
	} else {
		return false;
	}
}

function displayNewEmote(name, file) {
	let div = document.getElementById("emotesDiv");
	let img = document.createElement("img");
	img.src = localStorage.name;
	img.title = name;
	div.appendChild(img);
}

function convertImageToBase64(file) {
	let canvas = document.createElement("canvas");
	canvas.width = file.width; //change to 28px later
	canvas.height = file.height; //change to 28px later

	let ctx = canvas.getContext("2d");
	ctx.drawImage(file, 0, 0, canvas.width, canvas.height);

	let dataURL = canvas.toDataURL("image/png");

	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}