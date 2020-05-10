var Game = {};

var GameSize = {
    x: 2560,
    y: 1600
};

var Input = {};

class GameScreen extends Phaser.Scene {
    constructor() {
        super('GameScreen');
    }
    
    preload() {
        game = this;
        this.load.image('sprite', 'assets/Plane5.png');
        this.load.image('bullet', 'assets/Bullet_8x8.png');
        this.load.image('bg', 'assets/Background_Sky_3.png');
        this.load.image('heart', 'assets/Heart_16x16.png');
        this.load.image('scoreboard', 'assets/Scoreboard_220x300.png');
        this.load.image('muted', 'assets/Mute.png');
        this.load.image('unmuted', 'assets/Unmuted.png');
        
        this.load.audio('music', 'assets/GameMusic.wav');
        this.load.audio('fire', 'assets/shotburst_01.wav');
        this.load.audio('explosion', 'assets/explosion.wav');
        this.load.audio('damage', 'assets/damage.wav');
    }

    create() {
        Client.socket.connect();
        IsInGame = true;
                
        Game.UserInterface = new UserInterface();
        
        Game.SoundEffectHandler = new SoundEffectHandler();
        Game.SoundEffectHandler.StartMusic();
        
        var muteButton = this.add.sprite(1240, 40, 'unmuted').setScrollFactor(0);
        muteButton.setDepth(1);
        muteButton.setOrigin(0.5, 0.5);
        muteButton.setInteractive();
        muteButton.on('pointerdown', () => {
            if (!Game.SoundEffectHandler.IsMuted()) {
                Game.SoundEffectHandler.MuteAll();
                muteButton.setTexture('muted');
            }
            else {
                Game.SoundEffectHandler.UnmuteAll();
                muteButton.setTexture('unmuted');
            }
        });

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

        Input.move = {
            up: false,
            down: false
        };
        Input.fire = 0;

        var testKey = this.input.keyboard.addKey('ENTER');
        testKey.on('down', function() { Client.sendTest });

        var inputKeys = this.input.keyboard.addKeys({
            up: 'up',
            down: 'down',
            space: 'SPACE'
        });
        
        inputKeys.up.on('down', function(event) { Input.move.up = true; Client.inputMove(Input.move); });
        inputKeys.up.on('up', function(event) { Input.move.up = false; Client.inputMove(Input.move); });

        inputKeys.down.on('down', function(event) { Input.move.down = true; Client.inputMove(Input.move); });
        inputKeys.down.on('up', function(event) { Input.move.down = false; Client.inputMove(Input.move); });

        inputKeys.space.on('down', function(event) { Input.fire = 1; Client.inputFire(Input.fire); });
        inputKeys.space.on('up', function(event) { Input.fire = 0; Client.inputFire(Input.fire); });

        var randomColour = Math.random() * 0xffffff
        Client.askNewPlayer('Player', randomColour);
    }

    update() {
        Client.update();
        Object.keys(Game.playerMap).forEach(function(player){
            Game.playerMap[player].update();
        });
    }
    
}

Game.addNewPlayer = function(id, displayName, polygon, colour, bulletSet){
    Game.playerMap[id] = new Player(id, displayName, polygon, colour, bulletSet);
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

Game.GameOver = function(){
    game.sound.stopAll();
    game.scene.start('GameOver', { scores: Game.UserInterface.ScoreBoard.getScores() });
}