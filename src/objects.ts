class stationaryCircle extends drawable {
	/** from 0 (transparent) to 1 (opaque) */
	alpha: number = 1;
	protected _center: Vector2 = Vector2.Zero;
	public get center(): Vector2 {
		return this._center;
	}
	public set center(value: Vector2) {
		this._center = value;
	}
	protected _radius: number = 0;
	public get radius() {
		return this._radius * distScale;
	}
	public set radius(value: number) {
		this._radius = value / distScale;
	}
	get collider() {
		return new CircleCollider(this.center, this.radius);
	}
	constructor(center: Vector2, radius: number) {
		super();
		this._center = center;
		this.radius = radius;
	}
}
class body extends stationaryCircle {
	velocity: Vector2 = Vector2.Zero;
	constructor(center: Vector2, radius: number) {
		super(center.clone(), radius);
	}
	update() {
		this.center.add(this.velocity);
		if (
			(this.center.x + this.radius > canv.width && this.velocity.x > 0) ||
			(this.center.x - this.radius < 0 && this.velocity.x < 0)
		)
			this.velocity.x = -this.velocity.x * 0.9;
		if (
			(this.center.y + this.radius > canv.height && this.velocity.y > 0) ||
			(this.center.y - this.radius < 0 && this.velocity.y < 0)
		)
			this.velocity.y = -this.velocity.y * 0.9;
	}
}
