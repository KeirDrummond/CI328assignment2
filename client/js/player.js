class Player extends Phaser.GameObjects.GameObject {
    constructor(id, x, y, angle, colour) {
        super(game, 'Player');
        
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.colour = colour;
        
        this.sprite = game.add.sprite(x, y, 'sprite');
        this.sprite.angle = this.angle;
        this.sprite.tint = this.colour;
        console.log("New player added");
    }
    
    OnDisconnect() {
        this.sprite.destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setPosition(this.x, this.y);
        this.sprite.angle = this.angle;
    }
}