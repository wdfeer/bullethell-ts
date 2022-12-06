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
var bullet = /** @class */ (function (_super) {
    __extends(bullet, _super);
    function bullet(center, velocity, radius) {
        var _this = _super.call(this, center, radius) || this;
        _this.zIndex = -1;
        _this.damage = bullet.baseDamage;
        _this.fillColor = 'black';
        _this.preUpdate = function (timeLeft) {
            if (timeLeft <= 15) {
                _this.alpha = timeLeft / 30;
            }
        };
        _this.onTimeout = function () {
            _this.delete();
        };
        _this.timeLeft = 600;
        _this.velocity = velocity;
        _this.draw = function (ctx) {
            drawCircle(ctx, _this.radius, _this.center, 'black', _this.alpha);
            fillCircle(ctx, _this.radius, _this.center, _this.fillColor, _this.alpha);
        };
        return _this;
    }
    bullet.prototype.delete = function () {
        _super.prototype.delete.call(this);
    };
    bullet.prototype.update = function () {
        this.preUpdate(this.timeLeft);
        this.timeLeft--;
        if (this.timeLeft <= 1)
            this.delete();
        _super.prototype.update.call(this);
    };
    bullet.shootEvenlyInACircle = function (count, bulletRadius, pos, velocity, spawnRadius, initialAngle) {
        if (spawnRadius === void 0) { spawnRadius = 0; }
        if (initialAngle === void 0) { initialAngle = 0; }
        var bullets = [];
        var angle = initialAngle;
        for (var i = 0; i < count; i++) {
            var Vy = Math.sin(angle) * velocity;
            var Vx = Math.cos(angle) * velocity;
            var V = new Vector2(Vx, Vy);
            var b = new bullet(pos.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius);
            bullets.push(b);
            angle += (Math.PI * 2) / count;
        }
        return bullets;
    };
    bullet.appearingBullet = function (center, radius, appearanceTime, lifetime) {
        if (appearanceTime === void 0) { appearanceTime = 60; }
        if (lifetime === void 0) { lifetime = 180; }
        var b = new bullet(center, Vector2.Zero, radius);
        b.timeLeft = lifetime;
        b.fillColor = '#0f0f0f';
        b.damage = 0;
        b.alpha = 0;
        b.ai = function () {
            var timeLived = lifetime - b.timeLeft;
            if (timeLived == appearanceTime) {
                b.alpha = 0.8;
                b.damage = bullet.baseDamage;
            }
            else if (timeLived < appearanceTime) {
                b.alpha = Math.sqrt(timeLived / appearanceTime) * 0.8;
            }
        };
        return b;
    };
    bullet.baseDamage = 35;
    return bullet;
}(enemy));
