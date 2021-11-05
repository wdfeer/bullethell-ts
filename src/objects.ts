class stationaryCircle extends drawable {
	alpha: number = 1;
	center: Vector2;
	protected _radius: number = 0;
	public get radius() {
		return this._radius * sizeMult();
	}
	public set radius(value: number) {
		this._radius = value / sizeMult();
	}
	get collider() {
		return new CircleCollider(this.center, this.radius);
	}
	constructor(center: Vector2, radius: number) {
		super();
		this.center = center;
		this.radius = radius;
	}
}
class body extends stationaryCircle {
	velocity: Vector2 = Vector2.Zero;
	constructor(center: Vector2, radius: number) {
		super(center, radius);
	}
	update() {
		this.center.add(this.velocity);
		if (
			(this.center.x + this.radius > canv.width && this.velocity.x > 0) ||
			(this.center.x - this.radius < 0 && this.velocity.x < 0)
		)
			this.velocity.x = -this.velocity.x * 0.5;
		if (
			(this.center.y + this.radius > canv.height && this.velocity.y > 0) ||
			(this.center.y - this.radius < 0 && this.velocity.y < 0)
		)
			this.velocity.y = -this.velocity.y * 0.5;
	}
}
