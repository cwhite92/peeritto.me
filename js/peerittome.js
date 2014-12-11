var Peerittome = function() {
	var socket = io('178.62.77.157:80');
	socket.on('news', function(data) {
		console.log(data);
	});
}

var peerittome = new Peerittome();