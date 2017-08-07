/*
	This defines all of the sidebar functions.
*/

// adding different streamer emotes and inner sidebar functions

document.getElementById("streamerInput").addEventListener("keypress", function(e){
	let key = e.which || e.keyCode;
	if (key === 13 && e.value != "") {
		findStreamer();
	}
});

document.getElementById("emoteName").addEventListener("keypress", function(e){
	let key = e.which || e.keyCode;
	if (key === 13 && e.value != "") {
		uploadImage();
	}
});

function getStreamerData(name) {
	if (!addedStreamers.includes(name)) {
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
}

function getStreamerInfo(id) {
	fetch(location + 'broadcaster/' + id).then((res) => {
		return res.json();
	}).then((json) => {
		addStreamerEmotes(json);
	}).catch((err) => {
		console.log(err);
	})
}

function findStreamer() {
	let streamer = document.getElementById("streamerInput").value;
	streamer = streamer.trim();
	streamer = streamer.split(' ').join('').toLowerCase();
	if (!addedStreamers.includes(streamer)) socket.emit("add emotes", streamer);
	document.getElementById("streamerInput").value = '';
}

function addStreamer(data) {
	for(let i = 0; i < data._total; i++) {
		createListItem(data.users[i]);
		addedStreamers.push(data.users[i].name);
	}
}

function createListItem(streamer) {
	let span = document.createElement("div");
	let img = document.createElement("img");
	let div = document.createElement("div");
	let a = document.createElement("a");
	span.id = streamer.name;
	span.className = "streamersClass";
	div.style.display = "flex";
	img.src = streamer.logo;
	img.title = streamer.display_name;
	img.style.width = "100%";
	img.style.height = "auto";
	a.href = "https://twitch.tv/" + streamer.name;
	a.style.color = "white";
	a.target = "_blank";
	div.style.paddingLeft = "1px";
	div.id = streamer.name + 'Div';
	a.appendChild(img);
	div.appendChild(a);
	span.appendChild(div);
	document.getElementById("streamersDiv").appendChild(span);
	getStreamerInfo(streamer._id);
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
	buildEmoteDiv(emoteNames, streamerData.channel_name);
}

function buildEmoteDiv(emotesArray, name) {
	let parent = document.getElementById(name + "Div");
	let div = document.createElement("div");
	div.className = "emoteDisplay scroll";
	for(let i = 0; i < emotesArray.length; i++) {
		let img = findEmoteId(emotesArray[i]);
		img.className = "emoteImage"
		div.appendChild(img);		
	}
	parent.appendChild(div);
}

// Uploading new emotes for previewing!!!
window.onload = function() {

	let fileInput = document.getElementById('fileInput');
	let fileDisplayArea = document.getElementById('fileDisplayArea');
	fileInput.style.color = 'white';

	fileInput.addEventListener('change', function(e) {
		let file = fileInput.files[0];
		let imageType = /image.*/;

		if (file.type.match(imageType)) {
			let reader = new FileReader();
			reader.onload = function(e) {
				fileDisplayArea.innerHTML = "";
				let img = new Image();
				img.src = reader.result;
				img.id = "emotePreview";
				fileDisplayArea.appendChild(img);
				if (img.width != "28" || img.height != "28") {
					let p = document.createElement("p");
					p.innerHTML = "Emote will not upload because of size.";
					console.log("Emote Height: " + img.height);
					console.log("Emote Width: " + img.width);
					fileDisplayArea.appendChild(p);
				}
			}

			reader.readAsDataURL(file);	
		} else {
			fileDisplayArea.innerHTML = "File not supported!"
		}
	});
}

function uploadImage() {
	let emoteFile = document.getElementById("emotePreview");
	let emoteName = document.getElementById("emoteName").value;
	if (emoteFile.width == '28' && emoteFile.height == '28') {
		let stored = socket.emit('add session emote', emoteName, emoteFile.src);
		if (stored) {
			displayNewEmote(emoteName, emoteFile.src);
			document.getElementById("fileInput").value = '';
			document.getElementById("emoteName").value = '';
			emoteFile.remove();
		} else console.log("Not able to store Image.");
	}
}

function storeLocally(name, file) {
	if (name != '' && file != '') {
		sessionStorage.setItem(name, file);
		return true;
	} else {
		return false;
	}
}

function displayNewEmote(name, file) {
	let div = document.getElementById("emotesDiv");
	let smallerDiv = document.createElement("div");
	let img = document.createElement("img");
	let p = document.createElement("p");
	p.innerHTML = name;
	p.style.color = "white";
	p.className = "emoteTextClass";
	img.src = file;
	img.title = name;
	smallerDiv.className = "localEmoteClass";
	smallerDiv.appendChild(img);
	smallerDiv.appendChild(p);
	div.appendChild(smallerDiv);
}

function checkForPreviousUploads() {
	if (sessionStorage.length != 0) {
		for (let i = 0; i < sessionStorage.length; i++) {
			let key = sessionStorage.key(i);
			displayNewEmote(key, sessionStorage.getItem(key));
		}
	}
}

checkForPreviousUploads();

// open sidename initially for testing
openSideBar();