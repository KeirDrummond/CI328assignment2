class Player extends Phaser.GameObjects.GameObject {
    constructor(id, x, y, colour) {
        super(game, 'Player');
        
        this.id = id;
        this.x = x;
        this.y = y;
        this.colour = colour;
        
        this.sprite = game.add.sprite(x, y, 'sprite');
        this.sprite.tint = this.colour;
        console.log("New player added");
    }
    
    OnDisconnect() {
        this.sprite.destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setPosition(this.x, this.y);
    }
}