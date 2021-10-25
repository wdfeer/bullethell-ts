class Hitbox {
    width: number;
    height: number;
    position: Vector2 = Vector2.Zero;
    constructor(width: number, height: number, position?: Vector2) {
        this.width = width;
        this.height = height;
        if (position)
            this.position = position;
    }
}

