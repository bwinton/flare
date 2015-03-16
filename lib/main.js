/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

let prefs = require('sdk/simple-prefs');
let self = require('sdk/self');
let winutils = require('sdk/window/utils');
let xulcss = require('./xulcss');

const kXULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
const CUSTOM_CSS = self.data.url('searchicons.css');

let loaded = false;

// let app = require('sdk/system/xul-app');
let run = function () {
  console.log('Format changed to ' + prefs.prefs.format);
  if (prefs.prefs.format === 0) {
    let window = winutils.getMostRecentBrowserWindow();
    let document = window.document;
    let searchbar = document.getElementById('searchbar');
    let popup = document.getElementById('PopupSearchAutoComplete');
    let listbox = document.getAnonymousElementByAttribute(popup, 'richlistbox');
    console.log(listbox);
  }
};

exports.main = function () {
  if (!loaded) {
    loaded = xulcss.addXULStylesheet(CUSTOM_CSS);
  }
  run();
};

exports.onUnload = function () {
  if (loaded) {
    loaded = xulcss.removeXULStylesheet(CUSTOM_CSS);
  }
};
