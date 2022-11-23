"use strict";
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.rotate = function (v2, degrees) {
        var newV2 = v2.clone();
        newV2.x = Math.cos(degrees) * v2.x - Math.sin(degrees) * v2.y;
        newV2.y = Math.sin(degrees) * v2.x + Math.cos(degrees) * v2.y;
        return newV2;
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    };
    Vector2.prototype.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    };
    Vector2.prototype.mult = function (by) {
        this.x *= by;
        this.y *= by;
    };
    Vector2.prototype.div = function (by) {
        this.x /= by;
        this.y /= by;
    };
    Vector2.prototype.Add = function (other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    };
    Vector2.prototype.Sub = function (other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };
    Vector2.prototype.Mult = function (by) {
        return new Vector2(this.x * by, this.y * by);
    };
    Vector2.prototype.Div = function (by) {
        return new Vector2(this.x / by, this.y / by);
    };
    Object.defineProperty(Vector2.prototype, "length", {
        get: function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "normalized", {
        get: function () {
            return this.Div(this.length);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector2, "Zero", {
        get: function () {
            return new Vector2(0, 0);
        },
        enumerable: false,
        configurable: true
    });
    return Vector2;
}());
