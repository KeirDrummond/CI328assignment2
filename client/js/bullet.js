class Bullet extends Phaser.GameObjects.GameObject {
    constructor(id, x, y, angle) {
        super(game, 'Bullet');
        
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        
        this.sprite = game.add.sprite(x, y, 'bullet');
        this.sprite.angle = this.angle;
    }
    
    Destroy() {
        this.sprite.destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setPosition(this.x, this.y);
    }
}