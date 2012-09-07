var effect = me.AnimationSheet.extend({
    init: function(x, y, Image, spritewidth, spriteheight) {
        this.parent(x, y, Image, spritewidth, spriteheight);
        // this.collidable = false;
        // this.visible = true;
        // this.setVelocity(0,0);
        // this.gravity = 0;
        this.addAnimation("sprite", [0,1,2,3,4,5,6,7,8,9,10,11,10]);
        //this.setCurrentAnimation("sprite");
        this.animationspeed = me.sys.fps / 60;
    },
    
    update: function() {
        this.setCurrentAnimation("sprite", function(){ me.game.remove(this) });
        this.parent(this);
        return true;
    },
    
    onDestroyEvent: function() {
    }
});