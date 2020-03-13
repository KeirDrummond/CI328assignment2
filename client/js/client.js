var Client = {};
Client.socket = io('http://localhost:55000');

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
}

Client.socket.on('newplayer',function(data){
    //Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers', function(data){
    for (var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
});

Client.socket.on('update', function(data){
    for (var i = 0; i < data.length; i++){
        Game.playerMap[data[i].id].x = data[i].x;
    }
})