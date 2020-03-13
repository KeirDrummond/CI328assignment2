var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('sprite', 'assets/plane.png');
};

Game.create = function(){
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    
    Client.askNewPlayer();
};

Game.addNewPlayer = function(id, x, y){
    Game.playerMap[id] = new Player(id, x, y);
}