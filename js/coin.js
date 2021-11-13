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
var coin = /** @class */ (function (_super) {
    __extends(coin, _super);
    function coin(center) {
        var _this = _super.call(this, center, coin.radius) || this;
        _this.draw = function (ctx) {
            drawCircle(ctx, coin.radius, _this.center, 'green');
            fillCircle(ctx, coin.radius, _this.center, '#faffde', _this.alpha);
        };
        _this.zIndex = -2;
        _this.onPlayerCollide = function () {
            getPlayer().onCoinCollect();
            _this.delete();
        };
        return _this;
    }
    Object.defineProperty(coin, "radius", {
        get: function () {
            return 22 * sizeMult;
        },
        enumerable: false,
        configurable: true
    });
    coin.prototype.update = function () {
        var plColliding = this.collider.colliding(getPlayer().collider);
        var bossColliding = currentBoss && this.collider.colliding(currentBoss.collider);
        if (plColliding)
            this.onPlayerCollide();
        if (plColliding || bossColliding) {
            this.delete();
        }
    };
    return coin;
}(stationaryCircle));
