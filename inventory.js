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
								'<span id="Slot01"><img class="invSlot01" src="content/gui/32x32Trans.png" /></span>' + 
								'<span id="Slot02"><img class="invSlot02" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot03"><img class="invSlot03" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot04"><img class="invSlot04" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot05"><img class="invSlot05" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot06"><img class="invSlot06" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot07"><img class="invSlot07" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot08"><img class="invSlot08" src="content/gui/32x32Trans.png"/></span>' + 
								'<span id="Slot09"><img class="invSlot09" src="content/gui/32x32Trans.png"/></span>');
		
		// attach to inventoryLayer
		$('#inventoryLayer').append($messageBoxHtml);
		
		console.log('Init inventory class...');
		
		//TESTING Drag and drop
		this.itemDND();
	},
	"show" : function show() {
		

		
		if (!this.isShowing){
		
			//Heroe face
			$('.invImage').attr({
			'src' : 'content/sprites/h_male01_face.png',
			'alt' : 'Testing...'});
			
			// Inventory name
			$('.invText,#hiddenText').html('Inventario');
			
			// Show invComment
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
		}	
	},
	"removeItem" : function removeItem( slot ) {
		var itemIndex = parseInt(slot.substr(slot.length - 1));
		this.slotsMap[ itemIndex - 1 ] = -1
		$( '.inv' + slot ).attr({
			'src' : 'content/gui/32x32Trans.png',
			'alt' : ''});
			
		// heroeItems.splice((this.slotNumber - 1),1);
		
		$.each( heroeItems , function(i,heroeItem){
			if (heroeItem.slotNumber == (itemIndex - 1) ){
				console.log('Delete this item.');
				heroeItems.splice(i,1);
				return
			}
		});
	},
	
	"addItem" : function addItem( item ) {		
		// Check empty slots - if no empty slots then warning player
		this.slotNumber = jQuery.inArray(-1, this.slotsMap);
		
	
		if (this.slotNumber != -1) {
			//Keep data for all items found by the heroe
			item.slotNumber = this.slotNumber;
			heroeItems.push(item);

			//This slot is full now
			this.slotsMap[this.slotNumber] = ( item.itemIndex );
			console.log(' slotNumber : ' +  this.slotNumber );
			console.log(' Insert item on inventory: ' +  ads_items_data[this.slotsMap[this.slotNumber]].nome );
			console.log(' this.slotsMap[this.slotNumber] : ' + this.slotsMap[this.slotNumber] );
			//Show item in inventory
			$( '.invSlot0' + ( this.slotNumber + 1 ) ).attr({
			'src' : 'content/sprites/items/' + item.imagem,
			'alt' : ''});

			//*** IMPROVE - Update invComment
			this.invComment = ads_items_data[this.slotsMap[this.slotNumber]].nome;
			$('.invComment,#hiddenText').html(this.invComment);
			
			// Test again if slots are full after add new item
			this.slotNumber = jQuery.inArray( -1 , this.slotsMap);
			
			
			if (this.slotNumber == -1) {
				//*** IMPROVE - Update invComment
				console.log('Inventory full...');
				this.invComment = 'Inventario cheio.';
				$('.invComment,#hiddenText').html(this.invComment);
				fullInventory = true;
			}
		}
	},
	"itemDND" : function itemDND() {
			var box = document.getElementById('adsGame');
			var slot =[];
			for(var i=0; i < 9; i++){
				slot[i] = document.getElementById('Slot0' + ( i + 1 ));
				slot[i].addEventListener('dragstart',this.dragStart, false);
			}
			box.addEventListener('dragover',function(e){e.preventDefault()}, false);
			box.addEventListener('drop',this.dropped, false);
	},
	
	"dragStart" : function dragStart(e){
		var value=e.currentTarget.id;
		e.dataTransfer.setData('text',value);
		console.log('..drag start...' );
	},
	
	"dropped" : function dropped(e){
		e.preventDefault();
		var slot = e.dataTransfer.getData('text')
		console.log('Item drop out...' + slot);
		adsGame.Inventory.removeItem(slot);
	}
 });