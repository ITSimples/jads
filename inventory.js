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
		
		// Create html in inventoryLayer DIV
		var $messageBoxHtml = (	'<img class="invImage" src="" alt="">' +
								'<div class="invText"></div>' +
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
			
			// Test item on slot
			for ( x = 1 ; x < 10 ; x++)
			{
				$('.invSlot0' + x ).attr({
				'src' : 'content/sprites/items/vegetais.png',
				'alt' : 'Testing...'});
			}
			// Show inventory window with a fade
			$('#inventoryLayer').fadeIn( 250, function() {
				$('.msgText').scrollTop(0);
			});

			console.log("Show inventory...");
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
	"add" : function add() {
			
	},
	"use" : function use() {
			
	}
 });