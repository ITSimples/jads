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

// var hudInitialValues = {"vida" : 20,"conhecimento" : 10,"velocidade" : 2, "ouro" : 40,"sorte":1};

/*------------------- 
START hud live entity
-------------------------------- */
var HUDLive = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
		this.font = new me.Font("MedievalSharp",_Globals.hud.fontSize,_Globals.hud.color.live,"left");
		// this.value = hudInitialValues["vida"];
		this.value = _Globals.hud.values.init.live;
		
		this.name= language.system.TRlive;
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * _Globals.hud.fontSize ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + _Globals.hud.fontSize ); 
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
		this.font = new me.Font("MedievalSharp",_Globals.hud.fontSize,_Globals.hud.color.gold,"left");
		// this.value = hudInitialValues["ouro"];
		// this.value = hudInitialValues["ouro"];
		this.value = _Globals.hud.values.init.gold;
		this.name = language.system.TRgold;
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * _Globals.hud.fontSize ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + _Globals.hud.fontSize );
		
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
		this.font = new me.Font("MedievalSharp",_Globals.hud.fontSize,_Globals.hud.color.velocity,"left");
		// this.value = hudInitialValues["velocidade"] * 2 ; //Hud information
		this.value = _Globals.hud.values.init.velocity;
		this.name = language.system.TRvelocity;
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * _Globals.hud.fontSize ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + _Globals.hud.fontSize );
		
	},	

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
		heroVelocity = this.value / 2;
		
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
		this.font = new me.Font("MedievalSharp",_Globals.hud.fontSize,_Globals.hud.color.knowledge,"left");
		// this.value = hudInitialValues["conhecimento"];
		this.value = _Globals.hud.values.init.knowledge;
		this.name = language.system.TRknowledge;

		// calculate value position
		this.itemHUDLength = (( ( this.name.length ) * _Globals.hud.fontSize ) / 2) + _Globals.hud.position.x;
    },

	hudLength : function(){
		// Plus 10 because star on _Globals.hud.position.x
		return (this.itemHUDLength + _Globals.hud.fontSize + _Globals.hud.position.x);
		
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
		this.font = new me.Font("MedievalSharp",_Globals.hud.fontSize,_Globals.hud.color.lucky,"left");
		// this.value = hudInitialValues["sorte"];
		this.value = _Globals.hud.values.init.lucky;
		this.name = language.system.TRlucky;
		// calculate value position
		this.itemHUDLength = ( ( this.name.length ) * _Globals.hud.fontSize ) / 2;
    },
	
	hudLength : function(){
		return ( this.itemHUDLength + _Globals.hud.fontSize );
		
	},	

    draw: function(context, x, y) {
		this.font.draw(context, this.name, this.pos.x , this.pos.y);
        this.font.draw(context, this.value, this.pos.x + this.itemHUDLength, this.pos.y);
    }
});
/*--- END hud Lucky entity ---*/

adsGame.initHUD = function(){
        // Setup HUD
        me.game.addHUD(0,0,_Globals.canvas.width,33,"#222222");
        
        
        var hudSpace= ~~(_Globals.canvas.width / 16);
        
        var hudLive = new HUDLive(_Globals.hud.position.x ,_Globals.hud.position.y);

        var hudKnowledge = new HUDKnowledge( hudLive.hudLength() + 
                                            (hudSpace * 1),_Globals.hud.position.y);
        var hudVelocity = new HUDVelocity(  hudLive.hudLength() + 
                                            hudKnowledge.hudLength() + 
                                            (hudSpace * 2) ,_Globals.hud.position.y);
        var hudGold =  new HUDGold( hudVelocity.hudLength() + 
                                    hudLive.hudLength() + 
                                    hudKnowledge.hudLength() + 
                                    (hudSpace * 3),_Globals.hud.position.y);
        var hudLucky =  new HUDLucky(   hudLive.hudLength() + 
                                        hudKnowledge.hudLength() + 
                                        hudVelocity.hudLength() + 
                                        hudGold.hudLength() + (hudSpace * 4),_Globals.hud.position.y);
        
        
        
        me.game.HUD.addItem(_Globals.hud.name.live, hudLive );
        me.game.HUD.addItem(_Globals.hud.name.knowledge, hudKnowledge );
        me.game.HUD.addItem(_Globals.hud.name.velocity, hudVelocity );
        me.game.HUD.addItem(_Globals.hud.name.gold, hudGold );
        me.game.HUD.addItem(_Globals.hud.name.lucky, hudLucky);
        // HUD border must be last so it is on the bottom
        // me.game.HUD.addItem("HUDborder", new HUDBorder(0,0));
};

adsGame.resetHUD = function(){
        me.game.HUD.setItemValue(_Globals.hud.name.live, _Globals.hud.values.init.live );
        me.game.HUD.setItemValue(_Globals.hud.name.knowledge, _Globals.hud.values.init.knowledge );
        me.game.HUD.setItemValue(_Globals.hud.name.gold, _Globals.hud.values.init.gold );
        me.game.HUD.setItemValue(_Globals.hud.name.lucky, _Globals.hud.values.init.lucky);
        
        // Reset items on hud values
        // $.each(hudInitialValues , function (index , value){
            // if (index !== "velocidade"){
                // me.game.HUD.setItemValue(index, value );
            // }
        // });
};
