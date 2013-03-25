/*
-----------------------------------
Ficheiro: adslab.js
ClassName:main
Comment: Classe Test
Create Date: 26/02/2012 - ITSimples
HTTP://www.itsimples.com  - change to ITSimples Games
-----------------------------------
*/

var TestingGlobalOnLevelChange = "Level 0";
var currentLevel = "";
var playerPos = new me.Vector2d(0, 0);
var changeLevel = false;

// Game resources
var jadsTestResources = 
[
	// ---- Mapas ----
	{name: "bee",type: "image",src: "../content/sprites/bee.png"},
	{name: "player",type: "image",src: "../content/sprites/h_female01.png"},
	{name: "tiles",type: "image",src: "maptest_tileset/tiles.png"},
	{name: "maptest01", type: "tmx", src: "maptest.tmx"},
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
		
		var result;
		
	},
	
	loaded:function()
	{	
	
		// Definir estado jogo 
		me.state.set(me.state.PLAY,new PlayScreen());		

		// Configurar entidades do mapasw
		// Class HeroeEntity em entities
		//"Heroe" - Nome no mapa .tmx
		me.entityPool.add("bee", beeEntity);
		me.entityPool.add("player", playerEntity);
		me.entityPool.add('MapExit', MapExit );
		
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.S, "down");
		
		// Debug Mode
		me.state.change(me.state.PLAY);


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
		me.levelDirector.loadLevel("maptest01");
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
		this.parent(32, 32 , settings);

		// Configurar velocidade do jogador
		this.setVelocity(1, 1);
		
		// Configurar velocidade de travagem
		// Valores maiores tempo de travagem menor
		this.setFriction(0, 0);
		
		// adjust the bounding box
		this.updateColRect(0,32,0,32); 
		
		// disable gravity
		this.gravity = 0;
		
		// adjust the bounding box
		// this.updateColRect(4,24,20,23); 
		
		this.collidable= true;

		//Config npc's animation
		this.renderable.addAnimation("stand-down", [4]);
		this.renderable.addAnimation("stand-left", [8]);
		this.renderable.addAnimation("stand-up", [1]);
		this.renderable.addAnimation("stand-right", [11]);
		this.renderable.addAnimation("down", [3,4,5,4]);
		this.renderable.addAnimation("left", [6,7,8]);
		this.renderable.addAnimation("up", [0,1,2,1]);
		this.renderable.addAnimation("right", [9,10,11]);
		
		//Direção inicial
		this.direction = 'down';
	
		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
	},
	//Update player position.
	update : function ()
	{		
		this.renderable.setCurrentAnimation( this.direction );
		this.animationspeed = me.sys.fps / 23;
		
		// check & update player movement
		updated = this.updateMovement();

		// Actualizar animação
		this.parent(this);
		
		return updated;
	}
});
// *****************************
// ****  Fim Entidade bee ****
// *****************************

// *************************
// ****  Entidade player ****
// *************************
var playerEntity = me.ObjectEntity.extend({
	//Construtor:
	init:	function (x , y , settings){
	
	console.log('If the second or more time in that map init will be different call new initsecond and return...');
	
	
		//Definir propriedades do objecto heroi na classe em vez de no mapa:
		settings.image="player"; 
		settings.spritewidth=32;

		// Chamar o contrutor
		this.parent(x, y , settings);
		
		//Debug Position
		var ads_tile_size = 32;
		
			this.pos.x = 2 * ads_tile_size;
			this.pos.y = 7 * ads_tile_size;

		// Configurar velocidade do jogador
		this.setVelocity(3, 3);
		
		// Configurar velocidade de travagem
		// Valores maiores tempo de travagem menor
		this.setFriction(0.5, 0.5);
		
		// adjust the bounding box
		this.updateColRect(4,24,20,23); 
		
		// disable gravity
		this.gravity = 0;
		
		//Direção inicial
		this.direction = 'down';
		
		this.collidable= true;

		//Config npc's animation
		this.renderable.addAnimation("stand-down", [4]);
		this.renderable.addAnimation("stand-left", [8]);
		this.renderable.addAnimation("stand-up", [1]);
		this.renderable.addAnimation("stand-right", [11]);
		this.renderable.addAnimation("down", [3,4,5,4]);
		this.renderable.addAnimation("left", [6,7,8]);
		this.renderable.addAnimation("up", [0,1,2,1]);
		this.renderable.addAnimation("right", [9,10,11]);
		
	
		// Viewport follow heroe
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
	},
	
	//Update player position.
	update : function ()
	{		
		
		if (me.input.isKeyPressed('left'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);

			this.vel.x = -this.accel.x * me.timer.tick;
			this.renderable.setCurrentAnimation('left');
			this.direction = 'left';			
		}
		else if (me.input.isKeyPressed('right'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.x = this.accel.x * me.timer.tick; 
			this.renderable.setCurrentAnimation('right');
			this.direction = 'right';
		}

		if (me.input.isKeyPressed('up'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.y = -this.accel.y * me.timer.tick; 
			this.renderable.setCurrentAnimation('up');
			this.direction = 'up';
		}
		else if (me.input.isKeyPressed('down'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.y = this.accel.y * me.timer.tick; 
			this.renderable.setCurrentAnimation('down');
			this.direction = 'down';
		}
		
		// If player Stop set stand animationa
		if (this.vel.y === 0 && this.vel.x === 0)
		{
			this.renderable.setCurrentAnimation('stand-' + this.direction);
		}
	
		// check & update player movement
		updated = this.updateMovement();

		// update animation
		if (updated)
		{
			// Actualizar animação
			this.parent(this);
		}

		var res = me.game.collide(this);
		
		return updated;
		
	},
	
	onDestroyEvent: function()
	{
		playerPos = this.pos;
		changeLevel = true;
	}
});
// *****************************
// ****  Fim Entidade player ****
// *****************************

var MapExit = me.LevelEntity.extend({

    init : function( x, y, settings ) {
        settings.duration = 250;
        settings.fade = '#000000';
		this.x = 32;
		this.y = 64;
		
		// var player = me.game.getEntityByName('player');
		// playerPos = player[0].pos;
		// player[0].pos.x ;
		// player[0].pos.y ; 
		
		console.log(TestingGlobalOnLevelChange +  ' playerPos:'  + playerPos);
		
		TestingGlobalOnLevelChange = TestingGlobalOnLevelChange + settings.to;
		
        this.parent( x, y, settings );
    }
});



//bootstrap :)
window.onReady(function() 
{
	adsTest.onload();
});