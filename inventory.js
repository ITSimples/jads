/*
 * Aventura do saber, a fantasy action RPG
 * Copyright (C) 2012  ITSimples - Francisco Fernandes
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
		this.slotsMap = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
		
		//Comment on inventory
		this.invComment = 'Inventario Vazio.';
		
		// Create html in inventoryLayer DIV
		var $messageBoxHtml = (	'<img class="invImage" src="" alt="">' +
								'<div class="invText"></div>' +
								'<div class="invComment"></div>' +
								'<div id="Slot01"><img class="invSlot01" src="content/gui/32x32Trans.png" /></div>' + 
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
								'<div class="infValue"></div>');
		
		$('#itemInfLayer').append($infItemBoxHtml);
		
		
		console.log('Init inventory class...');
	},
	"show" : function show() {
	
		if (!this.isShowing){	
			//Disable event drop on game window
			this.eventDrop(true);
						
			//Heroe face
			$('.invImage').attr({
			'src' : 'content/sprites/h_male01_face.png',
			'alt' : 'Testing...'});
			
			// Inventory name
			$('.invText,#hiddenText').html('Inventario');
			
			// Show invComment
			if (fullInventory){
				this.invComment = 'Inventario cheio.';
			}
			$('.invComment,#hiddenText').html(this.invComment);
			
			// Show inventory window with a fade
			$('#inventoryLayer').fadeIn( 250, function() {
				$('.msgText').scrollTop(0);
			});
		
			this.isShowing = true;
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
	
			var box = document.getElementById('adsGame');
			
			if (!enable){
				box.removeEventListener('dragover',function(e){e.preventDefault()}, false);
				box.removeEventListener('drop',this.dropped, false);
			}else{
				box.addEventListener('dragover',function(e){e.preventDefault()}, false);
				box.addEventListener('drop',this.dropped, false);
			}
	},
	
	"removeItem" : function removeItem( slot , itemTarget ) {
		// itemTarget have two options "drop" and "use"
		
		// slot variable return 'Slot0*' substr function return the last character * like 0,1 the slot dropped
		var itemIndex = ( parseInt(slot.substr(slot.length - 1)) - 1);
		
		// Make this slot available
		this.slotsMap[ itemIndex ] = -1
		
		// Mask the removed item with a transparent image
		$( '.inv' + slot ).attr({
			'src' : 'content/gui/32x32Trans.png',
			'alt' : ''});
		
		
		if (itemTarget == 'use'){
			console.log (' Use this item...');
			me.game.HUD.updateItemValue(heroeItems[itemIndex].categoria, (parseInt(heroeItems[itemIndex].valor)));
				//hide item information because on leave with mouse the item info doesn't dissapear
			$('#itemInfLayer').hide();
		}
		
		
		//The heroe drop one 
		fullInventory = false;
		
		//Delete item from heroeItems array
		// console.log(heroeItems.splice(itemIndex,1));
		
		// Empty item from heroeItems array
		heroeItems[itemIndex] = [];
		
		console.log ('Test after remove item. heroeItems:');
		$.each(heroeItems , function (i, heroeItem) {
			console.log ('heroeItem[' + i + ']: ' + heroeItem.nome);
		});
			
		// Reset inComment
		this.invComment = '';
		$('.invComment,#hiddenText').html(this.invComment);
		
		//Call removeEvents for this slot (itemIndex + 1 is the slot number)
		this.eventListener('remove', itemIndex + 1 );
	},
	
	"addItem" : function addItem( item ) {
		// Check empty slots - if no empty slots then return -1
		this.slotNumber = jQuery.inArray(-1, this.slotsMap);

		if (this.slotNumber != -1) {
			// Add the new item to heroeItems data
			heroeItems[this.slotNumber] = item;
			
			//The data slot in the position of new item keep the number of the item index in the array
			this.slotsMap[this.slotNumber] = ( item.itemIndex );
		
			//Show item in the inventory slot
			$( '.invSlot0' + ( this.slotNumber + 1 ) ).attr({
			'src' : 'content/sprites/items/' + item.imagem,
			'alt' : ''});

			this.eventListener ('add' , this.slotNumber + 1);
			
			//*** IMPROVE - Update invComment

			this.invComment = "Duplo-click usar";
			$('.invComment,#hiddenText').html(this.invComment);
			
			// Test again if slots are full after add new item
			this.slotNumber = jQuery.inArray( -1 , this.slotsMap);
			
			if (this.slotNumber == -1) {
				//*** IMPROVE - Update invComment
				this.invComment = 'Inventario cheio.';
				$('.invComment,#hiddenText').html(this.invComment);
				fullInventory = true; 
			}
			
			console.log ('Test heroeItems:');
			$.each(heroeItems , function (i, heroeItem) {
				console.log ('heroeItem[' + i + ']: ' + heroeItem.nome);
			});
		}
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
		var slot = e.dataTransfer.getData('text')
		console.log('Item drop out...' + slot);
		adsGame.Inventory.removeItem(slot);
	},
	
	"itemInformation" : function itemInformation( e, slot ){
		
		// slot variable return 'Slot0*' substr function return the last character * like 0,1 the slot dropped
		var itemIndex = ( parseInt(slot.substr(slot.length - 1)) - 1);
		
		this.invComment = heroeItems[itemIndex].nome;
		$('.invComment,#hiddenText').html(this.invComment);
		 
		
		// Show inventory window with a fade
		$('.infName').html( heroeItems[itemIndex].nome + ':' );
		$('.infDesc').html( heroeItems[itemIndex].descricao );
		
		// select information value color		
		var infValueColor;
		switch (heroeItems[itemIndex].categoria)
		{
			case 'vida': infValueColor = hudColorLive;
						break;
			case 'forca': infValueColor = hudColorStrength;
						break;

			case 'velocidade': infValueColor = hudColorVelocity;
						break;
							
			case 'conhecimento': infValueColor = hudColorKnowledge;
						break;
			
			case 'sorte': infValueColor = hudColorLucky;
						break;
							
			default:  infValueColor = "white";
		}	
		
		$('.infValue').css("color", infValueColor);
		$('.infValue').html( '+' + heroeItems[itemIndex].valor + ' ' +  heroeItems[itemIndex].categoria );
		$('#itemInfLayer').show();
		$('#itemInfLayer').offset({left:(e.pageX - 260),top:(e.pageY + 10)});
	},

	"eventListener" : function eventListener( option , slotNumber){
		// Get two options "remove" and "add"

		// var box = document.getElementById('adsGame');
		var box = $("#adsGame");

		var slot = $("#Slot0" + slotNumber );
		
		// var slot = $("#Slot01");

		if ( option == 'remove'){
			box.unbind();
			slot.unbind();

		} else if ( option == 'add' ) {

			
			if (box != "undefined") {
				box.bind('dragover',function(e){e.preventDefault()});
				box.bind('drop',this.dropped);
			}

			if (slot != "undefined") {
				// Drag and Drop event
				slot.bind("dragstart",this.dragStart);
				
				//Use item with double click
				slot.bind('dblclick' , function () { 
					adsGame.Inventory.removeItem( 'Slot0' + slotNumber , 'use' ); 
				});

				
				 // Mouse enter and leave to show item information
				slot.mouseenter(function(e) {
					adsGame.Inventory.itemInformation( e, 'Slot0' + slotNumber); 
				}).mouseleave(function() {
					$('#itemInfLayer').hide();
				});

			}
		}
	}
 });