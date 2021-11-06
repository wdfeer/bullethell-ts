"use strict";
var canv = document.querySelector('canvas');
canv.width = window.innerWidth;
canv.height = window.innerHeight;
function isOffscreenX(x) {
    return x > window.innerWidth;
}
function isOffscreenY(y) {
    return y > window.innerHeight;
}
window.onresize = function () {
    getCircles().forEach(function (renderObject) {
        if (isOffscreenX(renderObject.center.x))
            renderObject.center.x =
                (window.innerWidth * renderObject.center.x) / canv.width;
        if (isOffscreenY(renderObject.center.y))
            renderObject.center.y =
                (window.innerHeight * renderObject.center.y) / canv.height;
    });
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
};
var audio = document.querySelector('audio');
function playSound(src, volume) {
    if (volume === void 0) { volume = 1; }
    audio.src = src;
    audio.volume = volume;
    audio.play();
}
window.onkeydown = function (event) {
    onKeyPress(event.code);
};
canv.addEventListener('click', function (event) { return onClick(event); });
