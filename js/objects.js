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
var stationaryCircle = /** @class */ (function (_super) {
    __extends(stationaryCircle, _super);
    function stationaryCircle(center, radius) {
        var _this = _super.call(this) || this;
        /** from 0 (transparent) to 1 (opaque) */
        _this.alpha = 1;
        _this._center = Vector2.Zero;
        _this._radius = 0;
        _this._center = center;
        _this.radius = radius;
        return _this;
    }
    Object.defineProperty(stationaryCircle.prototype, "center", {
        get: function () {
            return this._center;
        },
        set: function (value) {
            this._center = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(stationaryCircle.prototype, "radius", {
        get: function () {
            return this._radius * distScale;
        },
        set: function (value) {
            this._radius = value / distScale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(stationaryCircle.prototype, "collider", {
        get: function () {
            return new CircleCollider(this.center, this.radius);
        },
        enumerable: false,
        configurable: true
    });
    return stationaryCircle;
}(drawable));
var body = /** @class */ (function (_super) {
    __extends(body, _super);
    function body(center, radius) {
        var _this = _super.call(this, center.clone(), radius) || this;
        _this.deflect = true;
        _this.velocity = Vector2.Zero;
        return _this;
    }
    body.prototype.update = function () {
        this.center.add(this.velocity);
        if (this.deflect)
            this.updateDeflect();
    };
    body.prototype.updateDeflect = function () {
        if ((this.center.x + this.radius > canv.width && this.velocity.x > 0) ||
            (this.center.x - this.radius < 0 && this.velocity.x < 0))
            this.velocity.x = -this.velocity.x * 0.9;
        if ((this.center.y + this.radius > canv.height && this.velocity.y > 0) ||
            (this.center.y - this.radius < 0 && this.velocity.y < 0))
            this.velocity.y = -this.velocity.y * 0.9;
    };
    return body;
}(stationaryCircle));
