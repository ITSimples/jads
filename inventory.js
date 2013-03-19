/*
 * Aventura do Saber , a educational fantasy action RPG
 * Copyright (C) 2012  Francisco Fernandes - ITSimples.com
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
		// -1 => Normal Item
		// -2 => Special Item
		this.slotsMap = [-1,-1,-1,-1,-1,-1,-2,-2,-2];
		
		//Comment on inventory
		this.invComment = " 'I' Esconder invent�rio.";
		
		// Special items name
		// Improve - Make this multilingual
		this.specialItemsStr = "Items Especiais";
		
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
		
		// slot variable return 'Slot0*' substr function return the last character * like 0,1 the slot dropped
		var itemIndex = ( parseInt(slot.substr(slot.length - 1)) - 1);
		
		// Make this slot available
		if (!heroItems[itemIndex].specialItem){
			this.slotsMap[ itemIndex ] = -1;
			//The hero use or drop one normal item
			fullInventory = false;
		}else{
			this.slotsMap[ itemIndex ] = -2;
		}
		
		// Mask the removed item with a transparent image
		$( '.inv' + slot ).attr({
			'src' : 'content/gui/32x32Trans.png',
			'alt' : ''});
		
		
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
			console.log ('Special item...', item.valor);
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
			this.invComment = "Parab�ns novo item.";
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

			$('.invComment').html('Item da miss�o, n�o pode ser destruido.');
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
					  itemInfUse = 'N�o podes usar nem destruir';
					  // If mission item then change value 
					  iteminfValue= "Item da miss�o.";
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
								this.invComment = 'Supera o m�ximo de vida. N�o podes usar.';
								$('.invComment').css("color", hudColorLive);
								$('.invComment,#hiddenText').html(this.invComment);
							}
							console.log('Vida:' , me.game.HUD.getItemValue(itemCategory));
						});
					}
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