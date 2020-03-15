var Game = {};

function preload() {
    game = this;
    this.load.image('sprite', 'assets/plane.png');
}

//console.log(game);

function create() {
    Game.playerMap = {};
    var testKey = this.input.keyboard.addKey('ENTER');
    testKey.on('down', function() { Client.sendTest });
    Client.askNewPlayer();
}

function update() {
    Client.update();
    Object.keys(Game.playerMap).forEach(function(player){
        Game.playerMap[player].update();
    });
}

Game.addNewPlayer = function(id, x, y){
    Game.playerMap[id] = new Player(id, x, y);
}