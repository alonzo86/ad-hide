// yad2_real_estate_content_script.js

$(function () {

    console.log('[AdIgnore]: Starting extension');

    var clickedEl = null;
    var handler;

    chrome.storage.sync.get(storageKey, function (items) {
        if (items[storageKey] && items[storageKey].ads) {
            var ads = items[storageKey].ads;
            ads.forEach(function (ad) {
                var adElement = parent.find(`#${ad.id}`)[0];
                setMarkState(adElement, true);
            });
        }
    });

    var adsParent = $(adsParentName);
    var initTimeout = setTimeout(() => initAds(adsParent, storageKey), 1000);

    if (contentChangeParentName) {
        console.log('[AdIgnore]: subscribed to content changed on ' + contentChangeParentName);
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
            console.log(`[AdIgnore]: Message received ${request.action}`);
            var parent = getParent(clickedEl);
            var id = getId(parent);
            chrome.storage.sync.get(storageKey, function (items) {
                var data = items[storageKey] || {};
                var ads = [];
                if (data.ads) {
                    ads = data.ads;
                }
                var adIndex = ads.findIndex(ad => ad.id === id);
                if (adIndex >= 0) {
                    ads.splice(adIndex, 1);
                } else {
					var adData = getAdData(parent[0]);
                    ads.push({ id, data: adData });
                }
                data.ads = ads;
                chrome.storage.sync.set({[storageKey]: data}, function () {
                    console.log(`[AdIgnore]: id ${id} saved successfully`);
                    if (adIndex >= 0) {
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
    console.log('[AdIgnore]: Initializing marked ads');
    chrome.storage.sync.get(storageKey, function (items) {
        if (items[storageKey] && items[storageKey].ads) {
            var ads = items[storageKey].ads;
            ads.forEach(function (ad) {
                var adElement = findChild(parent, ad.id);
                setMarkState(adElement, true);
            });
        }
    });
}
