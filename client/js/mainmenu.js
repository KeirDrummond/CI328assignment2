class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }
    
    preload() {
        this.load.image('image', 'assets/Hill_Background.png');
    }
    
    create() {
        var startButton = this.add.sprite(0, 0, 'image');
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScreen');
        })
    }
    
}