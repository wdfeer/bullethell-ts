"use strict";
var drawing = /** @class */ (function () {
    function drawing(draw) {
        this.draw = draw;
    }
    return drawing;
}());
var drawings = [];
function render() {
    var ctx = canv.getContext("2d");
    ctx.clearRect(0, 0, canv.width, canv.height);
    drawings.forEach(function (obj) {
        obj.draw(ctx);
    });
}
function drawCircle(ctx, radius, position) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}
