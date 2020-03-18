const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(client) {
    
    client.on('test', function() {
        console.log('test recieved');
    });
    
    client.on('newplayer',function(colour) {
        client.player = {
            id: server.lastPlayerID++,
            x: randomInt(100, 700),
            y: randomInt(100, 300),
            angle: 0,
            colour: colour,
            input: {
                move: 0,
                fire: 0
            }
        };
        
        console.log('connecting: ' + client.player.id);
        client.emit('allplayers', getAllPlayers());
        client.broadcast.emit('newplayer',client.player);

        client.on('disconnect',function() {
            io.emit('remove', client.player.id);
            client.broadcast.emit('leftplayer', client.player);
            console.log('disconnecting: ' + client.player.id);
        });
        
        client.on('inputmove',function(input) {
            input = Math.max(-1, Math.min(1, input));
            client.player.input.move = input;
        });
        
        client.on('inputfire',function(input) {
            input = Math.max(0, Math.min(1, input));
            client.player.input.fire = input;
        })
        
        client.on('update', function() {
            client.emit('update', getAllPlayers());
        });
    });  
});


server.lastPlayerID = 0;

server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});


var GameSize = {
    x: 800,
    y: 600
};

var planeSpeed = 5;

setInterval(Update, 1000/60);
function Update() {
    var player = getAllPlayers();
    for (var i = 0; i < player.length; i++)
        {
            player[i].x += planeSpeed;
            player[i].angle += player[i].input.move;
            
            if (player[i].x > GameSize.x) { player[i].x -= GameSize.x; }
            else if (player[i].x < 0) { player[i].x += GameSize.x; }
            if (player[i].y > GameSize.y) { player[i].y -= GameSize.y; }
            else if (player[i].y < 0) { player[i].y += GameSize.y; }
        }
}

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player) { players.push(player); }
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}