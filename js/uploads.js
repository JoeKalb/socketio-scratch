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



window.onload = function() {

		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		fileInput.style.color = 'white';

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();
				reader.onload = function(e) {
					fileDisplayArea.innerHTML = "";
					var img = new Image();
					img.src = reader.result;
					img.id = "emotePreview";
					fileDisplayArea.appendChild(img);
					if (img.width != "28" || img.height != "28") {
						let p = document.createElement("p");
						p.innerHTML = "Emote will not upload because of size.";
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
		let stored = storeLocally(emoteName, emoteFile.src);
		if (stored) {
			displayNewEmote(emoteName, emoteFile.src);
		} else console.log("Not able to store Image.");
	}
}

function storeLocally(name, file) {
	if (name != '' && file != '') {
		localStorage.setItem(name, file);
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
	img.src = file;
	img.title = name;
	smallerDiv.appendChild(img);
	smallerDiv.appendChild(p);
	div.appendChild(smallerDiv);
}
