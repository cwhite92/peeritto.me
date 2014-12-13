var Room = function(id) {
	this.id = id;
	this.clients = [];
	this.you = null;
}

Room.prototype.addYouDetails = function(id, socketId) {
	this.you = {
		id: id,
		socketId: socketId
	};
}

Room.prototype.addClient = function(id, socketId, peerjsId) {
	this.clients.push(new Client(id, socketId, peerjsId));
}