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
        
        client.player.bulletSet = new Array(5);
        for (var i = 0; i < client.player.bulletSet.length; i++)
            {
                client.player.bulletSet[i] = 
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
    
    var bulletSpeed = 10;
    
    var bullets = getAllBullets();
    for (var i = 0; i < bullets.length; i++)
        {
            if (bullets[i].alive)
                {                    
                    bullets[i].position.x += bulletSpeed * Math.cos(degrees_to_radians(bullets[i].angle));
                    bullets[i].position.y += bulletSpeed * Math.sin(degrees_to_radians(bullets[i].angle));

                    if (bullets[i].position.x > GameSize.x) { bullets[i].position.x -= GameSize.x; }
                    else if (bullets[i].position.x < 0) { bullets[i].position.x += GameSize.x; }
                    if (bullets[i].position.y > GameSize.y) { bullets[i].position.y -= GameSize.y; }
                    else if (bullets[i].position.y < 0) { bullets[i].position.y += GameSize.y; }
                    
                    bullets[i].lifetime -= 1/60;
                    if (bullets[i].lifetime <= 0)
                        {
                            bullets[i].alive = false;
                        }
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
        var player = io.sockets.connected[socketID].player;
        if (player) {
            for (i = 0; i < player.bulletSet.length; i++)
                {
                    bullets.push(player.bulletSet[i]);
                }
        }
    });
    return bullets;
}

function FireBullet(player) {
    
    var quickFireRate = 100; // Delay in milliseconds
    
    Bullet1();
    
    function Bullet1(){
        player.bulletSet[0].position.x = player.position.x;
        player.bulletSet[0].position.y = player.position.y;
        player.bulletSet[0].angle = player.angle;
        player.bulletSet[0].lifetime = 1;
        player.bulletSet[0].alive = true;
        setTimeout(Bullet2, quickFireRate);
        console.log("Bullet 1");
    }
    function Bullet2(){
        player.bulletSet[1].position.x = player.position.x;
        player.bulletSet[1].position.y = player.position.y;
        player.bulletSet[1].angle = player.angle;
        player.bulletSet[1].lifetime = 1;
        player.bulletSet[1].alive = true;
        setTimeout(Bullet3, quickFireRate);
        console.log("Bullet 2");
    }
    function Bullet3(){
        player.bulletSet[2].position.x = player.position.x;
        player.bulletSet[2].position.y = player.position.y;
        player.bulletSet[2].angle = player.angle;
        player.bulletSet[2].lifetime = 1;
        player.bulletSet[2].alive = true;
        setTimeout(Bullet4, quickFireRate);
        console.log("Bullet 3");
    }
    function Bullet4(){
        player.bulletSet[3].position.x = player.position.x;
        player.bulletSet[3].position.y = player.position.y;
        player.bulletSet[3].angle = player.angle;
        player.bulletSet[3].lifetime = 1;
        player.bulletSet[3].alive = true;
        setTimeout(Bullet5, quickFireRate);
        console.log("Bullet 4");
    }
    function Bullet5(){
        player.bulletSet[4].position.x = player.position.x;
        player.bulletSet[4].position.y = player.position.y;
        player.bulletSet[4].angle = player.angle;
        player.bulletSet[4].lifetime = 1;
        player.bulletSet[4].alive = true;
        console.log("Bullet 5");
    }
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}