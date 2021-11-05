class boss1 extends boss {
	attacks = [
		() => {
			this.rangedAttack([6, 12], false);
		},
		() => {
			this.rangedAttack([8, 16], false);
		},
		() => {
			this.rangedAttack([5, 7], true);
		},
	];
	ai = () => {
		let diff: Vector2 = getPlayer().center.Sub(this.center);
		let dist: number = diff.length;

		if (dist > this.radius * 4 + this.radius * 20 * sizeMult() * Math.random())
			this.velocity = getPlayer()
				.center.Sub(this.center)
				.normalized.Mult(this.speed);
		this.attackTimer++;
		if (this.attackTimer >= this.attackCooldown) {
			this.attack();
		}
	};
	rangedAttack(counts: [number, number], homing: boolean = false) {
		let bullets = shootEvenlyInACircle(
			Math.random() < 0.6 ? counts[0] : counts[1],
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
	constructor(center: Vector2) {
		super(center, 55 * sizeMult());
		this.draw = (ctx) => {
			fillCircle(ctx, this.radius, this.center, '#ff10a0');
			fillCircle(ctx, this.radius * 0.9, this.center, 'black');
		};
	}
}
