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
        var _this = _super.call(this, center, 55 * distScale, 60 * fps) || this;
        _this.fillColor = { r: 0, g: 0, b: 0 };
        _this.attackTimers = [];
        _this.attacks = [
            function () {
                var diff = getPlayer().center.Sub(_this.center);
                var angle = Math.atan2(diff.y, diff.x);
                _this.rangedAttack([1, 1], [16, 16], [15, 15], undefined, 180, angle);
                var _loop_1 = function (i) {
                    _this.newAttackTimer(4 * i, function () {
                        _this.rangedAttack([2, 2], [16 - i, 16 - i], [15 - i, 15 - i], undefined, 180, angle);
                    });
                };
                for (var i = 1; i <= 7; i++) {
                    _loop_1(i);
                }
            },
            function () {
                var rotation = (Math.random() < 0.5 ? 1 : -1) * 0.008;
                var coolAttack = function (rotation, angle) {
                    _this.rangedAttack([4, 4], [3.2, 3.2], [11, 11], undefined, 480, angle, function (b) {
                        b.velocity = Vector2.rotate(b.velocity, rotation);
                    }, false);
                };
                coolAttack(rotation, 0);
                var _loop_2 = function (i) {
                    _this.newAttackTimer((i + 1) * 2, function () { return coolAttack(rotation, (i + 1) * 10); });
                };
                for (var i = 0; i < 9; i++) {
                    _loop_2(i);
                }
            },
            function () {
                _this.rangedAttack([12, 14], [1.5, 2.5], [13, 13], '#9940ef', 300, undefined, function (b) {
                    var diff = getPlayer().center.Sub(b.center);
                    var direction = diff.normalized;
                    var dist = diff.length;
                    b.velocity.add(direction
                        .Div(dist > 20 ? dist * dist : 20)
                        .Mult(200 * (distScale < 1 ? distScale * distScale : distScale)));
                });
            },
        ];
        _this.ai = function () {
            _this.timeLeft -= getPlayer().score / 6;
            var diff = getPlayer().center.Sub(_this.center);
            var dist = diff.length;
            if (dist > _this.radius * 4 + _this.radius * 20 * distScale * Math.random())
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
            fillCircle(ctx, _this.radius * 0.9, _this.center, "rgb(".concat(_this.fillColor.r, ",").concat(_this.fillColor.g, ", ").concat(_this.fillColor.b, ")"));
        };
        return _this;
    }
    boss1.prototype.preTick = function (timeLeft) {
        _super.prototype.preTick.call(this, timeLeft);
        if (timeLeft <= 180) {
            this.fillColor.r = (1 - timeLeft / 180) * 255;
            if (timeLeft <= 30) {
                this.fillColor.g = (1 - timeLeft / 30) * 255;
                this.fillColor.b = (1 - timeLeft / 30) * 255;
            }
        }
    };
    boss1.prototype.onTimeout = function () {
        this.rangedAttack([15, 18], [4, 4], [8, 9]);
        this.rangedAttack([9, 9], [2, 3], [24, 24], 'rgb(36,36,36)');
        initiateVictory(7);
    };
    boss1.prototype.delete = function () {
        this.attackTimers.forEach(function (t) { return t.delete(); });
        _super.prototype.delete.call(this);
    };
    boss1.prototype.newAttackTimer = function (frames, onTimeout) {
        this.attackTimers.push(new Timer(frameInterval, frames, function () { }, onTimeout));
    };
    boss1.prototype.rangedAttack = function (counts, speeds, sizes, fillColor, timeLeft, angle, customAi, deflect) {
        var _this = this;
        if (counts === void 0) { counts = [6, 12]; }
        if (fillColor === void 0) { fillColor = '#ef4099'; }
        if (timeLeft === void 0) { timeLeft = 360; }
        if (angle === void 0) { angle = 0; }
        if (customAi === void 0) { customAi = undefined; }
        if (deflect === void 0) { deflect = true; }
        var bullets = shootEvenlyInACircle(Math.random() < 0.5 ? counts[0] : counts[1], distScale, this.center, 1, this.radius, angle);
        bullets.forEach(function (b) {
            b.timeLeft = timeLeft;
            b.radius *= Math.random() < 0.5 ? sizes[0] : sizes[1];
            b.velocity.mult(Math.random() < 0.5 ? speeds[0] : speeds[1] * distScale);
            b.deflect = deflect;
            b.velocity.add(_this.velocity);
            b.draw = function (ctx) {
                drawCircle(ctx, b.radius, b.center, 'black', b.alpha);
                fillCircle(ctx, b.radius, b.center, fillColor, b.alpha);
            };
            b.onTimeout = function () {
                b.delete();
            };
            if (customAi != undefined) {
                b.ai = function () { return customAi(b); };
            }
        });
        return bullets;
    };
    return boss1;
}(boss));
