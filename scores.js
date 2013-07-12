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
     * scores.js 12/07/2013
     * @class
     * @extends Object
     * @memberOf adsGame
     * @constructor
     * @param {string} function to use on scoreoid
     * @param {array} pass Parameters on array
     * @example
     * // create socre
     */
adsGame.Score = Object.extend ({
    /** @scope adsGame */
     "init" : function init( scoreoidFunc , scoreoidParameters ) {
         
        /**
         * api_key
         * @private
         * @type string
         * @name adsGame.api_key
         */
         var scoreoidApi_key = 'd1909dac1cb00b5b38db9c13d8e2be56d23e6460';
         
        /**
         * game_id
         * @private
         * @type string
         * @name adsGame.game_id
         */         
         var scoreoidGame_id = '78f73dc8b2';
         
         var method = scoreoidFunc;
         
         
         var output = {};
         var geralParameters = { api_key : scoreoidApi_key ,game_id: scoreoidGame_id ,response:"JSON"};
         
         for (var key in scoreoidParameters) {
          geralParameters[key] = scoreoidParameters[key];
         }
        
         console.log('geralParameters',geralParameters);
         
        $.post("http://api.scoreoid.com/v1/" + method, geralParameters,
        
        function(response) {
            //response will now contain the JSON data returned by Scoreoid
             //note, this is an async call
             if (response.error)
                console.log('Already on database...',response.error);
             else
                console.log('Not in database player created',response);
        });       
     }
     
}); //End adsGame.Score
