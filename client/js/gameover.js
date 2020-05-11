class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    
    init(data){
        // Re
        this.scores = data.scores;
    }
    
    preload() {
        this.load.image('background', 'assets/MenuNew2.png');
        this.load.image('gameover', 'assets/GameOverBevel.png');
        this.load.image('return', 'assets/ReturnButton.png');
    }
    
    create() {
        // Constructs the scoreboard.
        this.scoreboard();
        // Disconnect the player from the server. This way, a new player can be created if rejoining.
        Client.socket.disconnect();
        
        IsInGame = false;
        
        // Background.
        var background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        
        // Logo.
        var logo = this.add.sprite(640, 300, 'gameover');
        logo.setOrigin(0.5, 0.5);
        
        // Return button.
        var returnButton = this.add.sprite(640, 700, 'return');
        returnButton.setOrigin(0.5, 0.5);
        returnButton.setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
    
    // The scoreboard.
    scoreboard() {
        var textList = new Array(3);
        var textMargin = 30;
        
        // Constructs the text and makes them invisible.
        for (var i = 0; i < textList.length; i++)
            {
                textList[i] = this.add.text(640, 400 + textMargin * i, 'Player');
                textList[i].setOrigin(0.5, 0.5);
                textList[i].setFontSize(32);
                textList[i].setStroke('#000000', 4);
                textList[i].setDepth(1);
                textList[i].setVisible(false);
            }
        
        // Sets the scores into a new array and orders them.
        var list = new Array();
        for (var player in this.scores) {
            list.push(this.scores[player]);
        }

        list.sort(function(a, b) {
           return b.score - a.score; 
        });
        
        // Reconstructs the text in order of the ordered list.
        for (var i = 0; i < textList.length; i++)
            {
                if (list[i]) {
                    textList[i].setVisible(true);
                    textList[i].setText(list[i].displayName + " " + list[i].id + ': ' + list[i].score);
                    textList[i].setTint(list[i].colour);
                }
            }
        
    }
    
}