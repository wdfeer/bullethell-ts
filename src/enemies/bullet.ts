class bullet extends enemy {
	zIndex = -1;
	public static readonly baseDamage = 35;
	damage = bullet.baseDamage;
	fillColor: string = 'black';
	preUpdate = (timeLeft: number) => {
		if (timeLeft <= 15) {
			this.alpha = timeLeft / 30;
		}
	};
	onTimeout = () => {
		this.delete();
	};
	timeLeft: number = 600;
	constructor(
		center: Vector2,
		velocity: Vector2,
		radius: number
	) {
		super(center, radius);
		this.velocity = velocity;
		this.draw = (ctx) => {
			drawCircle(ctx, this.radius, this.center, 'black', this.alpha);
			fillCircle(
				ctx,
				this.radius,
				this.center,
				this.fillColor,
				this.alpha
			);
		};
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

	public static shootEvenlyInACircle(
		count: number,
		bulletRadius: number,
		pos: Vector2,
		velocity: number,
		spawnRadius: number = 0,
		initialAngle: number = 0
	): bullet[] {
		let bullets: bullet[] = [];
		let angle = initialAngle;
		for (let i = 0; i < count; i++) {
			let Vy = Math.sin(angle) * velocity;
			let Vx = Math.cos(angle) * velocity;
			let V = new Vector2(Vx, Vy);
			let b = new bullet(pos.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius);
			bullets.push(b);
			angle += (Math.PI * 2) / count;
		}
		return bullets;
	}
	public static appearingBullet(center: Vector2, radius: number, appearanceTime: number, lifetime: number = 300): bullet {
		let b = new bullet(center, Vector2.Zero, radius);
		b.timeLeft = lifetime;
		b.fillColor = '#0f0f0f'
		b.damage = 0;
		b.alpha = 0;
		b.ai = () => {
			let timeLived = lifetime - b.timeLeft;
			if (timeLived == appearanceTime) {
				b.alpha = 0.8;
				b.damage = bullet.baseDamage;
			} else if (timeLived < appearanceTime) {
				b.alpha = Math.sqrt(timeLived / appearanceTime) * 0.8;
			}
		};
		return b;
	}
}

