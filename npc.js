/* 
-----------------------------------
Ficheiro: npc.js
ClassName:npc
Comment: Non players charters
Create Date: 17/07/2012 - ITSimples
HTTP://www.itsimples.com
-----------------------------------
*/


// *************************
// ****  NPC entity ****
// *************************
var NpcEntity = me.ObjectEntity.extend({
	//Construtor:
	//Construtor:
	init:	function (x , y , settings , npcData){

		// Chamar o contrutor
		this.parent(x, y , settings);
		
		// NPC data from json file
		this.npcData = npcData;
		
		// Data to message box
		this.msgData = {};
		this.msgData.msgImage = 'sprites/' + this.npcData.imagem.replace(".png","_face.png");
		this.msgData.msgName = this.npcData.nome;
		this.msgData.msg = this.npcData.mensagem;
		
		this.collidable= true;
		
		this.gravity = 0;
		
		this.friction = 0;
	
		this.accel.x = 0.5;
        this.accel.y = 0.5;
		// Configurar velocidade do jogador

						
		// adjust the bounding box
		this.updateColRect(4,24,20,23); 
 
        // make him start from the right
        this.pos.x = x;
		this.pos.y = y;
        
		// make it an action object
        // this.type = me.game.ACTION_OBJECT;
		
		this.type = 'NPC_OBJECT';
		
		// Enable/disable dialogue box
		this.showMessage = false;

		//Configurar animações
		this.addAnimation("stand-down", [4]);
		this.addAnimation("stand-left", [8]);
		this.addAnimation("stand-up", [1]);
		this.addAnimation("stand-right", [11]);
		this.addAnimation("down", [3,4,5,4]);
		this.addAnimation("left", [6,7,8]);
		this.addAnimation("up", [0,1,2,1]);
		this.addAnimation("right", [9,10,11]);

		//Configure coordinates of npc
		this.initStartX = this.pos.x;
		this.initStartY = this.pos.y;
        this.initDestX = this.npcData.coordenadas.initDestX  * 32;
        this.initDestY = this.npcData.coordenadas.initDestY  * 32;
		
		
		this.distanceX = 0;
		this.distanceY = 0;
		this.stop = false;
		
		//if it moves
		this.direction = 'right';
		// this.setDirection();
		
		// Create message box for object to avoid blinking if is a global box
		this.message = new adsGame.message();
		
		this.result = [];
		this.i = 0;
		this.destX = 0;
		this.destY = 0;
		
		if (this.npcData.tipoMovimento == "path"){
			var start = [this.npcData.coordenadas.initStartX,this.npcData.coordenadas.initStartY]; //{'x': 2 , 'y' : 9};
			var end = [this.npcData.coordenadas.initDestX,this.npcData.coordenadas.initDestY]; //{'x': 7 , 'y' : 9};
		
			this.result = adsGame.pathFinder.getPath(start,end,"collision");
			
			//*32 to convert tile position to map coordinates
			this.destX = this.result[0][0] * 32;
			this.destY = this.result[0][1] * 32;
			
	
		}else{
			//*32 to convert tile position to map coordinates
			this.destX = this.initDestX;
			this.destY = this.initDestY;
		}
		
		if(this.npcData.nome == 'John'){
		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		}
	},
	
	setDirection : function() {
	
        this.distanceX = Math.abs( this.destX - this.pos.x );
        this.distanceY = Math.abs( this.destY - this.pos.y );
		
		if( this.distanceX > this.distanceY ) {
            this.direction = this.destX < this.pos.x ? 'left' : 'right' ;
        } else {
            this.direction = this.destY < this.pos.y ? 'up' : 'down';
        }
		
		// console.log ("distance :" + "(x=" + this.distanceX + ", y=" + this.distanceY +")" );

			
		// console.log ("Coordinates :" + "(x=" + this.pos.x + ", y=" + this.pos.y +")" );
		// if ( (this.pos.x > this.initDestX - 2 && this.pos.x < this.initDestX + 2) && 
			 // (this.pos.y > this.initDestY - 2 && this.pos.y < this.initDestY + 2) ){
			// this.destX = this.initStartX;
			// this.destY = this.initStartY;
		// } else if ( (this.pos.x > this.initStartX - 2 && this.pos.x < this.initStartX + 2) && 
					// (this.pos.y > this.initStartY - 2 && this.pos.y < this.initStartY + 2)){
			// this.destX = this.initDestX;
			// this.destY = this.initDestY;
		// }
    },
	
	//Update npc position.
	update : function ()
	{		
		this.setCurrentAnimation( this.direction );
		this.animationspeed = me.sys.fps / (me.sys.fps / 3);
		
		this.setDirection();
		
		
		if( moveObject( this ) ) {
			if (this.i != this.result.length){
				this.destX = this.result[this.i][0] * 32;
				this.destY = this.result[this.i][1] * 32;
				
				this.i++;
			}
			this.setDirection();
		}
		
		
		
		// Check collision
		// ***************** IMPROVE COLLISION TO COLIDE AND GO BACK *********************
		var res = me.game.collide( this );
        if( res ) {
			if( res.obj.name == 'heroe' ) {
				// this.setCurrentAnimation( 'stand-' + this.direction );
				this.message.show(this.msgData);
				this.showMessage = true;
				msgShowing = true;
				//Stop npc when he talk with heroe
				this.accel.x = 0;
				this.accel.y = 0;
				this.vel.x = 0;
				this.vel.y = 0;
			}
		}else if (this.showMessage){
				this.message.hide();
				msgShowing = false;
				this.showMessage = false;
				//Move npc when he stop talk with heroe
				this.accel.x = 0.5;
				this.accel.y = 0.5;
			}
		
		// check and update movement - Update animation
		this.updateMovement();
		this.parent(this);
		


		// if (!this.stop && this.i != this.result.length){

	}
});
// *************************
// ****  End NPC entity ****
// *************************

// **************************
// **** Spawn NPC on map ****
// **************************
var NpcSpawnEntity = me.InvisibleEntity.extend({
	
	//Construtor:
    init: function(x, y, settings) {

		this.parent(x, y, settings);
		
		// Create a new npc *32 to transform map coordinates to tile coordinates
		npc = new NpcEntity(adsNpcData[5].coordenadas.initStartX * 32, adsNpcData[5].coordenadas.initStartY * 32 , 
								{image: adsNpcData[5].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[5]);

		me.game.add(npc,6);
		me.game.sort();
		
		npc = new NpcEntity(adsNpcData[6].coordenadas.initStartX * 32, adsNpcData[6].coordenadas.initStartY * 32 , 
								{image: adsNpcData[6].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[6]);

		me.game.add(npc,6);
		me.game.sort();
		
		npc = new NpcEntity(adsNpcData[4].coordenadas.initStartX * 32, adsNpcData[4].coordenadas.initStartY * 32 , 
								{image: adsNpcData[4].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[4]);

		me.game.add(npc,6);
		me.game.sort();
	},
	
	update: function() {	
	},
	
	onCollision : function ()
	{
		
	}
});

// ******************************
// **** End Spawn NPC on map ****
// ******************************

