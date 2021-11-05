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
