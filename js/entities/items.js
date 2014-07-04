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

/// *************************
// ****  Entidade Item  ****
// *************************
var ItemEntity = me.CollectableEntity.extend({
    
    //Construtor:
    init:   function (x , y , settings , items_data){
        // Chamar o contrutor
        this.parent(x, y , settings);
        // Item data
        this.items_data = items_data;
        
        if (typeof this.items_data.specialItem !== 'undefined' && this.items_data.specialItem) {
            this.specialItem = true;
        }else{
            this.specialItem = false;
        }
        
        // console.log ("Item name:", this.items_data.nome , " - Special Item:" , this.specialItem);
        
        // La
        adsQtnDataKeys = Object.keys(adsQtnData);
        countQtn = adsQtnDataKeys.length;
        
        // Random question number between 0 and number of question less one 
        // var rndQuestion = randomInt( 0 , (countQtn - 1) );

        // this.rndQtnData = adsQtnData[adsQtnDataKeys[rndQuestion]];

                
        this.rndQtnData = adsQtnData[adsQtnDataKeys[qstDone]];
        
        qstDone++;
        
        if ( qstDone == countQtn )
            qstDone = 0;
        
        this.type = 'ITEM_OBJECT';
        
        //Change animation if is a special item or not
        if (!this.specialItem) {
            // Item sparkle animation
            this.itemAnimation = new effect(
                this.pos.x - 8 , this.pos.y - 8, // Coordinates
                me.loader.getImage("sparkle"),  // Image
                40, 40, // Size
                [0,1,2,3,4,5,6,7,8,9,10,11,12,13], //Animation sheet
                30, // Speed between 0 - Slowest and 60 - fastest
                true, // Repeat animation
                100 // Wait between animations 10 milliseconds
                );
        }else{
            // Item sparkle animation
            this.itemAnimation = new effect(
                this.pos.x - 8 , this.pos.y - 8 , // Coordinates
                me.loader.getImage("questitem"),    // Image
                45, 45, // Size
                [0,1,2,3,4,5,6,7,8], //Animation sheet
                20, // Speed between 0 - Slowest and 60 - fastest
                true,
                0
                );
        }

        me.game.add(this.itemAnimation, 6);
        me.game.sort();
    },
    
    
    getItem : function ()
    {
        //When player collide with item Stop player and ask question
        var player = adsGame.heroEntity();
        
        // If the answer is correct then update HUD and remove item
        heroAnswer = showQuestionLayer(this.items_data , this.rndQtnData);
        
        if (heroAnswer != -1)
        {
            if ( heroAnswer == this.rndQtnData.correta){ // if hero correct answer          
                // me.game.HUD.updateItemValue(this.items_data.categoria, parseInt(this.items_data.valor));
                
                //Keep data for all items found by the hero less gold and knowledge increment right away
                if (this.items_data.categoria == 'ouro' ||
                    this.items_data.categoria == 'conhecimento'){
                    me.game.HUD.updateItemValue(this.items_data.categoria , parseInt(this.items_data.valor, 10));
                }else{
            
            adsGame.Inventory.addItem( this.items_data );
                }                       
                hideQuestionLayer('C');
            }else if(heroAnswer != 0){ // if hero answer to the question but it's not the correct one
                var valueRemoved = -(parseInt(this.items_data.valor,10));
                
                //If is velocity then don't remove points
                if (this.items_data.categoria != 'velocidade'){
                    if (this.items_data.categoria == 'vida'){
                        // play a "hitplayer" sound
                        me.audio.play("hithero", false , null , hitHeroVolume);
                        // let's flicker in case we loses health
                        player.renderable.flicker(25);
                    }
                    me.game.HUD.updateItemValue(this.items_data.categoria, valueRemoved);
                }   
                hideQuestionLayer('W');
            }else{ // If hero doesn't answer to the question
                hideQuestionLayer('D');
            }
            
            //If correct answer and specialitem remove item - If not special item remove always the item
            if ( (!this.specialItem) || (this.specialItem &&  heroAnswer == this.rndQtnData.correta) ){
                // Remove Item 
                me.game.remove(this);
                
                // Remove sparkle item animation
                me.game.remove(this.itemAnimation);
            }else{ 
                // If is a Special item and the answer is not the correct 
                // then position hero to last position with no collition with item
                player.pos.x = player.posBeforeCollideX;
                player.pos.y = player.posBeforeCollideY;
                
                // If remove helath then play hit sound and flicker player
                if (this.items_data.remover == 'vida'){
                    // play a "hitplayer" sound
                    me.audio.play("hithero", false , null , hitHeroVolume);
                    // let's flicker in case we loses health
                        player.renderable.flicker(25);
                }
                
                // Remove special item value    
                var valueRemoved = -(parseInt(this.items_data.quantidade,10));
                me.game.HUD.updateItemValue(this.items_data.remover, valueRemoved);
            }
        }
        
        //Destroy player variable
        player = undefined;
    }
});

// **************************************
// ****  Distribuir items pelo mapa  ****
// **************************************
//me.InvisibleEntity has been removed, as following previous changes,
//this can now be achieved using a me.ObjectEntity without a renderable component.
var ItemSpawnEntity = me.ObjectEntity.extend({
    
    //Construtor:
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.gravity = 0;
        
        var item = [];
        
        var count = 0;
        
        //Create array to store coordinates data
        var checkTriggersData = [];
        
        var checknoItemsData = [];
        
        var collision_layer = me.game.currentLevel.getLayerByName("collision");
                
            
        var background_layer = me.game.currentLevel.getLayerByName("background");
        
        //returns an array of all enumerable property names defined by a given object
        var item_keys = Object.keys(ads_items_data);
        
        //Improve this to not spwan items on triggers points
        //Triggers Points
        $.each(triggersData, function(i, data){
            // create a array to store de tiles that belong to trigger
            // create the array outside this cicle because don't repeat the same code several times'            
            var finalHeight = ( data.settings.height / 32 );
            var finalWidth  = ( data.settings.width  / 32 );
            
            // console.log("Trigger:", data);
            // console.log("Width:", finalWidth);
            // console.log("Height:", finalHeight);

            for ( x = 0; x < finalWidth ; x++) 
            {
                for ( y = 0; y < finalHeight ; y++) 
                { 
                    //Store data coordinates
                    var triggersCoordinates = {};
                    triggersCoordinates.x = ( data.coordinates.x + x);
                    triggersCoordinates.y = ( data.coordinates.y + y);
                    
                    // console.log("triggers data:", triggersCoordinates);
                    checkTriggersData.push(triggersCoordinates);
                }
            }
        }); 
        
        //noItemsData Points
        $.each(noItemsData, function(i, data){
            // create a array to store de tiles that belong to trigger
            // create the array outside this cicle because don't repeat the same code several times'            
            var finalHeight = ( data.settings.height / 32 );
            var finalWidth  = ( data.settings.width  / 32 );

            for ( x = 0; x < finalWidth ; x++) 
            {
                for ( y = 0; y < finalHeight ; y++) 
                { 
                    //Store data coordinates
                    var noItemsCoordinates = {};
                    noItemsCoordinates.x = ( data.coordinates.x + x);
                    noItemsCoordinates.y = ( data.coordinates.y + y);
                    
                    // console.log("triggers data:", triggersCoordinates);
                    checknoItemsData.push(noItemsCoordinates);
                }
            }
        });         
        
        // parse all the collision layer tiles 
        for ( x = 0; x < collision_layer.cols; x++) 
        {
            for ( y = 0; y < collision_layer.rows; y++) 
            {
               
                var testTileCollision = collision_layer.layerData[x][y];
                var testTileBackground = background_layer.layerData[x][y];

                // If tile of layer collision is null then we can put an item
                if (testTileCollision === null && testTileBackground !== null){                 
                    // Item probability
                    var item_probability = Number.prototype.random(0, itemLucky);
                    // Total of items
                    total_items = item_keys.length - 1;
                    
                    // If is a mission item don't spawn
                    do{ // If mission item then random new item                 
                        //random a item
                        var randomNumber = Number.prototype.random(0, total_items);
                        var random_item = item_keys[randomNumber];
                    }while ( ads_items_data[random_item].categoria == "itemMissao" );   

                    if ( item_probability == Math.round(itemLucky / 2) ){                       
                        //Test if not a trigger or special item or born hero
                        var isCollide = false;
                        
                        // $.each(triggersData, function(i, data){
                            // if (data.coordinates.x == x && data.coordinates.y == y)
                                // isCollide = true;
                        // });
                        
                        //Improve this to not spwan items on mission tiles
                        //special item
                        $.each(specialItemsData, function(i, data){
                            if (data.coordinates.x == x && data.coordinates.y == y){
                                isCollide = true;
                            }
                        }); 
                        
                        // If is a trigger don't put object
                        $.each(checkTriggersData, function(i, data){
                            if (data.x == x && data.y == y){
                                isCollide = true;
                                // console.log("Collide with trigger tile!");
                            }
                        }); 
                        
                        // If is a noitems don't put object
                        $.each(checknoItemsData, function(i, data){
                            if (data.x == x && data.y == y){
                                isCollide = true;
                                // console.log("Collide with noItems tile!");
                            }
                        });                         
                        
                        //Hero born
                        if (x == startHero[0] && y == startHero[1])
                                isCollide = true;
                        
                        // Not to spawn item with json criarinicio =false
                        if ( ads_items_data[random_item].criarinicio !== undefined && !ads_items_data[random_item].criarinicio){
                            isCollide = true;
                        }
                        
                        if (!isCollide)
                        {
                            // Item Image
                            item[count] = new ItemEntity(parseInt(_Globals.map.tileSize*x ,10), parseInt(_Globals.map.tileSize*y ,10), 
                                    {image: ads_items_data[random_item].imagem.replace(".png",""),
                                    spritewidth: 32, spriteheight: 32}, ads_items_data[random_item]);
                            count++;
                            // console.log("Populate Map... X:" + parseInt(32*x) +
                                        // "   Y:" + parseInt(32*y) + 
                                        // " dss  Count:" + count + "    Item: " + random_item);
                        }
                    }
                
                }
            }
        }
        
        // add items on layer 5
        $.each(item, function(i, item){
            me.game.add(item,5);
            me.game.sort();
        });
        

        //Spawn special items
        $.each(specialItemsData, function(i, dataSpecialItem){
            $.each(ads_items_data, function(i, ads_item_data){
                // console.log('dataSpecialItem.value: ' + dataSpecialItem.value + '  ads_item_data.valor: ' + ads_item_data.valor);
                if ( dataSpecialItem.value == ads_item_data.valor)
                {
                    ads_item_data.remover = dataSpecialItem.remover;
                    ads_item_data.removerNome = dataSpecialItem.removerNome;
                    ads_item_data.quantidade = dataSpecialItem.quantidade;
                    ads_item_data.specialItem = true;
                    item = new ItemEntity(parseInt(_Globals.map.tileSize*dataSpecialItem.coordinates.x , 10), parseInt(_Globals.map.tileSize*dataSpecialItem.coordinates.y ,10), 
                    {image: ads_item_data.imagem.replace(".png",""),
                    spritewidth: 32, spriteheight: 32}, ads_item_data);
                    me.game.add(item,5);
                    me.game.sort();
                }
            });
        });
    }
});