/*
 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (C) 2012  Francisco Fernandes - ITSimples.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var effect = me.AnimationSheet.extend({
    init: function(x, y, Image, spritewidth, spriteheight , animation , speed, repeat, wait) {

        this.parent(x, y, Image, spritewidth, spriteheight);
 
        this.addAnimation("sprite", animation);
 
        this.animationspeed = me.sys.fps / speed;
		
		//Repeat the animation or not
		if( typeof repeat !== 'undefined' ) {
			this.repeat = repeat;
		}else
		{
			this.repeat = false;			
		}
		
		//Wait between animations
		this.waitBetweenAnimations = wait;
		
    },
    
    update: function() {
		if (this.repeat){
			this.setCurrentAnimation("sprite", function(){ 
				this.animationpause = true;
			});
			
			//If pause between animations
			//Put in the function the time between animations or random time
			if (this.animationpause && !Math.floor(Math.random() * this.waitBetweenAnimations)) {
				this.animationpause = false;
			}
		}else
		{
			this.setCurrentAnimation("sprite", function(){ me.game.remove(this); });
		}
		
        this.parent(this);
        return true;
    },
    
    onDestroyEvent: function() {
    }
});