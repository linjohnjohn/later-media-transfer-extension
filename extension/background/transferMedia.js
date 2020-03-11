'use strict';

// import generateCaption from './generateCaption.js';

const tabsToCaptionObjects = {};


console.log('transferMedia script attached');

// open later importing tab
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.type === 'savePost') {
        const { url, captionObjects } = msg;
        captionObjects.forEach(({ labels, caption }) => {
            const encodedLink = encodeURIComponent(url);
            const laterLink = `https://app.later.com/2QQB6/collect/import?url=${encodedLink}`;
            chrome.tabs.create({ url: laterLink, active: false }, function(tab) {
                tabsToCaptionObjects[tab.id] = { labels, caption };
            });
        });
    }
});

// catch later api requests
const requestCallback = function(detail) {
    const { url, requestBody, tabId } = detail;
    const modificationDetails = tabsToCaptionObjects[tabId];

    if (modificationDetails === undefined) return;

    if (url.match(/https:\/\/app\.later\.com\/api\/v2\/media_items\/[0-9]+/)) {
        const arrayBuffer = new Uint8Array(requestBody.raw[0].bytes);
        const { caption: preCreditCaption, labels } = modificationDetails;
        const enc = new TextDecoder('utf-8');
        const stringJSON = enc.decode(arrayBuffer).replace(/\n/g, '\\n');
        console.log(stringJSON);
        
        const data = JSON.parse(stringJSON);
        const { processing_key: processingKey, source_username: credit, media_type: mediaType } = data.media_item;
        const caption = preCreditCaption.replace('{{credit}}', credit);
        const id = url.replace('https://app.later.com/api/v2/media_items/', '');
        chrome.tabs.sendMessage(tabId, { id, processingKey, caption, mediaType, labels });
    }
};
const filter = { urls: ['https://app.later.com/api/v2/media_items/*'] };

chrome.webRequest.onBeforeRequest.addListener(requestCallback, filter, ['requestBody']);