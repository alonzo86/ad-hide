const STORAGE_KEY_YAD2 = 'yad2';
const STORAGE_KEY_MADLAN = 'madlan';
const DEFAULT_MARKED_AD_COLOR = '#f9fc21';

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("inactive");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

subscribeToMarkedAdColorSelector(STORAGE_KEY_YAD2);
subscribeToMarkedAdColorSelector(STORAGE_KEY_MADLAN);

setDefaultMarkedAdColor(STORAGE_KEY_MADLAN);
setDefaultMarkedAdColor(STORAGE_KEY_YAD2);

function setDefaultMarkedAdColor(storageKey) {
    chrome.storage.sync.get(storageKey, function (items) {
        var options = {};
		if (items[storageKey] && items[storageKey].options) {
			options = items[storageKey].options;
		}
        if (!options.markedAdColor) {
            options.markedAdColor = DEFAULT_MARKED_AD_COLOR;
        }
		if (!options.markedAdHandle) {
			options.ignoredAdHandle = 'hide';
		}
		var ignoredAdHandleSelector = document.getElementById(`ignoredAdHandle_${storageKey}`);
		ignoredAdHandleSelector.value = options.ignoredAdHandle;
		ignoredAdHandleSelector.addEventListener("change", function (event) {
			ignoredAdHandle(event, storageKey)
		}, false);
		 
		var markedAdColorSelectorSection = document.getElementById(`markedAdColorSection_${storageKey}`);
		var visibility = options.ignoredAdHandle === 'hide' ? 'hidden' : 'visible';
		markedAdColorSelectorSection.style.visibility = visibility;
		
		var markedAdColorSelector = document.getElementById(`markedAdColor_${storageKey}`);
		console.log(`[AdIgnore]: Setting Marked Ad Color for ${storageKey} to ${options.markedAdColor}`);
		markedAdColorSelector.value = options.markedAdColor;
    });
}

function subscribeToMarkedAdColorSelector(storageKey) {
    var markedAdColorSelector = document.getElementById(`markedAdColor_${storageKey}`);
    markedAdColorSelector.addEventListener("change", function (event) {
        markedAdColorChanged(event, storageKey)
    }, false);
}

function ignoredAdHandle(event, storageKey) {
	var handle = event.target.value;
	var visibility = handle === 'hide' ? 'hidden' : 'visible';
	var markedAdColorSelectorSection = document.getElementById(`markedAdColorSection_${storageKey}`);
	markedAdColorSelectorSection.style.visibility = visibility;
	console.log(`[AdIgnore]: Marked Ad Handle for ${storageKey} changed to ${handle}`);
    chrome.storage.sync.get(storageKey, function (items) {
        var data = items[storageKey] || {};
        if (!data.options) {
            data.options = {};
        }
        data.options.ignoredAdHandle = handle;
        chrome.storage.sync.set({[storageKey]: data}, function () {
            console.log(`[AdIgnore]: Marked Ad Handle for ${storageKey} saved successfully`);
        });
    });
}

function markedAdColorChanged(event, storageKey) {
    var newColor = event.target.value;
    console.log(`[AdIgnore]: Marked Ad Color for ${storageKey} changed to ${newColor}`);
    chrome.storage.sync.get(storageKey, function (items) {
        var data = items[storageKey] || {};
        if (!data.options) {
            data.options = {};
        }
        data.options.markedAdColor = newColor;
        chrome.storage.sync.set({[storageKey]: data}, function () {
            console.log(`[AdIgnore]: Marked Ad Color for ${storageKey} saved successfully`);
        });
    });
}
