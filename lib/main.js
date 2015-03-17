/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* jshint debug:true */

'use strict';

let self = require('sdk/self');
let winutils = require('sdk/window/utils');
let xulcss = require('./xulcss');

const kXULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
const CUSTOM_CSS = self.data.url('autocomplete.css');

let loaded = false;

/**
 * Okay, it looks like we can add the box for the query.
 */
let addQueryBox = function (document, listbox) {
  let query = listbox.querySelector('.query');
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
    // Perhaps I can add it to the _scrollbox instead?
    listbox._scrollbox.insertBefore(query, listbox._scrollbox.childNodes.item(0));
  }
};

// let app = require('sdk/system/xul-app');
let run = function () {
  let window = winutils.getMostRecentBrowserWindow();
  let document = window.document;
  // let searchbar = document.getElementById('searchbar');
  let popup = document.getElementById('PopupAutoCompleteRichResult');
  let listbox = document.getAnonymousElementByAttribute(popup, 'anonid', 'richlistbox');
  popup.addEventListener('popupshown', (event) => {
    addQueryBox(document, listbox);

    let items = listbox.querySelectorAll('richlistitem');
    // Ugh.  I need to replace popup.mInput.mController to add suggestions.
    // Fortunately, I can use a Proxy, but that's still going to be work.
    popup.mInput.mController = new Proxy(popup.mInput.mController, {
      get: (target, name) => {
        // console.log('proxy!', name);
        return target[name];
      }
    });
    console.log(listbox, items.item(0), event);
    for (let item of items) {
      item.style.border = '1px solid rebeccapurple';
    }

    // This doesn't work.  Use the proxy instead!
    let suggestion = document.createElementNS(kXULNS, 'richlistitem');
    suggestion.setAttribute('text', 'Search Suggestion');
    suggestion.setAttribute('class', 'suggestion autocomplete-richlistitem');
    suggestion.style.border = '1px solid lightblue';
    listbox.insertBefore(suggestion, items.item(0));
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
