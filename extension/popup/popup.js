// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const openButton = document.getElementById('open');
const urls = document.getElementById('urls');
const tabsInput = document.getElementById('tabs');
const ytMirrored = document.getElementById('mirrored');

chrome.storage.local.get('mirrored', function(data) {
    ytMirrored.checked = data.mirrored;
})
openButton.onclick = function() {
    const urlArray = urls.value.split('\n');
    const numTabs = parseInt(tabsInput.value, 10);
    for (let i = 0; i < Math.min(numTabs, urlArray.length); i++) {
        const nextLink = urlArray.pop();
        chrome.tabs.create({ url: nextLink, active: false });
    }
    chrome.storage.local.set({ urls: urlArray });
};

ytMirrored.onchange = function(event) {
    const isMirrored = event.target.checked;
    chrome.storage.local.set({ mirrored: isMirrored });
}