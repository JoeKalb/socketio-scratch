const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const co = require('co');

// Setting up local cache
let globals; 
let broadcasters;
function getCache() {
	co(function *() {
		let res = yield fetch('https://twitchemotes.com/api_cache/v3/global.json');
		globals = yield res.json();
		console.log("Gloabal Emotes Cache Updated");
	});
	co(function *() {
		let res = yield fetch('https://twitchemotes.com/api_cache/v3/subscriber.json');
		broadcasters = yield res.json();
		console.log("Broadcasters Data Updated");
	});
}
getCache();

app.get('/globals', function(req, res) {
	if (globals) {
		res.status(200).json(globals);
	} else {
		console.log("Problem Sending Global Emotes");
		res.send({ "error": "Emote Not Found" });
	}
});
app.get('/broadcaster/:channel_id', function(req, res) {
	if (broadcasters[req.params.channel_id]) {
		res.status(200).json(broadcasters[req.params.channel_id]);
	} else {
		console.log("Problem finding Broadcaster");
		res.send({ "error": "Broadcaster not found" });
	}
});

// Setting up app front end
app.use('/node_modules/font-awesome/', express.static(path.join(__dirname + '/node_modules/font-awesome/')));
app.use('/styles', express.static(path.join(__dirname + '/styles')));
app.use('/js', express.static(path.join(__dirname + '/js')));
app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Setting up app sockets
io.on('connection', function(socket) {

	socket.broadcast.emit('broadcast', "New User Connected PogChamp");
	
	socket.on('chat message', function(message) {
		io.emit('chat message', message);
	});

	socket.on('disconnect', () => {
		io.emit('disconnect', 'User Has Disconnected BibleThump');
	});
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});