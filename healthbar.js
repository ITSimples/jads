/*This software is released under MIT License. Texts for  license are listed below:

 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (c) 2012-2013, ITSimples Games

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
     * HealthBar 22/03/2013
     * @class
     * @extends Object
     * @memberOf adsGame
     * @constructor
     * @param {int} x x position (relative to veiwport position)
     * @param {int} y y position (relative to veiwport position)
     * @param {maxHealth} Initial health for bar
     * @param {maxWidth} Initial health for bar Width
     * @example
     * // create a NPC bar
     *    init: function(x, y)
     *    {
     *     ...
     *       // Create new health bar for NPC
     *      //  this.npcData.spriteWidth -> width of health bar is the width of sprite image
     *      this.healthBar = new adsGame.HealthBar( this.pos.x , this.pos.y , this.health , this.npcData.spriteWidth);
     *      ...
     *    },
     * 
     *    //Update ObjectEntity .
     *    update : function() {
     *     if ( ObjectEntity is hit by projectile)
     *      this.health  = this.health - removePointsProjectile // Update health of ObjectEntity
     *    }
     *    // draw function
     *    draw : function (context)
     *    {
     *       
     *      if (this.healthBar.update(ObjectEntity.pos)) {
     *          // remove ObjectEntity is death :)  
     *      }
     *       // Draw health bar
     *       this.healthBar.draw(context);
     *    }
     * });
     */
adsGame.HealthBar = Object.extend ({
    /** @scope adsGame */
     "init" : function init( x , y , maxHealth ,  maxWidth ) {
         
        /**
         * Initial health for bar
         * @public
         * @type int
         * @name adsGame.HealthBar#maxHealth
         */
         this.maxHealth = maxHealth;
         
        /**
         * Initial health for bar Width
         * @public
         * @type int
         * @name adsGame.HealthBar#maxWidth
         */         
         this.maxWidth = maxWidth;
         
        /**
         * Initial health for bar Height
         * @public
         * @type int
         * @name adsGame.HealthBar#maxHeight
         */    
         this.maxHeight = 8;
         
        /**
         * position of the item
         * @public
         * @type me.Vector2d
         * @name adsGame.HealthBar#pos
         */
         this.pos = new me.Vector2d( x , y );
         
        // Initialize Bar position on top of ObjectEntity         
         this.pos.y = y  -  ( this.maxHeight + 5); 
         
         // Create a private variable
         var self = Object.create( this );
         
         self.health = this.maxHealth;         
     },
     
    /**
     * set health in the bar
     * @public
     * @param {int} Health on bar.
     */
     "setHealth" : function setHealth( health ){
         self.health = health;
     },
     
    /**
     * upadate bar
     * @public
     * @return {boolean} if TRUE then health bar is empty else if returns FALSE it's not empty
     */     
     "update": function update(){
         if ( (this.maxWidth * self.health / this.maxHealth) < 0 ) 
            return true;
         else
            return false
     },
     
    /**
     * draw the Health bar
     * @public
     * @param {Context2D} context 2D context
     */     
     "draw" : function draw( context ){
         context.beginPath();
             context.rect ( this.pos.x , this.pos.y , this.maxWidth , this.maxHeight );
             context.fillStyle = "black";
             context.fill();
         context.closePath();
         
         context.beginPath();
            var width = this.maxWidth * self.health / this.maxHealth;

            context.rect( this.pos.x , this.pos.y , width , this.maxHeight);
            context.fillStyle = "red";
            context.fill();
        context.closePath();
         
     }
}); //End adsGame.HealthBar
