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
        _this.preUpdate = function (timeLeft) { };
        _this.onTimeout = function () {
            _this.delete();
        };
        _this.velocity = velocity;
        _this.fadeTimer = new Timer(frameInterval, lifetime * fps, function (c) {
            _this.preUpdate(c);
            if (c == 1)
                _this.onTimeout();
        });
        return _this;
    }
    bullet.prototype.delete = function () {
        this.fadeTimer.end();
        _super.prototype.delete.call(this);
    };
    bullet.prototype.update = function () {
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
        bullets.push(new bullet(pos.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius));
        angle += (Math.PI * 2) / count;
    }
    return bullets;
}
