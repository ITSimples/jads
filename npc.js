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

		console.log("npcData:" + this.npcData.nome);
		
		this.collidable= true;
		
		this.gravity = 0;
		
		this.friction = 0;
		
		this.setVelocity(0);
		
		//Configurar animações
		this.addAnimation("stand-down", [4]);

 
        // make him start from the right
        this.pos.x = x;
		this.pos.y = y;
        
		// make it an action object
        // this.type = me.game.ACTION_OBJECT;
		
		this.type = 'NPC_OBJECT';
		
		// Enable/disable dialogue box
		this.showMessage = false;

	},
	
	//Update player position.
	update : function ()
	{	 
		this.vel.y = 0;
		this.vel.x = 0;
		
		this.setCurrentAnimation('stand-down');
		
		// Check collision
		// ***************** IMPROVE COLLISION TO COLIDE AND GO BACK *********************
		var res = me.game.collide( this );
        if( res ) {
			if( res.obj.name == 'heroe' ) {
				showMessageLayer(this.npcData);
				this.showMessage = true;
			}
		}else if (this.showMessage){
				hideMessageLayer();
				this.showMessage = false;
			}
		
		// check and update movement - Update a nimation
		this.updateMovement();
		this.parent(this);
		
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
		
		npc = new NpcEntity(80, 200 , 
								{image: adsNpcData[0].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[0]);

		me.game.add(npc,2);
		me.game.sort();
		
		npc = new NpcEntity(180, 300 , 
								{image: adsNpcData[1].imagem.replace(".png",""),
								spritewidth: 32, spriteheight: 43}, adsNpcData[1]);

		me.game.add(npc,2);
		me.game.sort();
		console.log("adsNpcData[0].imagem.replace:" + adsNpcData[0].imagem.replace(".png",""));
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