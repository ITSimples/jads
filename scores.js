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
     
     "createPlayer" : function createPlayer ( userName , sucess , fail , failCommunication ){

        $.post('libraries/scoreoid_proxy.php', {
            action:'curl_request', method:'createPlayer',username: userName, response:'JSON'
            }).done(
                function(data) { 
                    if ( data == undefined || data ==""){
                        failCommunication(); 
                    }else{
                        // console.log("Data Loaded: " , data);
                        var dataJSON =  JSON.parse(data);
                        
                        var createPlayerSucessed = dataJSON.error;
                        
                        if ( createPlayerSucessed && userName !=="Prince Wise" ){ // Return true or false
                            // Call fail function
                            fail( createPlayerSucessed );
                        }else{
                            sucess( );
                        }
                    }
                }).fail( failCommunication );
  
     },
     
     "setPlayerScore" : function setPlayerScore ( userName , playerScore, sucess , fail , failCommunication){
                $.post('libraries/scoreoid_proxy.php', {action:'curl_request', 
                                                                            method:'createScore',
                                                                            username: userName, 
                                                                            score : playerScore,  
                                                                            response:'JSON'}).done(
                function(data) { 
                    if ( data == undefined || data ==""){
                        failCommunication(); 
                    }else{
                        // console.log("Data Loaded: " , data);
                        var dataJSON =  JSON.parse(data);
                        
                        var error = dataJSON.error;
                        
                        if ( error ){ // Return true or false
                            // Call fail function
                            fail( error );
                        }else{
                            sucess();
                        }
                    }
                }).fail( failCommunication );
     },
     
     "topPlayers" : function topPlayers ( sucess , fail , failCommunication ){
            $.post('libraries/scoreoid_proxy.php', {action:'curl_request', 
                                                                        method:'getBestScores',
                                                                        order_by : 'score', 
                                                                        order : 'desc', limit : 10, 
                                                                        response:'JSON'}).done(
                function(data) { 
                    if ( data == undefined || data ==""){
                        failCommunication(); 
                    }else{
                        // console.log("Data Loaded: " , data);
                        var dataJSON =  JSON.parse(data);
                        
                        var error = dataJSON.error;
                        
                        if ( error ){ // Return true or false
                            // Call fail function
                            fail( error );
                        }else{
                            console.log('Top 10 : ',data.Player);
                            $.each($.parseJSON(data), function(index, element) {
                                 console.log('element' , element.Player.username , '- Score:', element.Score.score);
                            });
                            sucess( dataJSON );
                        }
                    }
                }).fail( failCommunication );
     },
     
     "getPlayerRank" : function getPlayerRank ( playerName , sucess , fail , failCommunication ){
            $.post('libraries/scoreoid_proxy.php', {action:'curl_request', 
                                                                        method:'getPlayerRank',
                                                                        username : playerName,
                                                                        response:'JSON'}).done(
                function(data) { 
                    if ( data == undefined || data ==""){
                        failCommunication(); 
                    }else{
                        // console.log("Data Loaded: " , data);
                        var dataJSON =  JSON.parse(data);
                        
                        var error = dataJSON.error;
                        
                        if ( error ){ // Return true or false
                            // Call fail function
                            fail( error );
                        }else{
                            console.log('Rank for ' , playerName , ' rank :' , dataJSON.rank);
                            
                            sucess( dataJSON.rank );
                        }
                    }
                }).fail( failCommunication );
     }     
     
}); //End adsGame.Score


