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
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,"white","left");
		this.value = 100;
		this.name= "Vida:";
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 60, this.pos.y);
    }
});
/*--- END hud live entity ---*/


/*------------------- 
START hud strength entity
-------------------------------- */
var HUDStrength = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,"red","left");
		this.value = 100;
		this.name = "Força:";
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 60, this.pos.y);
    }
});
/*--- END hud Strength entity ---*/

/*------------------- 
START hud velocity entity
-------------------------------- */
var HUDVelocity = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,"green","left");
		this.value = 100;
		this.name = "Velocidade:";
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 100, this.pos.y);
    }
});
/*--- END hud velocity entity ---*/

/*------------------- 
START hud knowledge entity
-------------------------------- */
var HUDKnowledge = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",ads_HUD_font_size,"yellow","left");
		this.value = 100;
		this.name = "Conhecimento:";
    },

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + 130, this.pos.y);
    }
});
/*--- END hud knowledge entity ---*/