/*
 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (C) 2012  Francisco Fernandes - ITSimples.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// *************************
// ****  Entidade Heroi ****
// *************************
var HeroeEntity = me.ObjectEntity.extend({
	//Construtor:
	init:	function (x , y , settings){
		//Definir propriedades do objecto heroi na classe em vez de no mapa:
		settings.image="h_male01"; 
		settings.spritewidth=32;

		// Chamar o contrutor
		this.parent(x, y , settings);
		
		//Debug Position
		
		this.pos.x = this.posBeforeCollideX = startHeroe[0] * ads_tile_size;
		this.pos.y = this.posBeforeCollideY = startHeroe[1] * ads_tile_size;
		
		
		// This move
		this.movemouse = false;
		
		this.distancetotargetx = 0;
		this.distancetotargety = 0;
		this.xydivision = 0;
		
		// Configurar velocidade do jogador
		this.setVelocity(heroeVelocity, heroeVelocity);
		
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
		this.addAnimation("stand-down", [4]);
		this.addAnimation("stand-left", [8]);
		this.addAnimation("stand-up", [1]);
		this.addAnimation("stand-right", [11]);
		this.addAnimation("down", [3,4,5,4]);
		this.addAnimation("left", [6,7,8]);
		this.addAnimation("up", [0,1,2,1]);
		this.addAnimation("right", [9,10,11]);
		
		// Define point of click on mouse :
		this.dest_point_X = 0;
		this.dest_point_Y = 0;
		
		// Viewport follow heroe
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
		//TESTING.... 
		this.makeOneTime = true;
		
		//Check if is showing the inventory enable/disable
		this.isShowInv = false;
		
		
		// DEBUG GET KEY TO HERO 
		// adsGame.Inventory.addItem(  ads_items_data[14] );
		
	},
	
	//Update player position.
	update : function ()
	{		
		
		if (me.input.isKeyPressed('left'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);

			this.vel.x = -this.accel.x * me.timer.tick;
			this.setCurrentAnimation('left');
			this.direction = 'left';			
		}
		else if (me.input.isKeyPressed('right'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.x = this.accel.x * me.timer.tick; 
			this.setCurrentAnimation('right');
			this.direction = 'right';
		}

		if (me.input.isKeyPressed('up'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.y = -this.accel.y * me.timer.tick; 
			this.setCurrentAnimation('up');
			this.direction = 'up';
		}
		else if (me.input.isKeyPressed('down'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.y = this.accel.y * me.timer.tick; 
			this.setCurrentAnimation('down');
			this.direction = 'down';
		}
			
		// If keypressed I then open the inventory
		if (me.input.isKeyPressed('inventory'))
		{
			if (this.isShowInv){
				adsGame.Inventory.hide();
				// Disable showing
				this.isShowInv = false;
			}else{
				adsGame.Inventory.show();
				// Enable showing
				this.isShowInv = true;
			}			
		}
	
		// If player Stop set stand animationa
		if (this.vel.y === 0 && this.vel.x === 0)
		{
			this.setCurrentAnimation('stand-' + this.direction);
		}

		// If question box is showing then stop the player
		if (showingQuestion){
			this.setCurrentAnimation('stand-' + this.direction);
			this.vel.x = 0;
			this.vel.y = 0;
		}		

		// update collision
		var res = me.game.collide(this);
		
		
		//  --- TESTING which OBJECT ---
		if (res){
		
			// // Not needed anymore
			// if (res.obj.type == 'NPC_OBJECT') {
				// console.log('Heroe Collide with NPC...');
				// this.setCurrentAnimation('stand-' + this.direction);
			// }
			
			if (res.obj.type == 'ITEM_OBJECT') {
				// console.log('Heroe Collide with Item...' , res.obj.items_data);
				// this.setCurrentAnimation('stand-' + this.direction);
				// this.pos.x = this.posBeforeCollideX;
				// this.pos.y = this.posBeforeCollideY;
				if (!fullInventory){
					this.vel.x = 0;
					this.vel.y = 0;
					res.obj.getItem();
				}else{
					adsGame.Inventory.show();
				}
			}
		}else{
			// Save the last hero coordinates before collide with something
			this.posBeforeCollideX = this.pos.x;
			this.posBeforeCollideY = this.pos.y;
		}

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



// *************************
// ****  Entidade Item  ****
// *************************
var ItemEntity = me.CollectableEntity.extend({
	
	//Construtor:
	init:	function (x , y , settings , items_data){
		// Chamar o contrutor
		this.parent(x, y , settings);
		// Item data
		this.items_data = items_data;
		
		if (typeof this.items_data.specialItem !== 'undefined') {
			this.specialItem = true;
		}else{
			this.specialItem = false;
		}
		
		// console.log ("Item name:", this.items_data.nome , " - Special Item:" , this.specialItem);
		
		// Random question number between 0 and number of question less one 
		var rndQuestion = randomInt( 0 , (countQtn - 1) );
		this.rndQtnData = adsQtnData[rndQuestion];
		
		this.type = 'ITEM_OBJECT';
		
		// Item sparkle animation
		this.itemAnimation = new effect(
			this.pos.x - 8 , this.pos.y - 8, // Coordinates
			me.loader.getImage("sparkle"),	// Image
			40, 40, // Size
			[0,1,2,3,4,5,6,7,8,9,10,11,12,13], //Animation sheet
			30, // Speed between 0 - Slowest and 60 - fastest
			true, // Repeat animation
			100 // Wait between animations 10 milliseconds
			);

		me.game.add(this.itemAnimation, 6);
		me.game.sort();
	},
	
	
	getItem : function ()
	{
		//Stop player
		var player = me.game.getEntityByName('Heroe');
		player[0].vel.x = 0;
		player[0].vel.y = 0;
		
		
		// If the answer is correct then update HUD and remove item
		heroeAnswer = showQuestionLayer(this.items_data , this.rndQtnData);
		if (heroeAnswer != -1)
		{
			if ( heroeAnswer == this.rndQtnData.correta){ // if heroe correct answer			
				// me.game.HUD.updateItemValue(this.items_data.categoria, parseInt(this.items_data.valor));
				
				//Keep data for all items found by the heroe less gold and knowledge increment right away
				if (this.items_data.categoria == 'ouro' ||
					this.items_data.categoria == 'conhecimento'){
					me.game.HUD.updateItemValue(this.items_data.categoria , parseInt(this.items_data.valor, 10));
				}else{
			
			adsGame.Inventory.addItem( this.items_data );
				}						
				hideQuestionLayer('C');
			}else if(heroeAnswer !== 0){ // if heroe answer to the question but it's not the correct one
				var valueRemoved = -(parseInt(this.items_data.valor,10));
				
				//If is velocity then don't remove points
				if (this.items_data.categoria != 'velocidade'){
					me.game.HUD.updateItemValue(this.items_data.categoria, valueRemoved);
				}	
				hideQuestionLayer('W');
			}else{ // If heroe doesn't answer to the question
				hideQuestionLayer('D');
			}
			
			//If correct answer and specialitem remove item - If not special item remove always the item
			if ( (!this.specialItem) || (this.specialItem &&  heroeAnswer == this.rndQtnData.correta) ){
				// Remove Item 
				me.game.remove(this);
				
				// Remove sparkle item animation
				me.game.remove(this.itemAnimation);
			}else{ 
				// If is a Special item and the answer is not the correct 
				// then position heroe to last position with no collition with item
				player[0].pos.x = player[0].posBeforeCollideX;
				player[0].pos.y = player[0].posBeforeCollideY;
				
				// Remove special item value
				var valueRemoved = -(parseInt(this.items_data.quantidade,10));
				me.game.HUD.updateItemValue(this.items_data.remover, valueRemoved);
			}
		}
		
		//Destroy player variable
		player = undefined;
	}
});

// **************************************
// ****  Distribuir items pelo mapa  ****
// **************************************
var ItemSpawnEntity = me.InvisibleEntity.extend({
	
	//Construtor:
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.gravity = 0;
		
		var item = [];
		
		var count = 0;
		
		var collision_layer = me.game.currentLevel.getLayerByName("collision");		
		var background_layer = me.game.currentLevel.getLayerByName("background");
		
		// parse all the collision layer tiles 
		for ( x = 0; x < collision_layer.width; x++) 
		{
			for ( y = 0; y < collision_layer.height; y++) 
			{
				var testTileCollision = collision_layer.layerData[x][y];
				var testTileBackground = background_layer.layerData[x][y];

				// If tile of layer collision is null then we can put an item
				if (testTileCollision === null && testTileBackground !== null){
					// Item probability
					var item_probability = Number.prototype.random(0, itemLucky);
					// Total of items
					total_items = ads_items_data.length - 1;
					
					// If is a mission item don't spawn
					do
					{
						//random a item
						random_item = Number.prototype.random(0, total_items);
					}
					while ( ads_items_data[random_item].categoria == "itemMissao" );
					
					

					if ( item_probability == Math.round(itemLucky / 2) ){						
						//Test if not a trigger or special item or born heroe
						var isCollide = false;
						$.each(triggersData, function(i, data){
							if (data.coordinates.x == x && data.coordinates.y == y)
								isCollide = true;
						});
						
						
						
						//Improve thi is to not spwan items on mission tiles
						//special item
						$.each(specialItemsData, function(i, data){
							if (data.coordinates.x == x && data.coordinates.y == y)
								isCollide = true;
						});	
						
						//Heroe born
						if (x == startHeroe[0] && y == startHeroe[1])
								isCollide = true;
						
						if (!isCollide)
						{
							// Item Image
							item[count] = new ItemEntity(parseInt(ads_tile_size*x ,10), parseInt(ads_tile_size*y ,10), 
									{image: ads_items_data[random_item].imagem.replace(".png",""),
									spritewidth: 32, spriteheight: 32}, ads_items_data[random_item]);
							count++;
							// console.log("Populate Map... X:" + parseInt(32*x) +
										// "   Y:" + parseInt(32*y) + 
										// " dss  Count:" + count + "    Item: " + random_item);
						}
					}
				
				}
			}
		}
		
		// add items on layer 5
		$.each(item, function(i, item){
			me.game.add(item,5);
			me.game.sort();
		});
		

		//Spawn special items
		$.each(specialItemsData, function(i, dataSpecialItem){
			$.each(ads_items_data, function(i, ads_item_data){
				// console.log('dataSpecialItem.value: ' + dataSpecialItem.value + '  ads_item_data.valor: ' + ads_item_data.valor);
				if ( dataSpecialItem.value == ads_item_data.valor)
				{
					ads_item_data.remover = dataSpecialItem.remover;
					ads_item_data.quantidade = dataSpecialItem.quantidade;
					ads_item_data.specialItem = true;
					item = new ItemEntity(parseInt(ads_tile_size*dataSpecialItem.coordinates.x , 10), parseInt(ads_tile_size*dataSpecialItem.coordinates.y ,10), 
					{image: ads_item_data.imagem.replace(".png",""),
					spritewidth: 32, spriteheight: 32}, ads_item_data);
					me.game.add(item,5);
					me.game.sort();
				}
			});
		});
	}
});

// **************************************
// ****  TRIGGER INVISIBLE ENTITY  ****
// **************************************
var TriggerEntity = me.InvisibleEntity.extend({
	
	//Constructor
	init: function( x , y , settings , triggerData){
		
		this.parent(x, y , settings );
		
		this.collidable = true;
		
		this.triggerData = triggerData;
		
		// prepare data to message box
		this.msgData = {};
		this.msgData.msgImage = 'sprites/items/' + triggerData.imageName;
		this.msgData.msgName = "Mensagem:";
		this.msgData.msg = triggerData.message;		
		this.type = triggerData.type;

		this.targX = triggerData.target.x;
		this.targY = triggerData.target.y;

		this.solution = this.triggerData.solution;
		this.checkSolution = false;
		this.isChecked = false;

		// Create message box for object
		this.message = new adsGame.message();
	},

	update : function (){
		// Check collision
		var res = me.game.collide( this );
        if( res ) {
			if( res.obj.name == 'heroe' ) {
				// Verify if heroe have the item only one time
				if (!this.isChecked)
				{
					//Create variable to work for each ?!?!?!?!?
					var solution = this.solution;
					var checkSolution = false;
					// Get index where heroe have the key to remove that from the inventory
					var itemIndex = null;
					
					//Make it check one time only - Problem var checkSolution = false; have to go inside if doorobject
					//check if heroe have the Solution			
					$.each(heroeItems, function(i,data)
					{
							if (data.valor == solution){
								console.log('Heroe have the key.');
								checkSolution = true;
								itemIndex = i;
							}
					});
					
					this.checkSolution = checkSolution;
					this.isChecked = true;
					
					// console.log('Test times...' + this.checkSolution);
					// console.log('Remove the item number : ' + itemIndex);
					
					// Remove item from inventory - Index + 1 Slot number
					if (itemIndex !== null)
						adsGame.Inventory.removeItem( 'Slot0' + (itemIndex + 1) );
				}
				
				// If trigger is a door object
				if (this.type == 'DOOR_OBJECT'){
					if (this.checkSolution){
					
						// // Open the door
						// this.doorLayer.clearTile(this.targX,this.targY);
						// this.collisionLayer.clearTile(this.targX,this.targY);

						// //Remove this object
						// me.game.remove(this);
						
						var doorCoord = new Array();
						doorCoord[0] = this.targX;
						doorCoord[1] = this.targY;
						
						adsGame.prisonDoors.remove(doorCoord , "openDoor");
						
						//portaPrisao -- Set door open to the prison number
						// adsGame.prisonDoors.prisonBreak[this.triggerData.portaPrisao] = true;
						adsGame.prisonDoors.openPrisonDoor( this.triggerData.portaPrisao );
						
						console.log("prisonBreak Heroe: " , adsGame.prisonDoors.getPrisonDoorState( this.triggerData.portaPrisao ) );
						
						// Remove Trigger
						me.game.remove(this);
						
						// **** TODO - REMOVE KEY  FROM LIST OF ITEMS
					}else{
						// console.log("Heroe don't have the key. npcTalking:" , npcTalking);
						
						if (!npcTalking){
							this.message.show(this.msgData);
							msgShowing = true;
						}
					}	
					
					// Set if NPC prisoner talk to hero to avoid to talk again on npc.js
					adsGame.prisonDoors.prisonDoorTrigger[this.triggerData.portaPrisao] = true;
				} // End door object
				
				// If trigger is a portal object
				if (this.type == 'PORTAL_OBJECT'){
					if (this.checkSolution){
						//***** TEST TELEPORT AND FADE MAP
						var player = me.game.getEntityByName('Heroe');
						
						player[0].pos.x = this.targX * ads_tile_size;
						player[0].pos.y = this.targY * ads_tile_size;
						//TODO - Fade out /in viewport 
						me.game.viewport.fadeOut('#000000',1000);
						
						// **** TODO - REMOVE SCROOLL OF PORTAL FROM LIST OF ITEMS
					}else{
						// console.log("Heroe don't have the key.");
						this.message.show(this.msgData);
						msgShowing = true;
					}
				} // End portal object
				
			} // End heroe collision
		}else{
			if (!msgShowing)
			{
					this.message.hide();	
			}
			msgShowing = false;
			// Reset check for items
			this.isChecked = false;
		}
	} // End Update
	
});

// **************************************
// ****  INVISIBLE ENTITY SPAWN ****
// **************************************
var TriggerSpawnEntity = me.InvisibleEntity.extend({
	//Constructor
	init: function( x , y , settings){
		// call the parent constructor
		this.parent(x, y, settings);
		
		// var triggerData = {};
		// triggerData.coordinates = {x:6,y:10};
		// triggerData.type = 'DOOR_OBJECT';
		// triggerData.tileTarget = {x:6,y:10};
		// triggerData.message = "Precisas da Chave Caveira<br>para abrir a porta.";
		// triggerData.imageName = "chaveosso.png";
		// triggerData.solution = "chaveosso";
		
		// //var settings = {};
		// var settings = triggerData.settings;
		// settings.width = 32;
		// settings.height = 32;
		
		// Adicionar items na camada 4
		$.each(triggersData, function(i, triggerData){
			trigger = new TriggerEntity( triggerData.coordinates.x * ads_tile_size , triggerData.coordinates.y * ads_tile_size
										, triggerData.settings , triggerData);
			me.game.add(trigger,4);
			me.game.sort();
		});	
		
		// // Door = new DoorEntity( 6*32 , 9*32, {image: "doorcheck", spritewidth: 32, spriteheight: 32});
		// heroeDoorCell = new TriggerEntity( 6*32 , 9*32, settings , triggersData[0]);
		// me.game.add(heroeDoorCell,3);
		// me.game.sort();
	}
});
// **************************************
// ****  END INVISIBLE ENTITY SPAWN ****
// **************************************

// **************************************
// ****  THROWERS ENTITY 				 ****
// **************************************

  var throwersEntity = me.ObjectEntity.extend({
    
	init: function (x, y, throwerData) {

		this.throwerData = throwerData;

		var settings = this.throwerData.configuracoes;
	 
		this.parent(x, y , settings);

		this.collidable = false;
		this.isSolid = true;
		
		// disable gravity
		this.gravity = 0;

		this.addAnimation("default", this.throwerData.animacoes.parado );
		this.addAnimation("throw", this.throwerData.animacoes.animado );
		this.setCurrentAnimation("default");
		
		this.animationspeed = me.sys.fps / (me.sys.fps / this.throwerData.animacoes.velocidade);
		
		this.resetThrowDurationAndTimer();
		
		// console.log('this.throwerData.solido:',this.throwerData.solido ,  'this.throwerData.nome:', this.throwerData.nome)
		
		//Put solid tile in this place if thrower is solid 226 number
		if (this.throwerData.solido){
			this.collisionLayer = me.game.currentLevel.getLayerByName("collision");
			this.collisionLayer.setTile(this.throwerData.coordenadas.x,this.throwerData.coordenadas.y,226);
		}
		
		// Create a maximum number of projectil objects
		this.numberProjectils = 0;
	},
    
	update: function () {
		this.updateThrowTimer();
		// check & update player movement
		updated = this.updateMovement();

		// update animation
		if (updated)
		{
			// Actualizar animação
			this.parent(this);
		}

		return updated;
	},
    
    updateThrowTimer: function () {
      this.throwTimer++;
      if (this.throwTimer > this.throwDuration) {
        this.resetThrowDurationAndTimer();
        this.throwProjectil();
      }
    },
    
    throwProjectil: function () {
      this.setCurrentAnimation("throw", "default");
	  
	  // DEBUG
	  if (typeof(this.throwerData.numeroDeProjeteis) !== 'undefined' ){
		// Create a maximum number of projectil objects
		this.createMaxProjectils(this.throwerData.numeroDeProjeteis);
	  }else{
		this.createProjectil();
	  }
      
      // me.audio.play("shot1");
    },
    
    resetThrowDurationAndTimer: function () {
	  // Set throw interval between shots
      this.throwDuration = randomInt(this.throwerData.intervaloTempoDisparo[0], this.throwerData.intervaloTempoDisparo[1]);
      this.throwTimer = 0;
    },
    
    createProjectil: function () {
	
		// //Create a random velocity for each projectil created
		// projectilsData[this.throwerData.nomeProjectil].velocity = randomInt(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
		
		// //Receive witch type of path the projectil must follow
		// projectilsData[this.throwerData.nomeProjectil].movimento = this.throwerData.movimento;
		
		this.throwerData.GUID = this.GUID;
		
		if (this.throwerData.direcao == "up" || this.throwerData.direcao == "down"){
			// Calculate trigger position on (X=middle of thrower - middle of projectil) and (Y = projectil height)
			var triggerPositionX = ~~(this.throwerData.configuracoes.spritewidth / 2) - 
									~~(projectilsData[this.throwerData.nomeProjectil].configuracoes.spritewidth / 2);
			var triggerPositionY = this.throwerData.posicaoDisparo.y ;	
				
			console.log("triggerPositionY + this.pos.y:" , triggerPositionY , "+", this.pos.y)
			
		}else if (this.throwerData.direcao == "right" || this.throwerData.direcao == "left"){
			var triggerPositionX = this.throwerData.posicaoDisparo.x ;
			var triggerPositionY = ~~(this.throwerData.configuracoes.spriteheight / 2) - 
									~~(projectilsData[this.throwerData.nomeProjectil].configuracoes.spriteheight / 2);
		}else{
			var triggerPositionX = this.throwerData.posicaoDisparo.x ;
			var triggerPositionY = this.throwerData.posicaoDisparo.y ;
		}
			
		
		var projectil = new projectilEntity(this.pos.x + triggerPositionX , 
											this.pos.y + triggerPositionY, 
											projectilsData[this.throwerData.nomeProjectil], this.throwerData);
		
		me.game.add(projectil,7);
		me.game.sort.defer();
    },
	
	// Max of prjectils if there is a max
	createMaxProjectils: function (maxNumberProjectils){
		if (this.numberProjectils <  maxNumberProjectils ){
			//Create projectil
			this.createProjectil();
			this.numberProjectils++;
			// console.log('numberProjectils' , this.numberProjectils);
			return;
		}
	},
  });
  
// **************************************
// ****  END THROWERS ENTITY 			 ****
// **************************************  
  
// **************************************
// ****  PROJECTIL ENTITY 	     	 ****
// ************************************** 
   var projectilEntity = me.ObjectEntity.extend({
    
    init: function (x, y, projectilData, throwerData ) {
		
		this.projectilData = projectilData;
		
		this.throwerData = throwerData;
		
		// console.debug( "Projectil", projectilData );
		var settings = this.projectilData.configuracoes;
		
		this.parent(x, y, settings);

		this.gravity = 0;
		
		// this.collidable = true;
		
		//Define if object moves in all directions
		this.testDirection = false;
		
		// If the projectil move in all directions then add animation if not set one animation
		if (typeof(this.projectilData.animacoes.anima) != 'undefined' && this.projectilData.animacoes.anima != null){
			this.addAnimation("default", this.projectilData.animacoes.parado );
			this.addAnimation("down", this.projectilData.animacoes.anima.baixo );
			this.addAnimation("up", this.projectilData.animacoes.anima.cima );
			this.addAnimation("left", this.projectilData.animacoes.anima.esquerda );
			this.addAnimation("right", this.projectilData.animacoes.anima.direita );
			
			//If projectil moves in all directions
			this.testDirection = true;
		}else{
			this.addAnimation("anime", this.projectilData.animacoes.animaTodasDirecoes );
			this.addAnimation("default", this.projectilData.animacoes.parado );
		}
		
		this.currentAnimation = "";
		
		this.setCurrentAnimation("default");
		
		switch (this.throwerData.movimento){
			case "line":
					this.lineMovement();
			break;

			case "random":
					this.randomDirection = "";
					this.initialDirection = true;
					this.randomMovement();
			break;
			
			case "BeeHavior":
					this.currentAnimation = "default";
					this.launchAngle = 0;
					
					this.changeRadius = -50;
			break;
			
			case "followHeroe":
					this.currentAnimation = "default";
					
					this.velocityFollow = randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);;
					
			break;
			
			default:
			break;
		}
		
		// If you want add time before destroy object must be interesting
		this.timeToDestroy = 0;
    },
    
    update: function () {
	
		//Update animation
		if (this.testDirection){
			this.setCurrentAnimation(this.currentAnimation);
		}else{
			this.setCurrentAnimation("anime");
		}
		
		if(this.throwerData.movimento  === "BeeHavior"){
			moveObjectBeeHavior( this );
		}
		
		if(this.throwerData.movimento  === "followHeroe"){
			followHeroe( this );
		}
		
		// Destroy object if the livetime has been exceeded
		if ( typeof(this.throwerData.tempoDeVida) !== 'undefined' ){
			this.liveTime();
		}
		
		// check & update movement
		updated = this.updateMovement();

		// update animation
		if (updated)
		{
			this.handleCollisions(updated);
			// Actualizar animação
			this.parent(this);
		}
	 
		return updated;
		
		
    },
	
	liveTime: function (){
		this.timeToDestroy++;
		if (this.timeToDestroy >  this.throwerData.tempoDeVida ){
			//Remove object
			me.game.remove(this);
			return;
		}
	},
    
    handleCollisions: function (updated) {	
		
		var res = me.game.collide(this);

		if (res && res.obj.name == "heroe" ) {
			me.game.HUD.updateItemValue(this.projectilData.atualizarHUD.tipo, 
										-(parseInt(this.projectilData.atualizarHUD.valor)));					
			//Remove object
			me.game.remove(this);
			
			//if there is a maximum number of projectils then when one die another is created
			if (typeof(this.throwerData.numeroDeProjeteis) !== 'undefined' ){
				var throwerEntity = me.game.getEntityByGUID(this.throwerData.GUID);
				throwerEntity.numberProjectils--;
			}	
				
			return;
		}
		
		// Remove bees only when do complet circle
		if (this.checkWallCollision(updated)){
			if(this.throwerData.movimento === "random"){			
				this.randomMovement();
			}else{
				//Remove object if there is a distance up 32 pixels
				me.game.remove(this);
			}
			
		}
		
    },
	
	checkWallCollision: function (updated) {
		
		var wallCollision = updated.x != 0 || updated.y!= 0 ? true : false;

		return wallCollision;	
	},

    randomMovement: function () {	

		var randomVelocity = randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		
		
		if (this.initialDirection){
			this.randomDirection = this.throwerData.direcao;
			this.initialDirection = false;
		}else{
			if(this.randomDirection == "down"){
				this.randomDirection = "up";
			}else{
				this.randomDirection = "down";
			}
		}
		
		switch (this.randomDirection){
		
			case "down":
				this.vel.x = randomVelocity * plusOrMinus;
				this.vel.y = randomVelocity;
			break;
			
			case "up":
				this.vel.x = randomVelocity * plusOrMinus;
				this.vel.y = -randomVelocity;
			break;
			
			case "all":
				this.vel.x = randomVelocity * plusOrMinus;
				plusOrMinus = Math.random() < 0.5 ? -1 : 1;
				this.vel.y = randomVelocity * plusOrMinus;
			break;
		}
		
		this.setMyAnimation( this );
		
	},
    
	lineMovement: function () {	
		switch (this.throwerData.direcao){
		
			case "down":
				this.vel.y = randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
			break;
			
			case "up":
				this.vel.y = -randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
			break;
			
			case "left":
				this.vel.x = -randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
			break;
			
			case "right":
				this.vel.x = randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
			break;
		}
	},
	
	setMyAnimation: function(  object){
		if ((object.vel.x < 0 && object.vel.y < 0) || 
			(object.vel.x < 0 && object.vel.y > 0) ||
			(object.vel.x < 0 && object.vel.y == 0)){
			object.currentAnimation = "left";
		}else if((object.vel.x > 0 && object.vel.y < 0) || 
			(object.vel.x > 0 && object.vel.y > 0) ||
			(object.vel.x > 0 && object.vel.y == 0)){
			object.currentAnimation = "right";
		} else if(object.vel.x == 0 && object.vel.y < 0){
			object.currentAnimation = "up";
		}  else {
			object.currentAnimation = "down";
		}
	}
    
  });
  
// **************************************
// ****  END PROJECTIL ENTITY 		*****
// **************************************


// **************************************
// ****  THROWERS ENTITY SPAWN ****
// **************************************
var ThrowersSpawnEntity = me.InvisibleEntity.extend({
	//Constructor
	init: function( x , y , settings){
		// call the parent constructor
		this.parent(x, y, settings);
		
		
		// Adicionar items na camada 4
		$.each( throwersData, function(i, throwerData){
			thrower = new throwersEntity( throwerData.coordenadas.x * ads_tile_size , throwerData.coordenadas.y * ads_tile_size, throwerData);
			me.game.add(thrower,6);
			me.game.sort.defer();
		});	

	}
});
// **************************************
// ****  END THROWERS ENTITY SPAWN ****
// **************************************

// **************************************
// ****  MAP EFFECTS ENTITY SPAWN ****
// **************************************
var MapEffectsSpawnEntity = me.InvisibleEntity.extend({
	//Constructor
	init: function( x , y , settings){
		// call the parent constructor
		this.parent(x, y, settings);
		
		
		// Add effects on map
		$.each( mapEffectsData, function(i, mapEffectData){
			var mapEffect = new effect(
				mapEffectData.coordenadas.x * 32 , mapEffectData.coordenadas.y * 32 , // Coordinates
				me.loader.getImage(mapEffectData.imagem),	// Image
				mapEffectData.largura, mapEffectData.altura, // Size
				mapEffectData.animacao, //Animation sheet
				mapEffectData.velocidade, // Speed between 0 - Slowest and 60 - fastest
				mapEffectData.repetir, // Repeat animation
				0 // time between animations
				);
			me.game.add(mapEffect,7);
			me.game.sort.defer();
		});	

	}
});
// **************************************
// ****  END MAP EFFECTS ENTITY SPAWN ****
// **************************************  