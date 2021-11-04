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
var Hitbox = /** @class */ (function () {
    function Hitbox(position) {
        this.position = position;
    }
    return Hitbox;
}());
var CircleCollider = /** @class */ (function (_super) {
    __extends(CircleCollider, _super);
    function CircleCollider(center, radius) {
        var _this = _super.call(this, center) || this;
        _this.radius = radius;
        return _this;
    }
    CircleCollider.prototype.colliding = function (other) {
        if (other instanceof Vector2) {
            var dist = other.Sub(this.position).length;
            return dist <= this.radius;
        }
        else {
            var dist = other.position.Sub(this.position).length;
            return dist < this.radius + other.radius;
        }
    };
    return CircleCollider;
}(Hitbox));
var RectCollider = /** @class */ (function (_super) {
    __extends(RectCollider, _super);
    function RectCollider(position, width, height) {
        var _this = _super.call(this, position) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Object.defineProperty(RectCollider.prototype, "center", {
        get: function () {
            return new Vector2(this.position.x + this.width, this.position.y + this.height);
        },
        enumerable: false,
        configurable: true
    });
    RectCollider.prototype.colliding = function (point) {
        var relativePos = point.Sub(this.position);
        return (relativePos.x <= this.width &&
            relativePos.x >= 0 &&
            relativePos.y <= this.height &&
            relativePos.y >= 0);
    };
    return RectCollider;
}(Hitbox));
