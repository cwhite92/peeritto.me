var Client = require('./client.js');

var Room = function(id) {
	this.id = id;
	this.clients = [];
}

Room.prototype.addClient = function(clientId, socketId) {
	this.clients.push(new Client(clientId, socketId));
	
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

Room.prototype.getClient = function(clientId) {
	var theClient = null;

	this.clients.forEach(function(client) {
		if (client.clientId == clientId) {
			theClient = client;
			return;
		}
	});

	return theClient;
}

module.exports = Room;