abstract class enemy extends body {
	damage: number = 100;
	constructor(center: Vector2, radius: number) {
		super(center, radius);
	}
	ai = () => { };
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
