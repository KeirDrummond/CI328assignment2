var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: 1280,
    height: 800,
    scene: [MainMenu, GameScreen, GameOver]
};

var game = new Phaser.Game(config);
var IsInGame = false;