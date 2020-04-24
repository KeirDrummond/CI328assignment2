class Player extends Phaser.GameObjects.GameObject {
    constructor(id, polygon, colour, bulletSet) {
        super(game, 'Player');
        
        this.id = id;
        this.x = polygon.pos.x;
        this.y = polygon.pos.y;
        this.angle = polygon.angle;
        this.alive = true;
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
        
        // Clones
        
        this.clone = new Array(3);
        
        var mirror = Game.mirror(this.x, this.y);
        
        this.clone[0] = game.add.sprite(mirror.x, this.y, 'sprite');
        this.clone[0].setOrigin(0, 0);
        this.clone[0].angle = this.angle;
        this.clone[0].tint = this.colour;
        
        this.clone[1] = game.add.sprite(this.x, mirror.y, 'sprite');
        this.clone[1].setOrigin(0, 0);
        this.clone[1].angle = this.angle;
        this.clone[1].tint = this.colour;
        
        this.clone[2] = game.add.sprite(mirror.x, mirror.y, 'sprite');
        this.clone[2].setOrigin(0, 0);
        this.clone[2].angle = this.angle;
        this.clone[2].tint = this.colour;        
    }
    
    OnDisconnect() {
        for (var i = 0; i < this.bulletSprites.length; i++)
            {
                this.bulletSprites[i].Destroy();
            }
        
        this.sprite.destroy();
        this.clone[0].destroy();
        this.clone[1].destroy();
        this.clone[2].destroy();
        this.destroy();
    }
    
    update() {
        this.sprite.setVisible(this.alive);
        this.sprite.setPosition(this.x, this.y);
        this.sprite.angle = this.angle;

        var mirror = Game.mirror(this.x, this.y);
        
        this.clone[0].setVisible(this.alive);
        this.clone[0].setPosition(mirror.x, this.y);
        this.clone[0].angle = this.angle;
        
        this.clone[1].setVisible(this.alive);
        this.clone[1].setPosition(this.x, mirror.y);
        this.clone[1].angle = this.angle;
        
        this.clone[2].setVisible(this.alive);
        this.clone[2].setPosition(mirror.x, mirror.y);
        this.clone[2].angle = this.angle;
        
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