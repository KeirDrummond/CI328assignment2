class Player extends Phaser.GameObjects.GameObject {
    constructor(id, x, y, angle, colour, bulletSet) {
        super(game, 'Player');
        
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.colour = colour;
        this.bulletSet = bulletSet;
        
        this.sprite = game.add.sprite(x, y, 'sprite');
        this.sprite.angle = this.angle;
        this.sprite.tint = this.colour;
        console.log("New player added");
        
        this.bulletSprites = new Array(5);
        for (var i = 0; i < this.bulletSprites.length; i++)
            {
                this.bulletSprites[i] = new Bullet(i, this.bulletSet[i].position.x, this.bulletSet[i].position.y, this.bulletSet[i].angle);
            }
    }
    
    OnDisconnect() {
        this.sprite.destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setPosition(this.x, this.y);
        this.sprite.angle = this.angle;
        
        for (var i = 0; i < this.bulletSprites.length; i++)
            {
                this.bulletSprites[i].x = this.bulletSet[i].position.x;
                this.bulletSprites[i].y = this.bulletSet[i].position.y;
                this.bulletSprites[i].angle = this.bulletSet[i].angle;
                this.bulletSprites[i].alive = this.bulletSet[i].alive;
                this.bulletSprites[i].update();
            }
    }
}