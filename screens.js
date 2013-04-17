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


// **********************
// **** Ecrã inicial ****
// **********************
var TileScreen = me.ScreenObject.extend(
{
	// Contrutor
	init: function()
	{
		this.parent(true);
		this.title = null;
		// Configurar fontes usadas no ecrã inicial - fonte,tamanho,cor,alinhamento
		this.txtMedievalSharp = new me.Font("MedievalSharp",18,"white","right");
		this.txtDevonshire = new me.Font("Devonshire",32,"red","left");
	},
	
	onResetEvent: function()
	{
		if(this.title == null)
		{
			this.title = me.loader.getImage("initialscreen");
		}
				
		// Provisório até fazer menu (Para entra no jogo)
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

	},
	// update function
    update: function() {
		if (me.input.isKeyPressed('enter')) {
			me.state.change(me.state.PLAY);
		}
	
	},
	
	draw: function(context)
	{		
		context.drawImage(this.title,0,0);
		this.txtDevonshire.draw(context,"<ENTER> Inicio do jogo...",400,195);
		this.txtMedievalSharp.draw(context,"Jogo desenvolvido por ITSimples.com ",450,590);
	},
});

// **************************
// **** Fim Ecrã inicial ****
// **************************

// **********************
// **** Ecrã de jogo ****
// **********************
var PlayScreen = me.ScreenObject.extend(
{

	onResetEvent: function()
	{	
		// Ler o primeiro nível
		me.levelDirector.loadLevel("map01");
		
		// ----- Set DIV width to fit the inventory, message and question box
		$('#adsGame').css("width", ads_width);
		
		// Show inventory when game start
		adsGame.Inventory.show();

		// Setup HUD
		me.game.addHUD(0,0,ads_width,33,"#222222");
		
		
		var hudSpace= ~~(ads_width / 16);
		
		var hudLive = new HUDLive(ads_HUD_X_Position ,ads_HUD_Y_Position);


		
		var hudKnowledge = new HUDKnowledge( hudLive.hudLength() + 
											(hudSpace * 1),ads_HUD_Y_Position);
		var hudVelocity = new HUDVelocity(	hudLive.hudLength() + 
											hudKnowledge.hudLength() + 
											(hudSpace * 2) ,ads_HUD_Y_Position);
		var hudGold =  new HUDGold(	hudVelocity.hudLength() + 
									hudLive.hudLength() + 
									hudKnowledge.hudLength() + 
									(hudSpace * 3),ads_HUD_Y_Position);
		var hudLucky =  new HUDLucky(	hudLive.hudLength() + 
										hudKnowledge.hudLength() + 
										hudVelocity.hudLength() + 
										hudGold.hudLength() + (hudSpace * 4),ads_HUD_Y_Position);
		
		
		
		me.game.HUD.addItem("vida", hudLive );
		me.game.HUD.addItem("conhecimento", hudKnowledge );
		me.game.HUD.addItem("velocidade", hudVelocity );
		me.game.HUD.addItem("ouro", hudGold );
		me.game.HUD.addItem("sorte", hudLucky);
		// HUD border must be last so it is on the bottom
		// me.game.HUD.addItem("HUDborder", new HUDBorder(0,0));
		
		
		//Config mouse cursor over game div with jquery
		$('#adsGame').css('cursor', "url('content/gui/point_cur.cur'),crosshair");
		//Config mouse cursor over inventory div with jquery
		$('#inventoryLayer').css('cursor', "url('content/gui/inv_cur.gif'),pointer");
		// me.loader.getImage("sparkle")
	},

	update: function () 
	{
		
	},

	onDestroyEvent: function()
	{
		me.game.disableHUD();
	}

});
// **************************
// **** Fim Ecrã de jogo ****
// **************************