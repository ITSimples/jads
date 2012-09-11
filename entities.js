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
			this.vel.x = this.accel.x * me.timer.tick 
			this.setCurrentAnimation('right')
			this.direction = 'right'
		}

		if (me.input.isKeyPressed('up'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.y = -this.accel.y * me.timer.tick 
			this.setCurrentAnimation('up')
			this.direction = 'up'
		}
		else if (me.input.isKeyPressed('down'))
		{
			this.animationspeed = me.sys.fps / (me.sys.fps / 3);
			this.vel.y = this.accel.y * me.timer.tick 
			this.setCurrentAnimation('down')
			this.direction = 'down'
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
		if (this.vel.y == 0 && this.vel.x == 0)
		{
			this.setCurrentAnimation('stand-' + this.direction)
		}

		// If question box is showing then stop the player
		if (showingQuestion){
			this.setCurrentAnimation('stand-' + this.direction);
			this.vel.x = 0;
			this.vel.y = 0;
		}		

		// Actaualizar colisão
		var res = me.game.collide(this);
		
		
		//  --- TESTING which OBJECT ---
		if (res){
		
			// // Not needed anymore
			// if (res.obj.type == 'NPC_OBJECT') {
				// console.log('Heroe Collide with NPC...');
				// this.setCurrentAnimation('stand-' + this.direction);
			// }
			
			if (res.obj.type == 'ITEM_OBJECT'  && !fullInventory) {
				// console.log('Heroe Collide with Item...' , res.obj.items_data);
				// this.setCurrentAnimation('stand-' + this.direction);
				this.vel.x = 0;
				this.vel.y = 0;
				res.obj.getItem();
			}
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
		
		// Random question number between 0 and number of question less one 
		var rndQuestion = randomInt( 0 , (countQtn - 1) );
		this.rndQtnData = adsQtnData[rndQuestion];
		
		this.type = 'ITEM_OBJECT';

	},
	
	
	getItem : function ()
	{
		if(!fullInventory) {
			//Stop player
			var player = me.game.getEntityByName('Heroe');
			player[0].vel.x = 0;
			player[0].vel.y = 0;
			player = undefined;
			
			// If the answer is correct then update HUD and remove item
			heroeAnswer = showQuestionLayer(this.items_data , this.rndQtnData);
			if (heroeAnswer != -1)
			{
				if ( heroeAnswer == this.rndQtnData.correta){ // if heroe correct answer			
					// me.game.HUD.updateItemValue(this.items_data.categoria, parseInt(this.items_data.valor));
					
					//Keep data for all items found by the heroe less gold and knowledge increment right away
					if (this.items_data.categoria == 'ouro' ||
						this.items_data.categoria == 'conhecimento'){
						me.game.HUD.updateItemValue(this.items_data.categoria, (parseInt(this.items_data.valor)));
					}else{
						adsGame.Inventory.addItem( this.items_data );
					}						
					hideQuestionLayer('C');
				}else if(heroeAnswer != 0){ // if heroe answer to the question but it's not the correct one
					me.game.HUD.updateItemValue(this.items_data.categoria, -(parseInt(this.items_data.valor)));
					hideQuestionLayer('W');
				}else{ // If heroe doesn't answer to the question
					hideQuestionLayer('D');
				}
				me.game.remove(this);
			}
		}else if(fullInventory) {
			adsGame.Inventory.show();
		}
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
		for ( var x = 0; x < collision_layer.width; x++) 
		{ 	
			for ( var y = 0; y < collision_layer.height; y++) 
		   { 
				var testTileCollision = collision_layer.layerData[x][y];
				var testTileBackground = background_layer.layerData[x][y];

				// If tile of layer collision is null then we can put an item
				if (testTileCollision == null && testTileBackground != null){
					// Item probability
					var item_probability = Number.prototype.random(0, itemLucky);
					// Total of items
					total_items = ads_items_data.length - 1;
					
					//random a item
					random_item = Number.prototype.random(0, total_items);

					if ( item_probability == Math.round(itemLucky / 2) ){						
						//Test if not a trigger or special item or born heroe
						var isCollide = false;
						$.each(triggersData, function(i, data){
							if (data.coordinates.x == x && data.coordinates.y == y)
								isCollide = true;
						});
						//special item
						$.each(specialItemsData, function(i, data){
							if (data.coordinates.x == x && data.coordinates.y == y)
								isCollide = true;
						});						
						//Heroe born
						if (x == 6 && y == 5)
								isCollide = true;
						
						if (!isCollide)
						{
							item[count] = new ItemEntity(parseInt(32*x), parseInt(32*y), 
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
		
		// Adicionar items na camada 3
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
					item = new ItemEntity(parseInt(32*dataSpecialItem.coordinates.x), parseInt(32*dataSpecialItem.coordinates.y), 
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
// ****  TEST INVISIBLE ENTITY  ****
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
		

		// If trigger is a door get layer door and coolision. Set where the door open
		if (this.type == 'DOOR_OBJECT'){
			this.doorLayer = me.game.currentLevel.getLayerByName("door");
			this.collisionLayer = me.game.currentLevel.getLayerByName("collision");
		
			//Check if door is open
			this.tileTarget = false;
		}
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
					if (itemIndex != null)
						adsGame.Inventory.removeItem( 'Slot0' + (itemIndex + 1) )
				}
				// If trigger is a door object
				if (this.type == 'DOOR_OBJECT'){
					if (this.checkSolution){
						// Open the door
						this.doorLayer.clearTile(this.targX,this.targY);
						this.collisionLayer.clearTile(this.targX,this.targY);

						//Remove this object
						me.game.remove(this);
						
						//portaPrisao -- Set door open to the prison number
						prisonBreak[this.triggerData.portaPrisao] = true;
						
						// **** TODO - REMOVE KEY  FROM LIST OF ITEMS
					}else{
						// console.log("Heroe don't have the key.");
						this.message.show(this.msgData);
						msgShowing = true;

					}	
					
					// Set if NPC prisoner talk to heore to avoid to talk again on npc.js
					prisonDoorTrigger[this.triggerData.portaPrisao] = true;
				} // End door object
				
				// If trigger is a portal object
				if (this.type == 'PORTAL_OBJECT'){
					if (this.checkSolution){
						//***** TEST TELEPORT AND FADE MAP
						var player = me.game.getEntityByName('Heroe');
						
						player[0].pos.x = this.targX * 32;
						player[0].pos.y = this.targY * 32;
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
// ****  TEST INVISIBLE ENTITY SPAWN ****
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
		
		var settings = {};
		settings.width = 32;
		settings.height = 32;
		
		// Adicionar items na camada 4
		$.each(triggersData, function(i, triggerData){
			trigger = new TriggerEntity( triggerData.coordinates.x * 32 , triggerData.coordinates.y * 32
										, settings , triggerData);
			me.game.add(trigger,4);
			me.game.sort();
		});	
		
		// // Door = new DoorEntity( 6*32 , 9*32, {image: "doorcheck", spritewidth: 32, spriteheight: 32});
		// heroeDoorCell = new TriggerEntity( 6*32 , 9*32, settings , triggersData[0]);
		// me.game.add(heroeDoorCell,3);
		// me.game.sort();
	}
});

