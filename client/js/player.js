class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        
        this.sprite = game.add.sprite(x, y, 'sprite');
        console.log("New player added");
    }
    
    update() {
        this.sprite.setPosition(this.x, this.y);
    }
}