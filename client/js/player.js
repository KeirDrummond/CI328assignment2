class Player {
    constructor(id, x, y) {
        
        this.id = id;
        this.sprite = game.add.sprite(x, y, 'sprite');
        console.log("New player added");
    }
}