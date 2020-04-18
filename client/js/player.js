class Player extends Phaser.GameObjects.GameObject {
    constructor(id, polygon, colour, bulletSet) {
        super(game, 'Player');
        
        this.id = id;
        this.x = polygon.pos.x;
        this.y = polygon.pos.y;
        this.angle = polygon.angle;
        this.colour = colour;
        this.bulletSet = bulletSet;
        
        console.log(polygon.pos);
        
        this.sprite = game.add.sprite(this.x, this.y, 'sprite');
        this.sprite.setOrigin(0, 0);
        this.sprite.angle = this.angle;
        this.sprite.tint = this.colour;
        console.log("New player added");
        
        this.bulletSprites = new Array(5);
        for (var i = 0; i < this.bulletSprites.length; i++)
            {
                this.bulletSprites[i] = new Bullet(i, this.bulletSet[i].polygon.pos.x, this.bulletSet[i].polygon.pos.y, this.bulletSet[i].polygon.angle);
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
                this.bulletSprites[i].x = this.bulletSet[i].polygon.pos.x;
                this.bulletSprites[i].y = this.bulletSet[i].polygon.pos.y;
                this.bulletSprites[i].angle = this.bulletSet[i].polygon.angle;
                this.bulletSprites[i].alive = this.bulletSet[i].alive;
                this.bulletSprites[i].update();
            }
    }
}