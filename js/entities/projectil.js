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
// ****  PROJECTIL ENTITY            ****
// ************************************** 
   var projectilEntity = me.ObjectEntity.extend({
    
    init: function (x, y, projectilData, throwerData ) {
        
        this.projectilData = projectilData;
        
        this.throwerData = throwerData;
        
        // console.debug( "Projectil", projectilData );
        var settings = this.projectilData.configuracoes;
        
        this.parent(x, y, settings);

        this.gravity = 0;
        this.canBreakTile = true;
        
        // Set NPC object type
        this.type = 'PROJECTIL_OBJECT';
        
        //Define if object moves in all directions
        this.testDirection = false;
        
        // If the projectil move in all directions then add animation if not set one animation
        if (typeof(this.projectilData.animacoes.anima) != 'undefined' && this.projectilData.animacoes.anima != null){
            this.renderable.addAnimation("default", this.projectilData.animacoes.parado );
            this.renderable.addAnimation("down", this.projectilData.animacoes.anima.baixo );
            this.renderable.addAnimation("up", this.projectilData.animacoes.anima.cima );
            this.renderable.addAnimation("left", this.projectilData.animacoes.anima.esquerda );
            this.renderable.addAnimation("right", this.projectilData.animacoes.anima.direita );
            
            //If projectil moves in all directions
            this.testDirection = true;
        }else{
            this.renderable.addAnimation("anime", this.projectilData.animacoes.animaTodasDirecoes );
            this.renderable.addAnimation("default", this.projectilData.animacoes.parado );          
        }
        
        if (typeof(this.projectilData.animacoes.animacaoRemover) != "undefined"){
            this.renderable.addAnimation("removeAnimation", this.projectilData.animacoes.animacaoRemover );
        }
        this.currentAnimation = "";
        
        this.renderable.setCurrentAnimation("default");
        
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
            
            case "followHero":
                    this.currentAnimation = "default";
                    
                    this.velocityFollow = randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
                    
            break;
            
            // Case mouseClickMovement then get the coordinates where is the point to move the projectil
            case "mouseClickMovement":
                    // Get mouse coordinates and save on this.destX and this.destY
                     this.destX = this.throwerData.destX;
                     this.destY = this.throwerData.destY; 
                     
                     this.velocityFollow = randomFloat(this.throwerData.velocidade[0], this.throwerData.velocidade[1]);
            break;          
            
            default:
            break;
        }
        
        // If you want add time before destroy object must be interesting
        this.timeToDestroy = 0;
        
        //Update always???
        this.alwaysUpdate = false;
    },
    
    update: function () {
    
        var self = this;
        
        //Update animation
        if (this.testDirection){
            this.renderable.setCurrentAnimation( this.currentAnimation );
        }else{
            this.renderable.setCurrentAnimation("anime" , 
            (function(){
                if (typeof(self.throwerData.repetirAnimProj) != 'undefined' && 
                    !self.throwerData.repetirAnimProj &&
                    typeof(self.throwerData.tempoDeVida) == 'undefined'){
                        this.renderable.setAnimationFrame( this.projectilData.animacoes.animaTodasDirecoes.length - 1 );
                        this.renderable.animationpause = true;
                        me.game.remove(this);
                }
            }).bind( this ));
        }
                
        // for bees movement
        if(this.throwerData.movimento  === "BeeHavior"){
            moveObjectBeeHavior( this );
        }
        
        if(this.throwerData.movimento  === "mouseClickMovement"){
           // Move the projectil to destination point
           if( fireProjectil( this ) ){
               // If there is a live time then don't remove presently
               // Make a tween with the time and remove after time with animation if exists
               
               // if reach the point remove projectil if no time to destroy
               if (typeof(self.throwerData.tempoDeVida) == 'undefined'){
                    me.game.remove(this);
               }
            }
        }
        
        if(this.throwerData.movimento  === "followHero"){
            // Rotate projectil here if true
            var heroAux = adsGame.heroEntity();
            
            followHero( this );
            
            // Verify if projectil rotate
            if (typeof(this.throwerData.rodarProjectil) !== 'undefined' && this.throwerData.rodarProjectil){
                var angleToHero = this.angleTo(heroAux);
                this.renderable.angle = angleToHero;
            }
        }
        
        // Destroy object if the livetime has been exceeded
        if ( typeof(this.throwerData.tempoDeVida) !== 'undefined' ){
            this.liveTime();
        }
        
        
                // If projectil ignore wall        
        if( !this.throwerData.ignorasolido ){
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
        }else{
            this.handleCollisions(updated);
            this.computeVelocity(this.vel);
            this.pos.add(this.vel);
              // Actualizar animação
            this.parent(this);            
        }
    },
    
    liveTime: function (){
        var self = this;
        
        this.timeToDestroy++;
        if (this.timeToDestroy >  this.throwerData.tempoDeVida ){
            //Remove object with removeAnimation animation
            if (typeof(this.projectilData.animacoes.animacaoRemover) !== "undefined"){
                this.renderable.setCurrentAnimation("removeAnimation" , 
                        function(){
                            self.renderable.setAnimationFrame( self.projectilData.animacoes.animacaoRemover.lenght - 1 );
                            self.renderable.animationpause = true;
                            me.game.remove( self );
                        });
            }else{
                 me.game.remove(this);
            }
            return;
        }
    },
    
    handleCollisions: function ( updated ) {
        var res = me.game.collide(this , true);
        var collideHero = false;
        var self = this;

        //Testing multiple collisions to verify if projectil collide with hero
        $.each(res, function(i,data)
        {
            if (data && data.obj.type == 'HERO_OBJECT' && self.throwerData.atacaObjeto == 'HERO_OBJECT') {
                collideHero = true;
            }else if  (data && data.obj.type == 'NPC_OBJECT' && self.throwerData.atacaObjeto == 'NPC_OBJECT') {
                //Get NPC GUID
                console.log("Hit NPC...", data.obj.GUID);
                //Remove object with removeAnimation if animation exists
                if (typeof(self.projectilData.animacoes.animacaoRemover) != "undefined"){
                    self.renderable.setCurrentAnimation("removeAnimation" , 
                            function(){
                                    // If NPC is hit by hero weapon
                                    if ( data.obj.npcData.armaHeroiAtaca === undefined || data.obj.npcData.armaHeroiAtaca )
                                        data.obj.removeHealth( self.projectilData.atualizarHUD.valor );
                                                      
                                    me.game.remove( self );
                            });
                }else{
                    // If NPC is hit by hero weapon
                    if ( data.obj.npcData.armaHeroiAtaca === undefined || data.obj.npcData.armaHeroiAtaca )
                        data.obj.removeHealth( self.projectilData.atualizarHUD.valor );
                     //remove projectil when hits NPC
                     me.game.remove( self );
                }
            }
        });
        
        if ( collideHero ) {
                me.game.HUD.updateItemValue(this.projectilData.atualizarHUD.tipo, 
                                            -(parseInt(this.projectilData.atualizarHUD.valor)));                    
                //Remove object
                me.game.remove(this);
                
                // If remove health then play hit sound and flicker player
                if ( this.projectilData.atualizarHUD.tipo == 'vida' ){
                    //When player collide with item Stop player and ask question
                    var player = adsGame.heroEntity();
                    // play a "hitplayer" sound
                    me.audio.play("hithero", false , null , hitHeroVolume);
                    // let's flicker in case we loses health
                    player.renderable.flicker(10);
                    player = undefined;
                }
                
                //if there is a maximum number of projectils then when one die another is created
                if (typeof(this.throwerData.numeroDeProjeteis) !== 'undefined' ){
                    var throwerEntity = me.game.getEntityByGUID(this.throwerData.GUID);
                    throwerEntity.numberProjectils--;
                }   
                    
                return;
        }
        
        // If projectil ignore wall        
        if( !this.throwerData.ignorasolido ){
            // Remove bees only when do complet circle
            if (this.checkWallCollision(updated)){
                if(this.throwerData.movimento === "random"){            
                    this.randomMovement();
                }else{
                    //Remove object if there is a distance up 32 pixels
                    me.game.remove(this);
                }           
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
    
    mouseClickMovement: function () {
                
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
// ****  END PROJECTIL ENTITY       *****
// **************************************