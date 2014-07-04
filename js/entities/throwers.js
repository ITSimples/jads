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
// ****  THROWERS ENTITY                 ****
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
        
        if (typeof this.throwerData.numeroDisparos !== "undefined"){
          this.numeroDisparos = this.throwerData.numeroDisparos;
        }
        
        // If thrower is animated in all directions
        if ( this.throwerData.animacoes.animaTodasPosicoes) {
            this.renderable.addAnimation("right"  ,  this.throwerData.animacoes.direita );
            this.renderable.addAnimation("left"    ,  this.throwerData.animacoes.esquerda );
            this.renderable.addAnimation("up"     ,  this.throwerData.animacoes.cima );
            this.renderable.addAnimation("down",  this.throwerData.animacoes.baixo );
            
            // console.log("Set animations to NPC..." , this.throwerData.configuracoes.image);
        }
        
        this.renderable.addAnimation("default", this.throwerData.animacoes.parado );
        this.renderable.addAnimation("throw", this.throwerData.animacoes.animado );
        
        this.renderable.setCurrentAnimation("default");
        
        this.animationspeed = me.sys.fps / (me.sys.fps / this.throwerData.animacoes.velocidade);
        
        this.resetThrowDurationAndTimer();
        
        // console.log('this.throwerData.solido:',this.throwerData.solido ,  'this.throwerData.nome:', this.throwerData.nome)
        
        //Put solid tile in this place if thrower is solid this.collisionLayer.getTileId( 0 , 0 ) number
        // In this case in the map 0,0 coordinates must be an solid tile
        if (this.throwerData.solido){
            this.collisionLayer = me.game.currentLevel.getLayerByName("collision");
            this.collisionLayer.setTile(this.throwerData.coordenadas.x,this.throwerData.coordenadas.y, this.collisionLayer.getTileId( 0 , 0 ));
            
            // Debug get solid tile number - Improve
            // console.log(" Solid tile number :", this.collisionLayer.getTileId( 0 , 0 ) );
            
        }
        
        // Create a maximum number of projectile objects
        this.numberProjectils = 0;
    },
    
    update: function () {
        //Create project by mouse click if thrower is controlled by mouse
        // If keypressed I then open the inventory
        var self = this;
        
        var htmlWeaponSlot = $("#Slot0" + heroWeaponSlot + " span");
        
        if (typeof this.numeroDisparos !== "undefined"){
          htmlWeaponSlot.text( this.numeroDisparos );
        }
        
        if (this.throwerData.movimento == "mouseClickMovement"){
            if (me.input.isKeyPressed('mouseOverride') && heroWeaponEnable)
            {
                // console.log('Mouse click create projectil...');
                // console.log('me.input.mouse.pos X:' , (me.input.mouse.pos.x + me.game.viewport.pos.x) );
//                 
                 // console.log('Hero pos X=:' , adsGame.heroEntity().pos.x , "  wY=", adsGame.heroEntity().pos.y);
                 
                var cursorWidth = me.loader.getImage("point_cur").width ;
                 
                // World Destination = mouse position - image mouse pointer size + viewport position
                this.throwerData.destX = ( me.input.mouse.pos.x - cursorWidth ) + me.game.viewport.pos.x;
                this.throwerData.destY = ( me.input.mouse.pos.y ) + me.game.viewport.pos.y;
                
                // Define here how many projectils hero must create
                if (typeof this.numeroDisparos !== "undefined"){
                    // console.log("this.throwerData.numeroDisparos:", this.numeroDisparos);
                    this.numeroDisparos--; // = this.throwerData.numeroDisparos - 1;
                    if (this.numeroDisparos > 0){
                        this.createProjectil();
                         // Add text to div that contain weapon                        
                    }else if ( this.numeroDisparos == 0 ){   
                            // Remove thrower and send information to remove item from inventory
                            this.createProjectil();
                            var player = adsGame.heroEntity();
                            player.removeWeapon( this.throwerData.nomeItem );
                            
                            htmlWeaponSlot.empty();
                            
                            me.game.remove( self );
                    }
                }else{
                    this.createProjectil();
                }
                
            }
        }else { //Thrower by time
            // Create projectil by interval time
            this.updateThrowTimer(); 
        }
        
        
        // check & update thrower movement
        updated = this.updateMovement();

        // update animation
        // if (updated)
        // {
            // // Actualizar animação
            // this.parent(this);
        // }
        
        // Always update thrower animation and movement
        this.parent(this);
        
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
       
       // If animation was no direction else another class control that ( NPC for example)
       if ( !this.throwerData.animacoes.animaTodasPosicoes) {
           this.renderable.setCurrentAnimation("throw", "default");
       }
          
      // DEBUG
      // If distancia exists then verify distance between thrower and hero
      if (typeof(this.throwerData.distancia) !== 'undefined' ){
      
        var player = adsGame.heroEntity();
        // console.log("Distance between hero and thrower : " , this.distanceTo(player[0]));
        
      
        if (this.throwerData.distancia > this.distanceTo(player) ){
            if (typeof(this.throwerData.numeroDeProjeteis) !== 'undefined' ){
                // Create a maximum number of projectil objects
                this.createMaxProjectils(this.throwerData.numeroDeProjeteis);
            }else{
                this.createProjectil();
            }
        }
        // destroy player variable
        player = undefined;
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
        
        // if (this.throwerData.direcao == "up" || this.throwerData.direcao == "down"){
            // // Calculate trigger position on (X=middle of thrower - middle of projectil) and (Y = projectil height)
            // var triggerPositionX = ~~(this.throwerData.configuracoes.spritewidth / 2) - 
                                    // ~~(projectilsData[this.throwerData.nomeProjectil].configuracoes.spritewidth / 2);
            // var triggerPositionY = this.throwerData.posicaoDisparo.y ;   
                
            // console.log("triggerPositionY + this.pos.y:" , triggerPositionY , "+", this.pos.y)
            
        // }else if (this.throwerData.direcao == "right" || this.throwerData.direcao == "left"){
            // var triggerPositionX = this.throwerData.posicaoDisparo.x ;
            // var triggerPositionY = ~~(this.throwerData.configuracoes.spriteheight / 2) - 
                                    // ~~(projectilsData[this.throwerData.nomeProjectil].configuracoes.spriteheight / 2);
        // }else{
            
            //  posicaoDisparo - give the launch position added to current positon of thrower
            // var triggerPositionX = this.throwerData.posicaoDisparo.x ;
            // var triggerPositionY = this.throwerData.posicaoDisparo.y ;
        // }
            
        // Debug - Console
        // console.log("throwerData.nome :", this.throwerData.nome );
        
        if ( this.throwerData.nomeSom != undefined && this.throwerData.volumeEfeito != undefined){
            // play a "throwerSound" sound
            me.audio.play( this.throwerData.nomeSom , false , null , this.throwerData.volumeEfeito );
        }
        
        //  posicaoDisparo - give the launch position added to current positon of thrower
        var triggerPositionX = this.throwerData.posicaoDisparo.x ;
        var triggerPositionY = this.throwerData.posicaoDisparo.y ;
            
        var projectil = new projectilEntity(this.pos.x + triggerPositionX , 
                                            this.pos.y + triggerPositionY, 
                                            projectilsData[this.throwerData.nomeProjectil], this.throwerData);
        
        me.game.add(projectil,10);
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
    }
  });
  
// **************************************
// ****  END THROWERS ENTITY         ****
// **************************************

// **************************************
// ****  THROWERS ENTITY SPAWN ****
// **************************************
//me.InvisibleEntity has been removed, as following previous changes,
//this can now be achieved using a me.ObjectEntity without a renderable component.
var ThrowersSpawnEntity = me.ObjectEntity.extend({
    //Constructor
    init: function( x , y , settings){
        // call the parent constructor
        this.parent(x, y, settings);
        
        
        // Adicionar items na camada 4
        $.each( throwersData, function(i, throwerData){
            if ( throwerData.criarinicio){
                thrower = new throwersEntity( throwerData.coordenadas.x * _Globals.map.tileSize , throwerData.coordenadas.y * _Globals.map.tileSize, throwerData);
                me.game.add(thrower,6);
                me.game.sort.defer();
            }
        }); 

    }
});
// **************************************
// ****  END THROWERS ENTITY SPAWN ****
// **************************************  