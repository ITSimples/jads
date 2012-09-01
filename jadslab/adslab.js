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


	var myLayer = [	
	//     ------- X ->
   //0  1  2  3  4  5  6  7  8  9
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //0
	[1, 0, 0, 0, 1, 0, 0, 0, 0, 1], //1
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 1], //2
	[1, 0, 0, 1, 1, 0, 0, 0, 0, 1], //3		 |
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1], //4   Y \/
	[1, 0, 1, 0, 1, 0, 0, 0, 0, 1], //5
	[1, 0, 1, 0, 1, 0, 1, 0, 0, 1], //6
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 1], //7
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1], //8
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  //9
	];

	
	var	startPoint = [1,1];
	var	endPoint = [8,8];
	
	
	result = AStar(myLayer, startPoint, endPoint, "Manhattan");
	
	$.each ( result, function (i, results ){
		console.log ("- " + results);
	});
	// console.log ("- " + result);
	

		
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
		
		
		this.i = 1;
		
				// x = result[i][0];
		// y = result[i][1];
			this.destX = result[1][0] * 32;
			this.destY = result[1][1] * 32;
		
		this.stop = false;

	},
	
	setDirection : function() {
        this.distanceX = Math.abs( this.destX - this.pos.x );
        this.distanceY = Math.abs( this.destY - this.pos.y );

		if ( this.distanceX == 0 && this.distanceY == 0){
			this.stop = true;
		} else if( this.distanceX > this.distanceY ) {
            this.direction = this.destX < this.pos.x ? 'left' : 'right' ;
        } else {
            this.direction = this.destY < this.pos.y ? 'up' : 'down';
        }
		

    },	


	//Update player position.
	update : function ()
	{		
		this.setCurrentAnimation( this.direction );
		this.animationspeed = me.sys.fps / 23;
		

		if ( this.stop )
		{
			this.vel.x = 0;
			this.vel.y = 0;
			
			this.setCurrentAnimation( this.direction );

			
			if (this.i != result.length){
				this.destX = result[this.i][0] * 32;
				this.destY = result[this.i][1] * 32;
				
				this.i++;
			}			
			
			this.stop = false;
		} else if (this.direction == 'left')
		{		
			this.vel.x = -this.accel.x * me.timer.tick;			
		}
		else if (this.direction == 'right')
		{		
			this.vel.x = this.accel.x * me.timer.tick;
		}
 
		if (this.direction == 'up')
		{
			this.vel.y = -this.accel.y * me.timer.tick; 
		}
		else if (this.direction == 'down')
		{
			this.vel.y = this.accel.y * me.timer.tick;
		}

		// check & update player movement
		updated = this.updateMovement();

			// Actualizar animação
			this.parent(this);

		this.setDirection();
		
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