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

// Game resources
var ads_resources = 
[
	// ---- Mapas ----
	
	// *** Tiles for Map 01 ***
	{name: "metatiles32x32",type: "image",src: "data/maps/map01_tileset/metatiles32x32.png"},	
	{name: "TileB",type: "image",src: "data/maps/map01_tileset/TileB.png"},
	{name: "TileC",type: "image",src: "data/maps/map01_tileset/TileC.png"},
	{name: "TileD",type: "image",src: "data/maps/map01_tileset/TileD.png"},
	{name: "TileE",type: "image",src: "data/maps/map01_tileset/TileE.png"},
	{name: "tiles",type: "image",src: "data/maps/map01_tileset/tiles.png"},
	
	// *** Map 01 ***
	{name: "map01", type: "tmx", src: "data/maps/map01.tmx"},
	
	// ---- Imagens GUI ----
	{name: "initialscreen",type: "image",src: _Globals.paths.images + "initialscreen.png"},
	{name: "menubutton",type: "image",src: _Globals.paths.images_gui + "menubutton.png"},
	{name: "menubuttonhover",type: "image",src: _Globals.paths.images_gui + "menubuttonhover.png"},
	
	// ---------------------------- AUDIO ------------------------------------------------------
	//---- Music ----
	{name: "ancientforest", type: "audio",  src:  _Globals.paths.music, channel: 1},
	
	//---- SFX ----
   {name: "doorexplosion", type: "audio",  src: _Globals.paths.sfx, channel: 1},
   {name: "herowalk", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "heroeat", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "doorlockmessage", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "opendoor", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "buttonclick", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "openingwindows", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "closingwindows", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "hithero", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "shopbells", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "fireball", type: "audio",  src: _Globals.paths.sfx, channel: 2}, 
   {name: "campfire", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "snake", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "wrong", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "hmmquestionfemale", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "hmmquestionmale", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "openchest", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "dragonbreath", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "dragonborn", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "icestaff", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "bombs", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "sword", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "goodanswer", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "badanswer", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "evillaugh", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "redeyeshide", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "mandying", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "dragondie", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "teleport", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "logo", type: "audio",  src: _Globals.paths.sfx, channel: 2},
   {name: "menumouseover", type: "audio",  src: _Globals.paths.sfx, channel: 2},   
   
	// ---- Enemies ----
	{name: "dragon_lvl_01", type: "image",  src: _Globals.paths.sprites + "dragon_lvl_01.png"},
	
	// ---- Sprites ----
	{name: "transparency",      type: "image",  src: _Globals.paths.sprites + "transparency.png"},
	{name: "bee",		type: "image",	src: _Globals.paths.sprites + "bee.png"},
	{name: "beehive",		type: "image",	src: _Globals.paths.sprites + "beehive.png"},
	{name: "e_male01",	type: "image",	src: _Globals.paths.sprites + "e_male01.png"},
	{name: "e_male03", type: "image",  src: _Globals.paths.sprites + "e_male03.png"},
	{name: "e_male04", type: "image",  src: _Globals.paths.sprites + "e_male04.png"},
    {name: "e_male05", type: "image",  src: _Globals.paths.sprites + "e_male05.png"},
    {name: "e_male06", type: "image",  src: _Globals.paths.sprites + "e_male06.png"},
	{name: "f_female01",	type: "image",	src: _Globals.paths.sprites + "f_female01.png"},
	{name: "f_female02",	type: "image",	src: _Globals.paths.sprites + "f_female02.png"},
	{name: "f_male03",	type: "image",	src: _Globals.paths.sprites + "f_male03.png"},
	{name: "f_male04",	type: "image",	src: _Globals.paths.sprites + "f_male04.png"},
	{name: "f_male05", type: "image",  src: _Globals.paths.sprites + "f_male05.png"},
	{name: "flame",	type: "image",	src: _Globals.paths.sprites + "flame.png"},
	{name: "h_female01",	type: "image",	src: _Globals.paths.sprites + "h_female01.png"},
	{name: "h_male01",	type: "image",	src: _Globals.paths.sprites + "h_male01.png"},
	{name: "snake",	type: "image",	src: _Globals.paths.sprites + "snake.png"},
	{name: "snakehole",		type: "image",	src: _Globals.paths.sprites + "snakehole.png"},
	{name: "items1",	type: "image",	src: _Globals.paths.items + "fruta.png"},
	{name: "fire01", 	type: "image",src: _Globals.paths.sprites + "fire01.png"},
	
	// **** Throwers
	{name: "thrower01", 	type: "image",src: _Globals.paths.sprites + "thrower01.png"},
	{name: "throwerfire", 	type: "image",src: _Globals.paths.sprites + "throwerfire.png"},
	{name: "throwerfire02", 	type: "image",src: _Globals.paths.sprites + "throwerfire02.png"},
	{name: "ice_staff",    type: "image",src: _Globals.paths.sprites + "ice_staff.png"},
	{name: "dragonfire",    type: "image",  src: _Globals.paths.sprites + "dragonfire.png"},
    {name: "campfire02",    type: "image",  src: _Globals.paths.sprites + "campfire02.png"},
    {name: "iceprojectil",  type: "image",  src: _Globals.paths.sprites + "iceprojectil.png"},
    {name: "animsword",  type: "image",  src: _Globals.paths.sprites + "animsword.png"},
    {name: "bomb",  type: "image",  src: _Globals.paths.sprites + "bomb.png"},
	
	//**** Effects
	{name: "explosion_32x32", 	type: "image",src: _Globals.paths.effects + "explosion_32x32.png"},
	{name: "explosion_64x64", 	type: "image",src: _Globals.paths.effects + "explosion_64x64.png"},
	{name: "prisiondooropen", 	type: "image",src: _Globals.paths.effects + "prisiondooropen.png"},
	{name: "dragondooropen",  type: "image",src: _Globals.paths.effects + "dragondooropen.png"},
	{name: "questitem", 	type: "image",src: _Globals.paths.effects + "questitem.png"},
	{name: "sparkle", 	type: "image",src: _Globals.paths.effects + "sparkle.png"},
	{name: "fireplace", 	type: "image",src: _Globals.paths.effects + "fireplace.png"},
	{name: "risesfire",    type: "image",src: _Globals.paths.effects + "risesfire.png"},
	{name: "frozendragon",    type: "image",src: _Globals.paths.effects + "frozendragon.png"},
	{name: "dialoge",    type: "image",src: _Globals.paths.effects + "dialoge.png"},
	{name: "exclamation",    type: "image",src: _Globals.paths.effects + "exclamation.png"},
	
	//***** Mouse cursor
	{name: "point_cur",    type: "image",src: _Globals.paths.images_gui + "point_cur.cur"},
];


//Configurar fontes a utilizar - Google web Fonts
WebFontConfig = {
    google : {
        families : ['Lancelot::latin', 'Geostar::latin', 'MedievalSharp::latin', 'Devonshire::latin']
    }
}; 
