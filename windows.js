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
 * message.
 * @class
 * @extends 
 * @constructor
 * @param msgData (.msgImage, .msgName, .msg)
 * @example
 * 
 */
 
adsGame.message =  Object.extend({
	"init" : function init() {
		this.messageShowing = false;
		
		this.leftClickMouse = false;		
		
		console.log('Init message class...');
	},
	"show": function show(msgData) {
			if (!this.messageShowing){
			     
			     // Create html in messagelayer DIV
                var $messageBoxHtml = ('<img class="msgImage" src="" alt="">' +
                    '<div class="titleText"></div>' +
                    '<div class="msgText"></div>' +
                    '<div class="mouseLeftClick"></div>');
                    
                $('#messageLayer').append($messageBoxHtml);
                
                //Positioning mouse image
                var mouseLeftClickCSS = { 'position' : 'absolute' , 'bottom': 12 , 'right': 28 };

                $(".mouseLeftClick").css( mouseLeftClickCSS );
                
                $('.mouseLeftClick').hide();
                
				//Fill fields from question box with msgData
				$('.msgImage').attr({
				'src' : 'content/' + msgData.msgImage,
				'alt' : 'Testing...',
				'height' : '48px',
				'width' : '48px'
				});
				
				$('.titleText').html( msgData.msgName );
				$('.msgText').html( msgData.msg );

				$('#messageLayer').fadeIn( 250, function() {
				$('.msgText').scrollTop(0);
				});
				
                // Get Click from user
                $('.msgText').bind('click' , ( function () { 
                    // play a "buttonclick" sound
                    me.audio.play("buttonclick");
                    this.leftClickMouse = true; 
                } ).bind(this));
                
				// console.log("Show message...");
				this.messageShowing = true;
			}
	},
		
	"hide": function hide() {
		if (this.messageShowing){
            $('#messageLayer').fadeOut( 20 , function(){
                // When finish to fade out 
                showingShop = false;
                //lears all the child divs, but leaves the master intact.
                $("#messageLayer").children().remove();
                 // $('#shopLayer').remove();
                 $('.msgText').unbind('click');
                 
                 //Reset left click
                 this.leftClickMouse = false;   
            });		    
	
			// console.log("hide message...");
			this.messageShowing = false;
		}
	}
});

adsGame.Shop =  Object.extend({
    "init" : function init() {
        this.buyItem = -1;
    },
    
    "show" : function show ( npcObject ){
        if ( !showingShop ){
            
            // play a "shopbells" sound
            me.audio.play("shopbells" , false , null , 0.3);
        
            var $itemsBoxHtml = ('<img class="npcImage" src="" alt="">' + 
                                '<div class="shopName"></div>' +
                                '<div class="npcInfo"></div>' + 
                                '<div class="buy1"></div>' + 
                                '<div class="buy2"></div>' +
                                '<div class="buy3"></div>' + 
                                '<div class="goldValue"></div>' +
                                '<div class="goldAnswer"></div>');
                                
            $('#shopLayer').append($itemsBoxHtml);

            $('#shopLayer').fadeIn( 250 );
            
            //Show fields from question box with data
            $('.npcImage').attr({
            'src' : 'content/sprites/' + npcObject.imagem.replace(".png", "_face.png"),
            'alt' : 'Testing...' 
            });
            $('.shopName').html( language.npcs[npcObject.loja.nome] );
            $('.npcInfo').html( language.npcs[npcObject.loja.bemVindo] );
            
            var self = this;
            
             $.each(npcObject.loja.produtos, function(i, data){ 
                var itemNumber = i + 1;
                var itmName = language.items[ads_items_data[data.itemIndex].nome];
                var itmValue = ads_items_data[data.itemIndex].valor;
                var itmGive = language.items[ads_items_data[data.itemIndex].categoriaDesc];
                var price = data.preco;
                $('.buy' + itemNumber ).html('(' + i + ') ' + itmName + ' + ' + itmValue + ' ' + itmGive + '</br>&emsp;&ensp; (' + price  + ' Moedas)');
             });
             
             $('.goldValue').html( language.system.TRshopWhatBuy );
             
            // Create event listener to get answer from player
            $(document).keyup(function(event) {
                var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
                // If correct answer return true else return false
                if (keyPressed =='0' || keyPressed =='1' || keyPressed =='2'  ) {    
                    // Return player answer
                    self.buyItem =Number(keyPressed);
                    self.buy( npcObject.loja.produtos[self.buyItem] );
                }
            });
            
            // Create a event listener to get the ansewer from the mouse 
            // $('#shopLayer  > div') same as $('#shopLayer').children("div")
            $('#shopLayer  > div').bind('click', function() {
                // play a "buttonclick" sound
                me.audio.play("buttonclick");
                var buyItemNumber = this.className;
                
                // If class start with r then is a answer get the answer from player
                if (buyItemNumber.indexOf("buy") == 0){
                   
                    self.buyItem = Number(buyItemNumber.substr(3,1) -1);
                     // console.log("This is a answer...", self.buyItem);
                    //Remove event listener
                    // $('#shopLayer  > div').unbind('click');
                    
                    // By item
                    self.buy( npcObject.loja.produtos[self.buyItem] );
                }
            });
            //Message box is showing - avoid call over and over again
            showingShop = true;
            
            // console.log("Sell item to hero:");
        } // Show shop only one time
    },
    
    "hide" : function hide (){
        // play a "closingwindows" sound
        me.audio.play("closingwindows");
        
        $('#shopLayer').fadeOut( 50 , function(){
            // When finish to fade out 
            showingShop = false;
            //lears all the child divs, but leaves the master intact.
            $("#shopLayer").children().remove();
             // $('#shopLayer').remove();
        });
        // Remove event listener to get answer from player
        $(document).unbind();
        $("*", "#shopLayer").unbind("click");
    },
    
     "buy" : function buy( itemObject ){
         if ( typeof itemObject !== "undefined"){
             // console.log("Buy Item Object:" , itemObject);
             var testOptions = "";
             var testOneItem = false;
             // Get hero money
             var heroGold = me.game.HUD.getItemValue("ouro");
             
             // if there is enough money add item to inventory
             if ( heroGold >= itemObject.preco){
                 // If item can buy only one time check if hero already have the item send a message if yes
                if ( itemObject.soUm ){
                    $.each(heroItems, function(i,data)
                    {
                         // console.log("Hero Items:::::" , data.itemIndex);
                        if ( typeof data !== 'undefined'  && typeof data.specialItem !== 'undefined' && data.itemIndex == itemObject.itemIndex ){                       
                            testOneItem = true;
                        }
                    });
                    
                    if ( testOneItem ){
                        testOptions = "CHOO"//"SÃ³ podes ter um item destes.";
                    }else{
                        if ( specialItemfullInventory ) { // if only one then is a special item
                            testOptions = "IF";
                        }else{  
                            testOptions = "TD"; //"Obrigado.";
                        }
                    } 
                }else  if ( fullInventory   ) {
                    testOptions = "IF";
                 }else  if ( adsGame.Inventory.itemExists( ads_items_data[itemObject.itemIndex] )  == -2  ) {
                     testOptions = "MAXITEMS";
                 }else{   
                    testOptions = "TD"; //"Obrigado.";
                 }
             }else{ // else send a message to goldAnswer "hero doesn't have enough money"
                 testOptions = "NEG"; //NÃ£o tens ouro suficiente."
             }
             
             var answerToHero = "";
    
             switch ( testOptions ){
                 case "CHOO":
                    answerToHero = language.system.TRshopOnlyOne;
                 break;
                 case "MAXITEMS":
                    answerToHero = language.system.TRshopMaxItemsType;
                 break;                 
                 case "TD":
                    answerToHero = language.system.TRshopThanks;
                     // remove the value of item in gold from hud
                    me.game.HUD.updateItemValue("ouro", -itemObject.preco)
                    
                    // make the transaction - give item to hero
                   // Add item to hero
                   // if itemObject.soUm is true then is a special item
                    if ( itemObject.soUm ) {
                        ads_items_data[itemObject.itemIndex].specialItem = true;
                   }
                   
                   adsGame.Inventory.addItem(ads_items_data[itemObject.itemIndex]);
                    
                 break;
                 case "NEG":
                    answerToHero = language.system.TRshopNotGold;
                 break;
                 case "IF":
                    answerToHero = language.system.TRshopinvFull;
                 break;              
             }
             
             $('.goldAnswer').html(answerToHero);
         }
    }
});

adsGame.QuestionQuest =  Object.extend({
    "init" : function init( npcName , objCall ) {
        // How many right answers
        this.rightQuestions = 0;
        
        // Object that call this challenge. To remove trigger if player wins
        this.objCall = objCall;
        
        // Get npc name
        this.npcName = npcName;
        
        //Quest is showing?
        this.showQuestionQuest = false;
        
        // Make this only one time
        this.oneTime = false;
        
        // Get NPC data who challenged hero
        this.npcData = adsNpcData[ npcName ];
        
        //Get palyer entity
        this.player = adsGame.heroEntity();
        
        // Current question to hero
        this.currentQuestion = 0;
        
        // Wrong answers
        this.wrongAnswer = 0;
        
        // Right answers
        this.rightAnswers = 0;
        
        // Get keys for questions data         
        this.adsQtnDataKeys = Object.keys(adsQtnData);
        
        // Add one more question
        this.questionCount = 1;
        
        //DEBUG
        this.debugCount = 0;
        
        // The NPC object
        this.npcObject = me.game.getEntityByName ( npcName );
        
        if ( this.npcData.questionQuest.salvaPrisioneiro !== undefined){
            this.prisonerObject = me.game.getEntityByName ( this.npcData.questionQuest.salvaPrisioneiro );            
        }
        
        // console.log("this.prisonerObject :" , this.prisonerObject );
    },
    
    "play" : function play(){
        //Stop Player
        this.player.setVelocity(0,0);
                    
        // Show question quest layer
        if ( !this.showQuestionQuest ){
            this.show();
        }
        
        //Ask hero if he accept the challenge first time only
        if ( !this.oneTime ){
            this.heroDecision( 'acceptChallenge' );
            this.oneTime = true;
        }

    },
    
    "show" : function show( ){
        
        // play a "openingwindows" sound
        me.audio.play("openingwindows");
        
        var $questionBoxHtml = ('<div class="questTitleText"></div>' + 
                                                 '<img class="questHeroImage" src="" alt="">' +
                                                 '<img class="questEnemyImage" src="" alt="">');
        
        $('#questionQuestLayer').append($questionBoxHtml);
        
        // Window quest title
        $('.questTitleText').html( language.system.TRqstQuestName );
        
        //Hero face
        $('.questHeroImage').attr({
        'src' : 'content/sprites/h_male01_face.png'});

        //Enemy face
        var npcFaceImage = this.npcData.imagem.replace(".png","_face.png");
        
        $('.questEnemyImage').attr({
        'src' : 'content/sprites/' + npcFaceImage });
        
        // $('.questStarImage').attr({
        // 'src' : 'content/gui/star_gold32.png'});       
        
        $('#questionQuestLayer').fadeIn( 250 );
        
        // Is showing question quest
        this.showQuestionQuest = true; 
    },
    
    //Ask hero if he accept the challenge
    "heroDecision" : function heroDecision( information ){
        
        var buttonsInf = '<div id="button_yes" ><a class="button"></a></div>';                           
        var questionToHero = "";
        var button_yes = "";
        var button_no = "";
        var button_yes_css = { 'position' : 'absolute' , 'top': 290 , 'left': 120 };
        var button_no_css = "";
        var npcChallengeInfo = "";
        
        if ( information == "acceptChallenge" ||  information == "acceptChallengeAgain" ){
            
            // add button no for this cases
            buttonsInf = buttonsInf + '<div id="button_no" ><a class="button"></a></div>';
            
            if ( information == "acceptChallenge"){
                npcChallengeInfo =  language.npcs[this.npcData.questionQuest.desafiaHeroi] ;
                questionToHero = language.system.TRqstQuestAccept;
            }else{
                npcChallengeInfo =  language.npcs[this.npcData.questionQuest.msgVence] ;
                questionToHero = language.system.TRqstQuestTryAgain;
            }
            
            button_yes = language.system.TRyes;
            button_no = language.system.TRno;
            button_no_css = {  'position' : 'absolute' ,  'top': 290 , 'left': 180 };
            
        }else if ( information == "heroWinChallenge" ){
            npcChallengeInfo =  language.npcs[this.npcData.questionQuest.msgPerde] ;
            questionToHero = language.system.TRcongratulations;
            button_yes = language.system.TRresume;
        }
        
        var self = this;
        
        var $questBoxHtml = ('<div id="heroInformationChallenge">' +
                                                '<div class="npcChallengeInfo"></div>' + 
                                                '<div class="questionToHero"></div>' + 
                                                '<div id="heroInput">' +
                                                    buttonsInf +
                                                '</div>' +
                                            '</div>' );
        
        $('#questionQuestLayer').append( $questBoxHtml );
        
        // Window quest title
        $('.npcChallengeInfo').html( npcChallengeInfo );
        $('.questionToHero').html( questionToHero );
        
        //Positioning buttons
        $("#button_yes").css( button_yes_css );
                
        // Buttons text
        $('#button_yes > a').html( button_yes );
        
        // Use this button only if not heroWinChallenge
        if ( information !== "heroWinChallenge" ){
            $('#button_no > a').html( button_no );
            $("#button_no").css( button_no_css );
        }
        
        $('#heroInput  > div').bind('click', function() {
            // play a "buttonclick" sound
            me.audio.play("buttonclick");
            // Get answer from player
            var playerChoice = this.id;

            if ( playerChoice == "button_yes" && ( information == "acceptChallenge" ||  information == "acceptChallengeAgain"  ) ){
                // console.log ("You accept the challenge.");
                
                // Remove question to hero if accepts challenge
                $('#heroInformationChallenge').fadeOut( 1000 , function(){
                    //lears all the child divs, but leaves the master intact.
                    $("#heroInformationChallenge").remove();
                    
                    // Goto questions
                    self.makeQuestion();
                });
                
                // If hero wants to play again then reset game
                if  ( information == "acceptChallengeAgain"  ){
                    // Remove star div's
                    $("div[id^='starSlot']").remove();
                    
                    //Init game again
                    self.init( self.npcName , self.objCall );
                    
                    // NPC get all health in the new challenge
                    self.npcObject[0].setNPCHealth ( self.npcData.vida );
                }
                
            }else if ( playerChoice == "button_yes" &&  information == "heroWinChallenge" ){
                    // Remove trigger hero wins the challenge
                    me.game.remove( self.objCall );
                    
                    // free prisoner
                    if ( self.prisonerObject !== undefined)
                        self.prisonerObject[0].freeNPCPrisoner();
                        
                        self.hide();
                        
                        // console.log(" Hero win and button continuar called....");
             }else{
               // console.log(" Hero don't accept challenge....");
               self.hide();
            }
        });

    },

    "makeQuestion" : function makeQuestion( number ){
        
        this.debugCount++;
        // console.log("How many times call question :" , this.debugCount);
        
        var self = this;
        // Get current question data
        this.currentQuestion = this.adsQtnDataKeys.length - this.questionCount;

        var questionData = adsQtnData[ this.adsQtnDataKeys[ this.currentQuestion ] ];
                 
        // One more Question
        this.questionCount++;
        
        // Set question div
        var $questBoxHtml = ('<div id="heroQuestions">' +
                                                '<div class="questionQuestText"></div>' + 
                                                '<div id="acceptAnswerQuest">' +
                                                    '<div class="QuestR1"></div>' +
                                                    '<div class="QuestR2"></div>' +
                                                    '<div class="QuestR3"></div>' +
                                                '</div>' +
                                                '<div class="questSate"></div>' +
                                            '</div>' );
        
        $('#questionQuestLayer').append( $questBoxHtml );
        
        //Adapt answers to question length
        var questionLength = questionData.pergunta.length;
        
        if ( questionLength > 0 && questionLength < 39 ){
            // console.log("One Line...");
            $(".questionQuestText").css({'height': 20});
            $(".QuestR1").css({'top' : 210});
            $(".QuestR2").css({'top' : 235});
            $(".QuestR3").css({'top' : 260});
        }else if ( questionLength > 38 && questionLength < 77 ){
            // console.log("Two Lines...");
            $(".questionQuestText").css({'height': 40});
            $(".QuestR1").css({'top' : 230});
            $(".QuestR2").css({'top' : 255});
            $(".QuestR3").css({'top' : 280});
        }else{
            $(".questionText").css({'height': 60});            
            // console.log("Three Lines...");
            $(".questionQuestText").css({'height': 60});
            $(".QuestR1").css({'top' : 250});
            $(".QuestR2").css({'top' : 275});
            $(".QuestR3").css({'top' : 300});
        }       
        //Hide question
        $('#heroQuestions').hide();

        $('.questionQuestText').html( questionData.pergunta );
        $('.QuestR1').html( "(1) " + questionData.r1 );
        $('.QuestR2').html( "(2) " + questionData.r2 );
        $('.QuestR3').html( "(3) " +questionData.r3 );      
        $('.questSate').html( language.system.TRgoodCorrectAnswer + " +2 " + language.system.TRknowledge + "<BR>" +
                                         language.system.TRbadWrongAnswer + " -2 " + language.system.TRknowledge );
        //Show question                         
        $('#heroQuestions').fadeIn( 1000 );
        
        //Create hero answer variable that return
        var heroAnswer = -1;

        // To answer with keys call click method ;)
        $(document).keydown(function(objEvent) {
            // play a "buttonclick" sound
            me.audio.play("buttonclick");
            var keyPressed = (String.fromCharCode(event.keyCode)).toUpperCase();
            
            switch( parseInt (keyPressed) )
            {
            case 1:
              $('.QuestR1').click(); //do click
              break;
            case 2:
              $('.QuestR2').click(); //do click
              break;
            case 3:
              $('.QuestR3').click(); //do click
              break;
            default:
                //Stop Player
                self.player.setVelocity(0,0);
                break;
            }
        });

        // Create a event listener to get the ansewer from the mouse 
        // $('#questionLayer  > div') same as $('#questionLayer').children("div")
        $('#acceptAnswerQuest  > div').bind('click', function( event ) {
            // play a "buttonclick" sound
            me.audio.play("buttonclick");
             //Stop Player
             self.player.setVelocity(0,0);
                
            var answer = this.className;

            // Get last char from string and make number
            heroAnswer = parseInt ( answer.substr(answer.length - 1) , 10 );

            $('#heroQuestions').fadeOut( 1000 , function(){
                // Remove Question div
                $("#heroQuestions").remove();
                
                //Remove event listener
                $('#acceptAnswerQuest  > div').unbind('click');
                // Call make questions again
                self.validateQuestion ( questionData , heroAnswer );
            });
                
        });
    },
    
    "validateQuestion" : function validateQuestion ( questionData , heroAnswer ){
            
        var rightAnswer = parseInt ( questionData.correta );
        
        if ( rightAnswer === heroAnswer) {
            // console.log("You are the best right answer...");
            
            // play a "goodanswer" sound
            me.audio.play("goodanswer");
            
            // Put a star on hero
            this.putStar ( this.rightAnswers , 'Hero' );
            
            // Count another right answer
            this.rightAnswers++;
            
            // Add 2 knowledge point to hero
            me.game.HUD.updateItemValue('conhecimento' , 2 );
            
            // Remove live to NPC
            this.npcObject[0].removeHealth ( 10 );            
            
            //make another question or finish the quest game
            if (this.rightAnswers == 5){
                this.finishQuestionQuest( 'Hero' );
            }else{            
                this.makeQuestion();
            }
        }else{
            // console.log("Try again wrong answer...");
            
            // play a "badanswer" sound
            me.audio.play("badanswer");
        
            // Put a star on npc
            this.putStar ( this.wrongAnswer , 'Npc' );
            
            // Count another right answer
            this.wrongAnswer++;
            
            // Remove -2 knowledge point to hero
            me.game.HUD.updateItemValue('conhecimento' , -2 );
            
             // If 5 wrong questions then player lose
             //make another question or finish game
            if (this.wrongAnswer == 5){
                this.finishQuestionQuest( 'NPC' );
            }else{            
                this.makeQuestion();
            }
        }
    },
    
    "putStar" : function putStar ( starNumber , where ){
            // Put a star to hero or NPC
            if ( where == 'Hero'){
                topPosition = 92;
            }else{
                topPosition = 132;
            }
            
            var $addStarHtml = ('<div id="starSlot' + where + starNumber  + '">' + 
                                              '<img class="questStarImage" src="content/gui/star_gold32.png" alt="">' +
                                              '</div>');

            // Space between stars 
            var spaceBetweenStars = 0;
            
            if ( starNumber < 1){
                spaceBetweenStars = 0;        
            }else{
                spaceBetweenStars = 8;    
            }
                
            var starDivPosition = 129 + ( 32 * starNumber ) + ( spaceBetweenStars * starNumber ) ;

            $('#questionQuestLayer').append( $addStarHtml );
            
            // CSS for the new star
            $("#starSlot" + where + starNumber ).css({
                "position" : "absolute" , 
                "top": topPosition + "px" , 
                "left": starDivPosition + "px" ,
                "width": "32px",
                "height": "32px",
                "border-style" : "none"
            });   
    },
    
    "finishQuestionQuest" : function finishQuestionQuest ( winner ){
        
        // console.log("And the winner is:" , winner);
        if ( winner == "Hero"){
            // play a "redeyeshide" sound
            me.audio.play("redeyeshide");
            // Message to player
            this.heroDecision( 'heroWinChallenge' );
        }else{
            // play a "evillaugh" sound
            me.audio.play("evillaugh");
            
            // Message to player
            this.heroDecision( 'acceptChallengeAgain' );
        }
    },
    
    "hide" : function hide(){
        $('#questionQuestLayer').fadeOut( 500 , function(){
            //lears all the child divs, but leaves the master intact.
            $("#questionQuestLayer").children().remove();
             // $('#shopLayer').remove();
        });
        
        // Remove event listener to get answer from player
        $(document).unbind();
        
        $("*", "#questionQuestLayer").unbind("click");
        
        // Is not showing questions quest anymore
        this.showQuestionQuest = false;
        
        this.QuestWindowClosed = true;
        
        var heroVelocity =  me.game.HUD.getItemValue("velocidade") / 2;
        
        // Player gets is velocity again
        this.player.setVelocity( heroVelocity , heroVelocity );
        

    }
});


 /**
 * helpwindow.
 * @class
 * @extends 
 * @constructor
 * @param msgData (.msgImage, .msgName, .msg)
 * @example
 * 
 */
 
adsGame.helpwindow =  Object.extend({
    "init" : function init() {
        this.helpwindowShowing = false;

        console.log('Init helpwindow class...');
    },
    "show": function show() {
            if (!this.helpwindowShowing){
                
                 // all help screen
                 var $allScreensBoxHtml = (                     
                    '<div id="helpScreen">' + 
                        '<div class="instructionsL1"></div>' +
                        '<div class="imgDIVL1"></div>' +
                        '<div class="instructionsL2"></div>' +
                        '<div class="txtDIVL1"></div>' +
                        '<div class="helpnext"></div>' +
                        '<div class="helpclose"></div>' + 
                    '</div>');
                    
                $('#menuHelpLayer').append($allScreensBoxHtml);
                // In all screens close window
                $('.helpclose').html("[" + language.system.TRclose + "]");
                 
                  // *************** First Screen *****************
                var $firstScreenBoxHtml = (
                        '<div class="imghelpmoveweapons"></div>' +
                        '<div class="helpmoveweaponstext"></div>');
                
                // New to first screen
                $('#helpScreen').append($firstScreenBoxHtml);
                
                //Html data for 1st screen
                $('.instructionsL1').html( "Movimento" );
                $('.instructionsL2').html( "Usar armas" );
                $('.imgDIVL1').html ( "<img src = '"+ ads_images_gui + "helpmove.png'></img>");
                $('.txtDIVL1').html( "W - Cima <br>S - Baixo <br>A - Esquerda <br>D - Direita <br>Também pode usar as setas" );
                $('.imghelpmoveweapons').html ( "<img src = '"+ ads_images_gui + "helpmoveweapons.png'></img>");
                $('.helpmoveweaponstext').html( "1 - Cursor sobre arma <br>2 - Clicar na arma uma vez para ativar arma<br>3 - Clicar no ecrã de jogo para disparar " );
                $(".helpnext").html( language.system.TRcontinue + "  >>");

                // Show first screen
                $('#menuHelpLayer').fadeIn(500);
                
                //If click next clear fields from previous screen and add the new ones and html data
                $('.helpnext').bind('click', {self: this} ,function( event ) {
                    
                    // Fade out the first screen and when done show the second help screen
                    $('#helpScreen').fadeOut(500 , function () {
                        
                        // Remove divs from older screen 
                        //* Don't remove instructionsL1, imgDIVL1 , instructionsL2 and helpnext used in the new screen
                        $('.imghelpmoveweapons').remove();
                        $('.helpmoveweaponstext').remove();
                        
                        //Add the new divs
                        var $secondScreenBoxHtml = (
                            '<div class="imghelpquestionsquest"></div>' +
                            '<div class="txthelpquestionsquest"></div>');
                            
                        // New to second screen
                        $('#helpScreen').append($secondScreenBoxHtml);
                        
                        // New html data for screen two
                        $('.instructionsL1').html( "Perguntas" );
                        $('.imgDIVL1').html ( "<img src = '"+ ads_images_gui + "helpquestion.png'></img>");
                        $('.txtDIVL1').html ( "Respondes às questões<br>Teclas 1-3<br>Click na resposta<br>Nota: O heroi fica parado.");
                        $('.instructionsL2').html( "Desafio de Perguntas" );
                        $('.imghelpquestionsquest').html ( "<img src = '"+ ads_images_gui + "helpquestionsquest.png'></img>");
                        $('.txthelpquestionsquest').html( "Tens que responder corretamente a 5 perguntas.<br>Não podes errar mais de 5 vezes ou então perdes o desafio.");
                        
                        // Fade in the second screen
                        $('#helpScreen').fadeIn(500);
                        
                        // Remove the old next now call the third help screen
                        $('.helpnext').unbind('click');
                        
                        // Create new click event to call the third screen
                        $('.helpnext').bind('click', function( event ) {
                            // Fade out the second screen and when done show the third help screen
                            $('#helpScreen').fadeOut(500 , function () {
                                // Remove divs from older screen 
                                //* Don't remove instructionsL1, imgDIVL1 , instructionsL2 used in the new screen
                                $('.imghelpquestionsquest').remove();
                                // Remove the old next now call the third help screen
                                $('.helpnext').unbind('click');
                                $(".helpnext").remove();
                                
                                // New html data for third screen
                                $('.instructionsL1').html( "Inventory" );
                                $('.imgDIVL1').css({'top':100, 'left':70});
                                $('.imgDIVL1').html ( "<img src = '"+ ads_images_gui + "helpinv.png'></img>");
                                $('.txtDIVL1').css({'top':105, 'left':160 , 'height': 130});
                                $('.txtDIVL1').html ( "I - Show/Hide inventory <br>" +
                                                                "Mouse:<br>" +
                                                                "Double Click - Use items <br>" + 
                                                                "Click - Select weapon to  use. <br>" +
                                                                "Over - Item information. <br>"+
                                                                "Drag item to map to destroy");
                                $('.instructionsL2').css('top',250);                                
                                $('.instructionsL2').html( "Exemplos" );
                                $('.txthelpquestionsquest').css({'top':281, 'left':136 , 'height': 125 , 'width': 230});
                                $('.txthelpquestionsquest').html( "* Duplo click para usares comida aumenta vida.<br>*Mantêm certos items no inventório para ganhares mais velocidade ou sorte.<BR>*Items especiais não podes destruir, são usados no mapa.");
                                
                                 // Fade in the third screen
                                $('#helpScreen').fadeIn(500);
                                
                            }); // Close fade out of the first screen
                        }.bind(this)); //Close the click event for the third screen                        
                    }); // Close fade out of the first screen
                }); // Close first next click event

                $('.helpclose').bind('click', function( event ) {
                    console.log("Close event...");
                    this.hide();
                }.bind(this));

                // console.log("Show message...");
                this.helpwindowShowing = true;
            }
    },
        
    "hide": function hide() {
        if (this.helpwindowShowing){
            $('#menuHelpLayer').fadeOut( 200 , function(){
                $('.helpclose').unbind('click');
                //lears all the child divs, but leaves the master intact.
                $("#menuHelpLayer").children().remove();
            });
    
            // console.log("hide message...");
            this.helpwindowShowing = false;
            
            windowMenuOpen = false;
        }
    }
});


 /**
 * storywindow.
 * @class
 * @extends 
 * @constructor
 * @param msgData (.msgImage, .msgName, .msg)
 * @example
 * 
 */
 
adsGame.storywindow =  Object.extend({
    "init" : function init() {
        this.storywindowShowing = false;

        console.log('Init story window class...');
    },
    "show": function show() {
            if (!this.storywindowShowing){
                 
                 // Create html in messagelayer DIV
                var $messageBoxHtml = (
                    '<div class="storytitle"></div>' +
                    '<div class="storytext"></div>' +
                    '<div class="storynext"></div>' +
                    '<div class="storyclose"></div>'+
                    '<div class="fire"></div>'+
                    '<img class="candlefire" src = "content/gui/candlefire.png"></img>');
                    
                $('#menuStoryLayer').append($messageBoxHtml);
                
                //Prepare candle fire
                $('.fire').fire({
                    speed:20,
                    maxPow:2,
                    minPow: 1,
                    gravity:12,
                    flameWidth:4,
                    flameHeight:1,
                    plasm:false,
                    fireTransparency:35,
                    globalTransparency:10,
                    fadingFlameSpeed:4,
                    mouseEffect:true,
                    maxPowZone: "center",
                    burnBorders: false,
                    yOffset: 0
                }); 
                
                $('.storytitle').html( language.system.TRgameName );
                 
                $('.storyclose').html( "[" + language.system.TRclose + "]" );
                
                $('.storyclose').bind('click', function( event ) {
                    console.log("Close event...");
                    this.hide();
                }.bind(this));

                //Make html space lines
                // <p style='padding-bottom:170px'> </p>

                $('.storytext').html ( "<img src = '"+ ads_images_path + "storyimage.png'>" + language.system.TRmenuFullStory  );
                
                 // CSS for the new star
                // $(".storylogoimage").css({
                    // "border-style" : "none"
                // });   
            
                $('#menuStoryLayer').fadeIn( 250);
                
                // Scroll text down
                $('.storytext').animate({
                scrollTop: 418}, 20000,function(){
                                            $(".storynext").html( language.system.TRcontinue + "  >>");
                                            $(".storynext").bind('click', function(){
                                                $(".storynext").unbind('click');
                                                $('.storytext').animate({
                                                scrollTop: 590}, 10000, function(){
                                                    $(".storynext").css({"left" : "265px"});   
                                                    $(".storynext").html( language.system.TRgoodLuck);
                                                    });
                                            });
                                            }
               );
                
                // console.log("Show message...");
                this.storywindowShowing = true;
            }
    },
        
    "hide": function hide() {
        if (this.storywindowShowing){
            $('#menuStoryLayer').fadeOut( 200 , function(){
                $('.storyclose').unbind('click');                
                //lears all the child divs, but leaves the master intact.
                $("#menuStoryLayer").children().remove();
            });
    
            // console.log("hide message...");
            this.storywindowShowing = false;
            
            windowMenuOpen = false;
        }
    }
});