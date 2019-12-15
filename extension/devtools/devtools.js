// chrome.devtools.network.onRequestFinished.addListener(req => {
//     const url = req.request.url;
//     const headers = req.request.headers;
//     const referer = headers.filter(header => {
//         return header.name === 'Referer';
//     })[0].value;
//     if (url.match(/https:\/\/app\.later\.com\/api\/v2\/media_items\/[0-9]+/)) {
//         const id = url.replace('https://app.later.com/api/v2/media_items/', '');
//         const message = { id, referer };
//         chrome.runtime.sendMessage({ type: 'laterId', message });
//     }
// });

chrome.runtime.sendMessage({ type: 'log', message: 'later network monitor on'});