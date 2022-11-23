class Vector2 {
	static rotate(v2: Vector2, degrees: number): Vector2 {
		let newV2 = v2.clone();
		newV2.x = Math.cos(degrees) * v2.x - Math.sin(degrees) * v2.y;
		newV2.y = Math.sin(degrees) * v2.x + Math.cos(degrees) * v2.y;
		return newV2;
	}
	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vector2) {
		this.x += other.x;
		this.y += other.y;
	}
	sub(other: Vector2) {
		this.x -= other.x;
		this.y -= other.y;
	}
	mult(by: number) {
		this.x *= by;
		this.y *= by;
	}
	div(by: number) {
		this.x /= by;
		this.y /= by;
	}

	Add(other: Vector2): Vector2 {
		return new Vector2(this.x + other.x, this.y + other.y);
	}
	Sub(other: Vector2): Vector2 {
		return new Vector2(this.x - other.x, this.y - other.y);
	}
	Mult(by: number): Vector2 {
		return new Vector2(this.x * by, this.y * by);
	}
	Div(by: number): Vector2 {
		return new Vector2(this.x / by, this.y / by);
	}

	public get length(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
	public get normalized() {
		return this.Div(this.length);
	}

	public static get Zero(): Vector2 {
		return new Vector2(0, 0);
	}
}
