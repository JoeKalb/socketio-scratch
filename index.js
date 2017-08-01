const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const fetch = require('node-fetch');

app.use('/node_modules/font-awesome/', express.static(path.join(__dirname + '/node_modules/font-awesome/')));
app.use('/styles', express.static(path.join(__dirname + '/styles')));
app.use('/js', express.static(path.join(__dirname + '/js')));
app.use('/', express.static(path.join(__dirname + '/')));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

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