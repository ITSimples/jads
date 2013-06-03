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
        this.invComment = " 'I' " + language.system.TRinvHide;
        
        // Special items name
        this.specialItemsStr = language.system.TRinvSpecialItems;
        
        // Active weapon on inventory
        this.activeWeapon = false;
        
        // Create html in inventoryLayer DIV
        var $messageBoxHtml = ( '<img class="invImage" src="" alt="">' +
                                '<div class="invText"></div>' +
                                '<div class="invSpecialItems"></div>' +                             
                                '<div class="invComment"></div>' +
                                '<div id="Slot01"><span class="textslotnormal"></span><img class="invSlot01" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot02"><span class="textslotnormal"></span><img class="invSlot02" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot03"><span class="textslotnormal"></span><img class="invSlot03" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot04"><span class="textslotnormal"></span><img class="invSlot04" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot05"><span class="textslotnormal"></span><img class="invSlot05" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot06"><span class="textslotnormal"></span><img class="invSlot06" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot07"><span class="textslot"></span><img class="invSlot07" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot08"><span class="textslot"></span><img class="invSlot08" src="content/gui/32x32Trans.png"/></div>' + 
                                '<div id="Slot09"><span class="textslot"></span><img class="invSlot09" src="content/gui/32x32Trans.png"/></div>');
        
        // attach to inventoryLayer
        $('#inventoryLayer').append($messageBoxHtml);
        
        // Create html in itemInfLayer DIV
        var $infItemBoxHtml = ( '<div class="infName"></div>' +
                                '<div class="infDesc"></div>' +
                                '<div class="infValue"></div>'+
                                '<div class="infUse"></div>');
                                
        
        $('#itemInfLayer').append($infItemBoxHtml);     
        
        console.log('Init inventory class...');
    },
    
    "show" : function show() {
    
        if (!this.isShowing){   
            // play a "openingwindows" sound
            me.audio.play("openingwindows");
            
            //Disable event drop on game window
            this.eventDrop(true);
                        
            //Hero face
            $('.invImage').attr({
            'src' : 'content/sprites/h_male01_face.png',
            'alt' : 'Testing...'});
            
            // Inventory name
            $('.invText').html( language.system.TRinvName );
            
            // Show invComment
            if (fullInventory){
                this.invComment = language.system.TRinvFull;
            }
            
            $('.invComment').html( this.invComment );
            
            $('.invSpecialItems').html( this.specialItemsStr );
            
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
            
            // play a "closingwindows" sound
            me.audio.play("closingwindows");
            
            // console.log("hide inventory...");
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
        
        // Create slot text                           
        var htmlSlotGroup = $("#" + slot + " span");
        
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
        // DEBUG 
        console.log("this.slotsMap before:", this.slotsMap);
        
        // If option is to use the item
        var itemCategory = heroItems[itemIndex].categoria;
        var itemValue = heroItems[itemIndex].valor;
            
        if (itemTarget == 'use'){
            // console.log (' Use this item...');
            
            me.game.HUD.updateItemValue(itemCategory,  parseInt(itemValue));
            //hide item information because on leave with mouse the item info doesn't dissapear
            $('#itemInfLayer').hide();
            
        }else // If removed item is velocity or lucky then update Hud to remove hud points
        {
            if ( itemCategory == 'velocidade' || itemCategory == 'sorte' ){
                me.game.HUD.updateItemValue(itemCategory,  -(parseInt(itemValue)) );
            }
        }
            
        // TODO - Remove only if there is only one item else remove on groupSize
        if ( heroItems[itemIndex].groupSize == 1 || itemIndex > 5  ){
            // console.log( "There is only one item on slot....");      
            // Make this slot available
            // if (!heroItems[itemIndex].specialItem){
           
           // DEBUG - If item index <6 normal item and > 5 special item
           if ( itemIndex < 6 ){
                this.slotsMap[ itemIndex ] = -1;
                //The hero use or drop one normal item
                fullInventory = false;
            }else{
                this.slotsMap[ itemIndex ] = -2;
                specialItemfullInventory = false;
            }
            
            // DEBUG 
            // console.log("this.slotsMap after:", this.slotsMap);
            
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
            
            //Delete item from heroItems array
            // console.log(heroItems.splice(itemIndex,1));

            // Empty item from heroItems array
            heroItems[itemIndex] = [];
            // Reset inComment
            this.invComment = '';
            $('.invComment').html(this.invComment);
            
            //Call removeEvents for this slot (itemIndex + 1 is the slot number)
            this.eventListener('remove', itemIndex + 1 );
            
            // Update text remove number of items
            htmlSlotGroup.text('');
                
            // console.log ('Test after remove item. heroItems:');
            
            // $.each(heroItems , function (i, heroItem) {
                // console.log ('heroItem[' + i + ']: ' + heroItem.nome);
            // });
        }else{
            // console.log( "There is more than one item on slot....");
            
            heroItems[itemIndex].groupSize--;
            
            // Update text
            htmlSlotGroup.text( heroItems[itemIndex].groupSize );
        }
    },
    
    "itemExists" : function ( item ) {
        
        // Method to test if a item exits on inventory - Return index of slot item or -1 don't exists
        // Count items of the same group
        var itemGroupIndex = -1;
        
        // TODO - Test limits here return -1 if limits exedes
        $.each(heroItems, function(i,data){
                // check each item on inventory if the new one is the same group
                if ( data !== undefined){
                    if ( data.itemIndex == item.itemIndex ){
                        //Get index of the first slot where is the same item group
                        if (itemGroupIndex == -1){
                            itemGroupIndex = parseInt ( i );
                        }
                    }
                }
        });
        
        if ( itemGroupIndex != -1 && typeof heroItems[itemGroupIndex] !== "undefined" && heroItems[itemGroupIndex].groupSize > 8 ){           
            // console.log("Max items on group...");
            // Reset inComment
            this.invComment = language.system.TRinvSlotFull;
            $('.invComment').html( this.invComment );
            itemGroupIndex = -2;
        }
        
        return itemGroupIndex;
    },
    
    "addItem" : function addItem( item ) {
        //Test if is a special item
        if (typeof item.specialItem !== 'undefined') {
            // console.log ('Special item...', item);
            // Check empty slots - if no empty slots then return -1
            this.slotNumber = jQuery.inArray(-2, this.slotsMap);
            
            if ( this.slotNumber == -1 ) {
                specialItemfullInventory = true; 
            }else{
                specialItemfullInventory = false; 
            }
            
            // console.log ("Special Item :", this.slotNumber );
            
            // if this special item is a weapon then call method on hero class to create a thrower that follow hero
            if (item.subcategoria === "weapon"){
                var player = adsGame.heroEntity();
                
                player.createWeapon( item );
                // console.log("This item is a weapon... !!! WATCH OUT !!! On slot " , this.slotNumber);
                heroWeaponSlot = this.slotNumber + 1 ; // plus one because html div slot**
            }
            
            // Add the new item to heroItems data
            heroItems[this.slotNumber] = item;
        }else{
            // Test if item type already exists on inventory
            var itemGroupIndex = this.itemExists( item );
            
            if ( itemGroupIndex != -1 && itemGroupIndex != -2){
                // console.log("There is more items of this kind...");

                heroItems[itemGroupIndex].groupSize++;
                
                var slotStr = itemGroupIndex + 1;
                // Create slot text                           
                var htmlSlotGroup = $( "#Slot0" + String( slotStr  ) + " span");
                
                // Update text
                htmlSlotGroup.text( heroItems[itemGroupIndex].groupSize );
            
                // Don't add item only add one more to the same slot
                return;
                                
            }else  if ( itemGroupIndex == -2){
                    return;
            }else{
                // console.log("This is the first one item of this kind...");
                // Check empty slots - if no empty slots then return -1
                this.slotNumber = jQuery.inArray(-1, this.slotsMap);     
                
                // Add the new item to heroItems data
                heroItems[this.slotNumber] = item;
                
                heroItems[this.slotNumber].groupSize = 1;
                
                // Create slot text                           
                var htmlSlotGroup = $( "#Slot0" + String( this.slotNumber + 1  ) + " span");
                
                // Update text
                htmlSlotGroup.text( heroItems[this.slotNumber].groupSize );                
            }
        }
             
        //The data slot in the position of new item keep the number of the item index in the array
        this.slotsMap[this.slotNumber] = ( item.itemIndex );
    
        //Show item in the inventory slot
        $( '.invSlot0' + ( this.slotNumber + 1 ) ).attr({
        'src' : 'content/sprites/items/' + item.imagem,
        'alt' : ''});

        // Add events for the new item 
        this.eventListener ('add' , this.slotNumber + 1);
        
        //*** IMPROVE - Update invComment
        this.invComment = language.system.TRinvNewItem;
        $('.invComment').html(this.invComment);
        
        // If added item is velocity or lucky update Hud 
        if ( item.categoria == 'velocidade' || item.categoria == 'sorte' ){
            me.game.HUD.updateItemValue(item.categoria,  (parseInt(item.valor)) );
        }
        
        // Test again if slots are full after add new item
        this.slotNumber = jQuery.inArray( -1 , this.slotsMap);
        
        if ( this.slotNumber == -1 ) {
            //*** IMPROVE - Update invComment
            this.invComment = language.system.TRinvFull;
            $('.invComment').html(this.invComment);
            fullInventory = true; 
        }
        
        // Test slots empty for special items
        var testSpecialItem = jQuery.inArray( -2 , this.slotsMap);
        
        if ( testSpecialItem == -1 ) {
            //*** IMPROVE - Update invComment
            this.invComment = language.system.TRinvFull;
            $('.invComment,#hiddenText').html(this.invComment);
            specialItemfullInventory = true; 
        }else{
            specialItemfullInventory = false; 
        }
    },
    
    "dragStart" : function dragStart(e){
        var value = e.currentTarget.id;
        console.log(value);
        e.originalEvent.dataTransfer.setData('text',value);
        
        //hide item information because on leave with mouse the item info doesn't dissapear
        $('#itemInfLayer').hide();
        
        // console.log('..drag start...' );
    },
    
    "dropped" : function dropped(e){
        e.preventDefault();
        var slot = e.originalEvent.dataTransfer.getData('text')
        console.log('Item drop out...' + slot);
        // If item is not dragable then dont return slot data return image to avoid error
        if ( slot.indexOf("Slot") >= 0){ // Remove Item - check if Slot string is in slot variable
            adsGame.Inventory.removeItem(slot);

            $('.invComment').html( language.system.TRinvDestroyItem );
        }else{ // Item not removed

            $('.invComment').html( language.system.TRinvDestroyMissionItem );
        }
    },
    
    "itemInformation" : function itemInformation( e, slot ){
        
        // slot variable return 'Slot0*' substr function return the last character * like 0,1 the slot dropped
        var itemIndex = ( parseInt(slot.substr(slot.length - 1)) - 1);
        
        // this.invComment = heroItems[itemIndex].nome;
        // $('.invComment,#hiddenText').html(this.invComment);
        
        // Show inventory window with a fade
        $('.infName').html( language.items[heroItems[itemIndex].nome] + ':' );
        $('.infDesc').html( language.items[heroItems[itemIndex].descricao] );
        
        var itemInfUse;
        
        var iteminfValue = '+' + heroItems[itemIndex].valor + ' ' +  language.items[heroItems[itemIndex].categoriaDesc];
        
        // select information value color       
        var infValueColor;
        switch (heroItems[itemIndex].categoria)
        {
            case 'vida': infValueColor = hudColorLive;
                        itemInfUse  = language.system.TRinvItemInfUse;
                        break;

            case 'velocidade': infValueColor = hudColorVelocity;
                        itemInfUse   = language.system.TRinvItemDestroyVelocity;
                        break;
            
            case 'sorte': infValueColor = hudColorLucky;
                        itemInfUse = language.system.TRinvItemDestroyLucky;
                        break;          
            default:  infValueColor = "white"; // Mission items
                      // If special item is a weapon then the message to hero is different
                      if ( heroItems[itemIndex].subcategoria !== undefined && heroItems[itemIndex].subcategoria  == "weapon"){
                           // If mission item then change value 
                           iteminfValue= language.system.TRinvItemWeaponInf;
                           
                           itemInfUse = language.system.TRinvItemWeaponUse;                          
                      }else{
                           itemInfUse = "";
                           // If mission item then change value 
                           iteminfValue= language.system.TRinvDestroyMissionItem;
                      }
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
                            if ( (me.game.HUD.getItemValue(itemCategory) + itemValue) <= heroHealth ){//maxHudValue['live']){
                                // play a "heroeat" sound
                                me.audio.play("heroeat");

                                adsGame.Inventory.removeItem( 'Slot0' + slotNumber , 'use' );
                            }else {
                                this.invComment = language.system.TRinvItemMaxHealth;
                                $('.invComment').css("color", hudColorLive);
                                $('.invComment').html(this.invComment);
                            }                            
                            
                            // console.log('Vida:' , me.game.HUD.getItemValue(itemCategory));
                        });
                    }
                }else{
                    slot.bind('click' , function () {
                        if ( typeof heroItems[slotNumber - 1].subcategoria != "undefined" && heroItems[slotNumber - 1].subcategoria == "weapon")
                        {    
                            // console.log("Special Item weapon:" , heroItems[slotNumber - 1]);                           
                            
                            // If weapon enable then disable -- if disable then enable
                            if (this.activeWeapon && heroWeaponEnable) 
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