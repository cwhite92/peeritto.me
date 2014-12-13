var Peerittome = function() {
	var that = this;

	// The room the client is in
	this.room = null;

	// Show loading template
	var template = Handlebars.compile(document.getElementById('loading-template').innerHTML);
	document.getElementById('content').innerHTML = template();

	// Make the socket connection
	this.socket = io('178.62.77.157:80');

	this.socket.on('connect', function() {
		// Init PeerJS
		// TODO: Refactor this into promises, makes it cleaner
		that.peer = new Peer({key: 'lwjd5qra8257b9'});

		that.peer.on('open', function(id) {
			// Notify the server that we're ready to recieve the room
			that.socket.emit('clientReady', {peerjsId: id});
		});
	});

	this.socket.on('roomDetails', function(data) {
		console.log(data);
		// Setup the room with the response from the server
		that.setupRoom(data, that.socket);
	});
}

Peerittome.prototype.setupRoom = function(data, socket) {
	var that = this;

	// Create new room object
	this.room = new Room(data.room.id);

	// And add our own details along with the other clients in the room
	data.room.clients.forEach(function(client) {
		if (client.socketId == socket.io.engine.id) {
			that.room.addYouDetails(client.id, client.socketId, client.peerjsId);
		} else {
			that.room.addClient(client.id, client.socketId, client.peerjsId);
		}
	});

	var template = Handlebars.compile(document.getElementById('room-template').innerHTML);
	document.getElementById('content').innerHTML = template({
		room: that.room
	});
}

Peerittome.prototype.showRoomChangeForm = function() {
	// Show room name form
	document.getElementById('room-form').style.display = 'block';

	// Also hide the join another room button
	document.getElementById('another-room').style.display = 'none';
}

Peerittome.prototype.changeRoom = function() {
	var roomName = document.getElementById('room-name').value.trim();

	if (!roomName) {
		return false;
	}

	// TODO make this send peerjs id as well
	this.socket.emit('clientReady', {desiredRoom: roomName, peerjsId: this.peer.id});
}

var peerittome = new Peerittome();