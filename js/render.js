"use strict";
var scoreDraw = function (ctx) { };
var drawings = [];
function render() {
    var ctx = canv.getContext("2d");
    ctx.clearRect(0, 0, canv.width, canv.height);
    var getZ = function (d) {
        if (typeof d == 'function')
            return 0;
        else
            return d.zIndex;
    };
    console.log(drawings.min(getZ), drawings.max(getZ));
    var _loop_1 = function (i) {
        drawings.forEach(function (d) {
            if (getZ(d) == i) {
                if (typeof d == 'function')
                    d(ctx);
                else
                    d.draw(ctx);
            }
        });
    };
    for (var i = drawings.min(getZ); i <= drawings.max(getZ); i++) {
        _loop_1(i);
    }
    scoreDraw(ctx);
}
function drawCircle(ctx, radius, center, color, alpha) {
    if (color === void 0) { color = 'black'; }
    if (alpha === void 0) { alpha = 1; }
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function fillCircle(ctx, radius, center, color, alpha) {
    if (color === void 0) { color = 'black'; }
    if (alpha === void 0) { alpha = 1; }
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
function drawCenteredText(ctx, text, color, alpha, fontStyle) {
    if (color === void 0) { color = 'black'; }
    if (alpha === void 0) { alpha = 1; }
    if (fontStyle === void 0) { fontStyle = '96px Bahnschrift'; }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = fontStyle;
    ctx.textAlign = 'center';
    ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
}
