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

// **********************
// **** Ecrã inicial - Menu****
// **********************
var TileScreen = me.ScreenObject.extend(
{
	// Contrutor
	init: function()
	{	    
		this.parent(true);
		this.title = null;
		// Configurar fontes usadas no ecrã inicial - fonte,tamanho,cor,alinhamento
		this.txtMedievalSharp = new me.Font("MedievalSharp",18,"white","right");
		this.txtDevonshire = new me.Font("Devonshire",28,"brown","left");
        // Disable right click mouse
        $('#adsGame').bind("contextmenu",function(e){
            e.preventDefault();
        });
        
        var menuStartYPosition = 15;
        var sizeBetweenButtons = 50;
        
        this.menuButtons = [
            {"text": "TRmenuPlay", "target":"playScreen" , "pos":{"x": 437 , "y" : menuStartYPosition }},
            {"text": "TRmenuStory", "target":"storyScreen" , "pos":{"x": 437 , "y" : menuStartYPosition + (sizeBetweenButtons * 1)}},
            {"text": "TRmenuHelp", "target":"instructionsScreen" , "pos":{"x": 437 , "y" : menuStartYPosition +  (sizeBetweenButtons * 2)}},
            {"text": "TRmenuTopScores", "target":"topScoresScreen" , "pos":{"x": 437 , "y" : menuStartYPosition +  (sizeBetweenButtons * 3)}},
            {"text": "TRmenuCredits", "target":"creditsScreen" , "pos":{"x": 437 , "y" : menuStartYPosition +  (sizeBetweenButtons * 4)}}
        ];
	},
	
	onResetEvent: function()
	{
		if(this.title == null)
		{
			this.title = new me.ImageLayer("initialscreen", 800, 520, "initialscreen",1, 1);
			// this.title = me.loader.getImage("initialscreen");
		}
		
		      //Config mouse cursor over game div with jquery
        $('#adsGame').css('cursor', "url('data/gui/point_cur.cur'),crosshair");
				
		// Provisório até fazer menu (Para entra no jogo)
        // me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        
        // Add background music
        // play the audio track
         // if ( backgroundMusic ){
                me.audio.playTrack( _Globals.music.start, _Globals.music.volume);
         // }
         
        // console.warn('tas a brincar?');
        
        // If restart then remove the last click event and create a new one
        if ( _Globals.restartGame){
            // console.log("backgroundMusic after restart:" , backgroundMusic);
            $("#music_button").unbind("click");
            $("#sfx_button").unbind("click");
        }
        
        // Enable/Disable music
        $("#music_button").click(function() {
            // play a "buttonclick" sound
            me.audio.play("buttonclick");
            
            if ( backgroundMusic ){
                $("#music_button").attr({ src: "data/gui/musicoff.png" });
                me.audio.pauseTrack();
                backgroundMusic = false;
            }else{
                $("#music_button").attr({ src: "data/gui/musicon.png" });
                me.audio.resumeTrack();
                backgroundMusic = true;
            }
            // console.log("backgroundMusic:", backgroundMusic );
            return false;
        });
        
        //Show language div not in game
        $('#flag_pt').show();
        $('#flag_en').show();
        
        // Change game Language
        $("#flag_pt").click(function() {
            // console.log("Change Language to portuguese.");
            chooseLanguage( "portuguese" );
            //Init game name
            $('#msgGameName').html( language.system.TRgameName );
        }); 
        
        $("#flag_en ").click(function() {
            // console.log("Change Language to english.");
            chooseLanguage( "english" );
            //Init game name
            $('#msgGameName').html( language.system.TRgameName );
        });      
        
        // Enable/Disable sfx
        $("#sfx_button").click(function() {
        // play a "buttonclick" sound
        me.audio.play("buttonclick");
            
          if ( backgroundMusic ){
            $("#sfx_button").attr({ src: "data/gui/sfxiconoff.png" });
            me.audio.muteAll();
            backgroundMusic = false;
          }else{
            $("#sfx_button").attr({ src: "data/gui/sfxiconon.png" });
            me.audio.unmuteAll();
            backgroundMusic = true;
          }
        });        
        
        // DEBUG - Remove sound while working
        // me.audio.muteAll();

         // add the object at pos (10,10), z index 4
        me.game.add(this.title,1);
         
         // TODO - Make Function MENU***************
         // add four buttons, z index 2


         $.each(this.menuButtons , function(i,data){
             me.game.add((new myButton( data.pos.x , data.pos.y , data.target, data.text)),2);
         });
        
        me.game.sort.defer();

	},
	// update function
    update: function() {
        // To avoid music play when window lost focus and music disabled
        if ( !backgroundMusic ){
            me.audio.pauseTrack();
        }else{
            me.audio.resumeTrack();
        }
        
        // if (me.input.isKeyPressed('enter')) {
            // // TODO - Make this to all screens and fadein and out
            // me.game.viewport.fadeIn("#000", 500, function () {
                // me.state.change(me.state.PLAY);
            // });
//             
        // }
        // console.log("Menu screen update...");
        return true;
	},
	
	onDestroyEvent: function()
    {
        // Remove language clicks handler
        $('#flag_pt').unbind('click');
        $('#flag_en').unbind('click');
        
        //Hide language div not in game
        $('#flag_pt').hide();
        $('#flag_en').hide();
        
        // $("#music_button").unbind("click");
        // $("#sfx_button").unbind("click");
    }
});


// **************************
// **** Fim Ecrã inicial  - Menu****
// **************************

// **********************
// **** Ecrã de jogo ****
// **********************
var PlayScreen = me.ScreenObject.extend(
{
	onResetEvent: function()
	{	
	    
	    //Pause game on pause
        me.sys.pauseOnBlur = true;
	            
		// Ler o primeiro nível
		me.levelDirector.loadLevel("map01");
		
		// Show inventory when game start
		adsGame.Inventory.show();

        // Create a set HUD
        adsGame.initHUD();

		//Config mouse cursor over inventory div with jquery
		$('#inventoryLayer').css('cursor', "url('data/gui/inv_cur.gif'),pointer");

		// If restart then play music again
        if ( _Globals.restartGame){
            me.audio.playTrack( _Globals.music.start, _Globals.music.volume);
        }
	},

	update: function () 
	{
        // To avoid music play when window lost focus and music disabled
        if ( !backgroundMusic ){
            me.audio.pauseTrack();
        }else{
            me.audio.resumeTrack();
        }
        // console.log("Game Loop..." , adsGame.helpwindow.isShowing());
        
        // console.log("isRunning out ():" , me.state.isRunning());
        
        // If pause onblur and help or finish window is showing then continue on pause
        if (adsGame.helpwindow.isShowing() || adsGame.lvlFinishedWindow.isShowing() || adsGame.heroDies.isShowing()){
            if(me.state.isRunning()){
                me.state.pause();
            }
        }
	},

	onDestroyEvent: function()
	{
		me.game.disableHUD();
		// stop the current audio track
        me.audio.stopTrack();
	}

});
// **************************
// **** Fim Ecrã de jogo ****
// **************************

// ************************
// **** Loading Screen ****
// ************************

adsGame.showLogo = function showLogo(callback) {
    adsGame.showLogo = new Image();
    adsGame.showLogo.onload = callback;
    adsGame.showLogo.src ='data/images/itsimpleslogo.png';
}

adsGame.LoadScreen = me.ScreenObject.extend({
    "init" : function () {
        this.parent(true);
        
        console.log("Init Load screen ...");
        // ----- Set DIV width to fit the inventory, message and question box
        $('#adsGame').css("width", _Globals.canvas.width);

        // Create a new scaled image
        var img = adsGame.showLogo;

        this.logo = img ;


        // Flag to cause a redraw
        this.invalidate = false;

        // Handler for loading status bar
        this.handler = null;

        // Loading progress percentage
        this.loadPercent = 0;
        
        // Disable pause on lost focus because on fade logo screen if lost focus and pause game stop
        me.sys.pauseOnBlur = false;
     

    },

    "onResetEvent" : function onResetEvent() {
        this.handler = me.event.subscribe(
            me.event.LOADER_PROGRESS, this.onProgressUpdate.bind(this)
        );
    },
    
    "onDestroyEvent" : function onDestroyEvent() {
        me.event.unsubscribe(this.handler);
        console.log("Destroy LoadScreen");
    },
    
    "onProgressUpdate" : function onProgressUpdate(progress) {
        this.loadPercent = progress;
        this.invalidate = true;
    },

    "update" : function update() {
        if (this.invalidate) {
            this.invalidate = false;
            return true;
        }

        return false;
    },

    "draw" : function draw(context) {
        var img = this.logo,
            x = (_Globals.canvas.width - img.width) / 2,
            y = (_Globals.canvas.height - img.height) / 2;

        me.video.clearSurface(context, "white");
        // Draw logo
        context.drawImage(
            this.logo,
            x = (_Globals.canvas.width - img.width) / 2,
            y = (_Globals.canvas.height - img.height) / 2
        );

        // Draw progress bar
        var progressBar = Math.floor((this.loadPercent * _Globals.canvas.width) / 8) ;
        var canvas = me.video.getScreenCanvas();
        
        // console.log("this.loadPercent" , this.loadPercent);
        
        drawCanvas(progressBar, canvas ,  context);
        
    }
});
// ****************************
// **** End Loading Screen ****
// ****************************


// ************************
// **** Loading Screen 2 ****
// ************************

adsGame.logoAnimationScreen = me.ScreenObject.extend({
    "init" : function () {
        this.parent(true);

        // Create a new scaled image
        var img = adsGame.showLogo;
        
        this.logo = img ;
    },

    "onResetEvent" : function onResetEvent() {
        // play a "logo" sound
        me.audio.play("logo");
        me.game.viewport.fadeIn("#000", 3000, function () {
               me.state.change(me.state.MENU);
               me.game.remove(this);
        }.bind(this));
    },

    "onDestroyEvent" : function onDestroyEvent() {
         
    },


    "update" : function update() {
        return true
    },

    "draw" : function draw(context) {
        me.video.clearSurface(context, "white");
        // Draw logo
        context.drawImage(
            this.logo,
            x = (_Globals.canvas.width - this.logo.width) / 2,
            y = (_Globals.canvas.height - this.logo.height) / 2
        );
    }
});
// ****************************
// **** End Loading Screen ****
// ****************************

// ************************
// **** Objectives Screen  *
// ************************

adsGame.levelObjectivesScreen = me.ScreenObject.extend({
    "init" : function () {
        this.parent(true);

        this.showObjectives = false;
    },

    "onResetEvent" : function onResetEvent() {
                // Show objectives for the first level
        if(!this.showObjectives){
            // Show objectives level on game play start
            adsGame.objectiveWindow.show();
            // Pause game
            me.state.pause();
            this.showObjectives = true;
        }
    },

    "onDestroyEvent" : function onDestroyEvent() {
        //When the window is called again
        this.showObjectives = false;
        console.log("Objective window destroyed...");
    },

    "update" : function update() {

        return true
    }
});
// ****************************
// **** End Objectives Screen  *
// ****************************
