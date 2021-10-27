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
var player = /** @class */ (function () {
    function player(center, radius) {
        this.score = 0;
        this.center = Vector2.Zero;
        this.velocity = Vector2.Zero;
        this.radius = 0;
        this.center = center;
        if (radius)
            this.radius = radius;
    }
    Object.defineProperty(player.prototype, "speed", {
        get: function () {
            return 4 + this.score / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(player.prototype, "collider", {
        get: function () {
            return new Circle(this.center.Add(new Vector2(this.radius, this.radius)), this.radius);
        },
        enumerable: false,
        configurable: true
    });
    return player;
}());
var coin = /** @class */ (function () {
    function coin(pos) {
        var _this = this;
        this.pos = pos;
        this.onPlayerCollide = function () { delete drawings[_this.drawingId]; pl.score++; };
        this.drawing = new drawing(function (ctx) { drawCircle(ctx, coin.radius, pos, 'brown'); });
        this.drawingId = drawings.length;
        drawings.push(this.drawing);
        this.collider = new Circle(pos, coin.radius);
    }
    coin.radius = 25;
    return coin;
}());
var fps = 60;
var canv = document.querySelector("canvas");
window.onresize = function () {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
};
canv.width = window.innerWidth;
canv.height = window.innerHeight;
var pl;
function coinSpawnCooldown() {
    return fps * 3 / Math.sqrt(1 + pl.score / 3);
}
function reset() {
    pl = new player(new Vector2(canv.width / 2, canv.height / 2), 13);
    drawings = [new drawing(function (ctx) { drawCircle(ctx, pl.radius, pl.center); })];
}
reset();
new Timer(1000 / fps, 99999999, update);
var coins = [];
var coinTimer = 0;
var clickCooldown = fps * 0.4;
var clickTimer = 0;
function update() {
    clickTimer += 1;
    coinTimer += 1;
    if (coinTimer >= coinSpawnCooldown() && coins.length < 3) {
        var coinPos = new Vector2(Math.random() * canv.width, Math.random() * canv.height);
        coins.push(new coin(coinPos));
        coinTimer = 0;
    }
    var newCoins = [];
    coins.forEach(function (c) {
        if (c.collider.colliding(pl.collider)) {
            c.onPlayerCollide();
        }
        else {
            newCoins.push(c);
        }
    });
    coins = newCoins;
    if ((pl.center.x + pl.radius > canv.width && pl.velocity.x > 0) || (pl.center.x - pl.radius < 0 && pl.velocity.x < 0))
        pl.velocity.x = -pl.velocity.x * 0.9;
    if ((pl.center.y + pl.radius > canv.height && pl.velocity.y > 0) || (pl.center.y - pl.radius < 0 && pl.velocity.y < 0))
        pl.velocity.y = -pl.velocity.y * 0.9;
    pl.center.add(pl.velocity);
    render();
    document.querySelector("#score").innerHTML = String(pl.score);
}
function onClick(event) {
    if (clickTimer < clickCooldown)
        return;
    pl.velocity = CursorPos(event).Sub(pl.center).normalized.Mult(pl.speed);
    clickTimer = 0;
}
function CursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
