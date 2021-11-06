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
    drawable.prototype.render = function (ctx) {
        if (this.isDrawn)
            this.draw(ctx);
    };
    drawable.prototype.delete = function () {
        delete drawables[drawables.indexOf(this)];
    };
    return drawable;
}());
var drawables = [];
function getDrawableWithId(id) {
    for (var i = 0; i < drawables.length; i++) {
        if (drawables[i] && drawables[i].id == id)
            return drawables[i];
    }
    return null;
}
function getDrawablesOfType(c) {
    return drawables.filter(function (x) { return x instanceof c; });
}
function getCircles() {
    return getDrawablesOfType(stationaryCircle);
}
function getBodies() {
    return getDrawablesOfType(body);
}
function getPlayer() {
    return getDrawablesOfType(player)[0];
}
function getCoins() {
    return getDrawablesOfType(coin);
}
