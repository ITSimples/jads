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

