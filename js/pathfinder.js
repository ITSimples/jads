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
 * pathFinder.
 * @class
 * @extends 
 * @constructor
 * @param 
 * @return path
 */
 
adsGame.PathFinder =  Object.extend({
	"init" : function init() {
		console.log('Init pathfinder class...');
	},
	
	"getPath" : function getPath( start, end , layerName){
		
		// console.log('Start:', start , 'End:', end , 'layerName:', layerName);
		
		// Get layer object
		var layer = me.game.currentLevel.getLayerByName("collision");
		
		// set array to layer
		var myLayerArray = new Array(layer.cols);
		
		// parse all the layer tiles 
		for ( var x = 0; x < layer.cols; x++) 
		{ 
			// create multidimensional array
			myLayerArray[x] = new Array(layer.rows);
		
			for ( var y = 0; y < layer.rows; y++) 
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
	},
	
	"getPathTest" : function getPathTest( start, end){
        // Get layer object
        var layer = me.game.currentLevel.getLayerByName("collision");
        
        // set array to layer
        var myLayerArray = new Array(layer.cols);
        
        // parse all the layer tiles 
        for ( var x = 0; x < layer.cols; x++) 
        { 
            // create multidimensional array
            myLayerArray[x] = new Array(layer.rows);
        
            for ( var y = 0; y < layer.rows; y++) 
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
           var grid = new PF.Grid(50, 50, myLayerArray);
           
           var finder = new PF.AStarFinder();
           
           
           var path = finder.findPath(start[0], start[1], end[0], end[1], grid);

           return path;
	}
});
	