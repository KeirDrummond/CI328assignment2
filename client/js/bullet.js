class Bullet extends Phaser.GameObjects.GameObject {
    constructor(id, x, y, angle) {
        super(game, 'Bullet');
        
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.alive = false;
        
        this.sprite = game.add.sprite(x, y, 'bullet');
        this.sprite.setOrigin(0, 0);
        this.sprite.angle = this.angle;
        
        // Clones
        
        this.clone = new Array(3);
        
        var mirror = Game.mirror(this.x, this.y);
        
        this.clone[0] = game.add.sprite(mirror.x, this.y, 'bullet');
        this.clone[0].setOrigin(0, 0);
        this.clone[0].angle = this.angle;
        
        this.clone[1] = game.add.sprite(this.x, mirror.y, 'bullet');
        this.clone[1].setOrigin(0, 0);
        this.clone[1].angle = this.angle;
        
        this.clone[2] = game.add.sprite(mirror.x, mirror.y, 'bullet');
        this.clone[2].setOrigin(0, 0);
        this.clone[2].angle = this.angle;    
    }
    
    Destroy() {
        this.sprite.destroy();
        this.clone[0].destroy();
        this.clone[1].destroy();
        this.clone[2].destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setVisible(this.alive);
        this.clone[0].setVisible(this.alive);
        this.clone[1].setVisible(this.alive);
        this.clone[2].setVisible(this.alive);
        
        if (this.alive)
            {
                this.sprite.setPosition(this.x, this.y);
                this.sprite.angle = this.angle;
                
                var mirror = Game.mirror(this.x, this.y);
        
                this.clone[0].setPosition(mirror.x, this.y);
                this.clone[0].angle = this.angle;

                this.clone[1].setPosition(this.x, mirror.y);
                this.clone[1].angle = this.angle;

                this.clone[2].setPosition(mirror.x, mirror.y);
                this.clone[2].angle = this.angle;
            }
    }
}