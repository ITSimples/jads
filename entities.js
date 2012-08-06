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
		this.setVelocity(6, 6);
		
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
				 
		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
		//TESTING.... 
		this.makeOneTime = true;
	},


	//Update player position.
	update : function ()
	{
		
		if (me.input.isKeyPressed('left'))
		{
			this.animationspeed = me.sys.fps / 20;
			this.vel.x = -this.accel.x * me.timer.tick;
			this.setCurrentAnimation('left');
			this.direction = 'left';			
		}
		else if (me.input.isKeyPressed('right'))
		{
			this.animationspeed = me.sys.fps / 20;
			this.vel.x = this.accel.x * me.timer.tick 
			this.setCurrentAnimation('right')
			this.direction = 'right'
		}

		if (me.input.isKeyPressed('up'))
		{
			this.animationspeed = me.sys.fps / 20;
			this.vel.y = -this.accel.y * me.timer.tick 
			this.setCurrentAnimation('up')
			this.direction = 'up'
		}
		else if (me.input.isKeyPressed('down'))
		{
			this.animationspeed = me.sys.fps / 20;
			this.vel.y = this.accel.y * me.timer.tick 
			this.setCurrentAnimation('down')
			this.direction = 'down'
		}
		
		
		// If player Stop set stand animationa
		if (this.vel.y == 0 && this.vel.x == 0)
		{
			this.setCurrentAnimation('stand-' + this.direction)
		}

		// check & update player movement
		updated = this.updateMovement();
		
		// update animation
		if (updated)
		{
			// Actaualizar colisão
			var res = me.game.collide(this);

			
			//  --- TESTING which OBJECT ---
			if (res){
				if (res.obj.type == 'NPC_OBJECT') {
					console.log(res.obj.type);
					this.setCurrentAnimation('stand-' + this.direction);
					this.vel.x = 0;
					this.vel.y = 0;
				}
			}
			//  --- TESTING which OBJECT ---
			
			// Test if player step into position 6,10
			// console.log("Testing player position (x,y): (" + Math.round(this.pos.x/32) + "," + Math.round(this.pos.y/32) + ")");
			if (this.makeOneTime && Math.round(this.pos.x/32) == 6 && Math.round(this.pos.y/32)==9 ){
				var doorLayer = me.game.currentLevel.getLayerByName("door");
				var collisionLayer = me.game.currentLevel.getLayerByName("collision");
				// var testTile = door_layer.layerData[6][10];
				// testTile.clearTile(6,10);
				doorLayer.clearTile(6,10);
				collisionLayer.clearTile(6,10);
				// collisionLayer.clearTile(5,10);
				// collisionLayer.clearTile(7,10);	
				
				this.makeOneTime = false;
			}
			
			//  --- TESTING MSG ---	MAKE IT DIFFERENT IF IT COLLIDE WITH AN TILE OBJECT		
			// if (Math.round(this.pos.x/32) == 9 && Math.round(this.pos.y/32)==4 ){
				// showMessageLayer();
			// }else{
				 // hideMessageLayer();
			// }
			//  --- FINISH TESTING MSG ---
			
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
		this.items_data=items_data;
	},
	
	onCollision : function (res, obj)
	{
		var res = me.game.collide( this );
        if( res ) {
			if( res.obj.name == 'heroe' ) {
				console.log("nome item:" + this.items_data.nome);
				console.log("Descrição:" + this.items_data.descricao);
				console.log("Valor:" + this.items_data.valor);
				// add a little score
				// me.game.HUD.updateItemValue("live", this.updateScore);
				
				me.game.HUD.updateItemValue(this.items_data.categoria, parseInt(this.items_data.valor));
				updateScore = 0;
				me.game.remove(this);
				}
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
		
		// parse all the collision layer tiles 
		for ( var x = 0; x <collision_layer.width + 1; x++) 
		{ 
		   for ( var y = 0; y < collision_layer.height + 1; y++) 
		   { 
				var testTile = collision_layer.layerData[x][y];   
				
				// If tile of layer collision is null then we can put an item
				if (testTile == null){
					// Item probability
					var item_probability = Number.prototype.random(0, 10);
					// Total of items
					total_items = ads_items_data.length - 1;
					random_item = Number.prototype.random(0, total_items);			
					if (item_probability==5){
						item[count] = new ItemEntity(parseInt(32*x), parseInt(32*y), 
								{image: ads_items_data[random_item].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 32}, ads_items_data[random_item]);
						count++;
						// console.log("Populate Map... X:" + parseInt(32*x) +
									// "   Y:" + parseInt(32*y) + 
									// "   Count:" + count + "    Item: " + random_item);
					}
				
				}
		   } 
		} 

		// Adicionar items na camada 2
		$.each(item, function(i, item){
			me.game.add(item,2);
			me.game.sort();
		});		
	}
});