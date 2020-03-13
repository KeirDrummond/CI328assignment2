const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(client) {
    
    client.on('test', function() {
        console.log('test recieved');
    });
    
});

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});