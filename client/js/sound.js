// Sound references.
var music;
var fireSound;
var damageSound;
var explosionSound;

var muted = false;

// How far away does a sound need to be to start becoming quieter and at what rate does the volume decrease.
var decayStart = 500;
var decayRate = 200;

class SoundEffectHandler {
    
    constructor() {
        // Creates the sound objects.
        fireSound = game.sound.add('fire');
        damageSound = game.sound.add('damage');
        explosionSound = game.sound.add('explosion');
    }
    
    MuteAll() {
        // Mutes all sounds.
        muted = true;
        music.mute = true;
        fireSound.mute = true;
        damageSound.mute = true;
        explosionSound.mute = true;
    }
    
    UnmuteAll() {
        // Unmutes all sounds.
        muted = false;
        music.mute = false;
        fireSound.mute = false;
        damageSound.mute = false;
        explosionSound.mute = false;
    }
    
    IsMuted() {
        // Returns the muted state.
        return muted;
    }
    
    StartMusic(){
        // The game background music.
        var musicConfig = {
            volume: 0.1,
            loop: true
        }
        music = game.sound.add('music', musicConfig);
        music.play();
    }
    
    // Plays a fire sound at a position.
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
    
    // Plays a damage sound at a position.
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
    
    // Plays an explosion sound at a position.
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