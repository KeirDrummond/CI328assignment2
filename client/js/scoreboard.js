class ScoreBoard {
    constructor() {
        this.sprite = game.add.sprite(10, 10, 'scoreboard').setScrollFactor(0);
        this.sprite.setDepth(1);
        this.sprite.setOrigin(0, 0);
        
        this.textList = new Array(10);
        
        var textMargin = 20;
        
        for (var i = 0; i < this.textList.length; i++)
            {
                this.textList[i] = game.add.text(30, 30 + textMargin * i, 'Player').setScrollFactor(0);
                this.textList[i].setStroke('#000000', 4);
                this.textList[i].setDepth(1);
                this.textList[i].setVisible(false);
            }
        
        this.list = [];
    }
    
    UpdateScore(){
        this.list.length = 0;
        var i = 0;
        
        var listtemp = this.list;
        
        Object.keys(Game.playerMap).forEach(function(player){
            if (i < 10) { listtemp.push(Game.playerMap[player]); }
        });
        
        this.list.sort(function(a, b) {
           return b.score - a.score; 
        });
        
        for (var i = 0; i < this.list.length; i++)
            {
                this.textList[i].setVisible(true);
                this.textList[i].setText(this.list[i].displayName + ': ' + this.list[i].score);
                this.textList[i].setTint(this.list[i].colour);
            }
        
    }
}