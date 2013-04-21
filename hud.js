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

/*------------------- 
START hud border entity
-------------------------------- */
// var HUDBorder = me.HUD_Item.extend({
    // init: function(x, y) {
        // this.parent(x, y);
        // this.image = me.loader.getImage("hudbg");
    // },

    // draw: function(context, x, y) {
        // context.drawImage(this.image, 0, 0);
    // }
// });
/*--- END hud border entity ---*/

/*------------------- 
START hud live entity
-------------------------------- */
var HUDLive = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,hudColorLive,"left");
		this.value = 10;
		this.name= "Vida:";
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * ads_HUD_font_size ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + ads_HUD_font_size ); 
	},

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
    }
});
/*--- END hud live entity ---*/


/*------------------- 
START hud gold entity
-------------------------------- */
var HUDGold = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,hudColorGold,"left");
		this.value = 420;
		this.name = "Ouro:";
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * ads_HUD_font_size ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + ads_HUD_font_size );
		
	},
	
    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
    }
});
/*--- END hud Gold entity ---*/

/*------------------- 
START hud velocity entity
-------------------------------- */
var HUDVelocity = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,hudColorVelocity,"left");
		this.value = heroVelocity * 2 ; //Hud information
		this.name = "Velocidade:";
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * ads_HUD_font_size ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + ads_HUD_font_size );
		
	},	

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
		heroVelocity = this.value / 2;
		console.log ('heroVelocity:', heroVelocity)
		
		// Update hero velocity
		var player = adsGame.heroEntity();
		player.setVelocity(heroVelocity, heroVelocity);
		player = undefined;
    }
});
/*--- END hud velocity entity ---*/


/*------------------- 
START hud knowledge entity
-------------------------------- */
var HUDKnowledge = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,hudColorKnowledge,"left");
		this.value = 10;
		this.name = "Conhecimento:";

		// calculate value position
		this.itemHUDLength = (( ( this.name.length ) * ads_HUD_font_size ) / 2) + ads_HUD_X_Position;
    },

	hudLength : function(){
		// Plus 10 because star on ads_HUD_X_Position
		return (this.itemHUDLength + ads_HUD_font_size + ads_HUD_X_Position);
		
	},	

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
    }
});
/*--- END hud knowledge entity ---*//*------------------- 


/*------------------- 
START hud Lucky entity
-------------------------------- */ 
var HUDLucky = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,hudColorLucky,"left");
		this.value = 1;
		this.name = "Sorte:";
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * ads_HUD_font_size ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + ads_HUD_font_size );
		
	},	

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
    }
});
/*--- END hud Lucky entity ---*/