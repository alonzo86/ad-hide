// background.js

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        'id': 'markAsReadContextItem',
        'title': 'Mark as relevant/irrelevant',
        'contexts': ['page', 'link']
    });
});

chrome.contextMenus.onClicked.addListener(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'itemMarkeStateChanged'}, function(response) {});
    });
})
