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
class player extends body {
	draw = (ctx: CanvasRenderingContext2D) => {
		drawCircle(ctx, this.radius, this.center);
		fillCircle(ctx, this.radius, this.center, 'crimson', this.alpha);
	};
	id = 'player';

	score: number = 0;
	static readonly maxhp: number = 100;
	private _hp: number = player.maxhp;
	public get hp(): number {
		return this._hp;
	}
	public set hp(value: number) {
		if (value < this.hp) playSound('./sounds/hit.mp3');
		if (value <= 0) {
			restart();
			this._hp = 0;
			return;
		}
		if (value >= player.maxhp) value = player.maxhp;
		this._hp = value;
		this.alpha = this.hp / player.maxhp;
	}
	get speed() {
		return (3 + this.score / 2) * sizeMult();
	}
	onCoinCollect() {
		this.score++;
		this.hp += 5;

		playSound('./sounds/score.mp3', 0.25);
	}
	get coinSpawnCooldown() {
		return (fps * 3) / Math.sqrt(1 + this.score / 3);
	}
	constructor(center: Vector2, radius: number) {
		super(center, radius);
	}
}
abstract class enemy extends body {
	damage: number = 100;
	constructor(center: Vector2, radius: number) {
		super(center, radius);
	}
	ai = () => {};
	onPlayerHit() {
		getPlayer().hp -= this.damage;
	}
	update() {
		super.update();

		if (!this.isDrawn) return;
		let plColliding = this.collider.colliding(getPlayer().collider);
		if (plColliding) this.onPlayerHit();
		this.ai();
	}
}
class boss1 extends enemy {
	id = 'boss1';
	speed = 2.5 * sizeMult();
	get attackCooldown(): number {
		return (
			40 + 80 / (getPlayer().score > 9 ? Math.sqrt(getPlayer().score - 8) : 1)
		);
	}
	attackTimer = 0;
	ai = () => {
		let diff: Vector2 = getPlayer().center.Sub(this.center);
		let dist: number = diff.length;

		if (dist > this.radius * 4 + this.radius * 20 * sizeMult() * Math.random())
			this.velocity = getPlayer()
				.center.Sub(this.center)
				.normalized.Mult(this.speed);
		this.attackTimer++;
		if (this.attackTimer >= this.attackCooldown) {
			this.rangedAttack(getPlayer().score > 5 && Math.random() < 0.2);
			this.attackTimer = 0;
		}
	};
	rangedAttack(homing: boolean = false) {
		let bullets = shootEvenlyInACircle(
			Math.random() < 0.6 ? 6 : 12,
			(homing ? 10 : 12) * sizeMult(),
			this.center,
			(1 + 3 * Math.random()) * sizeMult()
		);
		bullets.forEach((b) => {
			b.velocity.add(this.velocity);
			b.draw = (ctx) => {
				drawCircle(ctx, b.radius, b.center, 'black', b.alpha);
				fillCircle(
					ctx,
					b.radius,
					b.center,
					homing ? '#9940ef' : '#ef4099',
					b.alpha
				);
			};
			b.preUpdate = (timeLeft) => {
				if (timeLeft <= 60) {
					b.alpha = timeLeft / 60;
					b.onPlayerHit = () => {};
				}
			};
			b.onTimeout = () => {
				b.delete();
			};
			if (homing) {
				b.ai = () => {
					let direction = getPlayer().center.Sub(b.center).normalized;
					let dist = getPlayer().center.Sub(b.center).length;
					b.velocity.add(
						direction.Div(dist > 1 ? dist * dist : 1).Mult(480 * sizeMult())
					);
				};
			}
		});
	}
	constructor(center: Vector2, radius: number) {
		super(center, radius);
		this.draw = (ctx) => {
			fillCircle(ctx, this.radius, this.center, '#ff10a0');
			fillCircle(ctx, this.radius * 0.9, this.center, 'black');
		};
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
		angle += 360 / count;
	}
	return bullets;
}
class bullet extends enemy {
	zIndex = -1;
	damage = 35;
	onPlayerHit = () => {
		super.onPlayerHit();
		this.delete();
	};
	timer: Timer;
	preUpdate = (timeLeft: number) => {};
	onTimeout = () => {
		this.delete();
	};
	constructor(
		center: Vector2,
		velocity: Vector2,
		radius: number,
		lifetime: number = 9
	) {
		super(center, radius);
		this.velocity = velocity;
		this.timer = new Timer(frameInterval, lifetime * fps, (c) => {
			this.preUpdate(c);
			if (c == 1) this.onTimeout();
		});
	}
	delete() {
		this.timer.end();
		super.delete();
	}
	update() {
		super.update();
	}
}
class coin extends stationaryCircle {
	draw = (ctx: CanvasRenderingContext2D) => {
		drawCircle(ctx, coin.radius, this.center, 'green');
		fillCircle(ctx, coin.radius, this.center, '#faffde', this.alpha);
	};
	zIndex = -2;
	static get radius() {
		return 22 * sizeMult();
	}
	onPlayerCollide: () => void = () => {
		getPlayer().onCoinCollect();

		let alpha = 1;
		let timeLeft = fps * 2;
		new Timer(frameInterval, timeLeft, (counter) => {
			if (counter < timeLeft / 3) {
				alpha = counter / (timeLeft / 3);
			}
		});
		new drawable(
			(ctx) => {
				drawCenteredText(ctx, String(getPlayer().score), undefined, alpha);
			},
			undefined,
			'score'
		);

		this.delete();
	};
	constructor(public center: Vector2) {
		super(center, coin.radius);
	}
	update() {
		let plColliding = this.collider.colliding(getPlayer().collider);
		if (plColliding) this.onPlayerCollide();
		if (plColliding || (boss && this.collider.colliding(boss.collider))) {
			this.delete();
		}
	}
}
