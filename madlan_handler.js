// madlan_handler.js

const storageKey = 'madlan';
const adsParentName = '#mainBulletinsList';
const contentChangeParentName = 'main';
const DEFAULT_MARKED_AD_COLOR = '#f9fc21';

var ignoredAdHandle = 'hide';
var markedAdColor = DEFAULT_MARKED_AD_COLOR;

chrome.storage.sync.get(storageKey, function (items) {
    if (items[storageKey] && items[storageKey].options) {
        var options = items[storageKey].options || {};
        if (options.markedAdColor) {
            markedAdColor = options.markedAdColor;
        }
		if (options.ignoredAdHandle) {
            ignoredAdHandle = options.ignoredAdHandle;
        }
    }
});

function getParent(element) {
    return $(element).closest('a[id]');
}

function getId(element) {
    return element.attr('id');
}

function setMarkState(element, mark) {
	if (ignoredAdHandle === 'hide') {
		$(element).css('visibility', mark ? 'hidden' : 'visible');
	} else {
		$(element).css('background-color', mark ? markedAdColor : 'white');
	}
}

function findChild(parent, id) {
    return parent.find(`#${id}`)[0];
}
