// yad2_handler.js

const storageKey = 'yad2';
const adsParentName = '.feed_list';
const contentChangeParentName = null;
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
	return $(element).closest('div[itemid]');
}

function getId(element) {
	return element.attr('itemid');
}

function setMarkState(element, mark) {
	var selectedElement = $(element).children()[0];
	if (ignoredAdHandle === 'hide') {
		$(selectedElement).css('visibility', mark ? 'hidden' : 'visible');
	} else {
		$(selectedElement).css('background-color', mark ? markedAdColor : 'white');
	}
}

function findChild(parent, id) {
    return parent.find(`div[itemid=${id}]`)[0];
}
