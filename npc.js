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
		
		// Check if this npc is a prisoner 
		this.prisoner = this.npcData.prisioneiro;

		// Create message box for object to avoid blinking if is a global box
		this.message = new adsGame.message();
		
		//To store the distances bewwen two start and end point
		this.distanceX = 0;
		this.distanceY = 0;
		
		// If NPC reaches the end stops
		this.stop = false;
		
		//Get the path from Astar algotithm from pathfinder.js
		this.path = [[]];
		
		//Get reverse path from Astar algotithm from pathfinder.js
		// this.reversePath = [[]];
		this.reversePathNumber = -1 ;
		
		// Save path when reverse is used
		this.cachepath = [[]];
		
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
		this.readOneTimeEvent = false;
		
		//Increment number of events
		this.CurrentEventNumber = 0;
		
		// Check if event is happening at the moment
		this.eventHappening = false;
		
		// Check if event talk is happening at the moment
		this.talkEventHappening = false;
		
		this.npcEvents = this.npcData.evento;
		
		this.npcEscapeEvents = this.npcData.eventoFuga;


		//Check NPC movement
		if (this.npcData.tipoMovimento == "path"){
		
			// Get start and end position from gamedata.json for all paths
			for (pathNumber = 0 ; pathNumber < this.npcData.coordenadas.length ; pathNumber++ ){
				var start = [this.npcData.coordenadas[pathNumber].initStartX,this.npcData.coordenadas[pathNumber].initStartY];
				var end = [this.npcData.coordenadas[pathNumber].initDestX,this.npcData.coordenadas[pathNumber].initDestY]; 
			
				// Calculate path 
				this.path[pathNumber] = adsGame.pathFinder.getPath(start,end,"collision");
				
				// Calculate reverse path if event reverse
				if (this.npcData.coordenadas[pathNumber].reverter){
					// this.reversePath[pathNumber] = adsGame.pathFinder.getPath(end,start,"collision");
					this.reversePathNumber = pathNumber;
					console.log('Calculate reverse path...' , pathNumber);
					// // Keep a cache of normal path...
					// this.cachepath[this.currentPath] = this.path[this.currentPath];
				}
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
		
		
		// *** IMPROVE THIS ONE - MAKE IT DINAMIC IF IS PRISONER OR NOT
		if ( this.npcData.nome == "John" || (this.npcData.nome == "Lief" && prisonDoorTrigger[this.npcData.prisao.numero]) ){
			//if return true then wait else no wait time then can readwaittime again
			this.eventHappening = this.npcEvent( this.npcEvents );
			
			// Check if there is a wait time
			if(this.eventHappening){
				return;
			}else{
				this.readOneTimeEvent = false;
			}
		}

		if( moveObject( this ) && !this.stop) {
			if (this.countPath != this.path[this.currentPath].length){

					if (this.prisoner){
						if( prisonBreak[this.npcData.prisao.numero] ){
							
							console.log ('Says thx to heroe and.. ');
							console.log ('Calculate path to freedom... :)');
							console.log ('Stop being a prisoner...');
							//Stop being a prisoner...
							this.prisoner = false;
							
							//reset event number and execute escape events
							this.CurrentEventNumber = 0;
							this.npcEvents = this.npcEscapeEvents;
						}
						
						console.log ('Prisoner ' , this.npcData.nome , ' is arrested at cell ' , this.npcData.prisao.numero ,
							' and this cell is ' , prisonBreak[this.npcData.prisao.numero] ? 'open' : 'closed' );
					}
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
				
				//Test if there is reverse path
				if (this.reversePathNumber == this.currentPath){
					console.log('Reverse path...');

					this.currentPath = 0;					
					
					// if (this.cachepath[this.currentPath] == this.path[this.currentPath]){
						// console.log('Reverse path...');
						// this.path[this.currentPath] = this.reversePath[this.currentPath];
					// }else{
						// console.log('Normal Path...');
						// this.path[this.currentPath] = this.cachepath[this.currentPath];
					// }					
				}
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

	// *** npcTalkEvent Managment
	npcTalkEvent : function npcTalkEvent(){
		// read event wait time 
		if(!this.readOneTimeEvent){
			this.waitEvent = this.currentEvent.tempo * 60;
			this.readOneTimeEvent = true;
			
			// Event talk is happening to prevent hide message
			this.talkEventHappening = true;
			
			//Show message
			this.messageNumber = 0;
			
			// Change to calculate the number of conversations on currentevent
			// this.pauseMessage = Math.floor(this.waitEvent / this.npcData.mensagem.length);
			this.pauseMessage = Math.floor(this.waitEvent / this.currentEvent.conversa.length);
			
		}
		console.log('this.currentEvent.conversa:' , this.currentEvent.conversa , 'this.messageNumber:' , this.messageNumber );
		
		// this.msgData.msg = this.npcData.mensagem[0];
		// $('.msgText,#hiddenText').html( this.msgData.msg );
			
		// Change dialogue depending on the number of messages divided by the waiting time
		if ( this.waitEvent == ((this.currentEvent.tempo * 60) - (this.pauseMessage * this.messageNumber + 1)) && this.messageNumber < this.npcData.mensagem.length ){
			this.msgData.msg = this.npcData.mensagem[this.currentEvent.conversa[this.messageNumber]];
			// $('.msgText').hide();						
			$('.msgText,#hiddenText').html( this.msgData.msg );
			// $('.msgText').fadeIn(1000);	
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
	}, // end npcTalkEvent
	
	// *** npcWaitEvent Managment
	npcWaitEvent : function npcWaitEvent(){
		if(!this.readOneTimeEvent){
			this.waitEvent = this.currentEvent.tempo * 60;
			this.readOneTimeEvent = true;						
		}
			
		if ( --this.waitEvent < 0 ){
			this.CurrentEventNumber++; // New event
			return false;						
		}else{
			return true;  // Event happening
		}	
	},	 // end npcWaitEvent
	
	// *** npceffectEvent Managment
	npceffectEvent : function npceffectEvent(){
		if(!this.readOneTimeEvent){
			this.waitEvent = this.currentEvent.tempo * 60;
			this.readOneTimeEvent = true;
			
			//Call one time function explode
			console.log('Explode...');
			// (this.currentEvent.coordenadasAlvo[0] * 32)- 16 to center the explosion in the midle of tile
			var boom = new effect((this.currentEvent.coordenadasAlvo[0] * 32)- 16, (this.currentEvent.coordenadasAlvo[1] * 32) - 16, me.loader.getImage("explosion_64x64"), 64, 64);
			me.game.add(boom, 5);
			me.game.sort();
			
			// if is a door Open it
			this.doorLayer = me.game.currentLevel.getLayerByName("door");
			this.collisionLayer = me.game.currentLevel.getLayerByName("collision");
			this.doorLayer.clearTile(this.currentEvent.coordenadasAlvo[0],this.currentEvent.coordenadasAlvo[1]);
			this.collisionLayer.clearTile(this.currentEvent.coordenadasAlvo[0],this.currentEvent.coordenadasAlvo[1]);
			this.doorLayer = undefined;
			this.collisionLayer = undefined;
		}
		
		if ( --this.waitEvent < 0 ){
			this.CurrentEventNumber++; // New event
			return false;						
		}else{
			return true;  // Event happening
		}
	},	 // end npceffectEvent
	
	// *** Event Managment
	npcEvent : function npcEvent( npcEvents ){
		// console.log('this.CurrentEventNumber:' , this.CurrentEventNumber);
				
		// If no more events return else execute the next event
		if (this.CurrentEventNumber == npcEvents.length){
			return;
		}else{
			this.currentEvent = npcEvents[this.CurrentEventNumber];
		}
		
		switch( this.currentEvent.tipo ){
			case "talk":
				//**** CHANGE THIS FOR COORDINATES INSTEAD PATH
				// if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
				if( (this.currentEvent.coordenadas[0] == Math.round(this.pos.x/32) && 
					 this.currentEvent.coordenadas[1] == Math.round(this.pos.y/32)) ||
					 prisonDoorTrigger[this.npcData.prisao.numero]){
					if (this.npcTalkEvent()){
						return true;
					}else{
						return false;
					}
				}
				break;
			case "wait":
				// if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
				if( this.currentEvent.coordenadas[0] == Math.round(this.pos.x/32) && this.currentEvent.coordenadas[1] == Math.round(this.pos.y/32)){	
					if (this.npcWaitEvent()){
						return true;
					}else{
						return false;
					}
				}
				break;
			case "effect":
				// if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
				if( this.currentEvent.coordenadas[0] == Math.round(this.pos.x/32) && this.currentEvent.coordenadas[1] == Math.round(this.pos.y/32)){	
					if (this.npceffectEvent()){
						return true;
					}else{
						return false;
					}
				}
				break;
			case "escape":
				// this.readOneTimeEvent = false;
				if (this.npcTalkEvent()){
					
					return true;
				}else{
					// Calculate new path
					console.log('Calculate path on trigger ...');
					this.currentPath = this.path.length - 1 ;
					
					this.countPath = 0;
					var start = [ Math.round(this.pos.x/32), Math.round(this.pos.y/32)];
					var end = this.currentEvent.coordenadas;
					this.path[this.currentPath] = adsGame.pathFinder.getPath(start,end,"collision");
					
					// Stay on waiting room
					this.reversePathNumber = -1;					
					return false;
				}
				break;	
			case "giveItem":
				// this.readOneTimeEvent = false;
				if (this.npcTalkEvent()){
					
					return true;
				}else{
					console.log('Give item ...');
					// Show inventory window
					adsGame.Inventory.show();
					// Set isShowInv to true in heroe to avoid double pressed key I when inventory is showed by NPC
					var player = me.game.getEntityByName('Heroe');
					player[0].isShowInv = true;
					player = undefined;
					// Add item to heroe
					adsGame.Inventory.addItem( ads_items_data[this.currentEvent.item] );
					
					return false;
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

