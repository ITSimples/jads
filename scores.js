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
         console.log("Init adsGame.Score");
                  
     },
     
     "createPlayer" : function createPlayer ( userName ){
        
        self = this;
        self.createPlayerSucessed = "";     
        self.getPostResponse = false;
        
        $.post('libraries/scoreoid_proxy.php', {action:'curl_request', method:'createPlayer',username: userName, response:'JSON'}, function(data){
            // console.log("Data Loaded: " + data);
            var dataJSON =  JSON.parse(data)
            self.createPlayerSucessed = dataJSON.error;
            console.log("self.createPlayerSucessed:::", self.createPlayerSucessed);
        }).done(function() { self.getPostResponse = true; console.log('self.getPostResponse INside:',self.getPostResponse);})
        
        console.log('self.getPostResponse Outside:',self.getPostResponse);
        
        if ( self.createPlayerSucessed ){ // Return true or false
            console.log('Already on database...',self.createPlayerSucessed);
            return false;
        }else{
            console.log('Not in database player created',self.createPlayerSucessed);
            return true;
        }
        
         
     },
     "playerScore" : function playerScore ( userName , playerScore){
        $.post('libraries/scoreoid_proxy.php', {action:'curl_request', method:'createScore',username: userName, score : playerScore,  response:'JSON'}, 
            function(data) {
                // alert("Data Loaded: " + data);
            // console.log("Data Loaded: " + data);
            if (data.error)
                console.log('Error: ',data.error);
            else
                console.log('Score update : ',data);
        });
     },
     "topPlayers" : function topPlayers (){
        $.post('libraries/scoreoid_proxy.php', {action:'curl_request', method:'getBestScores',order_by : 'score', order : 'desc', limit : 10, response:'JSON'}, 
            function(data) {
                // alert("Data Loaded: " + data);

            if (data.error){
                console.log('Error: ',data.error);
                return 'Error';
            }else{
                console.log('Top 10 : ',data.Player);
                $.each($.parseJSON(data), function(index, element) {
                     console.log('element' , element.Player.username , '- Score:', element.Score.score);
                });
                return data
             }
        });
     }     
     
}); //End adsGame.Score


