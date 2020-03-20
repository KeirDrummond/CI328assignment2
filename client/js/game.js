var Game = {};

var Input = {};

function preload() {
    game = this;
    this.load.image('sprite', 'assets/Plane3.png');
    this.load.image('bg', 'assets/Hill_Background.png');
}

//console.log(game);

function create() {
    var bg = this.add.sprite(0, 0, 'bg');
    bg.setDisplayOrigin(0, 0);
    bg.scale = 1;
    bg.width = 800;
    bg.height = 600;
    Game.playerMap = {};
    
    Input.move = 0;
    Input.fire = 0;
    
    var testKey = this.input.keyboard.addKey('ENTER');
    testKey.on('down', function() { Client.sendTest });
    
    var inputKeys = this.input.keyboard.addKeys({
        up: 'up',
        down: 'down',
        space: 'SPACE'
    });
    inputKeys.up.on('down', function(event) { Input.move -= 1; Input.move = Math.max(Input.move, -1); Client.inputMove(Input.move); });
    inputKeys.up.on('up', function(event) { Input.move += 1; Input.move = Math.min(Input.move, 1); Client.inputMove(Input.move); });
    
    inputKeys.down.on('down', function(event) { Input.move += 1; Input.move = Math.min(Input.move, 1); Client.inputMove(Input.move); });
    inputKeys.down.on('up', function(event) { Input.move -= 1; Input.move = Math.max(Input.move, -1); Client.inputMove(Input.move); });
    
    inputKeys.space.on('down', function(event) { Input.fire = 1; Client.inputFire(Input.fire); });
    inputKeys.space.on('up', function(event) { Input.fire = 0; Client.inputFire(Input.fire); });
    
    var randomColour = Math.random() * 0xffffff
    Client.askNewPlayer(randomColour);
}

function update() {
    Client.update();
    Object.keys(Game.playerMap).forEach(function(player){
        Game.playerMap[player].update();
    });
}

Game.addNewPlayer = function(id, x, y, angle, colour){
    Game.playerMap[id] = new Player(id, x, y, angle, colour);
}