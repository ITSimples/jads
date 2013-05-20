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
				// this.prisonBreak = [false,false,false,false];
				this.prisonBreak = [false,false,false,false];

				// this.prisonDoorTrigger = [false,false,false,false];
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
	
	"remove" : function remove( initCoord , effectName , animation) {
	
				var doorLayer = me.game.currentLevel.getLayerByName("doors");
				var upperObjectsLayer = me.game.currentLevel.getLayerByName("upper objects");
				
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
									[0,1,2,3,4,5,6,7,8,9,10,11], //Animation sheet
									60, // Speed between 0 - Slowest and 60 - fastest
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
									me.loader.getImage(animation),	// Image
									64, 64, // Size
									[0,1,2,3,4], //Animation sheet
									10, // Speed between 0 - Slowest and 60 - fastest
									false,
									0
									);			
						// console.log("How many times open door...");
						me.game.add(openDoor, 6);
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