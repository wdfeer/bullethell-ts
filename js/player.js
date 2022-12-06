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
var player = /** @class */ (function (_super) {
    __extends(player, _super);
    function player(center, radius) {
        var _this = _super.call(this, center, radius) || this;
        _this.draw = function (ctx) {
            drawCircle(ctx, _this.radius, _this.center);
            fillCircle(ctx, _this.radius, _this.center, 'crimson', _this.alpha);
            if (_this.iFrames > 0) {
                var radius = _this.radius + _this.iFrames;
                drawCircle(ctx, radius, _this.center, 'black');
            }
        };
        _this.id = 'player';
        _this.score = 0;
        _this.scoreAlpha = 1;
        _this.scoreFadeTimer = null;
        _this.iFrames = 0;
        _this._hp = player.maxhp;
        return _this;
    }
    Object.defineProperty(player.prototype, "hp", {
        get: function () {
            return this._hp;
        },
        set: function (value) {
            if (value <= 0) {
                restart();
                this._hp = 0;
                return;
            }
            if (value < this.hp) {
                if (this.iFrames > 0)
                    return;
                playSound('./sounds/hit.mp3');
                this.iFrames = player.immunityOnHit;
            }
            if (value >= player.maxhp)
                value = player.maxhp;
            this._hp = value;
            this.alpha = this.hp / player.maxhp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(player.prototype, "speed", {
        get: function () {
            return 2.25 * distScale;
        },
        enumerable: false,
        configurable: true
    });
    player.prototype.onCoinCollect = function () {
        this.score++;
        this.hp += 5;
        playSound('./sounds/score.mp3', 0.25);
        this.showScore();
    };
    player.prototype.showScore = function () {
        var _this = this;
        this.scoreAlpha = 1;
        var timeLeft = fps * (1 + 2 * Math.pow(0.9, this.score));
        if (this.scoreFadeTimer)
            this.scoreFadeTimer.end();
        this.scoreFadeTimer = new Timer(frameInterval, timeLeft, function (counter) {
            if (counter < timeLeft / 3) {
                _this.scoreAlpha = counter / (timeLeft / 3);
            }
        });
        if (!getDrawableWithId('score'))
            new drawable(function (ctx) {
                drawCenteredText(ctx, String(getPlayer().score), undefined, undefined, _this.scoreAlpha);
            }, undefined, 'score');
    };
    player.prototype.shoot = function () {
        var bull = new body(this.center, this.radius * 20);
        bull.draw = function (ctx) {
            drawCircle(ctx, bull.radius, bull.center, 'lime');
            fillCircle(ctx, bull.radius, bull.center, 'green', bull.alpha / 3);
        };
        this.iFrames = 60;
        new Timer(frameInterval, 60, function (count) {
            if (paused) {
                count++;
                return;
            }
            if (count <= 30)
                bull.alpha = count / 30;
            {
                var bullets = getDrawablesOfType(bullet);
                var collidingWith = bullets.filter(function (enemyBullet) { return bull.collider.colliding(enemyBullet.collider); });
                collidingWith.forEach(function (b) {
                    b.delete();
                });
            }
        }, function () {
            bull.delete();
        });
    };
    Object.defineProperty(player.prototype, "coinSpawnCooldown", {
        get: function () {
            return (fps * 3) / Math.sqrt(1 + this.score / 3);
        },
        enumerable: false,
        configurable: true
    });
    player.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.iFrames > 0) {
            this.iFrames--;
        }
    };
    player.immunityOnHit = 45;
    player.maxhp = 100;
    return player;
}(body));
