class Player extends Phaser.GameObjects.GameObject {
    constructor(id, displayName, polygon, colour, bulletSet) {
        super(game, 'Player');
        
        this.id = id;
        this.displayName = displayName;
        this.x = polygon.pos.x;
        this.y = polygon.pos.y;
        this.angle = polygon.angle;
        this.alive = true;
        this.colour = colour;
        this.bulletSet = bulletSet;
        
        this.health = 5;
        this.score = 0;
        
        this.sprite = game.add.sprite(this.x, this.y, 'sprite');
        this.sprite.setOrigin(0, 0);
        this.sprite.angle = this.angle;
        this.sprite.tint = this.colour;
        
        var fireSound = game.sound.add('fire');
        
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
    
    TakeDamage(newHealth) {
        Game.SoundEffectHandler.Damage(this.getSprites());
        this.health = newHealth;
        if (this == Game.localPlayer){
            Game.UserInterface.Health.SetHealth(newHealth);
        }
        if (this.health <= 0) {
            Game.SoundEffectHandler.Explosion(this.getSprites());
        }
    }
    
    Respawn() {
        this.health = 5;
        if (this == Game.localPlayer){
            Game.UserInterface.Health.SetHealth(this.health);
        }
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
    
    Fire(){
        Game.SoundEffectHandler.Fire(this.getSprites());
    }
    
    getSprites(){
        var sprite = new Array(4);
        sprite[0] = {
            x: this.x,
            y: this.y
        }
        sprite[1] = {
            x: this.clone[0].x,
            y: this.clone[0].y
        }
        sprite[2] = {
            x: this.clone[1].x,
            y: this.clone[1].y
        }
        sprite[3] = {
            x: this.clone[2].x,
            y: this.clone[2].y
        }
        return sprite;
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