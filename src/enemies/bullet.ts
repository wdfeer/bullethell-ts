class bullet extends enemy {
	zIndex = -1;
	damage = 35;
	onPlayerHit = () => {
		super.onPlayerHit();
		this.delete();
	};
	public alphaMod = 1;
	preUpdate = (timeLeft: number) => {
		if (timeLeft <= 60) {
			this.alpha = this.alphaMod * timeLeft / 60;
			this.onPlayerHit = () => { };
		}
	};
	onTimeout = () => {
		this.delete();
	};
	timeLeft: number = 600;
	constructor(
		center: Vector2,
		velocity: Vector2,
		radius: number,
		lifetime: number = 9
	) {
		super(center, radius);
		this.velocity = velocity;
	}
	delete() {
		super.delete();
	}
	update() {
		this.preUpdate(this.timeLeft);
		this.timeLeft--;
		if (this.timeLeft <= 1) this.delete();
		super.update();
	}
}
function shootEvenlyInACircle(
	count: number,
	bulletRadius: number,
	pos: Vector2,
	velocity: number,
	spawnRadius: number = 0
): bullet[] {
	let bullets: bullet[] = [];
	let angle = 0;
	for (let i = 0; i < count; i++) {
		let Vy = Math.sin(angle) * velocity;
		let Vx = Math.cos(angle) * velocity;
		let V = new Vector2(Vx, Vy);
		bullets.push(
			new bullet(pos.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius)
		);
		angle += (Math.PI * 2) / count;
	}
	return bullets;
}
