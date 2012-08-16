/*
 * Aventura do saber, a fantasy action RPG
 * Copyright (C) 2012  ITSimples Francisco Fernandes
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
 
 /**
 * showMessage.
 * @class
 * @extends me.SpriteObject
 * @constructor
 * @param {int} x the x coordinates of the dialog box
 * @param {int} y the y coordinates of the dialog box
 * @param {me.loader#getImage} background image
 * @param {array} an array of dialog phrases (strings)
 * @param {int} width of the textbox
 * @param {int} height of the textbox
 * @param {int} x offset of the textbox inside the background image
 * @param {int} y offset of the textbox inside the background image
 * @param {me#Font} the font used to write the dialog
 * @param {String} tag of the key used to pass the dialog pages
 * @param {function} an optional callback function to be called when the dialog is done
 * @example
 * dialog = new DialogObject(10, 10, background, dialog, background.width - OFFSET_SIZE_TEXT_X, background.width - OFFSET_SIZE_TEXT_Y, OFFSET_DIALOG_X, OFFSET_DIALOG_Y, new me.Font("acmesa",20,"#880D0D", "center"), "enter", activateControls);
 */
 
js_ads_app.showMessage = function showMessage(script, callback) {

};