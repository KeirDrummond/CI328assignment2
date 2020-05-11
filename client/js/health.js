class Health {
    constructor() {
        this.heart = new Array(5);
        
        var pos = {
            x: 1200,
            y: 750
        };
        
        var margin = 20;
        
        this.heart[0] = game.add.sprite(pos.x, pos.y, 'heart').setScrollFactor(0);
        this.heart[1] = game.add.sprite(pos.x - margin, pos.y, 'heart').setScrollFactor(0);
        this.heart[2] = game.add.sprite(pos.x - margin * 2, pos.y, 'heart').setScrollFactor(0);
        this.heart[3] = game.add.sprite(pos.x - margin * 3, pos.y, 'heart').setScrollFactor(0);
        this.heart[4] = game.add.sprite(pos.x - margin * 4, pos.y, 'heart').setScrollFactor(0);
        
        this.heart[0].setDepth(1);
        this.heart[1].setDepth(1);
        this.heart[2].setDepth(1);
        this.heart[3].setDepth(1);
        this.heart[4].setDepth(1);
    }
    
    SetHealth(health) {
        switch(health) {
            case 0:
                // No health
                this.heart[0].setVisible(false);
                this.heart[1].setVisible(false);
                this.heart[2].setVisible(false);
                this.heart[3].setVisible(false);
                this.heart[4].setVisible(false);
                break;
            case 1:
                // 1 health
                this.heart[0].setVisible(true);
                this.heart[1].setVisible(false);
                this.heart[2].setVisible(false);
                this.heart[3].setVisible(false);
                this.heart[4].setVisible(false);
                break;
            case 2:
                // 2 health
                this.heart[0].setVisible(true);
                this.heart[1].setVisible(true);
                this.heart[2].setVisible(false);
                this.heart[3].setVisible(false);
                this.heart[4].setVisible(false);
                break;
            case 3:
                // 3 health
                this.heart[0].setVisible(true);
                this.heart[1].setVisible(true);
                this.heart[2].setVisible(true);
                this.heart[3].setVisible(false);
                this.heart[4].setVisible(false);
                break;
            case 4:
                // 4 health
                this.heart[0].setVisible(true);
                this.heart[1].setVisible(true);
                this.heart[2].setVisible(true);
                this.heart[3].setVisible(true);
                this.heart[4].setVisible(false);
                break;
            case 5:
                // 5 health
                this.heart[0].setVisible(true);
                this.heart[1].setVisible(true);
                this.heart[2].setVisible(true);
                this.heart[3].setVisible(true);
                this.heart[4].setVisible(true);
                break;
        }
    }
}