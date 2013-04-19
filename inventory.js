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
 * inventory.
 * @class
 * @extends 
 * @constructor
 * @param
 * @example
 */
 
 adsGame.Inventory =  Object.extend({
	"init" : function init() {
		// initialize variable to check if inventory is showing
		this.isShowing = false;
		
		//Check the empty slots - Set to the first
		this.slotNumber = 0;
		
		//Map of slots -1 - empty  index of ads_items_data  full
		// -1 => Normal Item
		// -2 => Special Item
		this.slotsMap = [-1,-1,-1,-1,-1,-1,-2,-2,-2];
		
		//Comment on inventory
		this.invComment = " 'I' Esconder inventário.";
		
		// Special items name
		// Improve - Make this multilingual
		this.specialItemsStr = "Items Especiais";
		
		// Active weapon on inventory
		this.activeWeapon = false;
		
		// Create html in inventoryLayer DIV
		var $messageBoxHtml = (	'<img class="invImage" src="" alt="">' +
								'<div class="invText"></div>' +
								'<div class="invSpecialItems"></div>' +								
								'<div class="invComment"></div>' +
								'<div id="Slot01"><img class="invSlot01" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot02"><img class="invSlot02" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot03"><img class="invSlot03" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot04"><img class="invSlot04" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot05"><img class="invSlot05" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot06"><img class="invSlot06" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot07"><img class="invSlot07" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot08"><img class="invSlot08" src="content/gui/32x32Trans.png"/></div>' + 
								'<div id="Slot09"><img class="invSlot09" src="content/gui/32x32Trans.png"/></div>');
		
		// attach to inventoryLayer
		$('#inventoryLayer').append($messageBoxHtml);
		
		// Create html in itemInfLayer DIV
		var $infItemBoxHtml = (	'<div class="infName"></div>' +
								'<div class="infDesc"></div>' +
								'<div class="infValue"></div>'+
								'<div class="infUse"></div>');
								
		
		$('#itemInfLayer').append($infItemBoxHtml);
		
		
		console.log('Init inventory class...');
	},
	"show" : function show() {
	
		if (!this.isShowing){	
			//Disable event drop on game window
			this.eventDrop(true);
						
			//Hero face
			$('.invImage').attr({
			'src' : 'content/sprites/h_male01_face.png',
			'alt' : 'Testing...'});
			
			// Inventory name
			$('.invText,#hiddenText').html('Inventario');
			
			// Show invComment
			if (fullInventory){
				this.invComment = 'Inventario cheio. Remove um item.';
			}
			
			$('.invComment,#hiddenText').html(this.invComment);
			
			$('.invSpecialItems,#hiddenText').html(this.specialItemsStr);
			
			// Show inventory window with a fade
			$('#inventoryLayer').fadeIn( 250, function() {
				$('.msgText').scrollTop(0);
			});
		
			this.isShowing = true;
			
			// Set inventory key I when inventory is open without I key
			// Set isShowInv to true in hero to avoid double pressed key I 
			var player = adsGame.heroEntity();
			player.isShowInv = true;
			player = undefined;
			}
	},
	"hide" : function hide() {
		if (this.isShowing){
			$('#inventoryLayer').fadeOut();
	
			console.log("hide inventory...");
			this.isShowing = false;
			//Disable event drop on game window
			this.eventDrop(false);
		}
	},
	
	//Enable/Disable event drop on game window
	"eventDrop" : function eventDrop( enable ) {
	
			var box = $("#adsGame");
			
			if (!enable){
				box.unbind();
			}else{
				box.bind('dragover',function(e){e.preventDefault()});
				box.bind('drop',this.dropped);
			}
	},
	
	"removeItem" : function removeItem( slot , itemTarget ) {
		// itemTarget have two options "drop" and "use"
		
		// Variable to get the index number of inventory
		var itemIndex = null;
		
		// If the varible slot of function isn't begin with "Slot" then the function is receiving the item index name
		if ( slot.substr( 0 , 4) !== "Slot" ){
		    // Find a index in heroItems for name index of item to remove
            $.each(heroItems, function(i,data)
            {
                if (typeof data != "undefined"){                    
                    if ( data.itemIndex == slot){
                        itemIndex = parseInt( i , 10);
                    }
                }
            });
		}else{
            // slot variable return 'Slot0*' substr function return the last character * like 0,1 the slot dropped
            itemIndex = ( parseInt(slot.substr(slot.length - 1)) - 1);		    
		}

		// Make this slot available
		if (!heroItems[itemIndex].specialItem){
			this.slotsMap[ itemIndex ] = -1;
			//The hero use or drop one normal item
			fullInventory = false;
		}else{
			this.slotsMap[ itemIndex ] = -2;
		}
		
		// Mask the removed item with a transparent image
		var htmlSlot = ".invSlot0" + ( itemIndex + 1 ).toString(); 
		$( htmlSlot  ).attr({
			'src' : 'content/gui/32x32Trans.png',
			'alt' : ''});

        // Remove square if exists
         $( htmlSlot ).css({
            'border-width': '', /*Add 1px solid border, use any color you want*/
            'border-style': '', /*Add a background color to the box*/
            'border-color':'' /*Align the text to the center*/
        });			

		// If option is to use the item
		var itemCategory = heroItems[itemIndex].categoria;
		var itemValue = heroItems[itemIndex].valor;
			
		if (itemTarget == 'use'){
			console.log (' Use this item...');
	
			me.game.HUD.updateItemValue(itemCategory,  parseInt(itemValue));
			//hide item information because on leave with mouse the item info doesn't dissapear
			$('#itemInfLayer').hide();
			
		}else // If removed item is velocity or lucky then update Hud to remove hud points
		{
			if ( itemCategory == 'velocidade' || itemCategory == 'sorte' ){
				me.game.HUD.updateItemValue(itemCategory,  -(parseInt(itemValue)) );
			}
		}				
		
		//Delete item from heroItems array
		// console.log(heroItems.splice(itemIndex,1));
		
		// Empty item from heroItems array
		heroItems[itemIndex] = [];
		
		// console.log ('Test after remove item. heroItems:');
		
		// $.each(heroItems , function (i, heroItem) {
			// console.log ('heroItem[' + i + ']: ' + heroItem.nome);
		// });
			
		// Reset inComment
		this.invComment = '';
		$('.invComment,#hiddenText').html(this.invComment);
		
		//Call removeEvents for this slot (itemIndex + 1 is the slot number)
		this.eventListener('remove', itemIndex + 1 );
	},
	
	"addItem" : function addItem( item ) {
		//Test if is a special item
		if (typeof item.specialItem !== 'undefined') {
			console.log ('Special item...', item);
			// Check empty slots - if no empty slots then return -1
			this.slotNumber = jQuery.inArray(-2, this.slotsMap);
			
			console.log ("Special Item :", this.slotNumber );
			
			// if this special item is a weapon then call method on hero class to create a thrower that follow hero
			if (item.subcategoria === "weapon"){
			    var player = adsGame.heroEntity();
			    
			    player.createWeapon( item );
			    console.log("This item is a weapon... !!! WATCH OUT !!!");
			}
		}else{
			// Check empty slots - if no empty slots then return -1
			this.slotNumber = jQuery.inArray(-1, this.slotsMap);
		}
		
		
		// if (this.slotNumber != -1) {
			// Add the new item to heroItems data
			heroItems[this.slotNumber] = item;
			
			$.each(heroItems, function(i,data)
			{
				console.log('heroItems[' , i , '].valor:', data);
			});
			
			
			//The data slot in the position of new item keep the number of the item index in the array
			this.slotsMap[this.slotNumber] = ( item.itemIndex );
		
			//Show item in the inventory slot
			$( '.invSlot0' + ( this.slotNumber + 1 ) ).attr({
			'src' : 'content/sprites/items/' + item.imagem,
			'alt' : ''});

			// Add events for the new item 
			this.eventListener ('add' , this.slotNumber + 1);
			
			//*** IMPROVE - Update invComment
			this.invComment = "Parabéns novo item.";
			$('.invComment,#hiddenText').html(this.invComment);
			
			// If added item is velocity or lucky update Hud 
			if ( item.categoria == 'velocidade' || item.categoria == 'sorte' ){
				me.game.HUD.updateItemValue(item.categoria,  (parseInt(item.valor)) );
			}
			
			// Test again if slots are full after add new item
			this.slotNumber = jQuery.inArray( -1 , this.slotsMap);
			
			if ( this.slotNumber == -1 ) {
				//*** IMPROVE - Update invComment
				this.invComment = 'Inventario cheio.';
				$('.invComment,#hiddenText').html(this.invComment);
				fullInventory = true; 
			}
			
			// console.log ('Test heroItems:');
			// $.each(heroItems , function (i, heroItem) {
				// console.log ('heroItem[' + i + ']: ' + heroItem.nome);
			// });
		// }
	},
	
	"dragStart" : function dragStart(e){
		var value = e.currentTarget.id;
		console.log(value);
		e.originalEvent.dataTransfer.setData('text',value);
		
		//hide item information because on leave with mouse the item info doesn't dissapear
		$('#itemInfLayer').hide();
		
		console.log('..drag start...' );
	},
	
	"dropped" : function dropped(e){
		e.preventDefault();
		var slot = e.originalEvent.dataTransfer.getData('text')
		console.log('Item drop out...' + slot);
		// If item is not dragable then dont return slot data return image to avoid error
		if ( slot.indexOf("Slot") >= 0){ // Remove Item - check if Slot string is in slot variable
			adsGame.Inventory.removeItem(slot);

			$('.invComment').html('Item destruido.');
		}else{ // Item not removed

			$('.invComment').html('Item da missão, não pode ser destruido.');
		}
	},
	
	"itemInformation" : function itemInformation( e, slot ){
		
		// slot variable return 'Slot0*' substr function return the last character * like 0,1 the slot dropped
		var itemIndex = ( parseInt(slot.substr(slot.length - 1)) - 1);
		
		// this.invComment = heroItems[itemIndex].nome;
		// $('.invComment,#hiddenText').html(this.invComment);
		 
		
		// Show inventory window with a fade
		$('.infName').html( heroItems[itemIndex].nome + ':' );
		$('.infDesc').html( heroItems[itemIndex].descricao );
		
		var itemInfUse;
		
		var iteminfValue = '+' + heroItems[itemIndex].valor + ' ' +  heroItems[itemIndex].categoria
		
		// select information value color		
		var infValueColor;
		switch (heroItems[itemIndex].categoria)
		{
			case 'vida': infValueColor = hudColorLive;
						itemInfUse  = 'Duplo click para usares.';
						break;

			case 'velocidade': infValueColor = hudColorVelocity;
						itemInfUse	 = 'Destruir retira-te velocidade.';
						break;
			
			case 'sorte': infValueColor = hudColorLucky;
						itemInfUse = 'Destruir retira-te sorte.';
						break;
							
			default:  infValueColor = "white"; // Mission items
					  itemInfUse = 'Não podes usar nem destruir';
					  // If mission item then change value 
					  iteminfValue= "Item da missão.";
		}	
			
		
		$('.infValue').css("color", infValueColor);
		$('.infValue').html( iteminfValue );
		$('.infUse').css("color", infValueColor);
		$('.infUse').html( itemInfUse );
		$('#itemInfLayer').show();
		$('#itemInfLayer').offset({left:(e.pageX - 260),top:(e.pageY + 10)});
	},

	"eventListener" : function eventListener( option , slotNumber){
		// Get two options "remove" and "add"

		var slot = $("#Slot0" + slotNumber );
		
		//Get item category and value
		var itemCategory = heroItems[slotNumber - 1].categoria;
		var itemValue = parseInt(heroItems[slotNumber - 1].valor);

		if ( option == 'remove'){
			slot.unbind();

		} else if ( option == 'add' ) {
			if (slot != "undefined") {
				// if an item mission then disable drag an drop and double click events
				if (itemCategory != 'itemMissao'){				
					// Drag and Drop event	
					slot.bind("dragstart",this.dragStart);

					//Use item with double click
					if (itemCategory == 'vida'){
						slot.bind('dblclick' , function () {
							// console.log((me.game.HUD.getItemValue(itemCategory) + itemValue) , ' < ' ,maxHudValue['live']);
							// Check if live is full
							if ( (me.game.HUD.getItemValue(itemCategory) + itemValue) <= maxHudValue['live']){
								adsGame.Inventory.removeItem( 'Slot0' + slotNumber , 'use' );
							}else {
								this.invComment = 'Supera o máximo de vida. Não podes usar.';
								$('.invComment').css("color", hudColorLive);
								$('.invComment,#hiddenText').html(this.invComment);
							}
							console.log('Vida:' , me.game.HUD.getItemValue(itemCategory));
						});
					}
				}else{
				    slot.bind('click' , function () {
				        if ( typeof heroItems[slotNumber - 1].subcategoria != "undefined" && heroItems[slotNumber - 1].subcategoria == "weapon")
				        {    
				            console.log("Special Item weapon" , heroItems[slotNumber - 1]);				           
				            
				            // If weapon enable then disable -- if disable then enable
                            if (this.activeWeapon) 
                                this.activeWeapon = false;
                            else
                                this.activeWeapon = true;

				            // Active weapon here ...
				             //Show item in the inventory slot
				             if ( this.activeWeapon ){
                                $( '.invSlot0' + slotNumber ).css({
                                    'border-width': '2px', /*Add 1px solid border, use any color you want*/
                                    'border-style': 'groove', /*Add a background color to the box*/
                                    'border-color':'red' /*Align the text to the center*/
                                });
                                // thrower must be commanded by mouse click or space and drop the bomb in hero location
                                heroWeaponEnable = true;
                            }else{                            
                                // Remove square
                                 $( '.invSlot0' + slotNumber ).css({
                                    'border-width': '', /*Add 1px solid border, use any color you want*/
                                    'border-style': '', /*Add a background color to the box*/
                                    'border-color':'' /*Align the text to the center*/
                                });
                                
                                //Thrower mouse click and space must be disabled
                                heroWeaponEnable = false;
                            }
                            
                            
				        }
				    });
				}
				
				 // Mouse enter and leave to show item information
				slot.mouseenter(function(e) {
					adsGame.Inventory.itemInformation( e, 'Slot0' + slotNumber); 
				}).mouseleave(function() {
					$('#itemInfLayer').hide();
				});

			}
		}
	},
	
	"isShowing" : this.isShowing,
 });