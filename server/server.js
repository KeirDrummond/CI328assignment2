const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);
var SAT = require('sat');

io.on('connection', function(client) {
    
    client.on('test', function() {
        console.log('test recieved');
    });
    
    client.on('newplayer',function(colour) {
        client.player = {
            id: server.lastPlayerID++,
            polygon: new SAT.Polygon(new SAT.Vector(0, 0), [
                new SAT.Vector(0, 0),
                new SAT.Vector(64, 0),
                new SAT.Vector(64, 32),
                new SAT.Vector(0, 32)
            ]),
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
                        polygon: new SAT.Polygon(new SAT.Vector(0, 0), [
                            new SAT.Vector(0, 0),
                            new SAT.Vector(8, 0),
                            new SAT.Vector(8, 8),
                            new SAT.Vector(0, 8)
                        ]),
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

var BulletArray = {};

var planeSpeed = 5;
var fireRate = 1.5;
var bulletLifetime = 0.75;

function degrees_to_radians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

setInterval(Update, 1000/60);
function Update() {
    var player = getAllPlayers();
    var bullets = getAllBullets();
    for (var i = 0; i < player.length; i++)
        {
            player[i].polygon.angle += player[i].input.move;

            player[i].polygon.pos.x += planeSpeed * Math.cos(degrees_to_radians(player[i].polygon.angle));
            player[i].polygon.pos.y += planeSpeed * Math.sin(degrees_to_radians(player[i].polygon.angle));
            
            if (player[i].polygon.pos.x > GameSize.x) { player[i].polygon.pos.x -= GameSize.x; }
            else if (player[i].polygon.pos.x < 0) { player[i].polygon.pos.x += GameSize.x; }
            if (player[i].polygon.pos.y > GameSize.y) { player[i].polygon.pos.y -= GameSize.y; }
            else if (player[i].polygon.pos.y < 0) { player[i].polygon.pos.y += GameSize.y; }
            
            player[i].fireCD = Math.max(player[i].fireCD - 1/60, 0);
            if (player[i].input.fire > 0)
                {
                    if (player[i].fireCD <= 0)
                        {
                            FireBullet(player[i]);
                            player[i].fireCD = fireRate;
                        }
                }
            
            //Collision
            
            /*var ppCollision = CheckCollisions(player, player);
            for (var p1 = 0; p1 < ppCollision.length; p1++)
                {
                    for (var p2 = 0; p2 < ppCollision[p1].length; p2++)
                        {
                            if (ppCollision[p1][p2] && ppCollision[p2][p1])
                                {
                                    // Ensures it won't be called twice.
                                    ppCollision[p1][p2] = false;
                                    ppCollision[p2][p1] = false;
                                    
                                    //Do something.
                                }
                        }
                }
            
            var pbCollision = CheckCollisions(player, bullets);
            for (var p = 0; p < pbCollision.length; p++)
                {
                    for (var b = 0; b < pbCollision[p1].length; b++)
                        {
                            if (pbCollision[p][b] && pbCollision[p][b])
                                {
                                    // Ensures it won't be called twice.
                                    pbCollision[p][b] = false;
                                    pbCollision[b][p] = false;
                                    
                                    //Do something.
                                }
                        }
                }*/
        }
    
    var bulletSpeed = 15;    
    
    for (var i = 0; i < bullets.length; i++)
        {
            if (bullets[i].alive)
                {                    
                    bullets[i].polygon.pos.x += bulletSpeed * Math.cos(degrees_to_radians(bullets[i].polygon.angle));
                    bullets[i].polygon.pos.y += bulletSpeed * Math.sin(degrees_to_radians(bullets[i].polygon.angle));

                    if (bullets[i].polygon.pos.x > GameSize.x) { bullets[i].polygon.pos.x -= GameSize.x; }
                    else if (bullets[i].polygon.pos.x < 0) { bullets[i].polygon.pos.x += GameSize.x; }
                    if (bullets[i].polygon.pos.y > GameSize.y) { bullets[i].polygon.pos.y -= GameSize.y; }
                    else if (bullets[i].polygon.pos.y < 0) { bullets[i].polygon.pos.y += GameSize.y; }
                    
                    bullets[i].lifetime -= 1/60;
                    if (bullets[i].lifetime <= 0)
                        {
                            bullets[i].alive = false;
                        }
                }
        }
}

/*function CheckCollisions(array1, array2){
    var collision = new Array(array1.length);
    
    for (var i = 0; i < collision.length; i++)
        {
            collision[i] = new Array(array2.length);
        }
    for (var x = 0; x < collision.length; x++)
        {
            for (var y = 0; y < collision[x].length; y++)
                {
                    collision[x][y] = false;
                }
        }
    
    for (o1 = 0; o1 < collision.length; o1++)
        {
            for (o2 = 0; o2 < collision[o1].length; o2++)
                {
                    if (!collision[o1][o2] && o1 != o2)
                        {
                            if (CheckCollisionAABB(array1[o1], array2[o2]))
                                {
                                    collision[o1][o2] = true;
                                    collision[o2][o1] = true;
                                }
                        }
                }
        }
    
    for (o1 = 0; o1 < collision.length; o1++)
        {
            for (o2 = 0; o2 < collision[o1].length; o2++)
                {
                    if (collision[o1][o2])
                        {
                            if (!CheckCollisionSAT(array1[o1], array2[o2]))
                                {
                                    collision[o1][o2] = false;
                                    collision[o2][o1] = false;
                                }
                        }
                }
        }
    
    return collision;
}*/

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
    
    var quickFireRate = 75; // Delay in milliseconds
    
    Bullet1();
    
    function Bullet1(){
        player.bulletSet[0].polygon.pos.x = player.polygon.pos.x + (64 * Math.cos(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[0].polygon.pos.y = player.polygon.pos.y + 16 + (64 * Math.sin(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[0].polygon.angle = player.polygon.angle;
        player.bulletSet[0].lifetime = bulletLifetime;
        player.bulletSet[0].alive = true;
        setTimeout(Bullet2, quickFireRate);
    }
    function Bullet2(){
        player.bulletSet[1].polygon.pos.x = player.polygon.pos.x + (64 * Math.cos(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[1].polygon.pos.y = player.polygon.pos.y + 16 + (64 * Math.sin(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[1].polygon.angle = player.polygon.angle;
        player.bulletSet[1].lifetime = bulletLifetime;
        player.bulletSet[1].alive = true;
        setTimeout(Bullet3, quickFireRate);
    }
    function Bullet3(){
        player.bulletSet[2].polygon.pos.x = player.polygon.pos.x + (64 * Math.cos(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[2].polygon.pos.y = player.polygon.pos.y + 16 + (64 * Math.sin(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[2].polygon.angle = player.polygon.angle;
        player.bulletSet[2].lifetime = bulletLifetime;
        player.bulletSet[2].alive = true;
        setTimeout(Bullet4, quickFireRate);
    }
    function Bullet4(){
        player.bulletSet[3].polygon.pos.x = player.polygon.pos.x + (64 * Math.cos(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[3].polygon.pos.y = player.polygon.pos.y + 16 + (64 * Math.sin(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[3].polygon.angle = player.polygon.angle;
        player.bulletSet[3].lifetime = bulletLifetime;
        player.bulletSet[3].alive = true;
        setTimeout(Bullet5, quickFireRate);
    }
    function Bullet5(){
        player.bulletSet[4].polygon.pos.x = player.polygon.pos.x + (64 * Math.cos(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[4].polygon.pos.y = player.polygon.pos.y + 16 + (64 * Math.sin(degrees_to_radians(player.polygon.angle)));
        player.bulletSet[4].polygon.angle = player.polygon.angle;
        player.bulletSet[4].lifetime = bulletLifetime;
        player.bulletSet[4].alive = true;
    }
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}