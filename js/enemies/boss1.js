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
                _this.rangedAttack(1, 12, 15, '#ef4f2f', 240, angle);
                var _loop_1 = function (i) {
                    _this.newAttackTimer(2 * i, function () {
                        _this.rangedAttack(1, 12 - i / 2, 15 - i / 2, '#ef4f2f', 240, angle);
                    });
                };
                for (var i = 1; i <= 14; i++) {
                    _loop_1(i);
                }
            },
            function () {
                var rotation = (Math.random() < 0.5 ? 1 : -1) * 0.004;
                var coolAttack = function (rotation, angle) {
                    _this.rangedAttack(3, 1.5, 10, undefined, 800, angle, function (b) {
                        b.velocity = Vector2.rotate(b.velocity, rotation);
                    }, false);
                };
                coolAttack(rotation, 0);
                var _loop_2 = function (i) {
                    _this.newAttackTimer((i + 1) * 3, function () { return coolAttack(rotation, 360 / 12 * (i + 1)); });
                };
                for (var i = 0; i < 12; i++) {
                    _loop_2(i);
                }
            },
            function () {
                var playerPos = getPlayer().center;
                _this.rangedAttack(12, 0.7, 12, '#ef10ef', 240, undefined, function (b) {
                    b.velocity.add(b.velocity.normalized.Div(12));
                }, false);
            },
        ];
        _this.ai = function () {
            _this.timeLeft -= getPlayer().score / 5;
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
        this.rangedAttack(16, 2, 9);
        this.rangedAttack(9, 1, 24, 'rgb(36,36,36)');
        var score = getPlayer().score;
        initiateVictory(10 / (score > 0 ? Math.sqrt(score) : 1));
    };
    boss1.prototype.delete = function () {
        this.attackTimers.forEach(function (t) { return t.delete(); });
        _super.prototype.delete.call(this);
    };
    boss1.prototype.newAttackTimer = function (frames, onTimeout) {
        this.attackTimers.push(new Timer(frameInterval, frames, function (c, timer) {
            if (paused) {
                timer.counter++;
            }
        }, onTimeout));
    };
    boss1.prototype.rangedAttack = function (count, speed, size, fillColor, timeLeft, angle, customAi, deflect) {
        var _this = this;
        if (fillColor === void 0) { fillColor = '#ef4099'; }
        if (timeLeft === void 0) { timeLeft = 720; }
        if (angle === void 0) { angle = 0; }
        if (customAi === void 0) { customAi = undefined; }
        if (deflect === void 0) { deflect = true; }
        var bullets = shootEvenlyInACircle(count, distScale, this.center, 1, this.radius, angle);
        bullets.forEach(function (b) {
            b.timeLeft = timeLeft;
            b.radius *= size;
            b.velocity.mult(speed * distScale);
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
