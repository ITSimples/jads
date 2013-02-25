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
 
 /**
 * PrisonDoors.
 * @class
 * @extends 
 * @constructor
 * @param
 * @example
 */
 
 adsGame.PrisonDoors =  Object.extend({
	"init" : function init() {
				/*------------------- 
				Prison Configuration
				-------------------------------- */

				//Create global variable to check if prison door is opened or closed
				this.prisonBreak = [false,false,false,false];

				this.prisonDoorTrigger = [false,false,false,false];

				/*------------------- 
				End Prison Configuration
				-------------------------------- */
	},
	
	"openPrisonDoor" : function openPrisonDoor ( prisonNumber ){
							this.prisonBreak[ prisonNumber ] = true;
	},
	
	"getPrisonDoorState" : function getPrisonDoorState ( prisonNumber ){
							return this.prisonBreak[ prisonNumber ];
	},
	
	"remove" : function remove( initCoord , effectName ) {
	
				var doorLayer = me.game.currentLevel.getLayerByName("doors");
				var upperObjectsLayer = me.game.currentLevel.getLayerByName("upper objects");

				console.log("Passed here...");
				
				// - Upper Door
				//Remove door:
				upperObjectsLayer.clearTile(initCoord[0]     , initCoord[1] - 1);
				upperObjectsLayer.clearTile(initCoord[0] + 1 , initCoord[1] - 1);			

				// - Lower
				doorLayer.clearTile(initCoord[0]     , initCoord[1]);
				doorLayer.clearTile(initCoord[0] + 1 , initCoord[1]);
				
				// Effect
				if ( !(effectName === undefined || effectName == null || effectName.length <= 0) )
				{
					if (effectName == "explodeDoor"){
	
				
						var boom = new effect(
									(initCoord[0] * ads_tile_size) , (initCoord[1] * ads_tile_size) - 32, // Coordinates
									me.loader.getImage("explosion_64x64"),	// Image
									64, 64, // Size
									[0,1,2,3,4,5,6,7,8,9,10,11,12], //Animation sheet
									30, // Speed between 0 - Slowest and 60 - fastest
									false, // Repeat
									0 // Wait between
									);
									
						me.game.add(boom, 8);
						me.game.sort();
						
						//New upper door exploded
						upperObjectsLayer.setTile(initCoord[0]     , initCoord[1] - 1 , 123);
						upperObjectsLayer.setTile(initCoord[0] + 1 , initCoord[1] - 1 , 124);
						
						// - New lower door exploded
						doorLayer.setTile(initCoord[0]     , initCoord[1] , 135);
						doorLayer.setTile(initCoord[0] + 1 , initCoord[1] , 136);
						
					}else if (effectName == "openDoor"){		
						var openDoor = new effect(
									(initCoord[0] * ads_tile_size) , (initCoord[1] * ads_tile_size) - 32, // Coordinates
									me.loader.getImage("prisiondooropen"),	// Image
									64, 64, // Size
									[0,1,2,3,4], //Animation sheet
									5 // Speed between 0 - Slowest and 60 - fastest
									);			
									 
						me.game.add(openDoor, 9);
						me.game.sort();
					}
					
				doorLayer = undefined;
				this.removeDoorCollision( initCoord );
			}
	},
	"removeDoorCollision" : function removeDoorCollision( initCoord ) {
		
		var collisionLayer = me.game.currentLevel.getLayerByName("collision");
		
		// Remove collision tiles on layer
		collisionLayer.clearTile(initCoord[0],initCoord[1]);
		collisionLayer.clearTile(initCoord[0] + 1,initCoord[1]);
		
		collisionLayer = undefined;
	}

 });