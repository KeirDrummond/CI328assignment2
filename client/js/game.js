var Game = {};

var GameSize = {
    x: 2560,
    y: 1600
};

var Input = {};

function preload() {
    game = this;
    this.load.image('sprite', 'assets/Plane5.png');
    this.load.image('bullet', 'assets/Bullet_8x8.png');
    this.load.image('bg', 'assets/Background_Sky_3.png');
}

function create() {
    
    var bg = new Array(4);
    
    bg[0] = this.add.sprite(0, 0, 'bg');
    bg[1] = this.add.sprite(GameSize.x, 0, 'bg');
    bg[2] = this.add.sprite(0, GameSize.y, 'bg');
    bg[3] = this.add.sprite(GameSize.x, GameSize.y, 'bg');
    
    for (var i = 0; i < bg.length; i++)
        {
            bg[i].setDisplayOrigin(0, 0);
            bg[i].scale = 2;
            bg[i].width = 1280;
            bg[i].height = 800;
            bg[i].setOrigin(0.5, 0.5);
        }
    
    Game.playerMap = {};
    
    game.cameras.main.setZoom(0.7);
    
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

Game.addNewPlayer = function(id, polygon, colour, bulletSet){
    Game.playerMap[id] = new Player(id, polygon, colour, bulletSet);
}

Game.mirror = function(x, y){
    var mirror = {
        x: 0,
        y: 0
    }
    
    var GameSize = {
        x: 2560,
        y: 1600
    };
    
    var xpos = x;
    var ypos = y;
        
    if (xpos < GameSize.x / 2)
        {
            mirror.x = xpos + GameSize.x;
        }
    else
        {
            mirror.x = xpos - GameSize.x;
        }
    if (ypos < GameSize.y / 2)
        {
            mirror.y = ypos + GameSize.y;
        }
    else
        {
            mirror.y = ypos - GameSize.y;
        }
    
    return mirror;
}