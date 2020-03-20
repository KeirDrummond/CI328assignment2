var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);