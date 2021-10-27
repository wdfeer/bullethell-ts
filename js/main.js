"use strict";
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
    Object.defineProperty(player.prototype, "coinSpawnCooldown", {
        get: function () {
            return fps * 3 / Math.sqrt(1 + pl.score / 3);
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
        this.onPlayerCollide = function () {
            delete drawings[_this.drawingId];
            pl.score++;
            var alpha = 1;
            var timeLeft = fps * 2;
            new Timer(frameInterval, timeLeft, function (counter) {
                if (counter < timeLeft / 3) {
                    alpha = counter / (timeLeft / 3);
                }
            });
            scoreDraw = function (ctx) {
                drawCenteredText(ctx, String(pl.score), undefined, alpha);
            };
        };
        this.draw = function (ctx) {
            drawCircle(ctx, coin.radius, pos, 'brown');
            fillCircle(ctx, coin.radius, pos, '#ffffde');
        };
        this.drawingId = drawings.length;
        drawings.push(this.draw);
        this.collider = new Circle(pos, coin.radius);
    }
    coin.radius = 25;
    return coin;
}());
var fps = 60;
var frameInterval = 1000 / fps;
var canv = document.querySelector("canvas");
window.onresize = function () {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
};
canv.width = window.innerWidth;
canv.height = window.innerHeight;
var pl;
function restart() {
    pl = new player(new Vector2(canv.width / 2, canv.height / 2), 13);
    coins = [];
    drawings = [function (ctx) {
            drawCircle(ctx, pl.radius, pl.center);
            fillCircle(ctx, pl.radius, pl.center, '#eeeeee');
        }];
}
window.onkeydown = function (event) {
    if (event.key == 'r')
        restart();
};
restart();
var coins = [];
var coinTimer = 0;
new Timer(1000 / fps, 99999999, update);
function update() {
    coinTimer += 1;
    if (coinTimer >= pl.coinSpawnCooldown && coins.length < 3) {
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
}
function onClick(event) {
    pl.velocity = CursorPos(event).Sub(pl.center).normalized.Mult(pl.speed);
}
function CursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
