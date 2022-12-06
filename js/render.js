"use strict";
function render() {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var getZ = function (d) {
        if (d)
            return d.zIndex;
        return 0;
    };
    var _loop_1 = function (i) {
        drawables.forEach(function (d) {
            if (d.zIndex == i) {
                d.render(context);
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
function drawCenteredText(ctx, text, offset, color, alpha, fontSize) {
    if (offset === void 0) { offset = Vector2.Zero; }
    if (color === void 0) { color = 'black'; }
    if (alpha === void 0) { alpha = 1; }
    if (fontSize === void 0) { fontSize = 80; }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = "".concat(Math.floor(fontSize * distScale), "px Bahnschrift");
    ctx.textAlign = 'center';
    var pos = new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2);
    pos.add(offset);
    ctx.fillText(text, pos.x, pos.y);
}
