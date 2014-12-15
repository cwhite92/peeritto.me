var mimeTypes = {
    'html': 'text/html',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'css': 'text/css'
};

var url = require('url'),
	path = require('path'),
	fs = require('fs');

var app = require('http').createServer(function(request, response) {
	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri);

	fs.exists(filename, function(exists) {
		if (!exists) {
			// Return a 404
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.write('404 Not Found\n');
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, 'binary', function(err, file) {
			if (err) {
				response.writeHead(500, {'Content-Type': 'text/plain'});
				response.write(err + '\n');
				response.end();
				return;
			}

			response.writeHead(200);
			response.write(file, 'binary');
			response.end();
		});
	});
});

// Make io global so we can use it anywhere
global.io = require('socket.io')(app);

// Make the server listen on port 80
app.listen(80);

var Peerittome = require('./classes/peerittome.js');
var peerittome = new Peerittome();