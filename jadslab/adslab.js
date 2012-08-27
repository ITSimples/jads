/*
-----------------------------------
Ficheiro: adslab.js
ClassName:main
Comment: Classe Test
Create Date: 26/02/2012 - ITSimples
HTTP://www.itsimples.com  - change to ITSimples Games
-----------------------------------
*/

// Game resources
var jadsTestResources = 
[
	// ---- Mapas ----
	{name: "bee",type: "image",src: "bee.png"},
	{name: "tiles",type: "image",src: "maps/maptest_tileset/tiles.png"},
	{name: "maptest", type: "tmx", src: "maps/maptest.tmx"}
];


/* adsGame - Game namespace */
var adsTest = 
{ 
	// Inicializar o Jogo
	onload:function()
	{
		//Inicializar resolução e teste se browser suporta o jogo
		if(!me.video.init('adsTest',320	, 320,false,1.0)){
			alert(" * O seu browser não suporta  * ");
			return;
		}
		
		//Inicializar formato de música a utilizar
		me.audio.init("mp3");
		
		//Callback - Carregar os recursos do jogo quando tudo estiver preparado
		me.loader.onload = this.loaded.bind(this);

		//Preparar todos os recursos do jogo
		me.loader.preload(jadsTestResources);
		
		//Mudar estado para ecrã de carregamento do jogo. 
		me.state.change(me.state.LOADING);
		
		// ************ Configurações de DEBUG *************
		//Ver caixa de colisão
		me.debug.renderHitBox = true;

	},
	
	loaded:function()
	{	
		// Definir estado jogo 
		me.state.set(me.state.PLAY,new PlayScreen());		

		// Configurar entidades do mapasw
		// Class HeroeEntity em entities
		//"Heroe" - Nome no mapa .tmx
		me.entityPool.add("bee", beeEntity); 
		
		// Debug Mode
		me.state.change(me.state.PLAY);
		
		// Teclas para debug - prefiro :)
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.S, "down");

	var myLayer = [	
	//     ------- X ->
   //1  0  2  1  4  5  6  7  8  9
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //1
	[1, 0, 0, 0, 1, 0, 0, 0, 0, 1], //0
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 1], //2
	[1, 0, 0, 1, 1, 0, 0, 0, 0, 1], //1		 |
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1], //4   Y \/
	[1, 0, 1, 0, 1, 0, 0, 0, 0, 1], //5
	[1, 0, 1, 0, 1, 0, 1, 0, 0, 1], //6
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 1], //7
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1], //8
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  //9
	
	];
	
	// var myLayer = [
        // [0,0,0,0],
        // [0,1,1,1],
        // [0,0,0,1],
		// [0,0,0,1]
    // ]
	
	var	startPoint = [1,1];
	var	endPoint = [8,8];
	
	
	result = AStar(myLayer, startPoint, endPoint, "Manhattan");
	
	console.log (result);
	
	for(var x, y, i = 0, j = result.length; i < j; i++) {
		x = result[i][0];
		y = result[i][1];
	};
	
		
	}
} // END ****  adsGame *******


// **********************
// **** Ecrã de jogo ****
// **********************
var PlayScreen = me.ScreenObject.extend(
{

	onResetEvent: function()
	{	
		// Ler o primeiro nível
		me.levelDirector.loadLevel("maptest");
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
var beeEntity = me.ObjectEntity.extend({
	//Construtor:
	init:	function (x , y , settings){
		//Definir propriedades do objecto heroi na classe em vez de no mapa:
		settings.image="bee"; 
		settings.spritewidth=32;

		// Chamar o contrutor
		this.parent(x, y , settings);

		// Configurar velocidade do jogador
		this.setVelocity(3, 3);
		
		// Configurar velocidade de travagem
		// Valores maiores tempo de travagem menor
		this.setFriction(0.5, 0.5);
		
		// adjust the bounding box
		this.updateColRect(4,24,10,24); 
		
		// disable gravity
		this.gravity = 0;
		
		// adjust the bounding box
		// this.updateColRect(4,24,20,23); 
		
		this.collidable= true;

		//Config npc's animation
		this.addAnimation("stand-down", [4]);
		this.addAnimation("stand-left", [8]);
		this.addAnimation("stand-up", [1]);
		this.addAnimation("stand-right", [11]);
		this.addAnimation("down", [3,4,5,4]);
		this.addAnimation("left", [6,7,8]);
		this.addAnimation("up", [0,1,2,1]);
		this.addAnimation("right", [9,10,11]);
		
		//Direção inicial
		this.direction = 'down';
	
		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},


	//Update player position.
	update : function ()
	{

		
		// check & update player movement
		updated = this.updateMovement();

		// update animation
		if (updated)
		{
			// Actualizar animação
			this.parent(this);
		}

		return updated;
	}
});
// *****************************
// ****  Fim Entidade Heroi ****
// *****************************


//bootstrap :)
window.onReady(function() 
{
	adsTest.onload();
});