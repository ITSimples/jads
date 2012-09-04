/*
 * Aventura do saber, a fantasy action RPG
 * Copyright (C) 2012  ITSimples - Francisco Fernandes
 */
 
 /**
 * pathFinder.
 * @class
 * @extends 
 * @constructor
 * @param
 * @example
 */
 
adsGame.pathFinder =  Object.extend({
	"init" : function init() {
		console.log('Init pathfinder class...');
	},
	
	"getPath" : function getPath( start, end , layerName){
		
		console.log('Start:', start , 'End:', end , 'layerName:', layerName);
		// Get layer object
		var layer = me.game.currentLevel.getLayerByName("collision");
		
		// set array to layer
		var myLayerArray = new Array(layer.width);
		
		// parse all the layer tiles 
		for ( var x = 0; x < layer.width; x++) 
		{ 
			// create multidimensional array
			myLayerArray[x] = new Array(layer.height);
		
			for ( var y = 0; y < layer.height; y++) 
		   { 
				var testTile = layer.layerData[y][x];
				
				// if null not collide then 0 free path with Astar algoritm
				if (testTile == null){
					myLayerArray[x][y] = 0;
				}else { // 1 block the path
					myLayerArray[x][y] = 1;
				}
			}
		}	
		
		console.log (myLayerArray);
		

	
		console.log('Start point:' , myLayerArray[start[0]][start[1]]);
		console.log('End point:' , myLayerArray[end[0]][end[1]]);
		
		
		var result = AStar(myLayerArray, start, end, "Manhattan");
	
		$.each ( result, function (i, results ){
			var x = result[i][0];
			var y = result[i][1];
			console.log ("X: " , x , ' Y:', y);
		});
		// return path;
	}
});
	