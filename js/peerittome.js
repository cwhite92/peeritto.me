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

		that.peer.on('connection', function(conn) {
			that.handleIncomingFile(conn);
		});
	});

	this.socket.on('roomDetails', function(data) {
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

Peerittome.prototype.handleIncomingFile = function(conn) {
	conn.on('data', function(buffer) {
		// Convert the binary string into a blob
		var blob = new Blob([buffer], {type: 'octet/stream'});

		// Create URL to download the blob file
		var url = URL.createObjectURL(blob);

		// Create hidden anchor and click it to initiate the download
		a = document.createElement('a');
		a.href = url;
		a.download = conn.metadata.filename;
		a.click();
		URL.revokeObjectURL(url);
	});
}

Peerittome.prototype.handleFileSelect = function(element) {
	var that = this;

	// The file the user wants to send
	var file = element.files[0];
	var reader = new FileReader();

	reader.onload = (function(theFile) {
		return function(e) {
			// When we get the file data, send it using PeerJS
			var peerId = element.parentNode.getAttribute('data-peerjsid');
			var conn = that.peer.connect(peerId, {
				metadata: {
					filename: 'helloworld.txt'
				}
			});

			conn.on('open', function() {
				// Send the file!
				conn.send(theFile);
			});
		};
	})(file);

	reader.readAsArrayBuffer(file);
}

var peerittome = new Peerittome();