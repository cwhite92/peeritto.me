var Client = require('./client.js');

var Room = function(id) {
	this.id = id;
	this.clients = [];
}

Room.prototype.addClient = function(socketId) {
	this.clients.push(new Client(socketId));
	
	return this.getClient(socketId);
}

Room.prototype.dropClient = function(socketId) {
	var that = this;

	this.clients.forEach(function(client, index) {
		if (client.socketId == socketId) {
			that.clients.splice(index, 1);
		}
	});
}

Room.prototype.getClient = function(socketId) {
	var theClient = null;

	this.clients.forEach(function(client) {
		if (client.socketId == socketId) {
			theClient = client;
			return;
		}
	});

	return theClient;
}

module.exports = Room;