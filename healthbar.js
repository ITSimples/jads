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

adsGame.HealthBar = Object.extend ({
     "init" : function init( config ) {
         
         this.maxHealth = config.maxHealth;

         this.maxWidth = config.maxWidth;
         
         // Bar Height
         this.maxHeight = 8;
         
         this.x = config.x;
         this.y = config.y  -  ( this.maxHeight + 5); // Bar up npc position
         
         this.health = this.maxHealth;         
     },
     
     "setHealth" : function setHealth(health){
         this.health = health;
     },
     
     "update": function update(pos){
         this.x = pos.x;
         this.y = pos.y -  ( this.maxHeight + 5);
         
         if ( (this.maxWidth * this.health / this.maxHealth) < 0 ) 
            return true;
         else
            return false
     },
     
     "draw" : function draw( context ){
         context.beginPath();
             context.rect ( this.x , this.y , this.maxWidth , this.maxHeight );
             context.fillStyle = "black";
             context.fill();
         context.closePath();
         
         context.beginPath();
            var width = this.maxWidth * this.health / this.maxHealth;
            
            console.log("this.height:" , this.height);
            context.rect( this.x , this.y , width , this.maxHeight);
            context.fillStyle = "red";
            context.fill();
        context.closePath();
         
     }
     
     
    
}); //End adsGame.HealthBar
