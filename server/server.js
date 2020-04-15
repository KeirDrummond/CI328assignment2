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
            size: {
                width: 64,
                height: 32
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
                        size: {
                            width: 8,
                            height: 8
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
            
            //Collision
            
            var ppCollision = CheckCollisions(player, player);
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
                }
        }
    
    var bulletSpeed = 15;    
    
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

function CheckCollisions(array1, array2){
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


function CheckCollisionAABB(objectA, objectB)
{    
    if ((objectA.position.x - (objectA.size.width / 2))                         < (objectB.position.x - (objectB.size.width / 2)) + objectB.size.width &&
        (objectA.position.x - (objectA.size.width / 2)) + objectA.size.width    > (objectB.position.x - (objectB.size.width / 2)) &&
        (objectA.position.y - (objectA.size.width / 2))                         < (objectB.position.y - (objectB.size.width / 2)) + objectB.size.width &&
        (objectA.position.y - (objectA.size.width / 2)) + objectA.size.width    > (objectB.position.y - (objectB.size.width / 2)))
        { return true; }
    return false;
}

function CheckCollisionSAT(objectA, objectB)
{
    console.log("Checking SAT");
    return false;
}

function FireBullet(player) {
    
    var quickFireRate = 75; // Delay in milliseconds
    
    Bullet1();
    
    function Bullet1(){
        player.bulletSet[0].position.x = player.position.x + (player.size.width * Math.cos(degrees_to_radians(player.angle)));
        player.bulletSet[0].position.y = player.position.y + (player.size.width * Math.sin(degrees_to_radians(player.angle)));
        player.bulletSet[0].angle = player.angle;
        player.bulletSet[0].lifetime = bulletLifetime;
        player.bulletSet[0].alive = true;
        setTimeout(Bullet2, quickFireRate);
    }
    function Bullet2(){
        player.bulletSet[1].position.x = player.position.x + (player.size.width * Math.cos(degrees_to_radians(player.angle)));
        player.bulletSet[1].position.y = player.position.y + (player.size.width * Math.sin(degrees_to_radians(player.angle)));
        player.bulletSet[1].angle = player.angle;
        player.bulletSet[1].lifetime = bulletLifetime;
        player.bulletSet[1].alive = true;
        setTimeout(Bullet3, quickFireRate);
    }
    function Bullet3(){
        player.bulletSet[2].position.x = player.position.x + (player.size.width * Math.cos(degrees_to_radians(player.angle)));
        player.bulletSet[2].position.y = player.position.y + (player.size.width * Math.sin(degrees_to_radians(player.angle)));
        player.bulletSet[2].angle = player.angle;
        player.bulletSet[2].lifetime = bulletLifetime;
        player.bulletSet[2].alive = true;
        setTimeout(Bullet4, quickFireRate);
    }
    function Bullet4(){
        player.bulletSet[3].position.x = player.position.x + (player.size.width * Math.cos(degrees_to_radians(player.angle)));
        player.bulletSet[3].position.y = player.position.y + (player.size.width * Math.sin(degrees_to_radians(player.angle)));
        player.bulletSet[3].angle = player.angle;
        player.bulletSet[3].lifetime = bulletLifetime;
        player.bulletSet[3].alive = true;
        setTimeout(Bullet5, quickFireRate);
    }
    function Bullet5(){
        player.bulletSet[4].position.x = player.position.x + (player.size.width * Math.cos(degrees_to_radians(player.angle)));
        player.bulletSet[4].position.y = player.position.y + (player.size.width * Math.sin(degrees_to_radians(player.angle)));
        player.bulletSet[4].angle = player.angle;
        player.bulletSet[4].lifetime = bulletLifetime;
        player.bulletSet[4].alive = true;
    }
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}