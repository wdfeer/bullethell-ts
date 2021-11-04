"use strict";
var canv = document.querySelector('canvas');
canv.width = window.innerWidth;
canv.height = window.innerHeight;
window.onresize = function () {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
};
var audio = document.querySelector('audio');
function playSound(src) {
    audio.src = src;
    audio.play();
}
window.onkeydown = function (event) {
    onKeyPress(event.key);
};
canv.addEventListener('click', function (event) { return onClick(event); });
