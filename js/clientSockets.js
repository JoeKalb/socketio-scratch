/*
	Pulled appart the sockets from the messages.js since I'll end up using
	more than just messaging 
*/

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