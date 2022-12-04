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
var Timer = /** @class */ (function () {
    function Timer(tickInterval, counter, preTick, timeOut) {
        var _this = this;
        this.tickInterval = tickInterval;
        this.counter = counter;
        this.timeOut = function () { };
        if (preTick) {
            this.intervalId = setInterval(function () {
                preTick(_this.counter, _this);
                _this.counter = _this.counter - 1;
                if (_this.counter <= 0)
                    _this.end();
            }, tickInterval);
        }
        else {
            this.intervalId = setInterval(function () {
                _this.counter = _this.counter - 1;
                if (_this.counter <= 0)
                    _this.end();
            }, tickInterval);
        }
        if (timeOut)
            this.timeOut = timeOut;
    }
    Object.defineProperty(Timer.prototype, "hasEnded", {
        get: function () {
            return this.counter <= 0;
        },
        enumerable: false,
        configurable: true
    });
    Timer.prototype.end = function () {
        clearInterval(this.intervalId);
        this.timeOut();
    };
    Timer.prototype.delete = function () {
        clearInterval(this.intervalId);
    };
    return Timer;
}());
var SecTimer = /** @class */ (function (_super) {
    __extends(SecTimer, _super);
    function SecTimer(counter, preTick) {
        var _this = _super.call(this, 1000, counter, preTick) || this;
        _this.counter = counter;
        return _this;
    }
    return SecTimer;
}(Timer));
