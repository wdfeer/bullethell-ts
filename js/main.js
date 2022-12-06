"use strict";
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function isOffscreenX(x) {
    return x > window.innerWidth || x < 0;
}
function isOffscreenY(y) {
    return y > window.innerHeight || y < 0;
}
window.onresize = function () {
    getCircles().forEach(function (renderObject) {
        if (isOffscreenX(renderObject.center.x))
            renderObject.center.x =
                (window.innerWidth * renderObject.center.x) / canvas.width;
        if (isOffscreenY(renderObject.center.y))
            renderObject.center.y =
                (window.innerHeight * renderObject.center.y) / canvas.height;
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    distScale = (canvas.width + canvas.height) / 2600;
};
var audio = document.querySelector('audio');
function playSound(src, volume) {
    if (volume === void 0) { volume = 1; }
    audio.src = src;
    audio.volume = volume;
    audio.play();
}
var cursorPos = new Vector2(0, 0);
document.onmousemove = function (event) {
    cursorPos = getCursorPos(event);
};
window.onkeydown = function (event) {
    onKeyDown(event.code);
};
canvas.addEventListener('click', function (event) { return onClick(event); });
