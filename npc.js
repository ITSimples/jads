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
    init : function(x, y, settings, npcData) {

        // Chamar o contrutor
        this.parent(x, y, settings);

        // NPC data from json file
        this.npcData = npcData;

        // Data to message box
        this.msgData = {};
        this.msgData.msgImage = 'sprites/' + this.npcData.imagem.replace(".png", "_face.png");
        this.msgData.msgName = this.npcData.nome;
        this.msgData.msg = this.npcData.mensagem[2];

        this.collidable = true;

        this.gravity = 0;

        this.friction = 0;

        //Diferrence between npc height and tilesize to avoid collision with wall
        this.avoidWall = (this.npcData.tamanhoImagem.altura - ads_tile_size) + 1;

        console.log("this.avoidWall:", this.avoidWall);

        // Config NPC acceleration
        this.accel.x = this.accel.y = this.npcData.velocidade;

        //Set animation speed
        this.animationspeed = me.sys.fps / (me.sys.fps / 3);

        if (typeof this.npcData.areaColisao !== "undefined"){
             var xOffset = this.npcData.areaColisao.x ;   // x offset (-1 don't change the with)
             var widthHitBox = this.npcData.areaColisao.w ; // width of the hit box
             var yOffset = this.npcData.areaColisao.y ;  // y offset (-1 don't change the height)
             var heightHitBox = this.npcData.areaColisao.h ; // height of the hit box
             
             // adjust the bounding box
            this.updateColRect(xOffset,widthHitBox,yOffset,heightHitBox);
        }

        // adjust the bounding box
        // this.updateColRect(0,32,19,20);

        // make him start from the right
        this.pos.x = x;
        this.pos.y = y;

        // Set NPC object type
        this.type = 'NPC_OBJECT';

        // Enable/disable dialogue box
        this.showMessage = false;
        
        //Keep animations data
        this.animation = {};
        
        //Standard animations or animation defined on json npc data
        if ( this.npcData.animacoes  === undefined ){
            // Standard animation for all NPC's
            this.animation = {"stand-down" :   [4],
                                "stand-left"     :   [8],
                                "stand-up"      :   [1],
                                "stand-right"   :   [11],
                                "down"            :   [3, 4, 5, 4],
                                "left"               :   [6, 7, 8],
                                "up"                :   [0, 1, 2, 1],
                                "right"             :   [9, 10, 11]
                               };           
         }else{
             // Animation defined on json
             this.animation = this.npcData.animacoes;
         }
         
        // To use in each loop 
        var self = this;
        
        //If there is a first animation for prisoner when is not free and it's stoped first time
        if ( this.npcData.animacoes !== undefined && this.npcData.animacoes.primeiraAnimacao !== undefined ){
            this.firstAnimation = true;
        }else{
            this.firstAnimation =false;
        }
        
        console.log('NPC Name:', this.npcData.nome , '- this.firstAnimation:' , this.firstAnimation );
        
       // Add all animation for NPC
       var countAnimation = 0;
       $.each ( this.animation, function (i, npcAnimation ){
            // console.log('npcAnimation:', i , '-' , npcAnimation );
            self.addAnimation( i , npcAnimation );
            countAnimation++;
       });
       
       console.log("NPC:" , this.npcData.nome , "  this.firstAnimation:" , this.firstAnimation);

        //Configurar animações
        // this.addAnimation("stand-down", [4]);
        // this.addAnimation("stand-left", [8]);
        // this.addAnimation("stand-up", [1]);
        // this.addAnimation("stand-right", [11]);
        // this.addAnimation("down", [3, 4, 5, 4]);
        // this.addAnimation("left", [6, 7, 8]);
        // this.addAnimation("up", [0, 1, 2, 1]);
        // this.addAnimation("right", [9, 10, 11]);
        
        // Make animation to die
        // Json "morre" : {"animacao" : [12] },
        // if (this.npcData.categoria == "enemies") {
            // this.addAnimation("die", this.npcData.morre.animacao);
        // }

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
        
        //Get the path from Astar algotithm from pathfinder.js
        this.heroFollowPath = [[]];

        //Get reverse path from Astar algotithm from pathfinder.js
        // this.reversePath = [[]];
        this.reversePathNumber = -1;

        // Save path when reverse is used
        this.cachepath = [[]];

        //Number of points in the path
        this.countPath = 0;

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
        
        //Testing if NPC should change is direction when collide with hero
        this.changeNPCDirection = true; 
        // To test if is hero that collide with npc or the opposite
        this.heroChangeDirection = false;
        
        // Save initial Z index for this object
        this.initialZIndex = this.z;
        
        // Set variable to see if NPC is collide with NPC
        this.collideHero = false;

        this.npcEvents = this.npcData.evento;

        this.npcEscapeEvents = this.npcData.eventoFuga;

        //Check NPC movement
        if (this.npcData.tipoMovimento == "path") {

            // Get start and end position from gamedata.json for all paths
            for ( pathNumber = 0; pathNumber < this.npcData.coordenadas.length; pathNumber++) {
                var start = [this.npcData.coordenadas[pathNumber].initStartX, this.npcData.coordenadas[pathNumber].initStartY];
                var end = [this.npcData.coordenadas[pathNumber].initDestX, this.npcData.coordenadas[pathNumber].initDestY];

                // Calculate path
                // this.path[pathNumber] = adsGame.pathFinder.getPath(start,end,"collision");

                this.path[pathNumber] = adsGame.pathFinder.getPath(start, end);

                // Calculate reverse path if event reverse
                if (this.npcData.coordenadas[pathNumber].reverter) {
                    // this.reversePath[pathNumber] = adsGame.pathFinder.getPath(end,start,"collision");
                    this.reversePathNumber = pathNumber;
                    // console.log('Calculate reverse path...' , pathNumber);
                    // // Keep a cache of normal path...
                    // this.cachepath[this.currentPath] = this.path[this.currentPath];
                }
            }

            //*ads_tile_size to convert tile position to map coordinates
            // First destination on array path
            this.destX = this.path[0][0][0] * ads_tile_size;
            this.destY = (this.path[0][0][1] * ads_tile_size) - this.avoidWall;
        } else if (this.npcData.tipoMovimento == "circle") {

        } else {
            //*ads_tile_size to convert tile position to map coordinates
            // If NPC movement is between two points only
            this.destX = this.npcData.coordenadas[0].initDestX * ads_tile_size;
            this.destY = (this.npcData.coordenadas[0].initDestY * ads_tile_size) - this.avoidWall;
        }

        // *****************************************************
        // ** Testing dragon fire breath
        // *****************************************************
        if (this.npcData.categoria == "enemies") {
            if (this.npcData.ataca) {

                var npcThrower = this.npcData.nomeAtirador;

                this.throwerData = throwersData[npcThrower];

                this.thrower = new throwersEntity((this.pos.x + 24) * ads_tile_size, (this.pos.y + 20) * ads_tile_size, this.throwerData);
                me.game.add(this.thrower, 7);
                me.game.sort.defer();
            }

            // Initial live for NPC
            this.health = this.npcData.vida;
            
            //Create new health bar for NPC
            this.healthBar = new adsGame.HealthBar( this.pos.x , this.pos.y , this.health , this.npcData.tamanhoImagem.largura);
            
            //test
            console.log("Testing this.healthBar.maxHealth:" , this.healthBar.maxHealth);
            
           // Remove NPC time after die
            this.removeTime = 5000;
        }
    },

    removeHealth : function removeHealth(hitPoints) {

        console.log("Call method in NPC...", this.npcData.nome);
        this.health = this.health - hitPoints;
    },

    setDirection : function() {
        // Get the distance between the two points to set the direction of NPC
        this.distanceX = Math.abs(this.destX - this.pos.x);
        this.distanceY = Math.abs(this.destY - this.pos.y);

        if (this.distanceX > this.distanceY) {
            this.direction = this.destX < this.pos.x ? 'left' : 'right';
        } else {
            this.direction = this.destY < this.pos.y ? 'up' : 'down';
        }
    },
    
     updateThrower : function updateThrower( direction ) {
              // thrower position depends on NPC direction
            var addToPosX;
            var addToPosY;

            var heroAux = adsGame.heroEntity();
            angleToHero = this.angleTo(heroAux);
            // console.log("this.angleTo hero:", angleToHero * 10);

            // But this values on Json to work with any NPC that attack
             // TODO  - Make only when change direction to improve velocity
            switch ( direction ) {
                case "left":
                    addToPosX = this.npcData.posicaoAtirador.left[0];
                    addToPosY = this.npcData.posicaoAtirador.left[1];
                    break;
                case "right":
                    addToPosX = this.npcData.posicaoAtirador.right[0];
                    addToPosY = this.npcData.posicaoAtirador.right[1];
                    break;
                case "up":
                    addToPosX = this.npcData.posicaoAtirador.up[0];
                    addToPosY = this.npcData.posicaoAtirador.up[1];                   
                    break;
                case "down":
                    addToPosX = this.npcData.posicaoAtirador.down[0];
                    addToPosY = this.npcData.posicaoAtirador.down[1];                    
                    break;

            }
                       
            // TODO  - Make only when change direction to improve velocity
            if ( this.thrower.throwerData.animacoes.animaTodasPosicoes ) {
                 // Change Z index when NPC UP
                 if ( direction == "up"){ 
                     this.thrower.z = this.z - 1;
                }else{
                     this.thrower.z = this.z + 1 ;
                }
                     
                 this.thrower.setCurrentAnimation( direction.toString() );                    
            }
           
            this.thrower.pos.x = (this.pos.x + addToPosX);
            this.thrower.pos.y = (this.pos.y + addToPosY);
     },

    //Update npc position.
    update : function() {
        
        // If NPC is death but is in the map don't update movement
        if (!this.alive) {
            return;
        }
        // Update thrower position follow NPC
        if (this.npcData.ataca) {
            this.updateThrower( this.direction );
        }

        // Check collision
        // ***************** IMPROVE COLLISION TO COLIDE AND GO BACK *********************
        var res = me.game.collide(this);
        if (res) {
            if (res.obj.name == 'hero' && !this.eventHappening) {
                // TODO - Change NPC direction to opposite side of the hero
                
                // If json falaComHeroi == true then talk to hero if not skip this step
                if (this.npcData.falaComHeroi){
                    this.message.show(this.msgData);

                }               
                this.showMessage = true;
                msgShowing = true;
                //Stop npc when he talk with hero
                // Change NPC direction to opposite side of the hero if hero collide with NPC
                // If NPC collide with hero don't change that otherwise they are on his back
               var auxNPCDirection = this.direction;
                                    
                if ( this.changeNPCDirection ){
                    // Get hero direction
                    var heroAux = adsGame.heroEntity();
                    
                    // Opposite direction of hero
                    if ( heroAux.direction == "left" )
                        auxNPCDirection = "right";
                    else if (heroAux.direction == "right")
                        auxNPCDirection = "left";
                    else if ( heroAux.direction == "up" )
                        auxNPCDirection = "down";
                    else
                        auxNPCDirection = "up";
                    
                    // If NPC have a weapon change this direction and position
                    if (this.npcData.ataca){
                        // Update thrower direction and position
                        this.updateThrower( auxNPCDirection );
                    }
                    
                    // To test if is hero that collide with npc or the opposite
                    this.heroChangeDirection = false;
                }
                
                // New NPC animation stand opposite direction of the hero
                if ( !this.firstAnimation ){
                    this.setCurrentAnimation("stand-" + auxNPCDirection);
                }else{
                    this.setCurrentAnimation( "primeiraAnimacao" );
                }
                this.accel.x = this.accel.y = 0;
                this.vel.x = this.vel.y = 0;
            }
        } else if (this.showMessage && !this.talkEventHappening) {
            // If json falaComHeroi == true then talk to hero if not skip this step
            if (this.npcData.falaComHeroi){
                this.message.hide();
            }
            
            msgShowing = false;
            this.showMessage = false;
            
            //Move npc when he stop talk with hero if is not stoped yet
            if (!this.stop) {
                this.accel.x = this.accel.y = this.npcData.velocidade;
                if ( !this.firstAnimation ){
                    this.setCurrentAnimation(this.direction);
                }else{
                    this.setCurrentAnimation( "primeiraAnimacao" );
                }
                // Reset to the next collision
                this.changeNPCDirection = true;
                // To test if is hero that collide with npc or the opposite
                this.heroChangeDirection = true;
            }
        }
        
        // If NPC collide with hero set collideHero = true otherwise set false to use on sellItems event
        if ( res && res.obj.name == 'hero' ){
            this.collideHero = true;
        }else {
            this.collideHero = false;
        }

        // *** IMPROVE THIS ONE - MAKE IT DINAMIC IF IS PRISONER OR NOT
        if (this.npcData.categoria == "enemies" || this.npcData.categoria == "friends" || (this.npcData.categoria == "prisoner" && adsGame.prisonDoors.prisonDoorTrigger[this.npcData.prisao.numero])) {
            //if return true then wait else no wait time then can readwaittime again
            this.eventHappening = this.npcEvent(this.npcEvents);

            // Check if there is a wait time
            if (this.eventHappening) {
                return;
            } else {
                this.readOneTimeEvent = false;
            }
        }

        if (this.prisoner) {
            if ( adsGame.prisonDoors.getPrisonDoorState( this.npcData.prisao.numero ) ) {

                // console.log ('Says thx to hero and.. ');
                // console.log ('Calculate path to freedom... :)');
                // console.log ('Stop being a prisoner...');
                //Stop being a prisoner...
                this.prisoner = false;
                
                //Stop first animation for prisoner npc now is free
                this.firstAnimation = false;                

                //reset event number and execute escape events
                this.CurrentEventNumber = 0;
                this.npcEvents = this.npcEscapeEvents;

            }

            // console.log ('Prisoner ' , this.npcData.nome , ' is arrested at cell ' , this.npcData.prisao.numero ,
            // ' and this cell is ' , prisonBreak[this.npcData.prisao.numero] ? 'open' : 'closed' );
        }

        //If NPC movement is path
        if (this.npcData.tipoMovimento == "path") {

            // Move NPC
            if (moveObject(this) && !this.stop) {
                if (this.countPath != this.path[this.currentPath].length) {
                    //return movement
                    this.accel.x = this.accel.y = this.npcData.velocidade;
                    // if ( !this.firstAnimation ){
                        // this.setCurrentAnimation(this.direction);
                    // }else{
                        // this.setCurrentAnimation( "primeiraAnimacao" );
                    // }
                    this.destX = this.path[this.currentPath][this.countPath ][0] * ads_tile_size;
                    this.destY = (this.path[this.currentPath][this.countPath ][1] * ads_tile_size) - this.avoidWall;

                    this.countPath++;
                    this.setDirection();
                    
                    // first animation before set prisoner free
                    if ( !this.firstAnimation ){
                        this.setCurrentAnimation(this.direction);
                    }else{
                        this.setCurrentAnimation( "primeiraAnimacao" );
                    }
                } else {
                    this.countPath = 0;
                    this.currentPath++;
                    
                    // if that happen then NPC follow hero and now return to initial path
                    if ( this.currentPath == this.npcData.coordenadas.length + 2) {
                        this.currentPath = 0;
                    }
                    
                    //Test if there is reverse path
                    if (this.reversePathNumber == this.currentPath) {
                        this.currentPath = 0;
                    }
                    // Stop the player
                    if (this.currentPath == this.path.length) {
                        this.stop = true;
                        // this.setCurrentAnimation("stand-" + this.direction);
                        if ( !this.firstAnimation ){
                            this.setCurrentAnimation( "stand-down");
                        }else{
                            this.setCurrentAnimation( "primeiraAnimacao" );
                        }
                    }
                }

            }
            
            var player = adsGame.heroEntity();
            
            if ( typeof (this.npcData.atacaDistancia ) !== "undefined" && this.npcData.atacaDistancia >  this.distanceTo(player) ){
                console.log(" follow - Distance to attack: " , this.distanceTo(player));
                this.countPath = 0;
                this.npcData.tipoMovimento = "npcFollowHero";
            }
        } else if (this.npcData.tipoMovimento == "followhero") {
            
            if ( !this.stop ){
                this.velocityFollow = this.npcData.velocidade;                
            }
            else{
                this.velocityFollow = 0;
                return;
            }

            followHero(this);

            var player = adsGame.heroEntity();

            var playerPosX = player.pos.x;
            var playerPosY = player.pos.y;

            this.distanceX = Math.abs(playerPosX - this.pos.x);
            this.distanceY = Math.abs(playerPosY - this.pos.y);

            // console.log("Distance x:" , this.distanceX, " Distance y:", this.distanceY);

            // console.log("Distance x:" , this.distanceX, " Distance y:", this.distanceY);

            if (this.distanceX > this.distanceY) {
                this.direction = playerPosX < this.pos.x ? 'left' : 'right';
            } else {
                this.direction = playerPosY < this.pos.y ? 'up' : 'down';
            }

            // Stop the player
            if (this.npcData.paraDistancia > this.distanceTo(player)) {
                this.setCurrentAnimation("stand-" + this.direction);
                this.accel.x = this.accel.y = 0;
                this.vel.x = this.vel.y = 0;

            } else {// if distance between player bigger than defined on json
                // check and update movement - Update animation
                this.setCurrentAnimation(this.direction);
                this.accel.x = this.accel.y = this.npcData.velocidade;
            }
        } else if (this.npcData.tipoMovimento == "npcFollowHero") {
            
            var player = adsGame.heroEntity();            
            
            if (this.countPath == 0){
                
                var initStartX = Math.round( this.pos.x / ads_tile_size);
                var initStartY = Math.round( ( this.pos.y ) / ads_tile_size);
                
                var initDestX = Math.round( player.pos.x / ads_tile_size);
                var initDestY = Math.round( ( player.pos.y + this.avoidWall ) / ads_tile_size);
                
                var start = [initStartX, initStartY];
                var end = [initDestX, initDestY];

                this.heroFollowPath = adsGame.pathFinder.getPath(start, end);
            
                this.destX = this.heroFollowPath[0][0] * ads_tile_size;
                this.destY = this.heroFollowPath[0][1] * ads_tile_size - this.avoidWall;
            }
            
            // Move NPC
            
            if (moveObject(this) && !this.stop) {
                if (this.countPath != this.heroFollowPath.length) {
                    //return movement
                    this.accel.x = this.accel.y = this.npcData.velocidade;
                    this.setCurrentAnimation(this.direction);

                    this.destX = this.heroFollowPath[this.countPath ][0] * ads_tile_size;
                    this.destY = (this.heroFollowPath[this.countPath ][1] * ads_tile_size) - this.avoidWall;

                    this.countPath++;
                    this.setDirection();
                    this.setCurrentAnimation(this.direction);
                } else {
                    this.countPath = 0;
                    // console.log("... Calculate new path follow hero---");
                    this.setCurrentAnimation("stand-" + this.direction);
                    // this.setCurrentAnimation( "stand-down" );
                }

            }

            // - this.distanceTo(player) - this.npcData.tamanhoImagem.altura NPC height 
            if ( typeof (this.npcData.atacaDistancia ) !== "undefined" && this.npcData.atacaDistancia < ( this.distanceTo(player) - this.npcData.tamanhoImagem.altura ) ){
                console.log(" Not follow - Distance to attack: " , this.distanceTo(player));
                this.countPath = 0;
                this.currentPath = this.npcData.coordenadas.length + 1;
                this.npcData.tipoMovimento = "path";
                
                var startX = Math.round( this.pos.x / ads_tile_size);
                var startY = Math.round( ( this.pos.y ) / ads_tile_size);
                

                var destX = this.npcData.coordenadas[0].initStartX;
                var destY = this.npcData.coordenadas[0].initStartY;
                
                var start = [startX, startY];
                var end = [ destX , destY ];
                
                this.path[this.currentPath] = adsGame.pathFinder.getPath(start, end);
                
                console.log("pathlength:", this.path.length);
                
                this.destX = this.path[this.currentPath][0][0] * ads_tile_size;
                this.destY = (this.path[this.currentPath][0][1] * ads_tile_size) - this.avoidWall;
            }
        }
        
        // check & update NPC movement
        updated = this.updateMovement();
       

        // update animation
        if (updated)
        {
            // Actualizar animação
            this.parent(this);
        }

        return updated;

    }, // end update

    // *** npcTalkEvent Managment
    npcTalkEvent : function npcTalkEvent() {
        // read event wait time
        if (!this.readOneTimeEvent) {
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

        // console.log('this.currentEvent.conversa:' , this.currentEvent.conversa , 'this.messageNumber:' , this.messageNumber );

        // this.msgData.msg = this.npcData.mensagem[0];
        // $('.msgText,#hiddenText').html( this.msgData.msg );

        // Change dialogue depending on the number of messages divided by the waiting time
        if (this.waitEvent == ((this.currentEvent.tempo * 60) - (this.pauseMessage * this.messageNumber + 1)) && this.messageNumber < this.npcData.mensagem.length) {
            this.msgData.msg = this.npcData.mensagem[this.currentEvent.conversa[this.messageNumber]];
            // $('.msgText').hide();
            $('.msgText,#hiddenText').html(this.msgData.msg);
            // $('.msgText').fadeIn(1000);
            this.messageNumber++;
        }

        this.message.show(this.msgData);
        this.showMessage = true;
        msgShowing = true;

        if (--this.waitEvent < 0) {
            // Hide message
            this.message.hide();
            msgShowing = false;
            this.showMessage = false;

            // New event
            this.CurrentEventNumber++;

            // Event is not happening anymore
            this.talkEventHappening = false;
    
            return false;
            // Event end...~~
        } else {                
            return true;    
            // Event happening
        }
    }, // end npcTalkEvent

    // *** npcWaitEvent Managment
    npcWaitEvent : function npcWaitEvent() {
        if (!this.readOneTimeEvent) {
            this.waitEvent = this.currentEvent.tempo * 60;
            this.readOneTimeEvent = true;
        }

        if (--this.waitEvent < 0) {
            this.CurrentEventNumber++;
            // New event
            return false;
        } else {
            return true;
            // Event happening
        }
    }, // end npcWaitEvent

    // *** npceffectEvent Managment
    npceffectEvent : function npceffectEvent() {
        if (!this.readOneTimeEvent) {
            this.waitEvent = this.currentEvent.tempo * 60;
            this.readOneTimeEvent = true;

            // ***** ATTENTION CAN BE OTHER EFFECTS LIKE FIRE ...
            // CHECK IF IS A DOOR REMOVE

            //Remove door and play explosion effect
            if (this.currentEvent.efeito == "explodeDoor") {
                adsGame.prisonDoors.remove(this.currentEvent.coordenadasAlvo, this.currentEvent.efeito);
            }
        }

        if (--this.waitEvent < 0) {
            this.CurrentEventNumber++;
            // New event
            return false;
        } else {
            return true;
            // Event happening
        }
    }, // end npceffectEvent

    // *** Event Managment
    npcEvent : function npcEvent(npcEvents) {
        // console.log('this.CurrentEventNumber:' , this.CurrentEventNumber);

        // If no more events return else execute the next event
        if (this.CurrentEventNumber == npcEvents.length) {
            return;
        } else {
            this.currentEvent = npcEvents[this.CurrentEventNumber];
        }

        switch( this.currentEvent.tipo ) {
            case "talk":
                //**** CHANGE THIS FOR COORDINATES INSTEAD PATH
                // if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
                // TODO - Review npc talk event how it's trigged
                if ((this.currentEvent.coordenadas[0] == Math.round(this.pos.x / ads_tile_size) && this.currentEvent.coordenadas[1] == Math.round(this.pos.y / ads_tile_size)) || adsGame.prisonDoors.prisonDoorTrigger[this.npcData.prisao.numero]) {// to talk to prisoner if hero pull the trigger
                    if (this.npcTalkEvent()) {
                        // event talking is happening
                        npcTalking = true;
                        return true;
                    } else {
                        // event talking is over
                        npcTalking = false;
                        return false;
                    }
                }
                break;
            case "wait":
                // if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
                if (this.currentEvent.coordenadas[0] == Math.round(this.pos.x / ads_tile_size) && this.currentEvent.coordenadas[1] == Math.round(this.pos.y / ads_tile_size)) {
                    if (this.npcWaitEvent()) {
                        return true;
                    } else {
                        return false;
                    }
                }
                break;
            case "effect":
                // if( this.currentEvent.caminho == this.currentPath && this.currentEvent.passo == this.countPath){
                if (this.currentEvent.coordenadas[0] == Math.round(this.pos.x / ads_tile_size) && this.currentEvent.coordenadas[1] == Math.round(this.pos.y / ads_tile_size)) {
                    if (this.npceffectEvent()) {
                        return true;
                    } else {
                        return false;
                    }
                }
                break;
            case "escape":
                // this.readOneTimeEvent = false;
                if (this.npcTalkEvent()) {

                    return true;
                } else {
                    // Calculate new path
                    // console.log('Calculate path on trigger ...');
                    this.currentPath = this.path.length - 1;

                    this.countPath = 0;
                    var start = [Math.round(this.pos.x / ads_tile_size), Math.round(this.pos.y / ads_tile_size)];
                    var end = this.currentEvent.coordenadas;
                    this.path[this.currentPath] = adsGame.pathFinder.getPath(start, end, "collision");

                    // Stay on waiting room
                    this.reversePathNumber = -1;
                    return false;
                }
                break;
            case "giveItem":
                // this.readOneTimeEvent = false;
                if (this.npcTalkEvent()) {

                    return true;
                } else {
                    //Keep data for all items found by the hero less gold and knowledge increment right away
                    if (ads_items_data[this.currentEvent.item].categoria == 'ouro' ||
                            ads_items_data[this.currentEvent.item].categoria == 'conhecimento'){
                            me.game.HUD.updateItemValue(ads_items_data[this.currentEvent.item].categoria , parseInt(ads_items_data[this.currentEvent.item].valor, 10));
                        }else{
                            // Show inventory window if is not open
                            if (!adsGame.Inventory.isShowing) {
                                adsGame.Inventory.show();
                                console.log('Inventory is not showing...');
                            }
        
                            // If npc give to hero a mission item then set as special item to go the rigth slot (Map items)
                            if (ads_items_data[this.currentEvent.item].categoria == 'itemMissao') {
                                ads_items_data[this.currentEvent.item].specialItem = true;
                            }
        
                            // Add item to hero
                            adsGame.Inventory.addItem(ads_items_data[this.currentEvent.item]);
        
                            return false;
                        }
                }
                break;
            case "sellItems":
                if( this.collideHero ){
                    adsGame.Shop.show( this.npcData );
                    // console.log("Sell item to hero:");
                }else{
                    // console.log("Don't sell item to hero:");
                    if ( showingShop ){
                        adsGame.Shop.hide();
                    }
                }
                
            break; // Sell talk
            
            default:
            break;
        }
    },

    "draw" : function draw(context) {
        this.parent(context);

        if (this.npcData.categoria == "enemies") {

            // Update position x and y health bar
            this.healthBar.pos.x = this.pos.x;
            this.healthBar.pos.y = this.pos.y -  ( this.healthBar.maxHeight + 5);
            
            // Update health
            this.healthBar.setHealth(this.health);
            
            if (this.alive){
                // If true NPC dies
                if (this.healthBar.update() ) {
                    // If is a mission item then set as special item to go the rigth slot (Map items)
                    console.log("ads_items_data[this.npcData.deixaitem.nome].categoria:", ads_items_data[this.npcData.deixaitem.nome].categoria);
                    if (ads_items_data[this.npcData.deixaitem.nome].categoria == 'itemMissao'){
                        ads_items_data[this.npcData.deixaitem.nome].specialItem = true;
                        ads_items_data[this.npcData.deixaitem.nome].remover = this.npcData.deixaitem.remover;
                        ads_items_data[this.npcData.deixaitem.nome].quantidade = this.npcData.deixaitem.quantidade;
                    }else{
                        ads_items_data[this.npcData.deixaitem.nome].specialItem = undefined;
                    }
                    console.log("ads_items_data[this.npcData.deixaitem.nome].specialItem:" , ads_items_data[this.npcData.deixaitem.nome].specialItem);
                    // Set item to drop as special item and where remove points and quantity

                    var item = new ItemEntity( this.pos.x , this.pos.y , {
                        image : this.npcData.deixaitem.nome,
                        spritewidth : 32,
                        spriteheight : 32
                    }, ads_items_data[this.npcData.deixaitem.nome]);
                    me.game.add(item, 6);
                    me.game.sort();

                    // Set NPC death
                    // this.setCurrentAnimation( "die" );
                    this.alive = false;
                    
                    // If message after die
                    if ( typeof this.npcData.msgMorre != "undefined" ){
                        // Message to player if npc die 
                        var dieMsgData = {};
                                            
                        dieMsgData.msgImage = this.msgData.msgImage;
                        dieMsgData.msgName = this.msgData.msgName;
                        dieMsgData.msg = this.npcData.msgMorre;
                        
                        // // Show message
                        this.message.show(dieMsgData);
                        this.showMessage = true;
                        msgShowing = true;
                        
                        var self = this;
                        
                        var tween = new me.Tween( { x: 1} )
                        .to( { x: 0 }, 10000 ).onComplete(function(){ 
                            console.log("Testing Tween..."); 
                            self.message.hide();
                            msgShowing = false;
                            self.showMessage = false;
                            if ( typeof(self.npcData.dieEffect.removerArmaHeroi) && self.npcData.dieEffect.removerArmaHeroi){
                                var player = adsGame.heroEntity();
                                player.removeWeapon( heroWeaponName );
                            }
                        }).start();
                    }
                    
                    // Remove Thrower associated with NPC
                    me.game.remove( this.thrower );
                }
                
                // Draw Bar
                this.healthBar.draw(context);
                
            }else { // NPC is death
                    // var self = this;
                    // var tween = new me.Tween( { x: 1} )
                        // .to( { x: 0 }, self.removeTime ).onComplete(function(){ me.game.remove(self);})
                        // .easing( me.Tween.Easing.Quartic.EaseIn )
                        // .onUpdate( function () {            
                           // self.resize( this.x );            
                        // } )
                        // .start();
                        
                        var self = this;
 
                        // Make npc die animation one time only
                        var dieNPCEffect = new effect(
                                ( self.pos.x ) , 
                                ( self.pos.y ) , // Coordinates
                                me.loader.getImage(self.npcData.dieEffect.name),  // Image
                                self.npcData.dieEffect.size.width,self.npcData.dieEffect.size.height, // Size
                                self.npcData.dieEffect.animationSheet, //Animation sheet
                                self.npcData.dieEffect.speed, // Speed between 0 - Slowest and 60 - fastest
                                self.npcData.dieEffect.repeat, // Repeat
                                self.npcData.dieEffect.waitBetween, // Wait between
                                self.npcData.dieEffect.funcOnComplete, // When animation is complete execute this code
                                self // send parent object
                        );
                                
                        me.game.add(dieNPCEffect, 8);
                        me.game.sort();
                        
                        // Remove this NPC from game
                        me.game.remove(self);
            }
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
    init : function(x, y, settings) {

        this.parent(x, y, settings);

        //returns an array of all enumerable property names defined by a given object
        var npcKeys = Object.keys(adsNpcData);

        // Total of NPC
        countNpc = npcKeys.length;

        console.log("NPC count:", countNpc);
        console.log("NPC name:", adsNpcData["dragonlvl01"].nome, ": Spritewidth:", adsNpcData["dragonlvl01"].tamanhoImagem.largura, " Sprite Height:", adsNpcData["dragonlvl01"].tamanhoImagem.altura);

        for (var x = 0; x < countNpc; x++) {
            //Test if npc is to create at the beginning of the game
            if (adsNpcData[npcKeys[x]].criarInicio) {
                adsGame.Npc.create(adsNpcData[npcKeys[x]]);
            }
        }
    }
});

// ******************************
// **** End Spawn NPC on map ****
// ******************************

// **************************
// **** Spawn NPC on map ****
// **************************
adsGame.NPC = Object.extend({

    create : function create(npcData) {
        var settings = {};
        settings.image = npcData.imagem.replace(".png", "");
        settings.spritewidth = npcData.tamanhoImagem.largura;
        settings.spriteheight = npcData.tamanhoImagem.altura;

        console.log("npcData.coordenadas[0].initStartX:", npcData.coordenadas[0].initStartX);

        // Create a new npc *ads_tile_size to transform map coordinates to tile coordinates
        npc = new NpcEntity(npcData.coordenadas[0].initStartX * ads_tile_size, npcData.coordenadas[0].initStartY * ads_tile_size, settings, npcData);

        me.game.add(npc, 7);
        me.game.sort();
    }
});

// ******************************
// **** End Spawn NPC on map ****
// ******************************

