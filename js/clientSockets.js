/*
	Pulled appart the sockets from the messages.js since I'll end up using
	more than just messaging with the sockets
*/

let socket;

function connectToNameSpace() {
	let nameSpace = document.getElementById("nameSpaceInput").value;
	nameSpace = nameSpace.trim();
	connect(nameSpace);
}

function connect(name) {
	socket = io("/" + name);
	document.getElementById("roomName").innerHTML = name;
	// socket actions
	socket.on('chat message', function(message) {
		let li = document.createElement("li");
		li.appendChild(appendMessage(message));
		list.appendChild(li);
		li.scrollIntoView();
	});

	socket.on('broadcast', function(message) {
		let li = document.createElement("li");
		li.style.color = "#696969";
		li.appendChild(appendText(message));
		list.appendChild(li);
	});

	socket.on('disconnect', function(message) {
		let li = document.createElement("li");
		li.style.color = "#696969";
		li.appendChild(appendText(message));
		list.appendChild(li);
	});

	socket.on('add emotes', (streamer) => {
		getStreamerData(streamer);
	});

	socket.on('add session emote', (name, file) => {
		storeLocally(name, file);
	});

	socket.on('remove session emote', (name) => {
		removeLocally(name);
	});

}

// This will later connect to the artist name and the room will be the streamer
connect("");
