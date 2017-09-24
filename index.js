const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const fetch = require('node-fetch');
const co = require('co');
const winston = require('winston');
//const {CONFIG} = require('./config');
const port = process.env.PORT || 3000;

// logging configuration
winston.configure({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({
			filename: 'info-file.log',
			name: 'info-file',
			level: 'info'
		}),
		new (winston.transports.File)({
			filename: 'error-file.log',
			name: 'error-file',
			level: 'error'
		})
	]
});

// Setting up local data
let globals;
let broadcasters;
function getData() {
	let date = new Date();
	co(function *() {
		let res = yield fetch('https://twitchemotes.com/api_cache/v3/global.json');
		globals = yield res.json();
		winston.log("info", "Gloabal Emotes Updated");
	});
	co(function *() {
		let res = yield fetch('https://twitchemotes.com/api_cache/v3/subscriber.json');
		broadcasters = yield res.json();
		let minutes = Math.round(((new Date()) - date) / 1000 / 60);
		winston.log("info", "Broadcasters Data Updated");
		winston.log("info", "Minutes to update: " + minutes);
	});
}
getData();
// refresh data every half an hour!
setInterval(getData, 1.8e6);

app.get('/globals', function(req, res) {
	if (globals) {
		res.status(200).json(globals);
		winston.log("info", "Global Emotes Sent")
	} else {
		winston.error("error", "Problem Sending Global Emotes");
		res.send({ "error": "Emote Not Found" });
	}
});
app.get('/broadcaster/:channel_id', function(req, res) {
	if (broadcasters[req.params.channel_id]) {
		res.status(200).json(broadcasters[req.params.channel_id]);
		winston.log("info", "Broadcaster info sent ID: ".concat(req.params.channel_id));
	} else {
		winston.error("error", "Broadcaster Not Found");
		res.send({ "error": "Broadcaster not found" });
	}
});

// Making twitch OAUTH calls

const TWITCHOAUTH = "https://api.twitch.tv/api/oauth2/token?client_id=<your client ID>&client_secret=<your client secret>&code=<authorization code received above>&grant_type=authorization_code&redirect_uri=<your registered redirect URI>"
	.replace("<your client ID>", CONFIG.CLIENT_ID || process.env.CLIENT_ID)
	.replace("<your client secret>", CONFIG.CLIENT_SECRET || process.env.CLIENT_SECRET)
	.replace("<your registered redirect URI>", CONFIG.REDIRECT_URI || process.env.REDIRECT_URI);
app.get('/login/:code', function(req, res) {
	let twitchCall = TWITCHOAUTH.replace("<authorization code received above>", req.params.code);
	co(function *() {
		let twitchPromise = yield fetch(twitchCall, {
			method: 'post'
		});
		let twitchInfo = yield twitchPromise.json();
		try {
			res.send({"success": twitchInfo});
		} catch(err) {
			res.error({"THERE WAS AN ERROR": err});
		}
	});
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
let nameSpaces = ['artistName', '', 'potato'];

// creating current namespaces build
for (let i in nameSpaces) {
	addNameSpace(nameSpaces[i]);
}

// adding function for building new namespaces
function addNameSpace(name) {
	let ns = io.of("/" + name);

	ns.on('connection', (socket) => {

		socket.broadcast.emit('broadcast', "New User Connected PogChamp");

		socket.on('chat message', (message) => {
			ns.emit('chat message', message);
		});

		socket.on('add emotes', (streamer) => {
			ns.emit('add emotes', streamer);
		});

		socket.on('add session emote', (name, file) => {
			ns.emit('add session emote', name, file);
		});

		socket.on('remove session emote', (name) => {
			ns.emit('remove session emote', name);
		});

		socket.on('disconnect', () => {
			ns.emit('disconnect', 'User Has Disconnected BibleThump');
		});
	});
}

// add route checker and adder

http.listen(port, function() {
	console.log("listening on *:" + port);
});
