var Client = {};
Client.socket = io('http://localhost:55000');

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(name, colour){
    Client.socket.emit('newplayer', name, colour);
}

Client.inputMove = function(value){
    Client.socket.emit('inputmove', value);
}

Client.inputFire = function(value){
    Client.socket.emit('inputfire', value);
}

Client.update = function(){
    Client.socket.emit('update');
}

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id, data.displayName, data.polygon, data.colour, data.bulletSet);
    Game.UserInterface.ScoreBoard.UpdateScore();
});

Client.socket.on('leftplayer',function(data){
    var player = Game.playerMap[data.id];
    delete Game.playerMap[player.id];
    player.OnDisconnect();
    Game.UserInterface.ScoreBoard.UpdateScore();
});

Client.socket.on('allplayers', function(data, size){
    GameSize = size;
    for (var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].displayName, data[i].polygon, data[i].colour, data[i].bulletSet);
    }
    Game.UserInterface.ScoreBoard.UpdateScore();
});

Client.socket.on('takedamage', function(id, health){
    Game.playerMap[id].TakeDamage(health);
});

Client.socket.on('respawn', function(id){
    Game.playerMap[id].Respawn();
});

Client.socket.on('getSelf', function(id){
    Game.localPlayer = Game.playerMap[id];
    game.cameras.main.startFollow(Game.playerMap[id], true);
});

Client.socket.on('score', function(data){
    for (var i = 0; i < data.length; i++)
        {
            Game.playerMap[data[i].id].score = data[i].score;
        }
    Game.UserInterface.ScoreBoard.UpdateScore();
});

Client.socket.on('update', function(data){
    for (var i = 0; i < data.length; i++){
        Game.playerMap[data[i].id].x = data[i].polygon.pos.x;
        Game.playerMap[data[i].id].y = data[i].polygon.pos.y;
        Game.playerMap[data[i].id].angle = data[i].polygon.angle;
        Game.playerMap[data[i].id].alive = data[i].alive;
        Game.playerMap[data[i].id].bulletSet = data[i].bulletSet;
    }
});