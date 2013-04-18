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
 * message.
 * @class
 * @extends 
 * @constructor
 * @param msgData (.msgImage, .msgName, .msg)
 * @example
 * 
 */
 
adsGame.message =  Object.extend({
	"init" : function init() {
		this.messageShowing = false;
		
		// Create html in messagelayer DIV
		var $messageBoxHtml = ('<img class="msgImage" src="" alt="">' +
			'<div class="titleText"></div>' +
			'<div class="msgText"></div>');
			
		$('#messageLayer').append($messageBoxHtml);
		
		console.log('Init message class...');
	},
	"show": function show(msgData) {
			if (!this.messageShowing){
			
				// If item them resize image to 64x64
				
				//Fill fields from question box with msgData
				$('.msgImage').attr({
				'src' : 'content/' + msgData.msgImage,
				'alt' : 'Testing...',
				'height' : '48px',
				'width' : '48px'
				});
				
				$('.titleText,#hiddenText').html( msgData.msgName );
				$('.msgText,#hiddenText').html( msgData.msg );

				$('#messageLayer').fadeIn( 250, function() {
				$('.msgText').scrollTop(0);
				});


				console.log("Show message...");
				this.messageShowing = true;
			}
	},
		
	"hide": function hide() {
		if (this.messageShowing){
			$('#messageLayer').fadeOut();
	
			console.log("hide message...");
			this.messageShowing = false;
		}
	}
});

adsGame.Shop =  Object.extend({
    "init" : function init() {
        this.showingShop = false;
        
        this.buyItem = -1;
    },
    
    "show" : function show ( npcObject ){
        if ( !this.showingShop ){
            var $itemsBoxHtml = ('<img class="npcImage" src="" alt="">' + 
                                '<div class="shopName"></div>' +
                                '<div class="npcInfo"></div>' + 
                                '<div class="buy1"></div>' + 
                                '<div class="buy2"></div>' +
                                '<div class="buy3"></div>' + 
                                '<div class="buy4"></div>' + 
                                '<div class="goldValue"></div>');
                                
            $('#shopLayer').append($itemsBoxHtml);
            $('#shopLayer').fadeIn( 250 );
            
            //Show fields from question box with data
            $('.npcImage').attr({
            'src' : 'content/sprites/' + npcObject.imagem.replace(".png", "_face.png"),
            'alt' : 'Testing...' 
            });
            $('.shopName').html( npcObject.loja.nome );
            $('.npcInfo').html( npcObject.loja.bemVindo );
            
            var self = this;
            
             $.each(npcObject.loja.produtos, function(i, data){ 
                var itemNumber = i + 1;
                var itmName = ads_items_data[data.itemIndex].nome;
                var itmValue = ads_items_data[data.itemIndex].valor;
                var itmGive = ads_items_data[data.itemIndex].categoria;
                var price = data.preco;
                $('.buy' + itemNumber ).html(' (' + i + ') ' + itmName + ' + ' + itmValue + ' ' + itmGive + ' (' + price  + ' Moedas)');
             });
             
             $('.goldValue').html('O que queres comprar?');
             
            // Create event listener to get answer from player
            $(document).keyup(function(event) {
                var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
                // If correct answer return true else return false
                if (keyPressed =='0' || keyPressed =='1' || keyPressed =='2'|| keyPressed =='3'  ) {    
                    // Return player answer
                    self.buyItem =Number(keyPressed);
                }
                self.buy( npcObject.loja.produtos[self.buyItem] );
            });
            
            
            // Create a event listener to get the ansewer from the mouse 
            // $('#shopLayer  > div') same as $('#shopLayer').children("div")
            $('#shopLayer  > div').bind('click', function() {
                var buyItemNumber = this.className;
                
                // If class start with r then is a answer get the answer from player
                if (buyItemNumber.indexOf("buy") == 0){
                   
                    self.buyItem = Number(buyItemNumber.substr(3,1) -1);
                     console.log("This is a answer...", self.buyItem);
                    //Remove event listener
                    // $('#shopLayer  > div').unbind('click');
                    
                    // By item
                    self.buy( npcObject.loja.produtos[self.buyItem] );
                }
            });
            

            
            //Message box is showing - avoid call over and over again
            this.showingShop = true;
        } // Show shop only one time
    },
     "buy" : function buy( itemObject ){
         console.log("Buy Item Object:" , itemObject);
         // Get hero money
         // if there is enough money add item to inventory
         // else send a message to goldAnswer "hero doesn't have enough money"
         // If item can buy only one time check if hero already have the item send a message if yes
         // if inventory full send a message goldAnswer
         // remove the value of item in gold from hud
         // 
     }

});

