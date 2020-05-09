var fireSound;
var damageSound;
var explosionSound;

var decayStart = 500;
var decayRate = 200;

class SoundEffectHandler {
    
    constructor() {
        fireSound = game.sound.add('fire');
        damageSound = game.sound.add('damage');
        explosionSound = game.sound.add('explosion');
    }
    
    Fire(sprite){
        var myLoc = {
            x: Game.localPlayer.x,
            y: Game.localPlayer.y
        }
        
        var distance = 10000;

        for (var i = 0; i < sprite.length; i++) {
            var newDis = Phaser.Math.Distance.Between(myLoc.x, myLoc.y, sprite[i].x, sprite[i].y);
            if (newDis < distance) { distance = newDis; }
        }
        
        var decay = Math.min(Math.max((distance - decayStart) / decayRate, 0), 1);
        var vol = 1 - decay;
        var config = {
            volume: vol
        }
        
        fireSound.play(config);
    }
    
    Damage(sprite){
        var myLoc = {
            x: Game.localPlayer.x,
            y: Game.localPlayer.y
        }
        
        var distance = 10000;

        for (var i = 0; i < sprite.length; i++) {
            var newDis = Phaser.Math.Distance.Between(myLoc.x, myLoc.y, sprite[i].x, sprite[i].y);
            if (newDis < distance) { distance = newDis; }
        }
        
        var decay = Math.min(Math.max((distance - decayStart) / decayRate, 0), 1);
        var vol = 1 - decay;
        var config = {
            volume: vol
        }
        
        damageSound.play(config);
    }
    
    Explosion(sprite){
        var myLoc = {
            x: Game.localPlayer.x,
            y: Game.localPlayer.y
        }
        
        var distance = 10000;

        for (var i = 0; i < sprite.length; i++) {
            var newDis = Phaser.Math.Distance.Between(myLoc.x, myLoc.y, sprite[i].x, sprite[i].y);
            if (newDis < distance) { distance = newDis; }
        }
        
        var decay = Math.min(Math.max((distance - decayStart) / decayRate, 0), 1);
        var vol = 1 - decay;
        var config = {
            volume: vol
        }
        
        explosionSound.play(config);
    }
    
}