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

		// Setup HUD
		var hudSpace= 80 - ads_HUD_font_size;
		me.game.addHUD(0,0,ads_width,34,"#111111");
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
	},

	update: function () 
	{
		
	},

	onDestroyEvent: function()
	{
	
	}

});
// **************************
// **** Fim Ecrã de jogo ****
// **************************