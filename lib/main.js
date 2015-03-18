/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* jshint debug:true */

'use strict';

let self = require('sdk/self');
let winutils = require('sdk/window/utils');
let xulcss = require('./xulcss');

// const kXULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
const CUSTOM_CSS = self.data.url('autocomplete.css');

let loaded = false;

/**
 * Replace the input's controller with a proxy so that we can insert our suggestions.
 */
let overrideController = function (popup) {
  // Ugh.  I need to replace popup.mInput.mController to add suggestions.
  // Fortunately, I can use a Proxy, but that's still going to be work.
  popup.mInput.mController = new Proxy(popup.mInput.mController, {
    get: (target, name) => {
      // console.log('proxy!', name);
      return target[name];
    }
  });
};

/**
 * Add a query box to the listbox, to notify people of the suggestions.
 */
let addQueryBox = function (document, listbox) {
  let container = listbox._scrollbox;
  let query = container.querySelector('.query');
  if (!query) {
    query = document.createElement('div');
    query.setAttribute('text', 'Blake’s Query Box');
    query.setAttribute('class', 'query');
    query.style.minHeight = '30px';
    query.style.minWidth = '300px';
    query.style.border = '1px solid green';
    query.innerText = 'Hi there!';
    query.onclick = (event) => {
      console.log('Query click!', event);
    };
    // Adding this to the listbox throws an because it's not a richlistitem.
    container.insertBefore(query, container.childNodes.item(0));
  }
};

/**
 * Re-style the existing list items.
 */
let styleItems = function (listbox) {
  let items = listbox.querySelectorAll('richlistitem');
  console.log(listbox, items.item(0));
  for (let item of items) {
    // Move stuff around, if necessary.
    item.classList.add('modified');
  }
};

// let app = require('sdk/system/xul-app');
let run = function () {
  let window = winutils.getMostRecentBrowserWindow();
  let document = window.document;
  let popup = document.getElementById('PopupAutoCompleteRichResult');
  let listbox = document.getAnonymousElementByAttribute(popup, 'anonid', 'richlistbox');
  popup.addEventListener('popupshown', () => {
    // We can't override the controller until the popup is showing, because there's no input.
    overrideController(popup);
    addQueryBox(document, listbox);
    styleItems(listbox);
  });
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
