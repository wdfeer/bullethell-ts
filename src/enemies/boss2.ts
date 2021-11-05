class boss2 extends boss {
	onTimeout() {}
	attacks = [];
	rangedAttack() {}
	constructor(center: Vector2) {
		super(center, 50 * sizeMult());
		this.draw = (ctx) => {
			fillCircle(ctx, this.radius, this.center, '#ef10a4');
			fillCircle(ctx, this.radius * 0.9, this.center, 'black');
		};
	}
}
