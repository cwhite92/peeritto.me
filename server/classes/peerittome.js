var Room = require('./room.js');
var Gibber = require('./gibber.js');

// Init the server application and register socket event handlers
var Peerittome = function() {
	var that = this;

	this.rooms = [];
	this.gibber = new Gibber();

	io.on('connection', function (socket) {
		socket.on('clientReady', function(data) {
			var roomId = that.gibber.getRandomId();

			// Override roomId if one has been supplied by the client
			if (typeof data !== 'undefined' && typeof data.desiredRoom !== 'undefined') {
				var roomId = data.desiredRoom;
			}

			var clientId = that.gibber.getRandomId();

			// Create a room for this new client and add the client to it
			that.addRoom(roomId).addClient(clientId, socket.id, data.peerjsId);

			// Subscribe the client to this room
			socket.join(roomId);

			// Broadcast the room back to clients subscribed to this room
			io.to(roomId).emit('roomDetails', {room: that.getRoom(roomId)});
		});

		socket.on('disconnect', function() {
			// Find the room this client belongs to, and then delete them from it
			var room = that.getRoomBySocketId(socket.id);

			// Heisenbug http://en.wikipedia.org/wiki/Heisenbug
			if (typeof room !== 'undefined') {
				room.dropClient(socket.id);
			}

			// Update the people subscribed to the room
			io.to(room.id).emit('roomDetails', {room: that.getRoom(room.id)});

			// If the room is now empty, delete it
			if (room.clients.length === 0) {
				that.dropRoom(room.id);
			}
		});
	});
}

// Adds a new room to the rooms collection and return it
Peerittome.prototype.addRoom = function(id) {
	// Check if the room exists, otherwise create a new one
	if (this.getRoom(id)) {
		return this.getRoom(id);
	}

	this.rooms.push(new Room(id));

	return this.getRoom(id);
}

// Gets a room from the rooms collection by its unique ID
Peerittome.prototype.getRoom = function(id) {
	var theRoom = null;

	this.rooms.forEach(function(room) {
		if (room.id == id) {
			theRoom = room;
			return;
		}
	});

	return theRoom;
}

Peerittome.prototype.dropRoom = function(id) {
	var that = this;

	this.rooms.forEach(function(room, index) {
		if (room.id == id) {
			that.rooms.splice(index, 1);
		}
	});
}

// Gets a room from the rooms collection by a socket ID of a client
Peerittome.prototype.getRoomBySocketId = function(socketId) {
	var theRoom = null;

	this.rooms.forEach(function(room) {
		room.clients.forEach(function(client) {
			if (client.socketId == socketId) {
				theRoom = room;
				return;
			}
		});
	});

	return theRoom;
}

module.exports = Peerittome;