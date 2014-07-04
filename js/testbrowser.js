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

var gameBrowser = "";

var TRbrowserInfOptimize = "";

var userLang = (navigator.language) ? navigator.language : navigator.userLanguage;

if (userLang.substr(0, 2) == "pt")
    TRbrowserInfOptimize = "* Este jogo está otimizado para o navegador Chrome, Mozilla Firefox e Safari, pode não funcionar corretamente em outros navegadores. *";
else
    TRbrowserInfOptimize = "* This game is optimized for the browser Chrome, Mozilla Firefox and Safari may not work correctly on other browsers. *";

if (navigator.userAgent.indexOf('Firefox') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6) {//Firefox
    gameBrowser = "Firefox";
} else if (navigator.userAgent.indexOf('Chrome') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Chrome') + 7).split(' ')[0]) >= 15) {//Chrome
    gameBrowser = "Chrome";
} else if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Version') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Version') + 8).split(' ')[0]) >= 5) {//Safari
    gameBrowser = "Safari";
} else {
    gameBrowser = "Other";
}

// If not a browser known by game then message to player. Player can try game but maybe not working
if (gameBrowser == "Other") {
    alert(TRbrowserInfOptimize);
    // alert( language.system.TRbrowserInfOptimize );
}

