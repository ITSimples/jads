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
		me.game.addHUD(0,0,ads_width,34,"#111111");
		

		me.game.HUD.addItem("vida", new HUDLive(10,ads_HUD_Y_Position));
		me.game.HUD.addItem("forca", new HUDStrength(125,ads_HUD_Y_Position));
		me.game.HUD.addItem("velocidade", new HUDVelocity(250,ads_HUD_Y_Position));
		me.game.HUD.addItem("conhecimento", new HUDKnowledge(440,ads_HUD_Y_Position));
		me.game.HUD.addItem("sorte", new HUDLucky(650,ads_HUD_Y_Position));
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