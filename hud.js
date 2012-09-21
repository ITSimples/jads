/*
 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (C) 2012  Francisco Fernandes - ITSimples.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*------------------- 
START hud border entity
-------------------------------- */
var HUDBorder = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
        this.image = me.loader.getImage("hudbg");
    },

    draw: function(context, x, y) {
        context.drawImage(this.image, 0, 0);
    }
});
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
		this.value = 10;
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
		this.value = heroeVelocity * 2 ; //Hud information
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
		heroeVelocity = this.value / 2;
		console.log ('heroeVelocity:', heroeVelocity)
		
		// Update heroe velocity
		var player = me.game.getEntityByName('Heroe');
		player[0].setVelocity(heroeVelocity, heroeVelocity);
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