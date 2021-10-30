"use strict";
var drawable = /** @class */ (function () {
    function drawable(draw, zIndex, id) {
        if (draw === void 0) { draw = function () { }; }
        if (zIndex === void 0) { zIndex = 0; }
        if (id === void 0) { id = ''; }
        this.isDrawn = true;
        this.draw = draw;
        this.zIndex = zIndex;
        this.id = id;
        drawables.push(this);
    }
    drawable.prototype.Draw = function (ctx) {
        if (this.isDrawn)
            this.draw(ctx);
    };
    drawable.prototype.delete = function () {
        delete drawables[drawables.indexOf(this)];
    };
    return drawable;
}());
function setDrawableWithIdOrPush(drawable, id) {
    if (!setDrawableWithId(drawable, id))
        drawables.push(drawable);
}
function setDrawableWithId(drawable, id) {
    for (var i = 0; i < drawables.length; i++) {
        if (drawables[i].id != id)
            continue;
        drawables[i] = drawable;
        return true;
    }
    return false;
}
var drawables = [];
function render() {
    var ctx = canv.getContext("2d");
    ctx.clearRect(0, 0, canv.width, canv.height);
    var getZ = function (d) {
        if (d)
            return d.zIndex;
        return 0;
    };
    var _loop_1 = function (i) {
        drawables.forEach(function (d) {
            if (d.zIndex == i) {
                d.Draw(ctx);
            }
        });
    };
    for (var i = drawables.min(getZ); i <= drawables.max(getZ); i++) {
        _loop_1(i);
    }
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
