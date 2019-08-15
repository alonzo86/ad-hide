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

subscribeToMarkedAdColorSelector('markedAdColorYad2', STORAGE_KEY_YAD2);
subscribeToMarkedAdColorSelector('markedAdColorMadlan', STORAGE_KEY_MADLAN);

setDefaultMarkedAdColor('markedAdColorYad2', STORAGE_KEY_YAD2);
setDefaultMarkedAdColor('markedAdColorMadlan', STORAGE_KEY_MADLAN);

function setDefaultMarkedAdColor(elementId, storageKey) {
    chrome.storage.sync.get(storageKey, function (items) {
        var options = items[storageKey].options || {};
        if (!options.markedAdColor) {
            options.markedAdColor = DEFAULT_MARKED_AD_COLOR;
        }
        var markedAdColorSelector = document.getElementById(elementId);
        console.log(`[AdHide]: Setting Marked Ad Color for ${storageKey} to ${options.markedAdColor}`);
        markedAdColorSelector.value = options.markedAdColor;
    });
}

function subscribeToMarkedAdColorSelector(elementId, storageKey) {
    var markedAdColorSelector = document.getElementById(elementId);
    markedAdColorSelector.addEventListener("change", function (event) {
        markedAdColorChanged(event, storageKey)
    }, false);
}

function markedAdColorChanged(event, storageKey) {
    var newColor = event.target.value;
    console.log(`[AdHide]: Marked Ad Color for ${storageKey} changed to ${newColor}`);
    chrome.storage.sync.get(storageKey, function (items) {
        var data = items[storageKey] || {};
        if (!data.options) {
            data.options = {};
        }
        data.options.markedAdColor = newColor;
        chrome.storage.sync.set({[storageKey]: data}, function () {
            console.log(`[AdHide]: Marked Ad Color for ${storageKey} saved successfully`);
        });
    });
}
