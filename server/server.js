const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(client) {
    
    client.on('test', function() {
        console.log('test recieved');
    });
    
    client.on('newplayer',function() {
        client.player = {
            id: server.lastPlayerID++,
            x: randomInt(100, 700),
            y: randomInt(100, 300)
        };
        
        console.log('connecting: ' + client.player.id);
        client.emit('allplayers', getAllPlayers());
        client.broadcast.emit('newplayer',client.player);

        client.on('disconnect',function() {
            io.emit('remove', client.player.id);
            console.log('disconnecting: ' + client.player.id);
        });
        
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
    y: 400
};

var planeSpeed = 10;

setInterval(Update, 1000/60);
function Update() {
    var player = getAllPlayers();
    for (var i = 0; i < players.length, i++)
        {
            player[i].x =+ planeSpeed;
            if (player[i].x > GameSize.x) 
                {
                    player[i].x = player[i].x - GameSize.x;
                }
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