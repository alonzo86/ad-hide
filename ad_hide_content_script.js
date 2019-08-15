// yad2_real_estate_content_script.js

$(function () {

    console.log('[AdHide]: Starting extension');

    var clickedEl = null;
    var handler;

    chrome.storage.sync.get(storageKey, function (items) {
        if (items[storageKey] && items[storageKey].ids) {
            var ids = items[storageKey].ids;
            ids.forEach(function (id) {
                var ad = parent.find(`#${id}`)[0];
                setMarkState(ad, true);
            });
        }
    });

    var adsParent = $(adsParentName);
    var initTimeout = setTimeout(() => initAds(adsParent, storageKey), 1000);

    if (contentChangeParentName) {
        console.log('[AdHide]: subscribed to content changed on ' + contentChangeParentName);
        $(contentChangeParentName).on('DOMSubtreeModified', function () {
            var currentAdsParent = $(adsParentName);
            clearTimeout(initTimeout);
            initTimeout = setTimeout(() => initAds(currentAdsParent, storageKey), 1000);
        });
    }

    document.addEventListener('mousedown', function (event) {
        if (event.button == 2) {
            clickedEl = event.target;
        }
    }, true);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log(`[AdHide]: Message received ${request.action}`);
            var parent = getParent(clickedEl);
            var id = getId(parent);
            chrome.storage.sync.get(storageKey, function (items) {
                var data = items[storageKey] || {};
                var ids = [];
                if (data.ids) {
                    ids = data.ids;
                }
                var idIndex = ids.indexOf(id);
                if (idIndex >= 0) {
                    ids.splice(idIndex, 1);
                } else {
                    ids.push(id);
                }
                data.ids = ids;
                chrome.storage.sync.set({[storageKey]: data}, function () {
                    console.log(`[AdHide]: id ${id} saved successfully`);
                    if (idIndex >= 0) {
                        setMarkState(parent[0], false);
                    } else {
                        setMarkState(parent[0], true);
                    }
                });
            });
            sendResponse({res: 'itemMarkeStateChanged'});
        }
    );
});

function initAds(parent, storageKey) {
    console.log('[AdHide]: Initializing marked ads');
    chrome.storage.sync.get(storageKey, function (items) {
        if (items[storageKey] && items[storageKey].ids) {
            var ids = items[storageKey].ids;
            ids.forEach(function (id) {
                var ad = findChild(parent, id);
                setMarkState(ad, true);
            });
        }
    });
}
