class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }
    
    preload() {
        this.load.image('background', 'assets/MenuNew2.png');
        this.load.image('logo', 'assets/FlyingAcesNewBevel.png');
        this.load.image('start', 'assets/StartButton.png');
    }
    
    create() {
        IsInGame = false;
        
        // The background.
        var background = this.add.sprite(0, 0, 'background');
        background.setOrigin(0, 0);
        
        // The logo.
        var logo = this.add.sprite(640, 300, 'logo');
        logo.setOrigin(0.5, 0.5);
        
        // The controls shown on screen.
        var text = this.add.text(640, 400, 'Up/Down to move up and down, space to shoot!');
        text.setOrigin(0.5, 0.5);
        text.setFontSize(32);
        text.setStroke('#000000', 4);
        text.setDepth(1);
        
        // The start button.
        var startButton = this.add.sprite(640, 700, 'start');
        startButton.setOrigin(0.5, 0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScreen');
        });
    }
    
}