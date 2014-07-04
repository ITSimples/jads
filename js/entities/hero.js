/*This software is released under MIT License. Texts for  license are listed below:

 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (c) 2012-2013, ITSimples Games

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// *************************
// ****  Entidade Heroi *****
// **** Hero entity *********
// *************************
var HeroEntity = me.ObjectEntity.extend({
    //Construtor: test
    init:   function (x , y , settings){ 
        //Definir propriedades do objecto heroi na classe em vez de no mapa:
        settings.image="h_male01"; 
        settings.spritewidth=32;

        // Chamar o contrutor
        this.parent(x, y , settings);
        
        // console.log("TESTING BRANCH...");
        
        //Debug Position
        
        this.pos.x = this.posBeforeCollideX = startHero[0] * _Globals.map.tileSize;
        this.pos.y = this.posBeforeCollideY = startHero[1] * _Globals.map.tileSize;
        
        // This move
        this.movemouse = false;
        
        this.distancetotargetx = 0;
        this.distancetotargety = 0;
        this.xydivision = 0;
        
        // Configurar velocidade do jogador
        this.setVelocity(heroVelocity, heroVelocity);
        
        // Configurar velocidade de travagem
        // Valores maiores tempo de travagem menor
        this.setFriction(0.5, 0.5);
        
        // adjust the bounding box
        this.updateColRect(4,24,20,23);
        
        // this.updateColRect(-1,0,20,27);
        
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
        
        // Define point of click on mouse :
        this.dest_point_X = 0;
        this.dest_point_Y = 0;
        
        // Viewport follow hero
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        //TESTING.... 
        this.makeOneTime = true;
        
        //Check if is showing the inventory enable/disable
        this.isShowInv = false;

        //Check if is showing the inventory enable/disable
        this.isShowHelp = false;
                
        // DEBUG GET KEY TO HERO 
        // adsGame.Inventory.addItem(  ads_items_data[14] );
        
        // Set hero object type
        this.type = 'HERO_OBJECT';
        
        // Set to true if hero carries a weapon
        this.heroCarryWeapon = false;
        
        // Change Inventory and question layer position
        this.layerPosition = "right";
        
        // Keep this last direction to change only when hero change is direction
        this.lastDirection = this.direction;
        
    },
    
    //Create weapon player position.
    createWeapon : function ( weapon )
    {
        // console.log("Weapon:", weapon);
        
        // Set global name of weapon
        heroWeaponName = weapon.valor;
        
        // Create Thrower with the weapon to hero
        var throwerData = throwersData["thr" + weapon.valor];
        
        this.heroWeapon = new throwersEntity( this.pos.x , this.pos.y , throwerData);
        
        
        me.game.add( this.heroWeapon , 9 );
        me.game.sort.defer();
        
       // console.log("this.heroWeapon z: ", this.heroWeapon.z);
        
        // Hero was a weapon now
        this.heroCarryWeapon = true;
        
        // Global hero don't have weapon anymore'
        heroWeaponEnable = false;
    },
    
    //Create weapon player position.
    removeWeapon : function removeWeapon( weaponName )
    {
        // Remove hero wepon
        me.game.remove(this.heroWeapon);
        
        // Remove weapon item from inventory
        adsGame.Inventory.removeItem( weaponName );
                
        // Hero wasn't a weapon now
        this.heroCarryWeapon = false;
        
        // Remove hero weapon slot
        heroWeaponSlot = -1;
        
        // Remove hero weapon name
        heroWeaponName = "";
        
        this.walkSound = false;
    },
    
    //Update player position.
    update : function ()
    {
        // DEBUG MODE remove
        if (DEBUG_MODE && this.makeOneTime && giveItemDebug !== undefined ){
            ads_items_data[giveItemDebug].specialItem = true;
            // Add item to hero
            adsGame.Inventory.addItem(ads_items_data[giveItemDebug]);
            
            this.makeOneTime = false;
        }
        
        // console.log("Hero Position X:" , this.pos.x , "Y: " , this.pos.y);
        
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
        
        // Debug mode speed up player
        if (me.input.isKeyPressed('ctrl')){
            if (me.input.isKeyPressed('speedup')){          
                heroVelocity = heroVelocity + 1;
                this.setVelocity(heroVelocity, heroVelocity);
                me.game.HUD.updateItemValue('velocidade' , parseInt(1, 10));
            }else if (me.input.isKeyPressed('speeddown')){
                heroVelocity = heroVelocity - 1;
                this.setVelocity(heroVelocity, heroVelocity);
                me.game.HUD.updateItemValue('velocidade' , parseInt(-1, 10));
            }
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
        
        // If keypressed H then open Help window
        if (me.input.isKeyPressed('helpWindow'))
        {  
            //If finished window is opened then don't show help
            if ( !adsGame.lvlFinishedWindow.isShowing() ) {         
                if (this.isShowHelp){
                    adsGame.helpwindow.hide();
                    // me.state.resume();
                    // Disable showing
                    this.isShowHelp = false;
                }else{
                    adsGame.helpwindow.show();
                    me.state.pause();
                    me.event.subscribe(me.event.KEYDOWN, function watch_key(action) {
                        if (action == "helpWindow") {
                            me.state.resume();
                        }
                    });
                    // Enable showing
                    this.isShowHelp = true;
                }
            }           
        }       
        
        //Change inventory and question layer position
        // if ( this.pos.x < 1300){
            // console.log("Inventory on the right and question on the left.");
            // $('#inventoryLayer').css({
                // "top": "33px" , 
                // "right": "0px"
            // });   
//             
            // this.layerPosition = "right";
        // }else{
            // console.log("Inventory on the left and question on the right.");
           // $('#inventoryLayer').fadeOut( 1000 , function(){
                 // $('#inventoryLayer').css({
                // "top": "33px" , 
                // "right": "620px"
                // });   
                // $('#inventoryLayer').fadeIn( 1000 );
           // } );
// 
            // this.layerPosition = "left";
        // }
    
        // If player Stop set stand animationa
        if (this.vel.y === 0 && this.vel.x === 0)
        {
            this.renderable.setCurrentAnimation('stand-' + this.direction);
        }else{
            // play a "herowalk" sound
            if ( !this.walkSound ){
                this.walkSound = true;
                me.audio.play("herowalk",false, (function(){
                    this.walkSound = false;
                }).bind(this) , 0.2);
            }

        }

        // If question box is showing then stop the player
        if (showingQuestion){
            this.renderable.setCurrentAnimation('stand-' + this.direction);
            this.vel.x = 0;
            this.vel.y = 0;
        }
        
        // If hero carry a weapon ?
        if (this.heroCarryWeapon){
           // But this values on Json to work with any NPC that attack
           switch (this.direction){
                  case "left":
                                addToPosX = this.heroWeapon.throwerData.posicaoAtirador.left[0];
                                addToPosY = this.heroWeapon.throwerData.posicaoAtirador.left[1];
                               // Flip weapon
                               this.heroWeapon.flipX(true);
                               break;
                  case "right":
                                addToPosX = this.heroWeapon.throwerData.posicaoAtirador.right[0];
                                addToPosY = this.heroWeapon.throwerData.posicaoAtirador.right[1];
                               this.heroWeapon.flipX(false);
                               break;
                  case "up":
                                addToPosX = this.heroWeapon.throwerData.posicaoAtirador.up[0];
                                addToPosY = this.heroWeapon.throwerData.posicaoAtirador.up[1];
                               this.heroWeapon.flipX(false);
                               break;
                  case "down":
                                addToPosX = this.heroWeapon.throwerData.posicaoAtirador.down[0];
                                addToPosY = this.heroWeapon.throwerData.posicaoAtirador.down[1];
                               this.heroWeapon.flipX(false);
                               // TODO Must refresh the animation 
                               break;                                
                                        
           }
           this.heroWeapon.pos.x = (this.pos.x + addToPosX);
           this.heroWeapon.pos.y = (this.pos.y + addToPosY);
           
            // Make only when change direction to improve velocity
            if ( this.direction !== this.lastDirection ) {
                 // Change Z index when NPC UP
                 
                 if ( this.direction !== "down" && this.direction !== "left"){ 
                    this.heroWeapon.z = this.z - 1;
                }else{
                    this.heroWeapon.z = this.z + 1;
                }

                me.game.sort();
                
                // Keep this last direction to change only when hero change is direction
                this.lastDirection = this.direction;
            }
        }

        // update collision
        var res = me.game.collide(this , true);
        var self =this;
        
        // Keep hero position before collide
        if( res.length == 0 ){
                    // Save the last hero coordinates before collide with something
                    self.posBeforeCollideX = self.pos.x;
                    self.posBeforeCollideY = self.pos.y;
            }

        
        
        // If hero collide with more then one item at same time
        var countCollideItems = 0;
        
        $.each(res,(function(i,data){
            if ( data.obj.type == "ITEM_OBJECT" ){
                countCollideItems++;
            }
        }).bind(this));

        //  --- TESTING which OBJECT --- multiple collisions
        $.each(res, function(i,data)
        {
            if (data){
                
                    // If more then one item is collide then do nothing hero must collide with only one item
                    if (data.obj.type == 'ITEM_OBJECT' && countCollideItems < 2) {
                        // console.log('Hero Collide with Item...' , res.obj.items_data);
                        // this.setCurrentAnimation('stand-' + this.direction);
                        // this.pos.x = this.posBeforeCollideX;
                        // this.pos.y = this.posBeforeCollideY;
                        
                        // console.log ("****First Time:" , adsGame.Inventory.itemExists( data.obj.items_data ));
                        
                        if ( (!fullInventory && adsGame.Inventory.itemExists( data.obj.items_data ) != -2 ) || (fullInventory &&
                             (adsGame.Inventory.itemExists( data.obj.items_data ) != -1 &&  adsGame.Inventory.itemExists( data.obj.items_data ) != -2) )
                           || data.obj.items_data.specialItem || data.obj.items_data.categoria == 'ouro' || data.obj.items_data.categoria == 'conhecimento' ){
                            self.vel.x = 0;
                            self.vel.y = 0;
                            data.obj.getItem();
                        }else{
                            adsGame.Inventory.show();
                        }
                    }
                    
                    if (data.obj.type == 'NPC_OBJECT') {
                         // NPC collide with hero - Don't change NPC direction otherwise NPC and hero stand back to back
                         // If NPC collide with hero and have opposite directions then NPC don't change his direction
                         if ( data.obj.heroChangeDirection )
                            data.obj.changeNPCDirection = false;
                    }
            }
        });
        
        // If hero died
        // console.log( "me.game.HUDgetItemValue(vida)" , me.game.HUD.getItemValue("vida"));
        if ( me.game.HUD.getItemValue(_Globals.hud.name.live) <= 0 ){
            // console.log("Player is dead");
            // Pause the game
            me.state.pause();
            // Show window game over
            adsGame.heroDies.show()
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

    }, // End update method
    
    onDestroyEvent : function(){
        // console.log("Hero was destroyed...");
        // When hero was destroyed
        //Reset hero global variables
        setInitialHeroVariables();
    }
});
// *****************************
// ****  Fim Entidade Heroi ****
// *****************************