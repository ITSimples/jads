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
 
/*------------------- 
Gobal Variables
-------------------------------- */

/*------------------- 
Game engine system Configuration 
-------------------------------- */
me.sys.fps = 30;
// me.sys.useNativeAnimFrame = true;
me.sys.cacheImage = true;
/*--- END Game engine system Configuration ---*/

/*------------------- 
START Global Variables
-------------------------------- */


// Configurações do Jogo - Variáveis Globais:
var ads_width = 800;
var ads_height = 520;
var ads_images_path='content/images/';
var ads_sprites_path='content/sprites/';
var ads_effects_path='content/effects/';
var ads_items_path='content/sprites/items/';
var ads_music_path='content/music/';
var ads_json_files='content/jsondata/';
var ads_tile_size = 32;


/*------------------- 
HUD Configuration
-------------------------------- */
// HUD font Size
var ads_HUD_font_size = 20;
// HUD texx Y Position
var ads_HUD_Y_Position = 23;
// HUD texx X Position
var ads_HUD_X_Position = 10;
// HUD color

var hudColorLive = "white";
var hudColorGold  = "yellow";
var hudColorVelocity = "red";
var hudColorKnowledge = "blue";
var hudColorLucky = "green";

// Max values to hud objects
var maxHudValue = {"live":10,"velocity":10};

/*--- END HUD Configuration ---*/


/*------------------- 
Heroe Configuration
-------------------------------- */

var heroeVelocity = 3 ;

var itemLucky = 20;

var startHeroe = [8,7];


/*--- END Heroe Configuration ---*/



/*------------------- 
Prison Configuration
-------------------------------- */

//Create global variable to check if prison door is opened or closed
var prisonBreak = [false,false,false,false];

var prisonDoorTrigger = [false,false,false,false];

/*------------------- 
End Prison Configuration
-------------------------------- */



/*------------------- 
KEEP DATA IN ARRAY FROM JSON FILE
-------------------------------- */

// Array with all items from game to load resources - Load from JSON file
// {name: "****",type: "image",src: "*****"},
var load_ads_items=[];

// Keep all information about the items of the game
var ads_items_data = [];

// Keep all information about the npc's
var adsNpcData = [];

// Keep all information about the trigger identity
var triggersData = [];

// Keep all information where to place the special items (coordinates and value)
var specialItemsData = [];

// Keep all information where to place the Throwers 
var throwersData = [];

// Keep all information where to place the Throwers 
var projectilsData = [];





// To solve problem with messageBox keeping blink - If is collide with a trigger avoid the others to hide message box
// also setup in NPC - set allways when message is showinf
var msgShowing = false;

// Keep all items found by heroe
var heroeItems = [];

// *********** QUESTIONS SECTION ***********
// Keep all information about the questions
var adsQtnData = [];
// Global variable to keep the number of questions:
var countQtn = 0;

// Global variables to test answer
var heroeAnswer = -1;

// If Question box is showing
var showingQuestion = false;

// If Question box is showing
var fullInventory = false; 

// *********** MESSAGE SECTION ***********
// adsGame.messageShowing = false; 

// Game resources
var ads_resources = 
[
	// ---- Mapas ----
	
	// *** Tiles for Map 01 ***	
	
	//Implement the new map with the tiles
	{name: "metatiles32x32",type: "image",src: "content/maps/map01_tileset/metatiles32x32.png"},	
	{name: "TileB",type: "image",src: "content/maps/map01_tileset/TileB.png"},
	{name: "TileC",type: "image",src: "content/maps/map01_tileset/TileC.png"},
	{name: "TileD",type: "image",src: "content/maps/map01_tileset/TileD.png"},
	{name: "TileE",type: "image",src: "content/maps/map01_tileset/TileE.png"},
	{name: "tiles",type: "image",src: "content/maps/map01_tileset/tiles.png"},
	
	// *** Map 01 ***
	{name: "map01", type: "tmx", src: "content/maps/map01.tmx"},
	
	// ---- Imagens ----
	{name: "initialscreen",type: "image",src: ads_images_path + "initialscreen.png"},
	
	// ---- Audio ----
	{name: "mfh", type: "audio",  src: "content/music/", channel: 1},
	
	// ---- Sprites ----
	{name: "bee",		type: "image",	src: ads_sprites_path + "bee.png"},
	{name: "beehive",		type: "image",	src: ads_sprites_path + "beehive.png"},
	// {name: "death",	type: "image",	src: ads_sprites_path + "death.png"},
	// {name: "diablo",	type: "image",	src: ads_sprites_path + "diablo.png"},
	// {name: "diablo02",	type: "image",	src: ads_sprites_path + "diablo02.png"},
	// {name: "diablo03",	type: "image",	src: ads_sprites_path + "diablo03.png"},
	// {name: "e_female01",	type: "image",	src: ads_sprites_path + "e_female01.png"},
	// {name: "e_male01",	type: "image",	src: ads_sprites_path + "e_male01.png"},
	// {name: "e_male02",	type: "image",	src: ads_sprites_path + "e_male02.png"},
	// {name: "e_male03",	type: "image",	src: ads_sprites_path + "e_male03.png"},
	// {name: "eye",		type: "image",	src: ads_sprites_path + "eye.png"},
	// {name: "f_female01",	type: "image",	src: ads_sprites_path + "f_female01.png"},
	// {name: "f_female02",	type: "image",	src: ads_sprites_path + "f_female02.png"},
	// {name: "f_male01",	type: "image",	src: ads_sprites_path + "f_male01.png"},
	// {name: "f_male02",	type: "image",	src: ads_sprites_path + "f_male02.png"},
	{name: "f_male03",	type: "image",	src: ads_sprites_path + "f_male03.png"},
	{name: "f_male04",	type: "image",	src: ads_sprites_path + "f_male04.png"},
	{name: "flame",	type: "image",	src: ads_sprites_path + "flame.png"},
	{name: "campfire",	type: "image",	src: ads_sprites_path + "campfire.png"},
	// {name: "goblin",	type: "image",	src: ads_sprites_path + "goblin.png"},
	// {name: "goblin02",	type: "image",	src: ads_sprites_path + "goblin02.png"},
	// {name: "golem",	type: "image",	src: ads_sprites_path + "golem.png"},
	{name: "h_female01",	type: "image",	src: ads_sprites_path + "h_female01.png"},
	// {name: "h_female02",	type: "image",	src: ads_sprites_path + "h_female02.png"},
	// {name: "h_female03",	type: "image",	src: ads_sprites_path + "h_female03.png"},
	// {name: "h_female04",	type: "image",	src: ads_sprites_path + "h_female04.png"},
	{name: "h_male01",	type: "image",	src: ads_sprites_path + "h_male01.png"},
	// {name: "h_male02",	type: "image",	src: ads_sprites_path + "h_male02.png"},
	// {name: "h_male03",	type: "image",	src: ads_sprites_path + "h_male03.png"},
	// {name: "h_male04",	type: "image",	src: ads_sprites_path + "h_male04.png"},
	{name: "Hudbg",	type: "image",	src: ads_sprites_path + "Hudbg.png"},
	// {name: "Iceman",	type: "image",	src: ads_sprites_path + "Iceman.png"},
	// {name: "kid_female",	type: "image",	src: ads_sprites_path + "kid_female.png"},
	// {name: "kid_male",	type: "image",	src: ads_sprites_path + "kid_male.png"},
	// {name: "king",	type: "image",	src: ads_sprites_path + "king.png"},
	// {name: "mushroom",	type: "image",	src: ads_sprites_path + "mushroom.png"},
	// {name: "queen",	type: "image",	src: ads_sprites_path + "queen.png"},
	// {name: "QuestionTile",type: "image",	src: ads_sprites_path + "QuestionTile.png"},
	// {name: "skull",	type: "image",	src: ads_sprites_path + "skull.png"},
	// {name: "sleleton",	type: "image",	src: ads_sprites_path + "sleleton.png"},
	{name: "snake",	type: "image",	src: ads_sprites_path + "snake.png"},
	{name: "snakehole",		type: "image",	src: ads_sprites_path + "snakehole.png"},
	// {name: "stoneman",	type: "image",	src: ads_sprites_path + "stoneman.png"},
	// {name: "tiles",	type: "image",	src: ads_sprites_path + "tiles.png"},
	// {name: "villain",	type: "image",	src: ads_sprites_path + "villain.png"},
	// {name: "wolf",	type: "image",	src: ads_sprites_path + "wolf.png"},
	{name: "items1",	type: "image",	src: ads_items_path + "fruta.png"},
	{name: "fire01", 	type: "image",src: ads_sprites_path + "fire01.png"},
	{name: "thrower01", 	type: "image",src: ads_sprites_path + "thrower01.png"},
	{name: "explosion_32x32", 	type: "image",src: ads_effects_path + "explosion_32x32.png"},
	{name: "explosion_64x64", 	type: "image",src: ads_effects_path + "explosion_64x64.png"}
	
];


//Configurar fontes a utilizar - Google web Fonts
WebFontConfig = {
	google: { families: [ 	'Lancelot::latin',
							'Geostar::latin',
							'MedievalSharp::latin',
							'Devonshire::latin']}
	};
(function() 
{
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
	// console.log("Loaded... Fonts");
})(); 
//**********************************************
// console.log("Loaded... B");

/*------------------- 
NPC's animation Configuration
------------------------------ */

/*--- END HUD Configuration ---*/