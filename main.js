/* 
-----------------------------------
Ficheiro: main.js
ClassName:main
Comment: Classe principal do jogo
Create Date: 26/02/2012 - ITSimples
HTTP://www.itsimples.com
-----------------------------------
*/

var js_ads_app = 
{ 
	// Inicializar o Jogo
	onload:function()
	{
		//Inicializar resolução e teste se browser suporta o jogo
		if(!me.video.init('js_ads_app',ads_width,ads_height,false,1.0)){
			alert("O seu browser não suporta o jogo * Aventura do saber \n Use o Firefox, Chrome ou IE9+ para poder jogar. *");
			return;
		}
		
		//Inicializar formato de música a utilizar
		me.audio.init("mp3");
		
		//Callback - Carregar os recursos do jogo quando tudo estiver preparado
		me.loader.onload = this.loaded.bind(this);
		
		console.log("Loaded... C");
		//Preparar todos os recursos do jogo
		me.loader.preload(ads_resources.concat(load_ads_items));

		//me.loader.preload(ads_resources);
		
		//Mudar estado para ecrã de carregamento do jogo. 
		me.state.change(me.state.LOADING);
		
		// ************ Configurações de DEBUG *************
		//Ver caixa de colisão
		me.debug.renderHitBox = true;
		
	},
	
	loaded:function()
	{
		// Definir estado Menu 
		me.state.set(me.state.MENU,new TileScreen());
		
		// Definir estado jogo 
		me.state.set(me.state.PLAY,new PlayScreen());		

		// Configurar entidades do mapa
		// Class HeroeEntity em entities
		//"Heroe" - Nome no mapa .tmx
		me.entityPool.add("Heroe", HeroeEntity);		
		me.entityPool.add("items", ItemEntity);
		me.entityPool.add("items_spawn", ItemSpawnEntity);
		me.entityPool.add("npc_spawn", NpcSpawnEntity);
		
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
		
		// --- TESTING NUMBER INPUT FROM QUESTION BOX
		// me.input.bindKey(me.input.KEY.Y, "Y");
		// me.input.bindKey(me.input.KEY.U, "U");
		// me.input.bindKey(me.input.KEY.I, "I");
		// me.input.bindKey(me.input.KEY.O, "O");
		// --- FINISH TESTING NUMBER INPUT FROM QUESTION BOX
		
		// Iniciar o jogo com o Menu
        //me.state.change(me.state.MENU);
		
		// Debug Mode
		me.state.change(me.state.PLAY);
		
	}
} // END ****  js_ads_app *******

/*
-----------------------------------
File: resources.js
Function: showMessageLayer
Comment: Display a message in the game
-----------------------------------
*/

// var messageShowing = false;

function showMessageLayer(npcData)
{
	//Format face image from the name
	npcFace = npcData.imagem.replace(".png","_face.png");
	
	$('.msgImage').attr({
		'src' : 'content/sprites/' + npcFace,
		'alt' : 'Testing...' 
	});
	$('.titleText,#hiddenText').html( npcData.nome );
	$('.msgText,#hiddenText').html( npcData.mensagem );

	$('#messageLayer').fadeIn( 250, function() {
		$('.msgText').scrollTop(0);
	});
}

/*
-----------------------------------
File: main.js
Function: hideMessageLayer
Comment: hide a message in the game
-----------------------------------
*/
function hideMessageLayer()
{
	$('.msgImage').scrollTop(0);
	$('.titleText').scrollTop(0);
    $('.msgText').scrollTop(0);
    $('#messageLayer').fadeOut();
    messageShowing = false;
}

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
		// Get random item
		rndQtnData = adsQtnData;
		
		$('#questionLayer').fadeIn( 250 );
		$('.qtnImage').attr({
		'src' : 'content/sprites/items/' + itemData.imagem,
		'alt' : 'Testing...' 
		});
		$('.itemText').html( itemData.descricao );
		$('.questionText').html( rndQtnData.pergunta );
		$('.r1').html('(1) ' + rndQtnData.r1 );
		$('.r2').html('(2) ' + rndQtnData.r2 );
		$('.r3').html('(3) ' + rndQtnData.r3 );
		$('.r4').html('(0) Não responder.');
		$('.answerValue').html('+/-' + itemData.valor + ' de ' + itemData.categoria + '.');
		$('#target').focus();
		$("#target").keyup(function(event) {
			var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
			// If correct answer return true else return false
			if (keyPressed =='0' || keyPressed =='1' || keyPressed =='2'|| keyPressed =='3'  ) {	
				// if (keyPressed == rndQtnData.correta){
					// heroeAnswer = true;
					// console.log('Resposta correta.');
				// }else{			
					// heroeAnswer = false;
					// console.log('Resposta errada.');
				// }
				heroeAnswer = keyPressed;
			}
		});
		console.log('Testing how many time question layer ....' + showingQuestion);
		showingQuestion = true;
	}
	
	// if (!heroeAnswer){
		// return false;
	// }else{
		// return true;
	// }

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
    $('#questionLayer').fadeOut();
	
	// * Question - remove from html ????
	// $('#questionLayer').remove();
	$('#target').unbind('keyup');
	
	showingQuestion = false;
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

//bootstrap :)
window.onReady(function() 
{
	$.getJSON(ads_json_files + "gamedata.json",function(data)
	{
		// Inicializar variável para ler recursos dos items
		var countNpc = 0;
		var countItems = 0;
		var ads_items_tmp=[];
		console.log("Loaded... A");
		
		//Get data Items
		$.each(data.items, function(i,data)
		{
			// To load automatic the items - it´s not necessary in the load resources
			ads_items_tmp.push({name: data.imagem.replace(".png",""),	type: "image",	
			src: ""+ ads_items_path + "" + data.imagem + ""});
			countItems++;
			ads_items_data.push(data);		
		});
		
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
		
		// Copy array ads_items_tmp to ads_items_final to load resouce items
		load_ads_items = ads_items_tmp.slice();

		console.log("Carregados " + countItems + " Items");
		console.log("ads_items_data " + ads_items_data + " .");
		
		console.log("Carregados " + countNpc + " NPC");
		console.log("adsNpcData " + adsNpcData + " .");
		
		console.log("Carregados " + countQtn + " Questions");
		console.log("adsQtnData " + adsQtnData + " .");
		
		js_ads_app.onload();
	});
});