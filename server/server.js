const PORT = 55000;

var server = require('http').createServer();
var io = require('socket.io')(server);
var SAT = require('sat');

// Constant reference to the game size.

const GameSize = {
    x: 2560,
    y: 1600
};

// When a new player connects

io.on('connection', function(client) {
    
    // A player will ask for a new player object when joining the game world. 
    
    client.on('newplayer',function(name, colour) {
        client.player = {
            id: server.lastPlayerID++, // The ID of the player so each player can be identified.
            displayName: name, // The display name of the user. Ideally, this can be user inputted when asking for a new player.
            polygon: new SAT.Polygon(new SAT.Vector(randomInt(0, GameSize.x), randomInt(0, GameSize.y)), [ // The body of the player using the SAT library.
                new SAT.Vector(0, 0),
                new SAT.Vector(64, 0),
                new SAT.Vector(64, 32),
                new SAT.Vector(0, 32)
            ]),
            health: 5, // Initial health points of a player.
            alive: true, // The player's alive state.
            colour: colour, // The colour of the player as determined by the player client.
            input: { // Flags for input. Movement, with direction, and firing.
                move: 0,
                fire: 0
            },
            fireCD: 0, // The cooldown state of firing. When 0, the player can fire again.
            score: 0 // The score of the player.
        };
        
        // Each player has a set of bullets associated with their object. These objects are reused after being fired.
        
        client.player.bulletSet = new Array(5);
        for (var i = 0; i < client.player.bulletSet.length; i++)
            {
                client.player.bulletSet[i] = 
                    {
                        owner: client.player.id, // Owner of the bullet.
                        polygon: new SAT.Polygon(new SAT.Vector(0, 0), [ // Body of the bullet.
                            new SAT.Vector(0, 0),
                            new SAT.Vector(8, 0),
                            new SAT.Vector(8, 8),
                            new SAT.Vector(0, 8)
                        ]),
                        lifetime: 1, // The length of time in seconds a bullet is alive for until it disappears.
                        alive: false // The alive state of the bullet.
                    };
            }
        
        // Print to the console when a player connects.
        console.log('connecting: ' + client.player.id); 
        // Alert the player client of all players currently in the game as well as the Game Size so it can be synchronised.
        client.emit('allplayers', getAllPlayers(), GameSize);
        // Gives the player a reference to the new player that has been created so the client camera knows which player object to follow.
        client.emit('getSelf', client.player.id); 

        client.broadcast.emit('newplayer', client.player); // When the new player connects, all existing players are alerted.
        
        // On player disconnect.
        client.on('disconnect',function() { 
            io.emit('remove', client.player.id);
            client.broadcast.emit('leftplayer', client.player);
            console.log('disconnecting: ' + client.player.id); // Print to console when a player disconnects.
        });
        
        // Sets the player's movement input value.
        client.on('inputmove',function(input) {
            input = Math.max(-1, Math.min(1, input));
            client.player.input.move = input;
        });
        
        // Sets the player's fire input value.
        client.on('inputfire',function(input) {
            input = Math.max(0, Math.min(1, input));
            client.player.input.fire = input;
        });
    });  
});


server.lastPlayerID = 0; // For creating new player IDs.

// Listens for connecting players.
server.listen(PORT, function(){
    console.log('Listening on ' + server.address().port);
});

// Constants for player attributes.
const planeSpeed = 5;
const fireRate = 1.5;
const bulletLifetime = 1;
const rotationSpeed = 1.5;


// Useful function for manipulating player movement based on their angle.
function degrees_to_radians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

// Calls the Update function 60 times a second, making the game run at 60fps.
setInterval(Update, 1000/60);
function Update() {
    var player = getAllPlayers();
    var bullets = getAllBullets();
    
    // Updates player movement and checks collision.
    for (var i = 0; i < player.length; i++)
        {
            if (player[i].alive)
                {
                    // Movement.
                    player[i].polygon.angle += player[i].input.move * rotationSpeed;

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

                    // Collision with bullets.
                    for (var b = 0; b < bullets.length; b++)
                        {
                            if (bullets[b].alive && bullets[b].owner != player[i].id)
                                {
                                    var response = new SAT.Response();
                                    var collided = SAT.testPolygonPolygon(player[i].polygon, bullets[b].polygon, response);
                                    if (collided)
                                        {
                                            // The player has collided with a bullet.
                                            bullets[b].alive = false;
                                            PlayerDamage(player[i], 1, bullets[b].owner);
                                        }
                                    response.clear();
                                }
                        }
                }
            
        }
    
    const bulletSpeed = 15;    
    
    // Updates bullet movement and lifetimer.
    for (var i = 0; i < bullets.length; i++)
        {
            if (bullets[i].alive)
                {   
                    // Bullet movement.
                    bullets[i].polygon.pos.x += bulletSpeed * Math.cos(degrees_to_radians(bullets[i].polygon.angle));
                    bullets[i].polygon.pos.y += bulletSpeed * Math.sin(degrees_to_radians(bullets[i].polygon.angle));

                    if (bullets[i].polygon.pos.x > GameSize.x) { bullets[i].polygon.pos.x -= GameSize.x; }
                    else if (bullets[i].polygon.pos.x < 0) { bullets[i].polygon.pos.x += GameSize.x; }
                    if (bullets[i].polygon.pos.y > GameSize.y) { bullets[i].polygon.pos.y -= GameSize.y; }
                    else if (bullets[i].polygon.pos.y < 0) { bullets[i].polygon.pos.y += GameSize.y; }
                    
                    // Bullet lifetime.
                    bullets[i].lifetime -= 1/60;
                    if (bullets[i].lifetime <= 0)
                        {
                            bullets[i].alive = false;
                        }
                }
        }
    
    // At the end of the update function, send the latest information about all players to all players.
    io.emit('update', getAllPlayers());
}

// When player takes damage.
function PlayerDamage(player, damage, otherplayer) {
    player.health -= damage;
    io.emit('takedamage', player.id, player.health);
    
    // If the player's health has gone below 0, they are not alive, they are set to respawn after 2 seconds and the player that hit them scores a point.
    if (player.health <= 0)
    {
        player.alive = false;
        setTimeout(RespawnPlayer, 2000, player);
        ScorePoint(otherplayer);
    }
}

// Function that gets all connected sockets and if they have a player, get the player object and puts it into an array. Repeats until all players are obtained and returns it.
function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player) { players.push(player); }
    });
    return players;
}

// Function that gets all connected sockets and if they have a player, get the player object's bullet set and puts them into an array. Repeats until all bullets are obtained and returns it.
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

// Called upon the player successfully attempting to fire a shot.
function FireBullet(player) {
    
    // Tell the players that this player has fired.
    io.emit('fire', player.id);
    
    var quickFireRate = 75; // Delay in milliseconds
    
    // Each bullet fires from in front of the player. Upon firing, call the next bullet to fire after a short delay.    
    
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

// Upon a player defeating another player, they score 1 point.
function ScorePoint(id)
{
    var player = getAllPlayers();
    
    var scoringPlayer
    
    // Gets the scoring player from their ID.
    for (var i = 0; i < player.length; i++)
        {
            if (player[i].id == id)
                {
                    scoringPlayer = player[i];
                    break;
                }
        }
    
    // Increment the player's score.
    scoringPlayer.score ++;
    
    // Alert players that this player has scored.
    io.emit('score', getAllPlayers());
    console.log("Player " + id + " score: " + scoringPlayer.score);
    
    // If the player has reached 10 points, the game ends.
    if (scoringPlayer.score >= 10) {
        io.emit('end');
    }
}

// Respawn the player at a random position.
function RespawnPlayer(player)
{
    player.polygon.pos.x = randomInt(0, GameSize.x);
    player.polygon.pos.y = randomInt(0, GameSize.y);
    player.polygon.angle = 0;
    player.health = 5;
    player.alive = true;
    
    io.emit('respawn', player.id);
}

// Utility function used to get a random value.
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}