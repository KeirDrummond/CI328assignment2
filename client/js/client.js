var Client = {};
Client.socket = io('http://localhost:55000');

Client.askNewPlayer = function(name, colour){
    Client.socket.emit('newplayer', name, colour);
}

Client.inputMove = function(value){
    if (value.up && value.down) { Client.socket.emit('inputmove', 0); }
    if (value.up && !value.down) { Client.socket.emit('inputmove', -1); }
    if (!value.up && value.down) { Client.socket.emit('inputmove', 1); }
    if (!value.up && !value.down) { Client.socket.emit('inputmove', 0); }
}

Client.inputFire = function(value){
    Client.socket.emit('inputfire', value);
}

Client.socket.on('newplayer',function(data){
    if (IsInGame){
        Game.addNewPlayer(data.id, data.displayName, data.polygon, data.colour, data.bulletSet);
        Game.UserInterface.ScoreBoard.UpdateScore();
    }
});

Client.socket.on('leftplayer',function(data){
    if (IsInGame) {
        var player = Game.playerMap[data.id];
        delete Game.playerMap[player.id];
        player.OnDisconnect();
        Game.UserInterface.ScoreBoard.UpdateScore();
    } 
});

Client.socket.on('allplayers', function(data, size){
    GameSize = size;
    for (var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].displayName, data[i].polygon, data[i].colour, data[i].bulletSet);
    }
    if (IsInGame){
        Game.UserInterface.ScoreBoard.UpdateScore();
    }    
});

Client.socket.on('takedamage', function(id, health){
    if (IsInGame) {
        Game.playerMap[id].TakeDamage(health);
    }    
});

Client.socket.on('respawn', function(id){
    if (IsInGame) {
        Game.playerMap[id].Respawn();
    }    
});

Client.socket.on('getSelf', function(id){
    if (IsInGame) {
        Game.localPlayer = Game.playerMap[id];
        game.cameras.main.startFollow(Game.playerMap[id], true);
    }
});

Client.socket.on('score', function(data){
    if (IsInGame) {
        for (var i = 0; i < data.length; i++)
        {
            if (Game.playerMap[data[i].id] != null) {
                Game.playerMap[data[i].id].score = data[i].score;
            }
        }
        Game.UserInterface.ScoreBoard.UpdateScore();
    }
});

Client.socket.on('fire', function(player){
    if (IsInGame) {
        Game.playerMap[player].Fire();
    }
});

Client.socket.on('end', function(){
    Game.GameOver();
});

Client.socket.on('update', function(data){
    if (IsInGame) {
        for (var i = 0; i < data.length; i++){
            if (Game.playerMap[data[i].id] != null) {
                Game.playerMap[data[i].id].x = data[i].polygon.pos.x;
                Game.playerMap[data[i].id].y = data[i].polygon.pos.y;
                Game.playerMap[data[i].id].angle = data[i].polygon.angle;
                Game.playerMap[data[i].id].alive = data[i].alive;
                Game.playerMap[data[i].id].bulletSet = data[i].bulletSet;
            }
        }
    }

});