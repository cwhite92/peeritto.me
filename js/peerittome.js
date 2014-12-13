var Peerittome = function() {
	var that = this;

	// The room the client is in
	this.room = null;

	// Show loading template
	var template = Handlebars.compile(document.getElementById('loading-template').innerHTML);
	document.getElementById('content').innerHTML = template();

	// Make the socket connection
	var socket = io('178.62.77.157:80');

	socket.on('roomDetails', function(data) {
		// We got room details from the server, create the room object
		that.room = new Room(data.room.id);

		// And add our own details along with the clients in the room
		data.room.clients.forEach(function(client) {
			if (client.socketId == socket.io.engine.id) {
				that.room.addYouDetails(client.id, client.socketId);
			} else {
				that.room.addClient(client.id, client.socketId);
			}
		});

		var template = Handlebars.compile(document.getElementById('room-template').innerHTML);
		document.getElementById('content').innerHTML = template({
			room: that.room
		});
	});
}

Peerittome.prototype.showRoomChangeForm = function() {
	// Show room name form
	document.getElementById('room-form').style.display = 'block';

	// Also hide the join another room button
	document.getElementById('another-room').style.display = 'none';
}

var peerittome = new Peerittome();