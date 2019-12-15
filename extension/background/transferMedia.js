'use strict';

import generateCaption from './generateCaption.js';

const tabsToCaption = {};

console.log('transferMedia script attached');

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.type === 'savePost') {
        const { url, caption } = msg;
        const encodedLink = encodeURIComponent(url);
        const laterLink = `https://app.later.com/2QQB6/import?url=${encodedLink}`;
        chrome.tabs.create({ url: laterLink, active: false }, function(tab) {
            tabsToCaption[tab.id] = caption;
        });
    }
});

// NETWORK DATA
const requestCallback = function(detail) {
    const { url, requestBody, tabId } = detail;
    if (url.match(/https:\/\/app\.later\.com\/api\/v2\/media_items\/[0-9]+/)) {
        const arrayBuffer = new Uint8Array(requestBody.raw[0].bytes);
        const enc = new TextDecoder('utf-8');
        const stringJSON = enc.decode(arrayBuffer);
        console.log(stringJSON);
        const data = JSON.parse(stringJSON);
        const { processing_key: processingKey, source_username: credit, media_type: mediaType } = data.media_item;
        const caption = generateCaption(tabsToCaption[tabId], credit);
        const id = url.replace('https://app.later.com/api/v2/media_items/', '');
        chrome.tabs.sendMessage(tabId, { id, processingKey, caption, mediaType });
    }
};
const filter = { urls: ['https://app.later.com/api/v2/media_items/*'] };

chrome.webRequest.onBeforeRequest.addListener(requestCallback, filter, ['requestBody']);