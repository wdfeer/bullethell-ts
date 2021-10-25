abstract class Hitbox {
    position: Vector2;
    public abstract get center(): Vector2;
    constructor(position: Vector2) {
        this.position = position;
    }
    abstract colliding(point: Vector2): boolean;
}
class Circle extends Hitbox {
    radius: number;
    public get center(): Vector2 {
        return new Vector2(this.position.x + this.radius, this.position.y + this.radius);
    }
    constructor(position: Vector2, radius: number) {
        super(position);
        this.radius = radius;
    }
    colliding(point: Vector2) {
        return point.Sub(this.center).length <= this.radius;
    }
}
class Rectangle extends Hitbox {
    width: number;
    height: number;
    public get center(): Vector2 {
        return new Vector2(this.position.x + this.width, this.position.y + this.height);
    }
    constructor(position: Vector2, width: number, height: number) {
        super(position);
        this.width = width;
        this.height = height;
    }
    colliding(point: Vector2) {
        let relativePos = point.Sub(this.position);
        return relativePos.x <= this.width && relativePos.x >= 0 && relativePos.y <= this.height && relativePos.y >= 0;
    }
}

let hitboxGetters: (() => Hitbox)[] = [];

