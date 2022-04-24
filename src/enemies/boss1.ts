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
		this.rangedAttack([15, 18], [4, 4], [8, 9], true);
		this.rangedAttack([8, 9], [3, 5], [24, 24], false, 'rgb(36,36,36)');

		initiateVictory(8);
	}
	attacks = [
		() => {
			this.rangedAttack([6, 12], [0.8, 0.8], [12, 12], false, undefined, 1200);
		},
		() => {
			this.rangedAttack([8, 16], [1.5, 2.5], [11, 12], false);
		},
		() => {
			this.rangedAttack([5, 7], [3, 4], [8, 10], true, '#9940ef');
		},
	];
	ai = () => {
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
		counts: [number, number] = [6, 12],
		speeds: [number, number],
		sizes: [number, number],
		homing: boolean = false,
		fillColor: string = '#ef4099',
		timeLeft: number = 600
	): bullet[] {
		let bullets = shootEvenlyInACircle(
			Math.random() < 0.5 ? counts[0] : counts[1],
			distScale,
			this.center,
			1,
			this.radius,
		);
		bullets.forEach((b) => {
			b.timeLeft = timeLeft;
			b.radius *= Math.random() < 0.5 ? sizes[0] : sizes[1];
			b.velocity.mult(Math.random() < 0.5 ? speeds[0] : speeds[1] * distScale);

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
			if (homing) {
				b.ai = () => {
					let diff = getPlayer().center.Sub(b.center);
					let direction = diff.normalized;
					let dist = diff.length;
					b.velocity.add(
						direction
							.Div(dist > 20 ? dist * dist : 20)
							.Mult(400 * (distScale < 1 ? distScale * distScale : distScale))
					);
				};
			}
		});
		return bullets;
	}
	constructor(center: Vector2) {
		super(center, 55 * distScale, 30 * fps);
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
