var Room = require('./room.js');
var Gibber = require('./gibber.js');

// Init the server application and register socket event handlers
var Peerittome = function() {
	var that = this;

	this.rooms = [];
	this.gibber = new Gibber();

	io.on('connection', function (socket) {
		var roomId = that.gibber.getRandomId();
		// Create a room for this new client and add the client to it
		that.addRoom(roomId).addClient(socket.id);

		// Subscribe the client to this room
		socket.join(roomId);
		
		socket.on('disconnect', function() {
			// Find the room this client belongs to, and then delete them from it
			var room = that.getRoomByClientSocketId(socket.id);
			room.dropClient(socket.id);
			
			// If the room is now empty, delete it
			if (room.clients.length === 0) {
				that.dropRoom(room.id);
			}
		});
	});
}

// Adds a new room to the rooms collection and return it
Peerittome.prototype.addRoom = function(id) {
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
	
	console.log(this.rooms);
}

// Gets a room from the rooms collection by a socket ID of a client
Peerittome.prototype.getRoomByClientSocketId = function(socketId) {
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