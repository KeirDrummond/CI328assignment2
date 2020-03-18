var Client = {};
Client.socket = io('http://localhost:55000');

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(colour){
    Client.socket.emit('newplayer', colour);
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
    Game.addNewPlayer(data.id, data.x, data.y, data.angle, data.colour);
    console.log(data.colour);
});

Client.socket.on('leftplayer',function(data){
    var player = Game.playerMap[data.id];
    delete Game.playerMap[player.id];
    player.OnDisconnect();
    
});

Client.socket.on('allplayers', function(data){
    for (var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y, data[i].angle, data[i].colour);
    }
});

Client.socket.on('update', function(data){
    for (var i = 0; i < data.length; i++){
        Game.playerMap[data[i].id].x = data[i].x;
        Game.playerMap[data[i].id].y = data[i].y;
        Game.playerMap[data[i].id].angle = data[i].angle;
    }
})