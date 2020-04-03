class Bullet extends Phaser.GameObjects.GameObject {
    constructor(id, x, y, angle) {
        super(game, 'Bullet');
        
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.alive = false;
        
        this.sprite = game.add.sprite(x, y, 'bullet');
        this.sprite.angle = this.angle;
    }
    
    Destroy() {
        this.sprite.destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setVisible(this.alive);
        if (this.alive)
            {
                this.sprite.setPosition(this.x, this.y);
                this.sprite.angle = this.angle;
            }
    }
}