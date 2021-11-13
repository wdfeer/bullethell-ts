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
        };
        _this.id = 'player';
        _this.score = 0;
        _this.scoreAlpha = 1;
        _this.scoreFadeTimer = null;
        _this.godmode = false;
        _this._hp = player.maxhp;
        return _this;
    }
    Object.defineProperty(player.prototype, "hp", {
        get: function () {
            return this._hp;
        },
        set: function (value) {
            if (value < this.hp)
                playSound('./sounds/hit.mp3');
            if (this.godmode)
                return;
            if (value <= 0) {
                restart();
                this._hp = 0;
                return;
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
            return (8 - 5 * Math.pow(0.9, this.score)) * sizeMult;
        },
        enumerable: false,
        configurable: true
    });
    player.prototype.onCoinCollect = function () {
        var _this = this;
        this.score++;
        this.hp += 5;
        playSound('./sounds/score.mp3', 0.25);
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
    Object.defineProperty(player.prototype, "coinSpawnCooldown", {
        get: function () {
            return (fps * 3) / Math.sqrt(1 + this.score / 3);
        },
        enumerable: false,
        configurable: true
    });
    player.maxhp = 100;
    return player;
}(body));
