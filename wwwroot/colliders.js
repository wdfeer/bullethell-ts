"use strict";
var Hitbox = /** @class */ (function () {
    function Hitbox(width, height, position) {
        this.position = Vector2.Zero;
        this.width = width;
        this.height = height;
        if (position)
            this.position = position;
    }
    return Hitbox;
}());
