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
var fireRate = 3;

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
    
    for (var i = 0; i < BulletArray.length; i++)
        {
            BulletArray[i].position.x += planeSpeed * Math.cos(degrees_to_radians(BulletArray[i].angle));
            BulletArray[i].position.y += planeSpeed * Math.sin(degrees_to_radians(BulletArray[i].angle));
            
            if (BulletArray[i].position.x > GameSize.x) { BulletArray[i].position.x -= GameSize.x; }
            else if (BulletArray[i].position.x < 0) { BulletArray[i].position.x += GameSize.x; }
            if (BulletArray[i].position.y > GameSize.y) { BulletArray[i].position.y -= GameSize.y; }
            else if (BulletArray[i].position.y < 0) { BulletArray[i].position.y += GameSize.y; }
            
            if (BulletArray[i].angle > 180) { BulletArray[i].angle -= 360; }
            if (BulletArray[i].angle < -180) { BulletArray[i].angle += 360; }
            
            BulletArray[i].lifetime -= 1/60;
            if (BulletArray[i].lifetime <= 0)
                {
                    
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

function FireBullet(player) {
    console.log("Pew");
    var bullet = {
        id: 
        owner: player.id,
        position: {
            x: player.position.x + 64,
            y: player.position.y
        },
        angle: player.angle,
        lifetime: 5 
    };
    BulletArray.push(bullet);
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}