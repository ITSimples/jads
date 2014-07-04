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


// **************************************
// ****  TRIGGER INVISIBLE ENTITY  ****
// **************************************
//me.InvisibleEntity has been removed, as following previous changes,
//this can now be achieved using a me.ObjectEntity without a renderable component.
var TriggerEntity = me.ObjectEntity.extend({
    
    //Constructor
    init: function( x , y , settings , triggerData){
        
        this.parent(x, y , settings );
        
        this.collidable = true;
        
        this.triggerData = triggerData;
        
        // prepare data to message box
        this.msgData = {};
        this.msgData.msgImage = 'sprites/items/' + triggerData.imageName;
        this.msgData.msgName = language.system.TRmessage;
        this.msgData.msg = language.triggers[triggerData.message];      
        this.type = triggerData.type;

        this.targX = triggerData.target.x;
        this.targY = triggerData.target.y;

        this.solution = this.triggerData.solution;      
        
        //add remove option
        this.remove = this.triggerData.remove;
        //check first time pull the trigger
        this.oneTime = false;

        //check one time for collision to trigger when leave trigger variable reseted
        this.oneTimeCollide = false;
        
        // Check if requirements are satisfied to pull the trigger default is true
        this.pullTrigger = true;
        
        //Get data from trigger new NPC
        if(this.type == "NEW_NPC"){
            //Get data that only exists on NEW_NPC trigger
            this.npcName = triggerData.npcName;
            
            //Get effect to rise the new NPC
            this.appearEffect = adsNpcData[ this.npcName].appearEffect;
        }   
        
        this.checkSolution = false;
        this.isChecked = false;

        // Create message box for object
        this.message = new adsGame.Message();
        
        //Update always
        this.alwaysUpdate = false;
        
        //  Show message and play sound only one timw when hero does'nt have the door key
        this.oneTimeSoundMessage = false;
        
        // Check requirement if exists only one time
        this.checkRequirementOne = false;
    },

    update : function (){
        // Check collisions
        var res = me.game.collide( this );
        if( res ) {
            if( res.obj.name == 'hero' ) {
                
                // Verify if hero have the item only one time
                if (!this.isChecked)
                {
                    //Create variable to work for each ?!?!?!?!?
                    var solution = this.solution;
                    var checkSolution = false;
                    // Get index where hero have the key to remove that from the inventory
                    var itemIndex = null;
                    
                    //Make it check one time only - Problem var checkSolution = false; have to go inside if doorobject
                    //check if hero have the Solution           
                    $.each(heroItems, function(i,data)
                    {
                        //Check if array is undefined to avoid error (may have empty slots)
                        if (typeof data !== 'undefined'){
                            if (data.valor == solution){
                                // console.log('Hero have the key.', i);
                                checkSolution = true;
                                itemIndex = i;
                            }
                        }
                    });
                    
                    this.checkSolution = checkSolution;
                    this.isChecked = true;
                    
                    // console.log('Test times...' + this.checkSolution);
                    // console.log('Remove the item number : ' + itemIndex);
                    
                    // If hero have the solution and if the solution is not a subcategoria weapon
                    // Remove item from inventory - Index + 1 Slot number                   
                    if (itemIndex !== null && heroItems[itemIndex].subcategoria !== "weapon"){
                       adsGame.Inventory.removeItem( 'Slot0' + (itemIndex + 1) );
                    }
                }
                
                // If trigger is a chest object
                if (this.type == 'CHEST_OBJECT'){
                    
                    var self = this;
                    
                    if (this.checkSolution){
                        // Remove old chest to empty chest
                        var lowerObjects = me.game.currentLevel.getLayerByName("lower objects");
                        
                        //Give tile number create a classe with good methods to the game
                        // console.log("Tile number:" , lowerObjects.getTileId(this.targX * 32, (this.targY + 3) * 32));
                        
                        //Remove chest
                        lowerObjects.clearTile(this.targX , this.targY);
                        lowerObjects.clearTile(this.targX , this.targY + 1 );
                        
                        //New upper door exploded
                        lowerObjects.setTile(this.targX , this.targY , 293);
                        lowerObjects.setTile(this.targX , this.targY + 1 , 294);
                        
                        //Next Give Item
                        // Show inventory window if is not open
                        if (!adsGame.Inventory.isShowing){
                            adsGame.Inventory.show();
                        }
                        
                        // If is a mission item then set as special item to go the rigth slot (Map items)
                        if (ads_items_data[this.triggerData.give].categoria == 'itemMissao'){
                            ads_items_data[this.triggerData.give].specialItem = true;
                        }
                        
                        if ( this.triggerData.nomeSom !== undefined && this.triggerData.volumeEfeito !== undefined){
                            // play a "throwerSound" sound
                            me.audio.play( this.triggerData.nomeSom , false , null , this.triggerData.volumeEfeito );
                        }
                        
                        // Add item to hero
                        adsGame.Inventory.addItem( ads_items_data[this.triggerData.give] );
                        
                        //The hero open chest show a message to hero
                        if (!npcTalking){
                            this.msgData.msg = language.triggers[this.triggerData.messageOpen];
                            this.message.show(this.msgData , 10000);
                            
                            // msgShowing = true;
                            // var tween = new me.Tween( { x: 0} )
                            // .to( { x: 1 }, 10000 ).onComplete(function(){ 
                                // self.message.hide();
//                                 
                            // }).start();
                            // console.log("How many times...");
                            
                            // Remove Trigger
                            me.game.remove(this);
                        }
                        
                        this.checkSolution = false;
                       
                    }else{
                        //The hero hasn't  the item to open chest show a message to hero
                        if (!npcTalking){
                            this.message.show(this.msgData);
                            // msgShowing = true;
                        }
                    }   
                } // End chest object
                
                // If trigger is a door object
                if (this.type == 'DOOR_OBJECT'){
                    // Check solution only if requirement does't exist or is satisfied
                    if ( typeof this.triggerData.requirement !== "undefined" ){
                        // prepare data to message box
                        var msgDataReq = {};
                        msgDataReq.msgImage = 'sprites/information.png' ;
                        msgDataReq.msgName = language.system.TRmessage;
                        msgDataReq.msg = language.triggers[this.triggerData.requirementMsg]; 
                        
                        if (typeof this.triggerData.requirement.salvarPrisao !== "undefined" && !this.checkRequirementOne ){
                            
                            this.checkRequirementOne = true;
                            
                            var self = this;
                            // var reqSavePrisionerLenght = Object.keys( this.triggerData.requirement.salvarPrisao ).length ;
                            var addAnd ="";
                            var isFree = false;
                            var allFree = true;
                            
                            // play a "doorlockmessage" sound
                            me.audio.play("doorlockmessage");
                            
                            $.each( this.triggerData.requirement.salvarPrisao, function( i , data ) {
                                // TODO - Must check if hero save the prisoners before                              
                                isFree = adsGame.prisonDoors.getPrisonDoorState( adsNpcData[data].prisao.numero );
                                
                                // Not free
                                if ( !isFree ) { 
                                    // One prisoner is not free opss
                                    allFree = false;
                                }
                            });
                            
                            // If not all prisoners are free than show message
                            if ( !allFree ){
                                if (!npcTalking){
                                    this.message.show(msgDataReq);
                                    // msgShowing = true;
                                }
                            }
                            
                            // If all prisioner not free then don't pull the trigger otherwise pull the trigger
                            this.pullTrigger = allFree;
                        }
                    }
                    
                    if (this.pullTrigger){
                        if (this.checkSolution){
                            // // Open the door
                            // this.doorLayer.clearTile(this.targX,this.targY);
                            // this.collisionLayer.clearTile(this.targX,this.targY);
    
                            // //Remove this object
                            // me.game.remove(this);
                            
                            var doorCoord = new Array();
                            doorCoord[0] = this.targX;
                            doorCoord[1] = this.targY;
                            
                            // play a "opendoor" sound
                            me.audio.play("opendoor");
                          
                            adsGame.prisonDoors.remove(doorCoord , "openDoor", this.triggerData.animation);
                            
                            //portaPrisao -- Set door open to the prison number
                            // adsGame.prisonDoors.prisonBreak[this.triggerData.portaPrisao] = true;
                            adsGame.prisonDoors.openPrisonDoor( this.triggerData.portaPrisao );
                            
                            // console.log("prisonBreak Hero: " , adsGame.prisonDoors.getPrisonDoorState( this.triggerData.portaPrisao ) );

                            // Remove Trigger
                            me.game.remove(this);
                            
                            // **** TODO - REMOVE KEY  FROM LIST OF ITEMS
                        }else{
                            // console.log("Hero don't have the key. npcTalking:" , npcTalking);
                            if ( !this.oneTimeSoundMessage ){
                                // play a "doorlockmessage" sound
                                me.audio.play("doorlockmessage");
                                if (!npcTalking){
                                    this.message.show(this.msgData);
                                    // msgShowing = true;
                                }
                                this.oneTimeSoundMessage = true;
                            }
                        } // End checkSolution
                        
                        // Set if NPC prisoner talk to hero to avoid to talk again on npc.js
                        adsGame.prisonDoors.prisonDoorTrigger[this.triggerData.portaPrisao] = true;
                        
                    } // End pullTrigger check  
    
                } // End door object
                
                // If trigger is a portal object
                if (this.type == 'PORTAL_OBJECT'){
                    if (this.checkSolution){
                        //***** TEST TELEPORT AND FADE MAP
                        var player = me.game.getEntityByName('Hero');
//                      
                        // player[0].pos.x = this.targX * _Globals.map.tileSize;
                        // player[0].pos.y = this.targY * _Globals.map.tileSize;
                        
                        // play a "teleport" sound
                        me.audio.play("teleport");
        
                        adsGame.heroEntity().pos.x = this.targX * _Globals.map.tileSize;
                        adsGame.heroEntity().pos.y = this.targY * _Globals.map.tileSize;
                        

                        //TODO - Fade out /in viewport 
                        me.game.viewport.fadeOut('#000000',1000, function() {
                            // End level one
                            // console.log("this.solution:", this.solution);
                            if ( this.solution == "chave3cristais"){
                                // console.log("Level one finished.");
                                adsGame.heroEntity().renderable.setCurrentAnimation('down');
                                // me.state.pause();
                                adsGame.Inventory.hide();
                                adsGame.lvlFinishedWindow.show();
                              // window.location = "https://docs.google.com/forms/d/17GBoEcrjcjzQ-kKA3o3RG961sBBLRuX4bmu6v1eGPQ8/viewform";
                            }
                        }.bind(this));
                        
                        // **** TODO - REMOVE SCROOLL OF PORTAL FROM LIST OF ITEMS
                    }else{
                        // console.log("Hero don't have the key.");
                        this.message.show(this.msgData);
                        // msgShowing = true;
                    }
                } // End portal object              
                
                // If trigger is a npc object object
                if (this.type == 'NEW_NPC'){                        
                        this.message.show(this.msgData, 5000);
                        // msgShowing = true;
                        
                        //Create the new NPC only one time
                        if ( !this.oneTime ){                
                            // Shake map
                            me.game.viewport.shake (20 , 1500);
                            
                            if ( this.triggerData.nomeSom !== undefined && this.triggerData.volumeEfeito !== undefined){
                                // play a "triggerData" sound
                                me.audio.play( this.triggerData.nomeSom , false , null , this.triggerData.volumeEfeito );
                            }
                            
                            //Rises effect goes here if exist
                            var risesNPC = new effect(
                                    (this.appearEffect.coordinates.x * _Globals.map.tileSize) , 
                                    (this.appearEffect.coordinates.y * _Globals.map.tileSize) , // Coordinates
                                    me.loader.getImage(this.appearEffect.name),  // Image
                                    this.appearEffect.size.width,this.appearEffect.size.height, // Size
                                    this.appearEffect.animationSheet, //Animation sheet
                                    this.appearEffect.speed, // Speed between 0 - Slowest and 60 - fastest
                                    this.appearEffect.repeat, // Repeat
                                    this.appearEffect.waitBetween // Wait between
                                    );
                            me.game.add(risesNPC, 8);
                            me.game.sort();
                                                        
                            //Create new NPC
                            adsGame.Npc.create(adsNpcData[this.npcName]);
                            
                            //Remove Trigger
                            me.game.remove(this);
                        }
                }

                // Quest questions object
                if (this.type == 'QUESTIONS_OBJECT' && !this.oneTimeCollide){

                    var questionQuest = new adsGame.QuestionQuest( this.triggerData.nomeNPC , this );
                    
                    questionQuest.play();
                    
                   questionQuest = undefined;
                   
                    // Remove this object 
                    // me.game.remove(this);
                } // End Quest questions object
                
                //If hero pull the trigger set onetime to true - pull one time atfer test triggers type
                this.oneTime = true;    
            }
        }else{
             
            // if (!msgShowing)
            // {
            this.message.hide();    
            // }
            
            // if (!npcTalking)
            // {
                    // msgShowing = false;
            // }
            
            // Play sound only one time
            this.oneTimeSoundMessage = false;
            
            // Check Trigger requirement only one time
            this.checkRequirementOne = false;
            
            // Reset check for items
            this.isChecked = false;
            
            //Remove item from game if remove = true:
            if (this.remove && this.oneTime){
                  // Remove this object 
                  me.game.remove(this);
                  
                  // console.log("Trigger Removed.....");
            }
        }

        // TODO - Use that variable for check only one time in others triggers
        // check only one collision with hero to activate the question quest
        if (this.type == 'QUESTIONS_OBJECT'){
            if ( res && res.obj.name == 'hero' ){
                this.oneTimeCollide = true;
            } else{ // If not collide with hero
                //If hero leave trigger reset onetime to false
                this.oneTimeCollide = false;
            }
        }
        
    }, // End Update
    
    onDestroyEvent : function(){
        console.log("TriggerEntity was destroyed...");
        // Hide messages when TriggerEntity was destroyed
        // this.message.hide();
    }
    
});

// **************************************
// ****  INVISIBLE ENTITY SPAWN ****
// **************************************
//me.InvisibleEntity has been removed, as following previous changes,
//this can now be achieved using a me.ObjectEntity without a renderable component.
var TriggerSpawnEntity = me.ObjectEntity.extend({
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
            trigger = new TriggerEntity( triggerData.coordinates.x * _Globals.map.tileSize , triggerData.coordinates.y * _Globals.map.tileSize
                                        , triggerData.settings , triggerData);
            me.game.add(trigger,4);
            me.game.sort();
        }); 
        
        // // Door = new DoorEntity( 6*32 , 9*32, {image: "doorcheck", spritewidth: 32, spriteheight: 32});
        // heroDoorCell = new TriggerEntity( 6*32 , 9*32, settings , triggersData[0]);
        // me.game.add(heroDoorCell,3);
        // me.game.sort();
    }
});
// **************************************
// ****  END INVISIBLE ENTITY SPAWN ****
// **************************************