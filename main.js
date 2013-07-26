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

/* 
-----------------------------------
Ficheiro: main.js
ClassName:main
Comment: Classe principal do jogo
Create Date: 26/02/2012 - ITSimples
HTTP://www.itsimples.com 
-----------------------------------
*/

/* adsGame - Game namespace */
var adsGame = 
{ 
	// Inicializar o Jogo
	onload:function()
	{   
	    if ( userLang.substr(0,2) == "pt"){
            //Language choose
            chooseLanguage("portuguese"); 
        }else{
            //Language choose
            chooseLanguage("english"); 
        }
        
		//Inicializar resolu��o e teste se browser suporta o jogo
		if( !me.video.init('adsGame',ads_width,ads_height,true,1.0,false) ){
			alert( language.system.TRbrowserInf );
			return;
		}
    
        //Init title name
        $( document ).attr("title", language.system.TRgameName);
        
        //Init game name
        $('#msgGameName').html( language.system.TRgameName );        
		
        // Initialize loading screen.
        adsGame.showLogo(function () {
            me.state.set(me.state.LOADING, new adsGame.LoadScreen());
            me.state.change(me.state.LOADING); 
        });
        
		//Inicializar formato de m�sica a utilizar
		me.audio.init("mp3,ogg");
		
		//Callback - Carregar os recursos do jogo quando tudo estiver preparado
		me.loader.onload = this.loaded.bind(this);
		
		// console.log("Loaded... C");
		//Preparar todos os recursos do jogo
		me.loader.preload(ads_resources.concat(load_ads_items));
		
		//me.loader.preload(ads_resources);
		
		//Mudar estado para ecr� de carregamento do jogo. 
		// me.state.change(me.state.LOADING);
		
		// ************ Configura��es de DEBUG *************
		//Ver caixa de colis�o
		me.debug.renderHitBox = DEBUG_MODE;
		
		this.createGameObjects();
	},
	
	deleteReferenceGameObjects:function(){
	    // Delete Create helpwindow box object
	       
        delete adsGame.helpwindow;
        
        // Delete  helpwindow box object
        delete adsGame.storywindow;
        
        // Delete Scorewindow box object
        delete adsGame.scoreWindow;
        
        // Delete Objectivewindow box object
        delete adsGame.objectiveWindow;
        
        // Delete bjectivewindow box object
        delete adsGame.lvlFinishedWindow;
        
        // Delete Inventory box object
        delete adsGame.Inventory;
        
        delete adsGame.pathFinder;
        
        // Delete object from prisondoor classe
        delete adsGame.prisonDoors;
        
        // Delete object to NPC
        delete adsGame.Npc;
        
        // Delete object to Shop
        delete adsGame.shop;
        
        // Delete object that handle with scoreoid server
        delete adsGame.scoreOID;
	},
	
	createGameObjects:function(){
	    
        //Create helpwindow box object
        adsGame.helpwindow = new adsGame.HelpWindow();
        
        //Create helpwindow box object
        adsGame.storywindow = new adsGame.StoryWindow();
        
        //CreateScorewindow box object
        adsGame.scoreWindow = new adsGame.ScoresWindow();
        
        //Create Objectivewindow box object
        adsGame.objectiveWindow = new adsGame.ObjectiveWindow();
        
        //Create Objectivewindow box object
        adsGame.lvlFinishedWindow = new adsGame.LVLFinishedWindow();
        
        // New structure for game
        // adsGame.data = game_data;
        
        //Create Inventory box object
        adsGame.Inventory = new adsGame.INVENTORY();
        
        adsGame.pathFinder = new  adsGame.PathFinder();
        
        //Create object from prisondoor classe
        adsGame.prisonDoors =  new adsGame.PrisonDoors();
        
        // Create object to NPC
        adsGame.Npc = new adsGame.NPC();
        
        // Create object to Shop
        adsGame.shop = new adsGame.Shop();
        
        //Create object that handle with scoreoid server
        adsGame.scoreOID = new adsGame.Score();
	},
	
	restart:function(){
		// this.data = null;
		//Delete old objects references
		unBindGameKeys();
		// me.game.removeAll(true);
        me.game.reset();
		
		this.deleteReferenceGameObjects();
		//Create new references
		this.createGameObjects();
	},
	
	//Create a global identity for player as hero 
    heroEntity :function(){
        var heroEntityAux = me.game.getEntityByName('Hero');
        
        return heroEntityAux[0];
    }, 
    
	loaded:function()
	{
	    var STATE_LOGO_ANIMATION = me.state.USER + 0;
	    // Create user state Level objectives
	    var STATE_LEVEL_OBJECTIVES = me.state.USER + 1;
	    
		// Definir estado Menu 
		me.state.set(me.state.MENU,new TileScreen(true));
		me.state.set(me.state.STATE_LOGO_ANIMATION,new adsGame.logoAnimationScreen(true));
		me.state.set(me.state.READY,new adsGame.levelObjectivesScreen(true));

		// Definir estado jogo 
		me.state.set(me.state.PLAY,new PlayScreen(true));		

		// Configurar entidades do mapasw
		// Class HeroEntity em entities
		//"Hero" - Nome no mapa .tmx
		me.entityPool.add("Hero", HeroEntity);		
		me.entityPool.add("items", ItemEntity);
		me.entityPool.add("items_spawn", ItemSpawnEntity);
		me.entityPool.add("npc_spawn", NpcSpawnEntity);
		me.entityPool.add("doors_spawn", TriggerSpawnEntity);
		me.entityPool.add("throwers_spawn", ThrowersSpawnEntity);
		me.entityPool.add("map_effects_spawn", MapEffectsSpawnEntity);		
		
		me.input.bindKey(me.input.KEY.SPACE, "mouseOverride", true);
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);
		
		// Iniciar o jogo com o Menu
		// me.state.change(me.state.MENU);
        me.state.change(me.state.STATE_LOGO_ANIMATION);
		// Debug Mode
		//me.state.change(me.state.PLAY);
		
		//Create creditswindow box object - Create were to not delay the load because load txt file
        adsGame.creditsWindow = new adsGame.CreditsWindow(); 
	}
}; // END ****  adsGame *******

function bindGameKeys(){
        // Config Keys - in game you can use WASD or arrow keys
        // Configurar teclas a usar, False - L� mais que uma vez True - L� v�rias vezes.
        // Usar true por exemplo para lutar...
        me.input.bindKey(me.input.KEY.UP, "up", false);
        me.input.bindKey(me.input.KEY.DOWN, "down", false);
        me.input.bindKey(me.input.KEY.LEFT, "left", false);
        me.input.bindKey(me.input.KEY.RIGHT, "right", false);
        
        // Teclas para debug - prefiro :)
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.W, "up");
        me.input.bindKey(me.input.KEY.S, "down");
        
        // For debug mode
        me.input.bindKey(me.input.KEY.CTRL, "ctrl", false);
        me.input.bindKey(me.input.KEY.P, "speedup", true);
        me.input.bindKey(me.input.KEY.L, "speeddown", true);
        
        //Create inventory key
        me.input.bindKey(me.input.KEY.I, "inventory", true);
        //Create help key
        me.input.bindKey(me.input.KEY.H, "helpWindow", true);
        
        // enable the keyboard
        me.input.bindKey(me.input.KEY.T, "touch");
};

function unBindGameKeys(){
        // Config Keys - in game you can use WASD or arrow keys
        // Configurar teclas a usar, False - L� mais que uma vez True - L� v�rias vezes.
        // Usar true por exemplo para lutar...
        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindKey(me.input.KEY.DOWN);
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        
        // Teclas para debug - prefiro :)
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.D);
        me.input.unbindKey(me.input.KEY.W);
        me.input.unbindKey(me.input.KEY.S);
        
        // For debug mode
        me.input.unbindKey(me.input.KEY.CTRL);
        me.input.unbindKey(me.input.KEY.P);
        me.input.unbindKey(me.input.KEY.L);
        
        //Create inventory key
        me.input.unbindKey(me.input.KEY.I);
        //Create help key
        me.input.unbindKey(me.input.KEY.H);
        
        // enable the keyboard
        me.input.unbindKey(me.input.KEY.T);
};

// *** Improve Speed of question box
/*
-----------------------------------
File: main.js
Function: showQuestionLayer
Comment: Display an question box in the game
-----------------------------------
*/
function showQuestionLayer(itemData, adsQtnData)
{
	if (!showingQuestion){
	    
        // play a "openingwindows" sound
        me.audio.play("openingwindows");
		
		//By default
		heroAnswer = -1;
		
		//Show fields from question box with data
        rndQtnData = adsQtnData;
        
		var $questionBoxHtml = ('<img class="qtnImage" src="" alt="">' + 
							'<div class="itemText"></div>' +
							'<div class="questionTheme"></div>' + 
							'<div class="questionText"></div>' + 
							'<div class="r1"></div>' + 
							'<div class="r2"></div>' +
							'<div class="r3"></div>' + 
							'<div class="r0"></div>' + 
							'<div class="answerValue"></div>');
							
		$('#questionLayer').append($questionBoxHtml);
		$('#questionLayer').fadeIn( 250 );
		
		//Adapt answers to question length
		var questionLength = rndQtnData.pergunta.length;
        
        if ( questionLength > 0 && questionLength < 39 ){
            // console.log("One Line...");
            $(".questionText").css({'height': 20});
            $(".r1").css({'top' : 125});
            $(".r2").css({'top' : 145});
            $(".r3").css({'top' : 165});
            $(".r0").css({'top' : 185});
        }else if ( questionLength > 38 && questionLength < 77 ){
            // console.log("Two Lines...");
            $(".questionText").css({'height': 40});
            $(".r1").css({'top' : 145});
            $(".r2").css({'top' : 165});
            $(".r3").css({'top' : 185});
            $(".r0").css({'top' : 205});
        }else{
            $(".questionText").css({'height': 65});            
            // console.log("Three Lines...");
            $(".r1").css({'top' : 165});
            $(".r2").css({'top' : 185});
            $(".r3").css({'top' : 205});
            $(".r0").css({'top' : 225});
        }
		
		$('.qtnImage').attr({
		'src' : 'content/sprites/items/' + itemData.imagem
		});
		$('.itemText').html( language.items[itemData.descricao] );
		$('.questionTheme').html( language.system.TRquestionsTheme + ": " + rndQtnData.categoria );
		$('.questionText').html( rndQtnData.pergunta );
		$('.r1').html('(1) ' + rndQtnData.r1 );
		$('.r2').html('(2) ' + rndQtnData.r2 );
		$('.r3').html('(3) ' + rndQtnData.r3 );
		$('.r0').html('(0) ' + language.system.TRnotAnswer);
		
		// if is a special item them show the value you can lose and not the name
		if (!itemData.specialItem){
			$('.answerValue').html('+/-' + itemData.valor + ' ' + language.system.TRof + ' ' + language.items[itemData.categoriaDesc] + '.');
		}else{
			$('.answerValue').html(language.system.TRwrongAnswer + ' ' + itemData.quantidade + ' ' + language.system.TRof + ' ' + itemData.remover + '.');
		}
		// Create event listener to get answer from player
		$(document).keyup(function(event) {
			var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
			// If correct answer return true else return false
			if (keyPressed =='0' || keyPressed =='1' || keyPressed =='2'|| keyPressed =='3'  ) {
                // play a "buttonclick" sound
                me.audio.play("buttonclick");
				// Return player answer
				heroAnswer = keyPressed;
			}
		});
		
		// Create a event listener to get the ansewer from the mouse 
        // $('#questionLayer  > div') same as $('#questionLayer').children("div")
        $('#questionLayer  > div').bind('click', function() {
            var answer = this.className;
            
            //console.log( "this.className:", answer );
            
            // play a "buttonclick" sound
            me.audio.play("buttonclick");
            
            // If class start with r then is a answer get the answer from player
            if (answer.indexOf("r") == 0){
                //console.log("This is a answer...", answer.substr(1,1));
                heroAnswer = answer.substr(1,1);
                
                //Remove event listener
                $('#questionLayer  > div').unbind('click');
            }
        });
		
		//Message box is showing - avoid call over and over again
		showingQuestion = true;
	}

	return heroAnswer;
}

/*
-----------------------------------
File: main.js
Function: hideQuestionLayer
Comment: hide an question box in the game
-----------------------------------
*/
function hideQuestionLayer(answer)
{
	// C -  if hero correct answer
	// W -  if hero answer to the question but it's not the correct one
	// D -  If hero doesn't answer to the question
	
	// **** TO MAKE - Keep information to the player until press space key
	//				- Show in box question the result of the answer
	//				- Make a new field with that information
    var answerResult ='';
    
    console.log("Answer:", answer);
	
	if(answer == 'C')
	{
		answerResult =  language.system.TRcongratulations + language.system.TRgoodCorrectAnswer;
		// play a "goodanswer" sound
        me.audio.play("goodanswer");
	}else if(answer == 'W')
	{
		answerResult = language.system.TRbadWrongAnswer;
		// play a "badanswer" sound
        me.audio.play("badanswer");
	}
	else{		
		answerResult = language.system.TRtryAgainAnswer;
	}

	//Hide Question fields
	$('.questionText').fadeOut();
	$('.questionTheme').fadeOut();
	$('.r1').fadeOut();
	$('.r2').fadeOut();
	$('.r3').fadeOut();
	$('.r0').fadeOut();
	$('.answerValue').fadeOut();
	
	// Kill click events
	$("*", "#questionLayer").unbind("click");

	$('.questionTheme').remove();
	$('.questionText').remove();
	$('.r1').remove();
	$('.r2').remove();
	$('.r3').remove();
	$('.r0').remove();
	$('.answerValue').remove();
	
	// Show player answer result
	var $addAnswerResult = ('<div class="answerResult"></div>');
	$('#questionLayer').append($addAnswerResult);
	$('.answerResult').html(answerResult);
	$('.answerResult').fadeIn();
    
	// Remove questions window
    $(document).bind('keyup click', function(event) {
        // play a "closingwindows" sound
        me.audio.play("closingwindows");
        
        $('.qtnImage').remove();
        $('.itemText').remove();
        $('.answerResult').fadeOut();
        $('.answerResult').remove();
        $('#target').remove();
        $('#questionLayer').fadeOut( 350 , function(){
            // When finish to fade out 
            showingQuestion = false;
        });
        // event.stopPropagation();
        // Remove event listener to get answer from player
        $(document).unbind();

    });		
}


/*
-----------------------------------
File: main.js
Function: randomInt
Comment: get a random number between min and max value
-----------------------------------
*/
function randomInt( min, max )
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
-----------------------------------
File: main.js
Function: randomFloat
Comment: get a random float number between min and max value
-----------------------------------
*/
function randomFloat(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

/**
 * Create  solid tiles on collision layer
 * @public
 * @param {int} start position of tile x (in Pixels world coordinates)
 * @param {int} start position of tile y  (in Pixels world coordinates)
 * @param {int} blockWidth
 * @param {int} blockHeight 
 */     
 function makeSolid( startX , startY , blockWidth , blockHeight ) {
      // Map position 0,0 is always a solid tile - get number
      var solidTileId = me.game.collisionMap.getTileId( 0 , 0)
      
      // World Coordinates to map Coordinates
      var startX = Math.round(startX / 32);
      var startY = Math.round(startY / 32);
      
      for (var x = 0 ; x < blockWidth ; x++ ){
           for (var y = 0 ; y < blockHeight ; y++ ){
               me.game.collisionMap.setTile ( startX + x  , startY + y , solidTileId );
           }
      }
 }


//bootstrap :)
//window.onReady(function(){
	var init_game = function(data)
	{

		// Inicializar vari�vel para ler recursos dos items
		var countNpc = 0;
		var countItems = 0;
		// var countTrg = 0;
		// var countSI = 0;
		// var countThrow = 0;
		var ads_items_tmp=[];
		// console.log("Loaded... A");
		
		//Get data Items
		$.each(data.items, function(i,data)
		{
			// To load automatic the items - it�s not necessary in the load resources
			ads_items_tmp.push({name: data.imagem.replace(".png",""),	type: "image",	
			src: ""+ ads_items_path + "" + data.imagem + ""});
			countItems++;
			// Add index of item in de array to use in inventory
			data.itemIndex = i;
			
			//ads_items_data.push(data);
		});
		
		//Get data to items - It's not necessary $.each without []
		ads_items_data = data.items;
		
		// Copy array ads_items_tmp to ads_items_final to load resource items
		load_ads_items = ads_items_tmp.slice();
		
		//Get NPC data
		// $.each(data.npc, function(i,data)
		// {
			// countNpc++;
			// adsNpcData.push(data);		
		// });
		
		//Get questions data
		// $.each(data.questions, function(i,data)
		// {
			// countQtn++;
			// adsQtnData.push(data);		
		// });
		
		//Get triggers data
		// $.each(data.triggers, function(i,data)
		// {
			// countTrg++;
			// triggersData.push(data);		
		// });
		
		// //Get specialItems data
		// $.each(data.specialItems, function(i,data)
		// {
			// countSI++;
			// specialItemsData.push(data);		
		// });

		//Get throwers data
		// $.each(data.throwers, function(i,data)
		// {
			// countThrow++;
			// throwersData.push(data);		
		// });
		
		//Get npcData data - It's not necessary $.each
		specialItemsData = data.specialItems;
		
		//Get npcData data - It's not necessary $.each
		adsNpcData = data.npc;
		
		//Get projectilData data - It's not necessary $.each
		projectilsData = data.projectils;
		
		//Get data to map effects - It's not necessary $.each without []
		mapEffectsData = data.mapEffects;
		
		//Get data to triggers - It's not necessary $.each without []
		triggersData = data.triggers;
		
		//Get data to throwers - It's not necessary $.each without []
		throwersData = data.throwers;
        
        //Get data where don't swamp items
		noItemsData = data.noItems;
		
		console.log("noItemsData", noItemsData);
		

		// console.log("Carregados " + countItems + " Items");
		// console.log("ads_items_data " + ads_items_data + " .");
		
		// console.log("Carregados " + countNpc + " NPC");
		// console.log("adsNpcData " + adsNpcData + " .");
		
		// console.log("Carregados " + countQtn + " Questions");
		// console.log("adsQtnData " + adsQtnData + " .");
		
		// Implement with a new level
		// adsGame.onload( data );
		
		adsGame.onload();
	};
$( function(){
    $.when(
        
        // Load multilingue items file
        $.get( ads_json_files + "itemslang.json" )
        .done( function( data ){
            if( typeof data != "object" ){
                alert( "Data is invalid --- itemslang.json ---" );
            }

            //Get Questions to variable
            adsItemsLangData = data.ItemsLanguages;
           
        })
        .fail( function(){
            alert( "Invalid DATA file! --- itemslang.json ---" );
        }),
        
        // Load multilingue level01 file
        $.get( ads_json_files + "gamedata01lang.json" )
        .done( function( data ){
            if( typeof data != "object" ){
                alert( "Data is invalid --- gamedata01lang.json ---" );
            }

            //Get Questions to variable
            adsNpcLangData = data.npc.languages;
            adsTriggersLangData = data.triggers.languages;
           
        })
        .fail( function(){
            alert( "Invalid DATA file! --- gamedata01lang.json ---" );
        }),
        
        // Get Data for level 01
    	$.get( ads_json_files + "gamedata01.json" )
    		.done( function( data ){
    			if( typeof data != "object" ){
    				alert( "Data is invalid --- gamedata01.json ---" );
    			}
    			// console.debug( "recebi o seguinte", data );
    			lvlData = data; 
    		})
    		.fail( function(){
    			alert( "Invalid DATA file! --- gamedata01.json ---" );
    		}),
    		
    	// Load questions jason data
        $.get( ads_json_files + "questions.json" )
            .done( function( data ){
                if( typeof data != "object" ){
                    alert( "Data is invalid --- question.json ---" );
                }
                // console.debug( "recebi o seguinte", data );
                // init_game( data );
                
                //Get Questions to variable
                adsQtnDataAll = data.questions;
               
            })
            .fail( function(){
                alert( "Invalid DATA file! --- question.json ---" );
            }),
        // Load multilingue system file
        $.get( ads_json_files + "gamelang.json" )
            .done( function( data ){
                if( typeof data != "object" ){
                    alert( "Data is invalid --- gamelang.json ---" );
                }
                // console.debug( "recebi o seguinte", data );
                // init_game( data );
                
                //Get Questions to variable
                adsLangData = data.languages;
               
            })
            .fail( function(){
                alert( "Invalid DATA file! --- gamelang.json ---" );
            })                      
	).done(function(){
	    
	    // Loading Google fonts:
	     (function() 
        {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
            console.log("Loaded... Fonts");
        })(); 
        
        //
        
        //place your code here, the scripts are all loaded
        init_game( lvlData );
        
         console.log("Questions Loaded..", adsQtnData);
    });
});

// create a basic GUI Object
var myButton = me.GUI_Object.extend(
{   
   init:function(x, y , target , text)
   {
      settings = {}
      settings.image = "menubutton";
      settings.spritewidth = 165;
      settings.spriteheight = 52;
      // parent constructor
      this.parent(x, y, settings);
      
      this.mouseover = false;
      
      this.mouseCoordinates = new me.Vector2d();
      
      this.target = target;
      
      this.text = text;
            
      // Register the hover event
      me.input.registerMouseEvent('mousemove', this, this.hover.bind(this));
      
      this.txtDevonshire = new me.Font("Devonshire",28,"white","left");

      this.playOneTime = false;
      
   },
    
    hover: function () {
          //Keep mouse coordinates
          this.mouseCoordinates = new me.Vector2d(me.input.mouse.pos.x,me.input.mouse.pos.y);
    },
    
   // output something in the console
   // when the object is clicked
   onClick:function()
   {
      // don't propagate the event
      console.log("this.target:", this.target );
      if ( this.target == "playScreen"){
            // TODO - Make this to all screens and fadein and out
            me.game.viewport.fadeIn("#000", 500, function () {
                // me.state.change(me.state.PLAY);
                me.state.change(me.state.READY); 
            });
      }else if (this.target == "instructionsScreen") {
          if (!windowMenuOpen){
            adsGame.helpwindow.show();
            windowMenuOpen = true;
          }
      }else if (this.target == "storyScreen") {
           if (!windowMenuOpen){
            adsGame.storywindow.show();
            windowMenuOpen = true;
          }
      }else if (this.target == "topScoresScreen") {
           if (!windowMenuOpen){
            adsGame.scoreWindow.show();
            windowMenuOpen = true;
          }
      }else if (this.target == "creditsScreen") {
           if (!windowMenuOpen){
            // console.log("contentsOfFileAsString", contentsOfFileAsString);
    
            adsGame.creditsWindow.show();
            windowMenuOpen = true;
          }
      }
      return false;
   },
   
    update: function () {
         
         var testMouseCoordinates = new me.Vector2d(me.input.mouse.pos.x,me.input.mouse.pos.y);
         
         //If coordinates not on button mouse leave button
         if ( objectEquals(this.mouseCoordinates, testMouseCoordinates) ){
             this.mouseover = true;
         }else{
             this.mouseover = false;
         }

         if (this.mouseover){
            this.image = me.loader.getImage("menubuttonhover"); 
            // play a "menumouseover" sound
            if ( !this.playOneTime ){
                me.audio.play("menumouseover",false, null, 0.7);
                this.playOneTime = true;
            }
        }else{
            this.image = me.loader.getImage("menubutton");
            this.playOneTime = false;
        }
        // this.parent(this);
        return true;
    },
    
        
   draw:function(context)
   {
       this.parent(context);
       
       // console.log ("this.text.lenght:", this.text.length)
      var correctBrowserFont = 0; 
       if (gameBrowser == "Firefox")
        correctBrowserFont = 8;
       
       this.txtDevonshire.draw(context,language.system[this.text],this.pos.x + (60 - this.text.length) ,this.pos.y + 5 + correctBrowserFont);
       
   },
    
   onDestroyEvent:function()
   {
       //Close window if is one open before play game
       if (windowMenuOpen){
           if (this.target == "instructionsScreen") {
                adsGame.helpwindow.hide();
          }else if (this.target == "storyScreen") {
                adsGame.storywindow.hide();
          }else if (this.target == "creditsScreen") {
                adsGame.creditsWindow.hide();
          }else if (this.target == "topScoresScreen") {
                adsGame.scoreWindow.hide();
          }
      }
      console.log("Destroy button!");
      me.input.releaseMouseEvent("mousedown", this);
      me.input.releaseMouseEvent('mousemove', this);
      me.game.remove(this);
      // don't propagate the event
      return true;
   }
});

function objectEquals(x, y) {
    // if both are function
    if (x instanceof Function) {
        if (y instanceof Function) {
            return x.toString() === y.toString();
        }
        return false;
    }
    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }

    // if one of them is date, they must had equal valueOf
    if (x instanceof Date) { return false; }
    if (y instanceof Date) { return false; }

    // if they are not function or strictly equal, they both need to be Objects
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    var p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) ?
            p.every(function (i) { return objectEquals(x[i], y[i]); }) : false;
}

function chooseLanguage( lang ) {
        //Define hero language
        // Testing multilingual feature
        // language.system = adsLangData.portuguese;
        
        language.system = adsLangData[lang];
        
        language.items = adsItemsLangData[lang];
        
        language.npcs = adsNpcLangData[lang];
        
        language.triggers = adsTriggersLangData[lang];
        
        //Get Questions to variable with hero language
        adsQtnData = adsQtnDataAll[lang];
}

function FileHelper()
{}
{
    FileHelper.readStringFromFileAtPath = function(pathOfFileToReadFrom)
    {
        var request = new XMLHttpRequest();
        request.open("GET", pathOfFileToReadFrom, false);
        request.send(null);
        var returnValue = request.responseText;

        return returnValue;
    }
}
        
