"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Timer = /** @class */ (function () {
    function Timer(tickInterval, counter, preTick) {
        var _this = this;
        this.tickInterval = tickInterval;
        this.counter = counter;
        var intervalId = setInterval(function () {
            preTick(_this.counter);
            _this.counter = _this.counter - 1;
            if (_this.counter <= 0)
                clearInterval(intervalId);
        }, tickInterval);
    }
    Object.defineProperty(Timer.prototype, "hasEnded", {
        get: function () {
            return this.counter <= 0;
        },
        enumerable: false,
        configurable: true
    });
    return Timer;
}());
var SecTimer = /** @class */ (function (_super) {
    __extends(SecTimer, _super);
    function SecTimer(counter, preTick) {
        var _this = _super.call(this, 1000, counter, preTick) || this;
        _this.counter = counter;
        return _this;
    }
    return SecTimer;
}(Timer));
var renderObject = /** @class */ (function () {
    function renderObject(render) {
        this.render = render;
    }
    return renderObject;
}());
var fps = 60;
var canv = document.querySelector("canvas");
var canvWidth = canv.width;
var canvHeight = canv.height;
var timescale = document.querySelector("#timescale");
timescale.ondblclick = function (event) {
    timescale.value = "1.00";
    timescale.onchange(new Event("click"));
};
var vLossOnHit = document.querySelector("#vLossOnHit");
vLossOnHit.ondblclick = function (event) {
    vLossOnHit.value = "10";
    vLossOnHit.onchange(new Event("click"));
};
function velocityMultOnHit() {
    return 1 - Number(vLossOnHit.value) / 100;
}
var playerPos = new Vector2(canv.width / 2, canv.height / 2);
var playerVelocity = Vector2.Zero;
var playerRadius = 10;
new Timer(1000 / fps, 99999999, update);
function reset() {
    playerPos = new Vector2(canvWidth / 2, canvHeight / 2);
    playerVelocity = Vector2.Zero;
    timescale.ondblclick(new MouseEvent(""));
    vLossOnHit.ondblclick(new MouseEvent(""));
}
function update() {
    if ((playerPos.x + playerRadius > canvWidth && playerVelocity.x > 0) || (playerPos.x - playerRadius < 0 && playerVelocity.x < 0))
        playerVelocity.x = -playerVelocity.x * velocityMultOnHit();
    if ((playerPos.y + playerRadius > canvHeight && playerVelocity.y > 0) || (playerPos.y - playerRadius < 0 && playerVelocity.y < 0))
        playerVelocity.y = -playerVelocity.y * velocityMultOnHit();
    playerPos.add(playerVelocity.Mult(Number(timescale.value)));
    gameRender();
}
//#region Rendering
function gameRender() {
    var ctx = canv.getContext("2d");
    ctx.clearRect(0, 0, canv.width, canv.height);
    drawCircle(ctx, playerRadius, playerPos);
}
function drawCircle(ctx, radius, position) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}
//#endregion
function onClick(event) {
    playerVelocity = CursorPos(event).Sub(playerPos).normalized.Mult(4);
}
function CursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
