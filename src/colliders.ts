abstract class Hitbox {
	position: Vector2;
	constructor(position: Vector2) {
		this.position = position;
	}
	abstract colliding(point: Vector2): boolean;
}
class CircleCollider extends Hitbox {
	radius: number;
	constructor(center: Vector2, radius: number) {
		super(center);
		this.radius = radius;
	}
	colliding(other: Vector2 | CircleCollider) {
		if (other instanceof Vector2) {
			let dist: number = other.Sub(this.position).length;
			return dist <= this.radius;
		} else {
			let dist: number = other.position.Sub(this.position).length;
			return dist < this.radius + other.radius;
		}
	}
}
class RectCollider extends Hitbox {
	width: number;
	height: number;
	public get center(): Vector2 {
		return new Vector2(
			this.position.x + this.width,
			this.position.y + this.height
		);
	}
	constructor(position: Vector2, width: number, height: number) {
		super(position);
		this.width = width;
		this.height = height;
	}
	colliding(point: Vector2) {
		let relativePos = point.Sub(this.position);
		return (
			relativePos.x <= this.width &&
			relativePos.x >= 0 &&
			relativePos.y <= this.height &&
			relativePos.y >= 0
		);
	}
}
