"use strict";
var scoreDraw = function (ctx) { };
var drawings = [];
function render() {
    var ctx = canv.getContext("2d");
    ctx.clearRect(0, 0, canv.width, canv.height);
    drawings.forEach(function (draw) {
        draw(ctx);
    });
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
