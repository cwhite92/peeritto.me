var app = require('http').createServer();
global.io = require('socket.io')(app);

// Make the server listen on port 80
app.listen(80);

var Peerittome = require('./classes/peerittome.js');
var peerittome = new Peerittome();