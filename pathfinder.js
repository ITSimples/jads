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
 * @return path
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
		
		
		var result = AStar(myLayerArray, start, end, "Manhattan");
		
		/*
			Get the result and transform to get only the start and end points of a line.
			to apply the Bresenham algorithm
		*/
		var pathArray = [];
		var countArray = 1;
		var equal ='';
		var x;
		var y;
		var nextX;
		var nextY;
		
		//first point
		pathArray[0] = start;
		
		$.each ( result, function (i, results ){
			if (i != result.length - 1){
				x = result[i][0];
				y = result[i][1];
				nextX = result[i + 1][0];
				nextY = result[i + 1][1];
				
				//if x is not equal to x+1 then y equal to y+1
				if ( x == nextX){
					if (equal == 'y') countArray++;
					pathArray[countArray] = [nextX,nextY];
					equal ='x';
				}else { // y equal
					if (equal == 'x') countArray++;
					pathArray[countArray] = [nextX,nextY];
					equal ='y';
				}

			}
			// console.log ("X: " , x , ' Y:', y);		
		});
		
		// $.each ( pathArray, function (i, point ){
			// console.log('pathArray:', i , '-' , point);
		// });
		return pathArray;
	}
});
	