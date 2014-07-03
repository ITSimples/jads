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

/**
 * move object from current position to destination x, y using Bresenham algorithm
 *
 * Source: http://de.wikipedia.org/wiki/Bresenham-Algorithmus#Kompakte_Variante
 *
 * object should have the attributes destX and destY for the destination coordinate
 *
 * @param object
 * @return bool / check, if object reached it's goal
 */
function moveObject( object )
{

    var dx  =  Math.abs( object.destX - object.pos.x ), sx = object.pos.x < object.destX ? object.accel.x : -object.accel.x,
        dy  = -Math.abs( object.destY - object.pos.y ) , sy = object.pos.y < object.destY ? object.accel.y : -object.accel.y,
        err = dx + dy, e2 = 0;
  
    if( object.pos.x == ( object.destX ) && object.pos.y == ( object.destY) ) {            
           return true;
    }
    
    if (object.type == 'PROJECTIL_OBJECT'){       
        // console.log("err:",err);
        if ( Math.abs(err) < 3 ) return true;
     }
     
    e2 = 2 * err;
    if( e2 > dy ) {
        err += dy;
        object.pos.x += sx;
        // object.vel.x = sx  * me.timer.tick;
       
    }

    if( e2 < dx ) {
        err += dx;
        object.pos.y += sy;
        // object.vel.y = sy *  me.timer.tick;
    }

    return false;
}

/**
 * move bee in circle
 *
 * @param object
 * @return bool / check, if object reached it's goal
 */
function moveObjectBeeHavior( object )
{

	if (object !== null){
        // Update the object     
        // this.vel.y += this.gravity ;
		if (object.launchAngle == 360) me.game.remove(object);;
		// if (object.changeRadius == 110) object.changeRadius = 0;
		
		var x_pos = object.pos.x + (object.changeRadius * Math.sin(Number.prototype.degToRad(object.launchAngle)));
		var y_pos = object.pos.y + (object.changeRadius * Math.cos(Number.prototype.degToRad(object.launchAngle)));
		var x_pos_add = object.pos.x + (object.changeRadius * Math.sin(Number.prototype.degToRad(object.launchAngle + 1)));
		var y_pos_add = object.pos.y + (object.changeRadius * Math.cos(Number.prototype.degToRad(object.launchAngle + 1)));
		x_pos = Math.round(x_pos_add) - Math.round(x_pos);
		y_pos = Math.round(y_pos_add) - Math.round(y_pos);
		
		// **** temos que ver a dire��o e andar em x em y positivo ou negativo
 		
		// console.log("x: " + x_pos + " Y: " + y_pos); 
		object.vel.x = (object.accel.x * me.timer.tick) + x_pos;
		object.vel.y = (object.accel.y * me.timer.tick) + y_pos;
		
		object.launchAngle += 1;
		// object.changeRadius+= 0.5 ;
		
		return true;
	}else{
		return false;
	}
}

/**
 * move object in circle
 *
 * @param object
 * @return bool / check, if object reached it's goal
 */
function moveObjectCircle( object )
{
	if (object !== null){
        // Update the object     
        // this.vel.y += this.gravity ;
		if (object.launchAngle == 360) object.launchAngle = 0;
		// 30 radius
		var x_pos = object.pos.x + (30 * Math.sin(Number.prototype.degToRad(object.launchAngle)));
		var y_pos = object.pos.y + (30 * Math.cos(Number.prototype.degToRad(object.launchAngle)));
		var x_pos_add = object.pos.x + (30 * Math.sin(Number.prototype.degToRad(object.launchAngle + 1)));
		var y_pos_add = object.pos.y + (30 * Math.cos(Number.prototype.degToRad(object.launchAngle + 1)));
		x_pos = Math.round(x_pos_add) - Math.round(x_pos);
		y_pos = Math.round(y_pos_add) - Math.round(y_pos);
		
		// **** temos que ver a dire��o e andar em x em y positivo ou negativo
 		
		// console.log("x: " + x_pos + " Y: " + y_pos); 
		object.vel.x = (object.accel.x * me.timer.tick) + x_pos;
		object.vel.y = (object.accel.y * me.timer.tick) + y_pos;
		object.launchAngle += 1;
		
		return true;
	}else{
		return false;
	}
}


/**
 * followHero
 *
 * @param object
 * @return bool / check, if object reached it's goal
 */
function followHero( object )
{
	if (object !== null){
			var player = adsGame.heroEntity();
						
			var playerPosX = player.pos.x + 16;
			// plus 20 to enter in hero hitbox
			var playerPosY = player.pos.y + 23;
			
			// console.log("playerPosX:", playerPosX);
			// console.log("playerPosY:", playerPosY);
			
			var angle = Math.atan2(playerPosY - object.pos.y, playerPosX - object.pos.x);
			object.vel.set(Math.cos(angle) * object.velocityFollow, Math.sin(angle) * object.velocityFollow);
		
		return true;
	}else{
		return false;
	}
}


/**
 * fire projectil
 *
 * @param object
 * @return bool / check, if object reached it's goal
 */
function fireProjectil( object )
{
    if ( Math.abs(object.pos.x - object.destX) <= object.velocityFollow && Math.abs(object.pos.y - object.destY) <= object.velocityFollow ){                                                  
            return true;
    }else{
        var destX = object.destX;
        var destY =  object.destY;
            
        // console.log("DestX:", destX , " DestY:" , destY);
         // console.log("object.pos.x:", object.pos.x , " object.pos.y :" , object.pos.y );
        
        var angle = Math.atan2(destY - object.pos.y, destX - object.pos.x);
        object.vel.set(Math.cos(angle) * object.velocityFollow, Math.sin(angle) * object.velocityFollow);
        return false;
    }
}

