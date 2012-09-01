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
		
		//*32 to convert tile position to map coordinates
		this.destX = this.initDestX;
        this.destY = this.initDestY;
		
		//if it moves
		this.direction = 'right';
		this.setDirection();
		
		// Create message box for object to avoid blinking if is a global box
		this.message = new adsGame.message();
	},
	
	setDirection : function() {
        this.distanceX = Math.abs( this.destX - this.pos.x );
        this.distanceY = Math.abs( this.destY - this.pos.y );

        if( this.distanceX > this.distanceY ) {
            this.direction = this.destX < this.pos.x ? 'left' : 'right' ;
        } else {
            this.direction = this.destY < this.pos.y ? 'up' : 'down';
        }
		// console.log ("Coordinates :" + "(x=" + this.pos.x + ", y=" + this.pos.y +")" );
		if ( (this.pos.x > this.initDestX - 2 && this.pos.x < this.initDestX + 2) && 
			 (this.pos.y > this.initDestY - 2 && this.pos.y < this.initDestY + 2) ){
			this.destX = this.initStartX;
			this.destY = this.initStartY;
		} else if ( (this.pos.x > this.initStartX - 2 && this.pos.x < this.initStartX + 2) && 
					(this.pos.y > this.initStartY - 2 && this.pos.y < this.initStartY + 2)){
			this.destX = this.initDestX;
			this.destY = this.initDestY;
		}
    },
	
	//Update npc position.
	update : function ()
	{		
		this.setCurrentAnimation( this.direction );
		this.animationspeed = me.sys.fps / (me.sys.fps / 3);
		
		if (this.direction == 'left')
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
		
		// Check collision
		// ***************** IMPROVE COLLISION TO COLIDE AND GO BACK *********************
		var res = me.game.collide( this );
        if( res ) {
			if( res.obj.name == 'heroe' ) {
				this.setCurrentAnimation( 'stand-' + this.direction );
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


		this.setDirection();
		
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