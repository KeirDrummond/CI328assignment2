class ScoreBoard {
    constructor() {
        // Initialies the scoreboard properties.
        this.sprite = game.add.sprite(10, 10, 'scoreboard').setScrollFactor(0);
        this.sprite.setDepth(1);
        this.sprite.setOrigin(0, 0);
        
        this.textList = new Array(10);
        
        var textMargin = 20;
        
        // Constructs the text and makes them invisible.
        for (var i = 0; i < this.textList.length; i++)
            {
                this.textList[i] = game.add.text(30, 30 + textMargin * i, 'Player').setScrollFactor(0);
                this.textList[i].setStroke('#000000', 4);
                this.textList[i].setDepth(1);
                this.textList[i].setVisible(false);
            }
        
        this.list = [];
    }
    
    // Gets the current list of scores.
    getScores() {
        return this.list;
    }
    
    UpdateScore(){
        // Resets the scoreboard.
        this.list.length = 0;
        var i = 0;
        
        for (var t = 0; t < this.textList.length; t++){
            this.textList[t].setVisible(false);
        }
        
        // Sets the scores into a new array and orders them.
        for (var player in Game.playerMap) {
            if (i < 10) { this.list.push(Game.playerMap[player]); }
        }

        this.list.sort(function(a, b) {
           return b.score - a.score; 
        });
        
        // Reconstructs the text in order of the ordered list.
        for (var i = 0; i < this.list.length; i++)
            {
                this.textList[i].setVisible(true);
                this.textList[i].setText(this.list[i].displayName + " " + this.list[i].id + ': ' + this.list[i].score);
                this.textList[i].setTint(this.list[i].colour);
            }
        
    }
}