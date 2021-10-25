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
var coin = /** @class */ (function () {
    function coin(pos) {
        var _this = this;
        this.pos = pos;
        this.drawing = new drawing(function (ctx) { drawCircle(ctx, coin.radius, pos); });
        this.drawingId = drawings.length;
        drawings.push(this.drawing);
        this.collider = new Circle(pos, coin.radius);
        this.onPlayerCollide = function () { drawings.splice(_this.drawingId); score++; };
    }
    coin.radius = 25;
    return coin;
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
var score;
var plPos;
var plVelocity;
var plSpeed;
var plRadius;
var plCollider;
function reset() {
    score = 0;
    plPos = new Vector2(canvWidth / 2, canvHeight / 2);
    plVelocity = Vector2.Zero;
    plSpeed = 4;
    plRadius = 13;
    plCollider = new Circle(plPos.Sub(new Vector2(plRadius, plRadius)), plRadius);
    timescale.ondblclick(new MouseEvent(""));
    vLossOnHit.ondblclick(new MouseEvent(""));
    drawings = [new drawing(function (ctx) { drawCircle(ctx, plRadius, plPos); })];
}
reset();
drawings.push(new drawing(function (ctx) { drawCircle(ctx, plRadius, plPos); }));
new Timer(1000 / fps, 99999999, update);
var coins = [];
var coinTimer = 0;
function update() {
    coinTimer += Number(timescale.value);
    if (coinTimer >= 180 && coins.length < 3) {
        var pos = new Vector2(Math.random() * canvWidth, Math.random() * canvHeight);
        coins.push(new coin(pos));
        coinTimer = 0;
    }
    var newCoins = [];
    coins.forEach(function (c) {
        if (c.collider.colliding(plCollider)) {
            c.onPlayerCollide();
        }
        else {
            newCoins.push(c);
        }
    });
    coins = newCoins;
    if ((plPos.x + plRadius > canvWidth && plVelocity.x > 0) || (plPos.x - plRadius < 0 && plVelocity.x < 0))
        plVelocity.x = -plVelocity.x * velocityMultOnHit();
    if ((plPos.y + plRadius > canvHeight && plVelocity.y > 0) || (plPos.y - plRadius < 0 && plVelocity.y < 0))
        plVelocity.y = -plVelocity.y * velocityMultOnHit();
    plPos.add(plVelocity.Mult(Number(timescale.value)));
    render();
    document.querySelector("#score").innerHTML = String(score);
}
function onClick(event) {
    plVelocity = CursorPos(event).Sub(plPos).normalized.Mult(plSpeed);
}
function CursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
