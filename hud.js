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
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 60, this.pos.y);
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
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 60, this.pos.y);
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
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 100, this.pos.y);
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
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 130, this.pos.y);
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
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 60, this.pos.y);
    }
});
/*--- END hud Lucky entity ---*/