/*
 * Aventura do saber, a fantasy action RPG
 * Copyright (C) 2012  ITSimples - Francisco Fernandes
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
        dy  = -Math.abs( object.destY - object.pos.y ), sy = object.pos.y < object.destY ? object.accel.y : -object.accel.y,
        err = dx + dy, e2 = 0;

    if( object.pos.x == object.destX && object.pos.y == object.destY ) {
        return true;
    }

    e2 = 2 * err;
    if( e2 > dy ) {
        err += dy;
        object.pos.x += sx;
    }

    if( e2 < dx ) {
        err += dx;
        object.pos.y += sy;
    }

    return false;
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
		if (launchAngle == 360) launchAngle = 0;

		var x_pos = object.pos.x + (90 * Math.sin(Number.prototype.degToRad(launchAngle)));
		var y_pos = object.pos.y + (90 * Math.cos(Number.prototype.degToRad(launchAngle)));
		var x_pos_add = object.pos.x + (90 * Math.sin(Number.prototype.degToRad(launchAngle + 1)));
		var y_pos_add = object.pos.y + (90 * Math.cos(Number.prototype.degToRad(launchAngle + 1)));
		x_pos = Math.round(x_pos_add) - Math.round(x_pos);
		y_pos = Math.round(y_pos_add) - Math.round(y_pos);
		
		// **** temos que ver a direção e andar em x em y positivo ou negativo
 		
		// console.log("x: " + x_pos + " Y: " + y_pos); 
		object.vel.x = (object.accel.x * me.timer.tick) + x_pos;
		object.vel.y = (object.accel.y * me.timer.tick) + y_pos;
		launchAngle += 1;
		
		return true;
	}else{
		return false;
	}
}