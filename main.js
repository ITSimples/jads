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

/* 
-----------------------------------
Ficheiro: main.js
ClassName:main
Comment: Classe principal do jogo
Create Date: 26/02/2012 - ITSimples
HTTP://www.itsimples.com  - change to ITSimples Games
-----------------------------------
*/

/* adsGame - Game namespace */
var adsGame = 
{ 
	// Inicializar o Jogo
	onload:function()
	{
		//Inicializar resolução e teste se browser suporta o jogo
		if(!me.video.init('adsGame',ads_width,ads_height,true,1.0)){
			alert("O seu browser não suporta o jogo * Aventura do saber \n Use o Firefox, Chrome ou IE9+ para poder jogar. *");
			return;
		}

		
		
		//Inicializar formato de música a utilizar
		me.audio.init("mp3");
		
		//Callback - Carregar os recursos do jogo quando tudo estiver preparado
		me.loader.onload = this.loaded.bind(this);
		
		// console.log("Loaded... C");
		//Preparar todos os recursos do jogo
		me.loader.preload(ads_resources.concat(load_ads_items));

		//me.loader.preload(ads_resources);
		
		//Mudar estado para ecrã de carregamento do jogo. 
		me.state.change(me.state.LOADING);
		
		// ************ Configurações de DEBUG *************
		//Ver caixa de colisão
		// me.debug.renderHitBox = true;
		
		//Create message box object
		// adsGame.message = new adsGame.message();
		
		// New structure for game
		// adsGame.data = game_data;
		
		//Create Inventory box object
		adsGame.Inventory = new adsGame.Inventory();
		
		adsGame.pathFinder = new  adsGame.pathFinder();
		
		//Create object from prisondoor classe
		adsGame.prisonDoors =  new adsGame.PrisonDoors();

	},
	reboot:function(){
		this.data = null;
	},
	loaded:function()
	{
		// Definir estado Menu 
		me.state.set(me.state.MENU,new TileScreen());
		
		// Definir estado jogo 
		me.state.set(me.state.PLAY,new PlayScreen());		

		// Configurar entidades do mapasw
		// Class HeroeEntity em entities
		//"Heroe" - Nome no mapa .tmx
		me.entityPool.add("Heroe", HeroeEntity);		
		me.entityPool.add("items", ItemEntity);
		me.entityPool.add("items_spawn", ItemSpawnEntity);
		me.entityPool.add("npc_spawn", NpcSpawnEntity);
		me.entityPool.add("doors_spawn", TriggerSpawnEntity);
		me.entityPool.add("throwers_spawn", ThrowersSpawnEntity);
		
		// Configurar teclas a usar, False - Lê mais que uma vez True - Lê várias vezes.
		// Usar true por exemplo para lutar...
		// me.input.bindKey(me.input.KEY.UP, "up", false);
		// me.input.bindKey(me.input.KEY.DOWN, "down", false);
		// me.input.bindKey(me.input.KEY.LEFT, "left", false);
		// me.input.bindKey(me.input.KEY.RIGHT, "right", false);
		
		// Teclas para debug - prefiro :)
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.S, "down");
		
		//Create inventory key
		me.input.bindKey(me.input.KEY.I, "inventory", true);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.T, "touch");
		
		// Iniciar o jogo com o Menu
        //me.state.change(me.state.MENU);
		
		// Debug Mode
		me.state.change(me.state.PLAY);
		
	}
}; // END ****  adsGame *******


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
		heroeAnswer = -1;
		var $questionBoxHtml = ('<img class="qtnImage" src="" alt="">' + 
							'<div class="itemText"></div>' +
							'<div class="questionText"></div>' + 
							'<div class="r1"></div>' + 
							'<div class="r2"></div>' +
							'<div class="r3"></div>' + 
							'<div class="r0"></div>' + 
							'<div class="answerValue"></div>');
							
		$('#questionLayer').append($questionBoxHtml);
		$('#questionLayer').fadeIn( 250 );
		
		//Show fields from question box with data
		rndQtnData = adsQtnData;
		$('.qtnImage').attr({
		'src' : 'content/sprites/items/' + itemData.imagem,
		'alt' : 'Testing...' 
		});
		$('.itemText').html( itemData.descricao );
		$('.questionText').html( rndQtnData.pergunta );
		$('.r1').html('(1) ' + rndQtnData.r1 );
		$('.r2').html('(2) ' + rndQtnData.r2 );
		$('.r3').html('(3) ' + rndQtnData.r3 );
		$('.r0').html('(0) Não responder..');
		$('.answerValue').html('+/-' + itemData.valor + ' de ' + itemData.categoria + '.');
		
		// Create event listener to get answer from player
		$(document).keyup(function(event) {
			var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
			// If correct answer return true else return false
			if (keyPressed =='0' || keyPressed =='1' || keyPressed =='2'|| keyPressed =='3'  ) {	
				// Return player answer
				heroeAnswer = keyPressed;
			}
		});
		
		//Message box is showing - avoid call over and over again
		showingQuestion = true;
	}

	return heroeAnswer;
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
	// C -  if heroe correct answer
	// W -  if heroe answer to the question but it's not the correct one
	// D -  If heroe doesn't answer to the question
	
	// **** TO MAKE - Keep information to the player until press space key
	//				- Show in box question the result of the answer
	//				- Make a new field with that information
    var answerResult ='';
	
	if(answer == 'C')
	{
		answerResult ='Parabéns resposta certa...';
	}else if(answer == 'W')
	{
		answerResult ='Resposta errada...';
	}
	else{		
		answerResult ='Tenta para a próxima...';
	}

	//Hide Question fields
	$('.questionText').fadeOut();
	$('.r1').fadeOut();
	$('.r2').fadeOut();
	$('.r3').fadeOut();
	$('.r0').fadeOut();
	$('.answerValue').fadeOut();
	
	// Kill click events
	$("*", "#questionLayer").unbind("click");
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
	
	
	$(document).keyup(function(event) {		
		$('.answerResult').fadeOut();
		$('.answerResult').remove();
		$('#target').remove();
		$('#questionLayer').fadeOut( 50 , function(){
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

//bootstrap :)
//window.onReady(function(){
	var init_game = function(data)
	{

		// Inicializar variável para ler recursos dos items
		var countNpc = 0;
		var countItems = 0;
		var countTrg = 0;
		var countSI = 0;
		var countThrow = 0;
		var ads_items_tmp=[];
		// console.log("Loaded... A");
		
		//Get data Items
		$.each(data.items, function(i,data)
		{
			// To load automatic the items - it´s not necessary in the load resources
			ads_items_tmp.push({name: data.imagem.replace(".png",""),	type: "image",	
			src: ""+ ads_items_path + "" + data.imagem + ""});
			countItems++;
			// Add index of item in de array to use in inventory
			data.itemIndex = i;
			ads_items_data.push(data);
		});
		
		
		// Copy array ads_items_tmp to ads_items_final to load resouce items
		load_ads_items = ads_items_tmp.slice();
		
		//Get NPC data
		$.each(data.npc, function(i,data)
		{
			countNpc++;
			adsNpcData.push(data);		
		});
		
		//Get questions data
		$.each(data.questions, function(i,data)
		{
			countQtn++;
			adsQtnData.push(data);		
		});
		
		//Get triggers data
		$.each(data.triggers, function(i,data)
		{
			countTrg++;
			triggersData.push(data);		
		});
		
		//Get specialItems data
		$.each(data.specialItems, function(i,data)
		{
			countSI++;
			specialItemsData.push(data);		
		});

		//Get throwers data
		$.each(data.throwers, function(i,data)
		{
			countThrow++;
			throwersData.push(data);		
		});
		
		//Get projectilData data - It's not necessary $.each
		projectilsData = data.projectils;
		

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
	$.get( ads_json_files + "gamedata01.json" )
		.done( function( data ){
			if( typeof data != "object" ){
				alert( "Data is invalid" );
			}
			// console.debug( "recebi o seguinte", data );
			init_game( data );
			
		})
		.fail( function(){
			alert( "Invalid DATA file!" );
		});
});