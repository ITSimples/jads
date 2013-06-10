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
 
/*------------------- 
Gobal Variables
-------------------------------- */

/*------------------- 
Game engine system Configuration 
-------------------------------- */
me.sys.fps = 30;

// me.sys.useNativeAnimFrame = true;

me.sys.cacheImage = true;

 me.sys.preRender = false;

/*--- END Game engine system Configuration ---*/

/*------------------- 
START Global Variables
-------------------------------- */

// Configurações do Jogo - Variáveis Globais:
var ads_width = 800;
var ads_height = 520;
var ads_images_path='content/images/';
var ads_images_gui='content/gui/';
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
var ads_HUD_Y_Position = 8;
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
Hero Configuration
-------------------------------- */

var heroVelocity = 3;

var itemLucky = 15;

var startHero = [45,8];

var heroHealth = 10;

var DEBUG_MODE = false;

// Give item to hero to start in debug mode
var giveItemDebug = "manuscrito";

/*--- END Hero Configuration ---*/

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

// Keep all information where not to place items on map
var noItemsData = [];

// Keep all information about map effects
var mapEffectsData = [];

 var language =  {};

// To solve problem with messageBox keeping blink - If is collide with a trigger avoid the others to hide message box
// also setup in NPC - set allways when message is showinf
// var msgShowing = false;

// NPC is talking - Test if NPC Event talk is true
// Used to avoid show prison door triggers messages to show when NPC is talking
var npcTalking = false;

// Keep all items found by hero
var heroItems = [];
// *********** QUESTIONS SECTION ***********
// Keep all information about the questions
var adsQtnData = [];
// Global variable to keep the number of questions:
var countQtn = 0;

// Global variables to test answer
var heroAnswer = -1;

// If Question box is showing
var showingQuestion = false;

// If Shop box is showing
var showingShop = false;        

// full inventory
var fullInventory = false; 

// full inventory special items
var specialItemfullInventory = false;

// Var background music
var backgroundMusic = true;

// Enable/Disable hero weapon
var heroWeaponEnable = false;

// Get slot inventory of hero weapon
var heroWeaponSlot = -1;

// Hero weapon name
var heroWeaponName = "";

// SFX volume when hit hero
hitHeroVolume = 0.1;

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
	
	// ---- Imagens GUI ----
	{name: "initialscreen",type: "image",src: ads_images_path + "initialscreen.png"},
	{name: "menubutton",type: "image",src: ads_images_gui + "menubutton.png"},
	
	// ---------------------------- AUDIO ------------------------------------------------------
	//---- Music ----
	{name: "cornfields", type: "audio",  src: "content/music/", channel: 1},
	
	//---- SFX ----
   {name: "doorexplosion", type: "audio",  src: "content/sfx/", channel: 1},
   {name: "herowalk", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "heroeat", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "heartbeat", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "doorlockmessage", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "opendoor", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "buttonclick", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "openingwindows", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "closingwindows", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "hithero", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "shopbells", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "fireball", type: "audio",  src: "content/sfx/", channel: 2}, 
   {name: "campfire", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "snake", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "wrong", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "hmmquestionfemale", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "hmmquestionmale", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "openchest", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "dragonbreath", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "dragonborn", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "icestaff", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "bombs", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "sword", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "goodanswer", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "badanswer", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "evillaugh", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "redeyeshide", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "mandying", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "dragondie", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "teleport", type: "audio",  src: "content/sfx/", channel: 2},
   {name: "logo", type: "audio",  src: "content/sfx/", channel: 2},
   
	// ---- Enemies ----
	{name: "dragon_lvl_01", type: "image",  src: ads_sprites_path + "dragon_lvl_01.png"},
	
	
	// ---- Sprites ----
	{name: "transparency",      type: "image",  src: ads_sprites_path + "transparency.png"},
	{name: "bee",		type: "image",	src: ads_sprites_path + "bee.png"},
	{name: "beehive",		type: "image",	src: ads_sprites_path + "beehive.png"},
	// {name: "death",	type: "image",	src: ads_sprites_path + "death.png"},
	// {name: "diablo",	type: "image",	src: ads_sprites_path + "diablo.png"},
	// {name: "diablo02",	type: "image",	src: ads_sprites_path + "diablo02.png"},
	// {name: "diablo03",	type: "image",	src: ads_sprites_path + "diablo03.png"},
	// {name: "e_female01",	type: "image",	src: ads_sprites_path + "e_female01.png"},
	{name: "e_male01",	type: "image",	src: ads_sprites_path + "e_male01.png"},
	// {name: "e_male02",	type: "image",	src: ads_sprites_path + "e_male02.png"},
	{name: "e_male03", type: "image",  src: ads_sprites_path + "e_male03.png"},
	{name: "e_male04", type: "image",  src: ads_sprites_path + "e_male04.png"},
    {name: "e_male05", type: "image",  src: ads_sprites_path + "e_male05.png"},
    {name: "e_male06", type: "image",  src: ads_sprites_path + "e_male06.png"},
	
	// {name: "eye",		type: "image",	src: ads_sprites_path + "eye.png"},
	{name: "f_female01",	type: "image",	src: ads_sprites_path + "f_female01.png"},
	{name: "f_female02",	type: "image",	src: ads_sprites_path + "f_female02.png"},
	// {name: "f_male01",	type: "image",	src: ads_sprites_path + "f_male01.png"},
	// {name: "f_male02",	type: "image",	src: ads_sprites_path + "f_male02.png"},
	{name: "f_male03",	type: "image",	src: ads_sprites_path + "f_male03.png"},
	{name: "f_male04",	type: "image",	src: ads_sprites_path + "f_male04.png"},
	{name: "f_male05", type: "image",  src: ads_sprites_path + "f_male05.png"},
	{name: "flame",	type: "image",	src: ads_sprites_path + "flame.png"},

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
	
	// **** Throwers
	{name: "thrower01", 	type: "image",src: ads_sprites_path + "thrower01.png"},
	{name: "throwerfire", 	type: "image",src: ads_sprites_path + "throwerfire.png"},
	{name: "throwerfire02", 	type: "image",src: ads_sprites_path + "throwerfire02.png"},
	{name: "ice_staff",    type: "image",src: ads_sprites_path + "ice_staff.png"},
	{name: "dragonfire",    type: "image",  src: ads_sprites_path + "dragonfire.png"},    
    {name: "campfire01",    type: "image",  src: ads_sprites_path + "campfire01.png"},
    {name: "campfire02",    type: "image",  src: ads_sprites_path + "campfire02.png"},
    {name: "iceprojectil",  type: "image",  src: ads_sprites_path + "iceprojectil.png"},
    {name: "animsword",  type: "image",  src: ads_sprites_path + "animsword.png"},
    {name: "bomb",  type: "image",  src: ads_sprites_path + "bomb.png"},
	
	//**** Effects
	{name: "explosion_32x32", 	type: "image",src: ads_effects_path + "explosion_32x32.png"},
	{name: "explosion_64x64", 	type: "image",src: ads_effects_path + "explosion_64x64.png"},
	{name: "prisiondooropen", 	type: "image",src: ads_effects_path + "prisiondooropen.png"},
	{name: "dragondooropen",  type: "image",src: ads_effects_path + "dragondooropen.png"},
	{name: "questitem", 	type: "image",src: ads_effects_path + "questitem.png"},
	{name: "sparkle", 	type: "image",src: ads_effects_path + "sparkle.png"},
	{name: "fireplace", 	type: "image",src: ads_effects_path + "fireplace.png"},
	{name: "risesfire",    type: "image",src: ads_effects_path + "risesfire.png"},
	{name: "frozendragon",    type: "image",src: ads_effects_path + "frozendragon.png"},
	
	//***** Mouse cursor
	{name: "point_cur",    type: "image",src: ads_images_gui + "point_cur.cur"},
];


//Configurar fontes a utilizar - Google web Fonts
WebFontConfig = {
	google: { families: [ 	'Lancelot::latin',
							'Geostar::latin',
							'MedievalSharp::latin',
							'Devonshire::latin']}
	};

//**********************************************
// console.log("Loaded... B");

/*------------------- 
NPC's animation Configuration
------------------------------ */

/*--- END HUD Configuration ---*/