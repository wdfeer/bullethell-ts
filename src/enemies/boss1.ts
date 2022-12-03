class boss1 extends boss {
	fillColor: color = { r: 0, g: 0, b: 0 };
	preTick(timeLeft: number) {
		super.preTick(timeLeft);
		if (timeLeft <= 180) {
			this.fillColor.r = (1 - timeLeft / 180) * 255;
			if (timeLeft <= 30) {
				this.fillColor.g = (1 - timeLeft / 30) * 255;
				this.fillColor.b = (1 - timeLeft / 30) * 255;
			}
		}
	}
	onTimeout() {

		this.rangedAttack(16, 4, 9);
		this.rangedAttack(9, 2, 24, 'rgb(36,36,36)');

		initiateVictory(7);
	}
	delete() {
		this.attackTimers.forEach((t) => t.delete());
		super.delete();
	}
	attackTimers: Timer[] = [];
	private newAttackTimer(frames: number, onTimeout: () => void) {
		this.attackTimers.push(new Timer(frameInterval, frames, () => { }, onTimeout));
	}
	attacks = [
		() => {
			let diff: Vector2 = getPlayer().center.Sub(this.center);
			let angle = Math.atan2(diff.y, diff.x);
			this.rangedAttack(1, 16, 15, undefined, 180, angle);
			for (let i = 1; i <= 7; i++) {
				this.newAttackTimer(4 * i, () => {
					this.rangedAttack(2, 16 - i, 15 - i, undefined, 180, angle);
				});
			}
		},
		() => {
			let rotation = (Math.random() < 0.5 ? 1 : -1) * 0.008;
			let coolAttack = (rotation: number, angle: number) => {
				this.rangedAttack(4, 3.2, 11, undefined, 480, angle, (b) => {
					b.velocity = Vector2.rotate(b.velocity, rotation);
				}, false);
			}
			coolAttack(rotation, 0);
			for (let i = 0; i < 9; i++) {
				this.newAttackTimer((i + 1) * 2, () => coolAttack(rotation, (i + 1) * 10));
			}
		},
		() => {
			this.rangedAttack(12, 2, 13, '#9940ef', 300, undefined,
				(b: bullet) => {
					let diff = getPlayer().center.Sub(b.center);
					let direction = diff.normalized;
					let dist = diff.length;
					b.velocity.add(
						direction
							.Div(dist > 20 ? dist * dist : 20)
							.Mult(200 * (distScale < 1 ? distScale * distScale : distScale)));
				}
			);
		},
	];
	ai = () => {
		this.timeLeft -= getPlayer().score / 6;

		let diff: Vector2 = getPlayer().center.Sub(this.center);
		let dist: number = diff.length;

		if (dist > this.radius * 4 + this.radius * 20 * distScale * Math.random())
			this.velocity = getPlayer()
				.center.Sub(this.center)
				.normalized.Mult(this.speed);
		this.attackTimer++;
		if (this.attackTimer >= this.attackCooldown) {
			this.attack();
		}
	};
	rangedAttack(
		count: number,
		speed: number,
		size: number,
		fillColor: string = '#ef4099',
		timeLeft: number = 360,
		angle: number = 0,
		customAi: ((b: bullet) => void) | undefined = undefined,
		deflect: boolean = true
	): bullet[] {
		let bullets = shootEvenlyInACircle(
			count,
			distScale,
			this.center,
			1,
			this.radius,
			angle
		);
		bullets.forEach((b) => {
			b.timeLeft = timeLeft;
			b.radius *= size;
			b.velocity.mult(speed * distScale);
			b.deflect = deflect;

			b.velocity.add(this.velocity);
			b.draw = (ctx) => {
				drawCircle(ctx, b.radius, b.center, 'black', b.alpha);
				fillCircle(
					ctx,
					b.radius,
					b.center,
					fillColor,
					b.alpha
				);
			};
			b.onTimeout = () => {
				b.delete();
			};
			if (customAi != undefined) {
				b.ai = () => customAi(b);
			}
		});
		return bullets;
	}
	constructor(center: Vector2) {
		super(center, 55 * distScale, 60 * fps);
		this.draw = (ctx) => {
			fillCircle(ctx, this.radius, this.center, '#ff10a0');
			fillCircle(
				ctx,
				this.radius * 0.9,
				this.center,
				`rgb(${this.fillColor.r},${this.fillColor.g}, ${this.fillColor.b})`
			);
		};
	}
}
