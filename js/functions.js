let socket = io();
let list = document.getElementById("messages");
let user;


document.getElementById("m").addEventListener("keypress", function(e){
	let key = e.which || e.keyCode;
	if (key === 13 && e.value != "") {
		sendMessage();
		e.preventDefault();
	}
});

function toggleSetting() {
	
}

function clearContents(element) {
	element.value = '';
}

function sendMessage() {
	let message = document.getElementById("m").value;
	socket.emit('chat message', message);
	clearContents(document.getElementById("m"));
}

socket.on('chat message', function(message) {
		let li = document.createElement("li");
		li.appendChild(document.createTextNode(message));
		list.appendChild(li);
});

socket.on('broadcast', function(message) {
		let li = document.createElement("li");
		li.appendChild(document.createTextNode(message));
		list.appendChild(li);
});