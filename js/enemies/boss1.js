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
var boss1 = /** @class */ (function (_super) {
    __extends(boss1, _super);
    function boss1(center) {
        var _this = _super.call(this, center, 55 * sizeMult()) || this;
        _this.attacks = [
            function () {
                _this.rangedAttack([6, 12], [3, 3], [12, 12], false);
            },
            function () {
                _this.rangedAttack([8, 16], [1.5, 2.5], [11, 12], false);
            },
            function () {
                _this.rangedAttack([5, 7], [3, 4], [8, 10], true);
            },
        ];
        _this.ai = function () {
            var diff = getPlayer().center.Sub(_this.center);
            var dist = diff.length;
            if (dist > _this.radius * 4 + _this.radius * 20 * sizeMult() * Math.random())
                _this.velocity = getPlayer()
                    .center.Sub(_this.center)
                    .normalized.Mult(_this.speed);
            _this.attackTimer++;
            if (_this.attackTimer >= _this.attackCooldown) {
                _this.attack();
            }
        };
        _this.draw = function (ctx) {
            fillCircle(ctx, _this.radius, _this.center, '#ff10a0');
            fillCircle(ctx, _this.radius * 0.9, _this.center, 'black');
        };
        return _this;
    }
    boss1.prototype.onTimeout = function () {
        this.rangedAttack([15, 18], [4, 4], [8, 9], true);
        this.rangedAttack([6, 8], [3, 5], [24, 24], false);
        initiateVictory(8);
    };
    boss1.prototype.rangedAttack = function (counts, speeds, sizes, homing, color) {
        var _this = this;
        if (counts === void 0) { counts = [6, 12]; }
        if (homing === void 0) { homing = false; }
        if (color === void 0) { color = ''; }
        var bullets = shootEvenlyInACircle(Math.random() < 0.5 ? counts[0] : counts[1], sizeMult(), this.center, 1, this.radius);
        bullets.forEach(function (b) {
            b.radius *= Math.random() < 0.5 ? sizes[0] : sizes[1];
            b.velocity.mult(Math.random() < 0.5 ? speeds[0] : speeds[1] * sizeMult());
            b.velocity.add(_this.velocity);
            b.draw = function (ctx) {
                drawCircle(ctx, b.radius, b.center, 'black', b.alpha);
                fillCircle(ctx, b.radius, b.center, homing ? '#9940ef' : '#ef4099', b.alpha);
            };
            b.preUpdate = function (timeLeft) {
                if (timeLeft <= 60) {
                    b.alpha = timeLeft / 60;
                    b.onPlayerHit = function () { };
                }
            };
            b.onTimeout = function () {
                b.delete();
            };
            if (homing) {
                b.ai = function () {
                    var diff = getPlayer().center.Sub(b.center);
                    var direction = diff.normalized;
                    var dist = diff.length;
                    b.velocity.add(direction.Div(dist > 20 ? dist * dist : 20).Mult(480 * sizeMult()));
                };
            }
        });
        return bullets;
    };
    return boss1;
}(boss));
