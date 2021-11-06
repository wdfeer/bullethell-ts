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
var boss = /** @class */ (function (_super) {
    __extends(boss, _super);
    function boss(center, radius, timeLeft) {
        var _this = _super.call(this, center, radius) || this;
        _this.speed = 2 * sizeMult();
        _this.attackTimer = 0;
        _this.attacks = [];
        _this._currentAttack = 0;
        _this.baseTimeLeft = timeLeft;
        _this.baseRadius = radius;
        _this.timer = new Timer(frameInterval, _this.baseTimeLeft, function (counter) {
            _this.preTick(counter);
            if (counter == 1) {
                _this.onTimeout();
                _this.delete();
            }
        });
        return _this;
    }
    boss.prototype.preTick = function (timeLeft) {
        this.radius =
            this.baseRadius * 0.35 +
                this.baseRadius * 0.65 * (timeLeft / this.baseTimeLeft);
    };
    boss.prototype.delete = function () {
        _super.prototype.delete.call(this);
        this.timer.end();
    };
    Object.defineProperty(boss.prototype, "attackCooldown", {
        get: function () {
            return (40 + 80 / (getPlayer().score > 9 ? Math.sqrt(getPlayer().score - 8) : 1));
        },
        enumerable: false,
        configurable: true
    });
    boss.prototype.attack = function () {
        this.attacks[this.currentAttack]();
        this.currentAttack++;
        this.attackTimer = 0;
    };
    Object.defineProperty(boss.prototype, "currentAttack", {
        get: function () {
            return this._currentAttack;
        },
        set: function (value) {
            if (value < 0)
                value = this.attacks.length - 1;
            else if (value >= this.attacks.length)
                value = 0;
            this._currentAttack = value;
        },
        enumerable: false,
        configurable: true
    });
    return boss;
}(enemy));
