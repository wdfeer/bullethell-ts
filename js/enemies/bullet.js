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
    function bullet(center, velocity, radius, lifetime) {
        if (lifetime === void 0) { lifetime = 9; }
        var _this = _super.call(this, center, radius) || this;
        _this.zIndex = -1;
        _this.damage = 35;
        _this.onPlayerHit = function () {
            _super.prototype.onPlayerHit.call(_this);
            _this.delete();
        };
        _this.alphaMod = 1;
        _this.preUpdate = function (timeLeft) {
            if (timeLeft <= 60) {
                _this.alpha = _this.alphaMod * timeLeft / 60;
                _this.onPlayerHit = function () { };
            }
        };
        _this.onTimeout = function () {
            _this.delete();
        };
        _this.timeLeft = 600;
        _this.velocity = velocity;
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
    return bullet;
}(enemy));
function shootEvenlyInACircle(count, bulletRadius, pos, velocity, spawnRadius) {
    if (spawnRadius === void 0) { spawnRadius = 0; }
    var bullets = [];
    var angle = 0;
    for (var i = 0; i < count; i++) {
        var Vy = Math.sin(angle) * velocity;
        var Vx = Math.cos(angle) * velocity;
        var V = new Vector2(Vx, Vy);
        var b = new bullet(pos.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius);
        bullets.push(b);
        angle += (Math.PI * 2) / count;
    }
    return bullets;
}
