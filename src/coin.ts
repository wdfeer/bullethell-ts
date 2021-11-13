class coin extends stationaryCircle {
	draw = (ctx: CanvasRenderingContext2D) => {
		drawCircle(ctx, coin.radius, this.center, 'green');
		fillCircle(ctx, coin.radius, this.center, '#faffde', this.alpha);
	};
	zIndex = -2;
	static get radius() {
		return 22 * sizeMult;
	}
	onPlayerCollide: () => void = () => {
		getPlayer().onCoinCollect();
		this.delete();
	};
	constructor(center: Vector2) {
		super(center, coin.radius);
	}
	update() {
		let plColliding = this.collider.colliding(getPlayer().collider);
		let bossColliding =
			currentBoss && this.collider.colliding(currentBoss.collider);
		if (plColliding) this.onPlayerCollide();
		if (plColliding || bossColliding) {
			this.delete();
		}
	}
}
