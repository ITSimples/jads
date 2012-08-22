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
								'<img class="invSlot01"/>' + 
								'<img class="invSlot02"/>' + 
								'<img class="invSlot03"/>' + 
								'<img class="invSlot04"/>' + 
								'<img class="invSlot05"/>' + 
								'<img class="invSlot06"/>' + 
								'<img class="invSlot07"/>' + 
								'<img class="invSlot08"/>' + 
								'<img class="invSlot09"/>');
		
		// attach to inventoryLayer
		$('#inventoryLayer').append($messageBoxHtml);
		
		console.log('Init inventory class...');
		
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
	"remove" : function remove() {
			
	},
	"add" : function add( item ) {		
		// Check empty slots - if no empty slots then warning player
		this.slotNumber = jQuery.inArray(-1, this.slotsMap);

		if (this.slotNumber != -1) {
			//Keep data for all items found by the heroe
			heroeItems.push( item );
			
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
			console.log (this.slotNumber);
			if (this.slotNumber == -1) {
				//*** IMPROVE - Update invComment
				console.log('Inventory full...');
				this.invComment = 'Inventario cheio.';
				$('.invComment,#hiddenText').html(this.invComment);
				fullInventory = true;
			}
		}
	},
	"use" : function use() {
			
	}
 });