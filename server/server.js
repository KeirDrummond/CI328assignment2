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
            },
            fireCD: 0
        };
        
        client.bulletSet = new Array(5);
        for (var i = 0; i < client.bulletSet.length; i++)
            {
                client.bulletSet[i] = 
                    {
                        owner: client.player.id,
                        position: {
                            x: 0,
                            y: 0
                        },
                        angle: 0,
                        lifetime: 1,
                        alive: false
                    };
            }
        
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
            client.emit('update', getAllPlayers(), BulletArray);
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

var planeSize = {
    x: 64,
    y: 32
};

var BulletArray = {};

var planeSpeed = 5;
var fireRate = 2;

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
            
            player[i].fireCD = Math.max(player[i].fireCD - 1/60, 0);
            if (player[i].input.fire > 0)
                {
                    if (player[i].fireCD <= 0)
                        {
                            FireBullet(player[i]);
                            player[i].fireCD = fireRate;
                        }
                }            
        }
    var bulletSet = getAllBullets();
    for (var x = 0; x < bulletSet.length; x++)
        {
            for (var y = 0; y < bulletSet[x].length; y++)
                {
                    console.log(bulletSet[x][y]);
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

function getAllBullets(){
    var bullets = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var bulletSet = io.sockets.connected[socketID].bulletSet;
        if (bulletSet) { bullets.push(bulletSet); }
    });
    return bullets;
}

function FireBullet(player) {

}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}