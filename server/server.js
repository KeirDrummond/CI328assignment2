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
            position: {
                x: randomInt(100, 700),
                y: randomInt(100, 300)
            },
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
    x: 1280,
    y: 800
};

var planeSpeed = 5;

function degrees_to_radians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

setInterval(Update, 1000/60);
function Update() {
    var player = getAllPlayers();
    for (var i = 0; i < player.length; i++)
        {
            player[i].angle += player[i].input.move;

            player[i].position.x += planeSpeed * Math.cos(degrees_to_radians(player[i].angle));
            player[i].position.y += planeSpeed * Math.sin(degrees_to_radians(player[i].angle));
            
            if (player[i].position.x > GameSize.x) { player[i].position.x -= GameSize.x; }
            else if (player[i].position.x < 0) { player[i].position.x += GameSize.x; }
            if (player[i].position.y > GameSize.y) { player[i].position.y -= GameSize.y; }
            else if (player[i].position.y < 0) { player[i].position.y += GameSize.y; }
            
            if (player[i].angle > 180) { player[i].angle -= 360; }
            if (player[i].angle < -180) { player[i].angle += 360; }
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