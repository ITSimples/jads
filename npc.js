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
		this.msgData.msg = this.npcData.mensagem[2];
		
		this.collidable= true;
		
		this.gravity = 0;
		
		this.friction = 0;
	
		// Config NPC acceleration 
		this.accel.x = this.accel.y = this.npcData.velocidade;
		
						
		// adjust the bounding box
		// this.updateColRect(4,24,20,23); 
 
        // make him start from the right
        this.pos.x = x;
		this.pos.y = y;

		// Set NPC object type
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
		
		// Create message box for object to avoid blinking if is a global box
		this.message = new adsGame.message();
		
		//To store the distances bewwen two start and end point
		this.distanceX = 0;
		this.distanceY = 0;
		
		// If NPC reaches the end stops
		this.stop = false;
		
		//Get the path from Astar algotithm from pathfinder.js
		this.path = [[]];
		
		//Number of points in the path
		this.countPath  = 0;
		
		//Next destination of the NPC
		this.destX = 0;
		this.destY = 0;
		
		//Set initial direction of NPC
		this.direction = "down";
		
		//Current path
		this.currentPath = 0;
		
		//Event wait time 
		this.waitEvent = 0;
		
		//Use this variable to read waitEvent only one time
		this.readWaitEvent = false;
		
		//Increment number of events
		this.CurrentEventNumber = 0;
		
		// Check if event is happening at the moment
		this.eventHappening = false;
		
		// Check if event talk is happening at the moment
		this.talkEventHappening = false;

		//Check NPC movement
		if (this.npcData.tipoMovimento == "path"){
		
			// Get start and end position from gamedata.json for all paths
			for (pathNumber = 0 ; pathNumber < this.npcData.coordenadas.length ; pathNumber++ ){
				var start = [this.npcData.coordenadas[pathNumber].initStartX,this.npcData.coordenadas[pathNumber].initStartY];
				var end = [this.npcData.coordenadas[pathNumber].initDestX,this.npcData.coordenadas[pathNumber].initDestY]; 
			
				// Calculate path 1
				this.path[pathNumber] = adsGame.pathFinder.getPath(start,end,"collision");
			}
			
			//*32 to convert tile position to map coordinates
			// First destination on array path
			this.destX = this.path[0][0][0] * 32;
			this.destY = this.path[0][0][1] * 32;	
		}else{
			//*32 to convert tile position to map coordinates
			// If NPC movement is between two points only
			this.destX = this.npcData.coordenadas[0].initDestX  * 32;
			this.destY = this.npcData.coordenadas[0].initDestY  * 32;
		}
	},
	
	setDirection : function() {
		// Get the distance between the two points to set the direction of NPC
        this.distanceX = Math.abs( this.destX - this.pos.x );
        this.distanceY = Math.abs( this.destY - this.pos.y );
		
		if( this.distanceX > this.distanceY ) {
            this.direction = this.destX < this.pos.x ? 'left' : 'right' ;
        } else {
            this.direction = this.destY < this.pos.y ? 'up' : 'down';
        }
    },
	
	//Update npc position.
	update : function ()
	{	
		//Set animation speed
		this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			
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
				this.setCurrentAnimation( "stand-" + this.direction );
				this.accel.x = this.accel.y = 0;
				this.vel.x = this.vel.y = 0;
			}
		}else if ( this.showMessage && !this.talkEventHappening){
				this.message.hide();
				msgShowing = false;
				this.showMessage = false;
				//Move npc when he stop talk with heroe if is not stoped yet
				if (!this.stop){
					this.accel.x = this.accel.y = this.npcData.velocidade;
					this.setCurrentAnimation( this.direction );
				}
		}
		
		if ( this.npcData.nome == "John"){
			//if return true then wait else no wait time then can readwaittime again
			this.eventHappening = this.npcEvent(this.npcData.evento);
			
			// Check if there is a wait time
			if(this.eventHappening){
				return;
			}else{
				this.readWaitEvent = false;
			}
		}

		if( moveObject( this ) && !this.stop) {
			if (this.countPath != this.path[this.currentPath].length){				
					//return movement
					this.accel.x = this.accel.y = this.npcData.velocidade;
					this.setCurrentAnimation( this.direction );
					
					this.destX = this.path[this.currentPath][this.countPath ][0] * 32;
					this.destY = this.path[this.currentPath][this.countPath ][1] * 32;
					
					this.countPath ++;
					this.setDirection();
					this.setCurrentAnimation( this.direction );
			}else {
				this.countPath = 0;
				this.currentPath++ ;
				
				// Stop the player
				if (this.currentPath == this.path.length){
					this.stop = true;
					this.setCurrentAnimation( "stand-" + this.direction );
				}
			}
		}
		
		// check and update movement - Update animation
		this.updateMovement();
		this.parent(this);
	}, // end update
	
	
	// *** Event Managment
	npcEvent : function npcEvent(npcEvents){
		// console.log('this.CurrentEventNumber:' , this.CurrentEventNumber);
		

		if (this.CurrentEventNumber == npcEvents.length){
			return;
		}else{
			this.currentEvent = npcEvents[this.CurrentEventNumber];
		}
		
		switch( this.currentEvent.tipo ){
			case "talk":
				if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
					// read event wait time 
					if(!this.readWaitEvent){
						this.waitEvent = this.currentEvent.tempo * 60;
						this.readWaitEvent = true;
						
						// Event talk is happening to prevent hide message
						this.talkEventHappening = true;
						
						//Show message
						this.messageNumber = 0;
						this.pauseMessage = Math.floor(this.waitEvent / this.npcData.mensagem.length);
					}
					
					// this.msgData.msg = this.npcData.mensagem[0];
					// $('.msgText,#hiddenText').html( this.msgData.msg );
						
					// Change dialogue depending on the number of messages divided by the waiting time
					if ( this.waitEvent == ((this.currentEvent.tempo * 60) - (this.pauseMessage * this.messageNumber + 1)) && this.messageNumber < this.npcData.mensagem.length ){
						this.msgData.msg = this.npcData.mensagem[this.currentEvent.conversa[this.messageNumber]];
						$('.msgText,#hiddenText').html( this.msgData.msg );
						this.messageNumber++;
					}
					
					this.message.show(this.msgData);
					this.showMessage = true;
					msgShowing = true;

					if ( --this.waitEvent < 0 ){
						// Hide message
						this.message.hide();
						msgShowing = false;
						this.showMessage = false;
						
						// New event
						this.CurrentEventNumber++;
						
						// Event is not happening anymore 
						this.talkEventHappening = false;
						
						return false;  // Event end...~~						
					}else{
						return true;  // Event happening
					}
				}
				break;
			case "wait":
				if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
					
					if(!this.readWaitEvent){
						this.waitEvent = this.currentEvent.tempo * 60;
						this.readWaitEvent = true;
					}
					
					if ( --this.waitEvent < 0 ){
						this.CurrentEventNumber++; // New event
						return false;						
					}else{
						return true;  // Event happening
					}
				}
				break;
			default:
				break;
		}
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
		npc = new NpcEntity(adsNpcData[5].coordenadas[0].initStartX * 32, adsNpcData[5].coordenadas[0].initStartY * 32 , 
								{image: adsNpcData[5].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[5]);

		me.game.add(npc,6);
		me.game.sort();
		
		npc = new NpcEntity(adsNpcData[6].coordenadas[0].initStartX * 32, adsNpcData[6].coordenadas[0].initStartY * 32 , 
								{image: adsNpcData[6].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[6]);

		me.game.add(npc,6);
		me.game.sort();
		
		npc = new NpcEntity(adsNpcData[4].coordenadas[0].initStartX * 32, adsNpcData[4].coordenadas[0].initStartY * 32 , 
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

