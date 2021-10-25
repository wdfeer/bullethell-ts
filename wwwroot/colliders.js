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
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(position, radius) {
        var _this = _super.call(this, position) || this;
        _this.radius = radius;
        return _this;
    }
    Object.defineProperty(Circle.prototype, "center", {
        get: function () {
            return new Vector2(this.position.x + this.radius, this.position.y + this.radius);
        },
        enumerable: false,
        configurable: true
    });
    Circle.prototype.colliding = function (point) {
        return point.Sub(this.center).length <= this.radius;
    };
    return Circle;
}(Hitbox));
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(position, width, height) {
        var _this = _super.call(this, position) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Object.defineProperty(Rectangle.prototype, "center", {
        get: function () {
            return new Vector2(this.position.x + this.width, this.position.y + this.height);
        },
        enumerable: false,
        configurable: true
    });
    Rectangle.prototype.colliding = function (point) {
        var relativePos = point.Sub(this.position);
        return relativePos.x <= this.width && relativePos.x >= 0 && relativePos.y <= this.height && relativePos.y >= 0;
    };
    return Rectangle;
}(Hitbox));
var hitboxGetters = [];
