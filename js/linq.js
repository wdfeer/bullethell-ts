"use strict";
Array.prototype.max = function (func) {
    var max = func(this[0]);
    this.forEach(function (element) {
        var num = func(element);
        if (num > max)
            max = num;
    });
    return max;
};
Array.prototype.min = function (func) {
    var min = func(this[0]);
    this.forEach(function (element) {
        var num = func(element);
        if (num < min)
            min = num;
    });
    return min;
};
