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

// **************************************
// ****  MAP EFFECTS ENTITY SPAWN ****
// **************************************
//me.InvisibleEntity has been removed, as following previous changes,
//this can now be achieved using a me.ObjectEntity without a renderable component.
var MapEffectsSpawnEntity = me.ObjectEntity.extend({
    //Constructor
    init: function( x , y , settings){
        // call the parent constructor
        this.parent(x, y, settings);
        
        
        // Add effects on map
        $.each( mapEffectsData, function(i, mapEffectData){
            var mapEffect = new effect(
                mapEffectData.coordenadas.x * 32 , mapEffectData.coordenadas.y * 32 , // Coordinates
                me.loader.getImage(mapEffectData.imagem),   // Image
                mapEffectData.largura, mapEffectData.altura, // Size
                mapEffectData.animacao, //Animation sheet
                mapEffectData.velocidade, // Speed between 0 - Slowest and 60 - fastest
                mapEffectData.repetir, // Repeat animation
                0 // time between animations
                );
            me.game.add(mapEffect,7);
            me.game.sort.defer();
        }); 

    }
});
// **************************************
// ****  END MAP EFFECTS ENTITY SPAWN ****
// **************************************  