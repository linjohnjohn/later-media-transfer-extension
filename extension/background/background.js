'use strict';

console.log('background script attached');

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({})
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// GENERAL FUNC
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.type === 'close') {
        chrome.tabs.remove(sender.tab.id);
    } else if (msg.type === 'log') {
        console.log(msg.message);
    }
});

// PRELOAD TABS
chrome.tabs.onRemoved.addListener(function() {
    chrome.storage.local.get('urls', function(data) {
        chrome.tabs.query({}, (allTabs) => {
            if (allTabs.length >= 20 || data.urls === undefined || data.urls.length === 0) {
                return;
            }
            const nextLink = data.urls.pop();
            chrome.tabs.create({ url: nextLink, active: false });
            chrome.storage.local.set({ urls: data.urls });
        });
    });
});