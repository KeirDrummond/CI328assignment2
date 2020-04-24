const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);
var SAT = require('sat');

var GameSize = {
    x: 2560,
    y: 1600
};

io.on('connection', function(client) {
    
    client.on('test', function() {
        console.log('test recieved');
    });
    
    client.on('newplayer',function(colour) {
        client.player = {
            id: server.lastPlayerID++,
            polygon: new SAT.Polygon(new SAT.Vector(randomInt(100, 1180), randomInt(100, 700)), [
                new SAT.Vector(0, 0),
                new SAT.Vector(64, 0),
                new SAT.Vector(64, 32),
                new SAT.Vector(0, 32)
            ]),
            health: 5,
            alive: true,
            colour: colour,
            input: {
                move: 0,
                fire: 0
            },
            fireCD: 0,
            score: 0
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
        client.emit('allplayers', getAllPlayers(), GameSize);
        client.emit('getSelf', client.player.id);
        
        client.broadcast.emit('newplayer', client.player);

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
            if (player[i].alive)
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

                    /*for (var p = 0; p < player.length; p++)
                        {
                            if (player[p].alive && i != p)
                                {
                                    var response = new SAT.Response();
                                    var collided = SAT.testPolygonPolygon(player[i].polygon, player[p].polygon, response);
                                    if (collided)
                                        {
                                            // Do something.
                                            console.log("Player collision");
                                            player[i].health --;
                                        }
                                    response.clear();
                                }
                        }*/

                    for (var b = 0; b < bullets.length; b++)
                        {
                            if (bullets[b].alive && bullets[b].owner != player[i].id)
                                {
                                    var response = new SAT.Response();
                                    var collided = SAT.testPolygonPolygon(player[i].polygon, bullets[b].polygon, response);
                                    if (collided)
                                        {
                                            // Do something.
                                            bullets[b].alive = false;
                                            player[i].health --;
                                            
                                            if (player[i].health <= 0)
                                                {
                                                    player[i].alive = false;
                                                    setTimeout(RespawnPlayer, 2000, player[i]);
                                                    ScorePoint(bullets[b].owner);
                                                }
                                        }
                                    response.clear();
                                }
                        }
                }
            
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

function ScorePoint(id)
{
    var player = getAllPlayers();
    
    var scoringPlayer
    
    for (var i = 0; i < player.length; i++)
        {
            if (player[i].id == id)
                {
                    scoringPlayer = player[i];
                    break;
                }
        }
    
    scoringPlayer.score ++;
    
    console.log("Player " + id + " score: " + scoringPlayer.score);
}

function RespawnPlayer(player)
{
    player.polygon.pos.x = randomInt(100, 1180);
    player.polygon.pos.y = randomInt(100, 700);
    player.polygon.angle = 0;
    player.health = 5;
    player.alive = true;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}