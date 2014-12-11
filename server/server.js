var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');

// Make the server listen on port 80
app.listen(80);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});