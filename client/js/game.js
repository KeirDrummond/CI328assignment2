var Game = {};

function preload() {
    game = this;
    this.load.image('sprite', 'assets/plane.png');
    this.load.image('bg', 'assets/Hill_Background.png');
}

//console.log(game);

function create() {
    var bg = this.add.sprite(0, 0, 'bg');
    bg.scale = 1.5;
    bg.width = 800;
    bg.height = 600;
    Game.playerMap = {};
    var testKey = this.input.keyboard.addKey('ENTER');
    testKey.on('down', function() { Client.sendTest });
    
    var randomColour = Math.random() * 0xffffff
    Client.askNewPlayer(randomColour);
}

function update() {
    Client.update();
    Object.keys(Game.playerMap).forEach(function(player){
        Game.playerMap[player].update();
    });
}

Game.addNewPlayer = function(id, x, y, colour){
    Game.playerMap[id] = new Player(id, x, y, colour);
}