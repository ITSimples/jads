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
// me.sys.fps = 30;

// When use that the me.sys.fps is disabled
me.sys.useNativeAnimFrame = true;

 me.sys.preRender = false;
 
 me.sys.pauseOnBlur = false;

/*--- END Game engine system Configuration ---*/

/*------------------- 
START Global Variables
-------------------------------- */

// Configurações do Jogo - Variáveis Globais:


var _Globals = {
    canvas : {
        width : 800,
        height : 520,
    },
    paths : {
        images : 'data/images/',
        images_gui : 'data/gui/',
        sprites : 'data/sprites/',
        effects : 'data/effects/',
        items : 'data/sprites/items/',
        music : 'data/music/',
        sfx : 'data/sfx/',
        json : 'data/jsondata/',
    },
    map : {
        tileSize : 32,
    },
    restartGame : false,
    gotoState : "",
    music : {
        start : "ancientforest",
        volume : 0.5,
    },
    hud : {
        fontSize : 20,
        position : {
            x : 10,
            y : 8,
        },
        color : {
            live : "white",
            gold  : "yellow",
            velocity : "red",
            knowledge : "blue",
            lucky : "green",
        },
        values : {
            max : {
            live : 10,
            gold  : 9999,
            velocity : 10,
            knowledge : 9999,
            lucky : 9999,
        },
            min : {
            live : 0,
            gold  : 0,
            velocity : 0,
            knowledge : 0,
            lucky : 0,
        },
        init : {
            live : 20,
            gold  : 40,
            velocity : 2,
            knowledge : 10,
            lucky : 1,
        },
        },
        name : {
            live : "vida",
            gold  : "ouro",
            velocity : "velocidade",
            knowledge : "conhecimento",
            lucky : "sorte",
        },
    },
};

/*------------------- 
HUD Configuration
-------------------------------- */
// HUD font Size
// var ads_HUD_font_size = 20;
// HUD texx Y Position
// var ads_HUD_Y_Position = 8;
// HUD texx X Position
// var ads_HUD_X_Position = 10;
// HUD color

// var hudColorLive = "white";
// var hudColorGold  = "yellow";
// var hudColorVelocity = "red";
// var hudColorKnowledge = "blue";
// var hudColorLucky = "green";

// Max values to hud objects
// var maxHudValue = {"live":10,"velocity":10};

/*--- END HUD Configuration ---*/


/*------------------- 
Hero Configuration
-------------------------------- */

var heroVelocity;

var itemLucky;

var startHero;

var heroName;

// var heroHealth;

// Keep all items found by hero
var heroItems;

// Enable/Disable hero weapon
var heroWeaponEnable;

// Get slot inventory of hero weapon
var heroWeaponSlot;

// Hero weapon name
var heroWeaponName;

// full inventory
var fullInventory;

// full inventory special items
var specialItemfullInventory;

var keepHeroName;

// Do not repeat questions until all are showed
var qstDone = 0;

var setInitialHeroVariables = function setInitialHeroVariables(){
    //Set initial variables for hero
    console.log("Set initial variables for hero.");
    
    heroVelocity = 3;

    itemLucky = 15;
    
    startHero = [5,5];
    
    heroName = "";
    
    // heroHealth = 10;
    
    heroItems = [];
    
    heroWeaponEnable = false;
    
    heroWeaponSlot = -1;
    
    heroWeaponName = "";
    
    fullInventory = false;
    
    specialItemfullInventory = false;
    
    var qstDone = 0;
};

var DEBUG_MODE = false;

// Give item to hero to start in debug mode
var giveItemDebug = "chave3cristais";

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

var windowMenuOpen = false;

 var language =  {};

// To solve problem with messageBox keeping blink - If is collide with a trigger avoid the others to hide message box
// also setup in NPC - set allways when message is showinf
// var msgShowing = false;

// NPC is talking - Test if NPC Event talk is true
// Used to avoid show prison door triggers messages to show when NPC is talking
var npcTalking = false;

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

// Var background music
var backgroundMusic = true;

// SFX volume when hit hero
var hitHeroVolume = 0.1;