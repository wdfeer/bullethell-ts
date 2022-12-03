class player extends body {
	draw = (ctx: CanvasRenderingContext2D) => {
		drawCircle(ctx, this.radius, this.center);
		fillCircle(ctx, this.radius, this.center, 'crimson', this.alpha);
		if (this.iFrames > 0) {
			let radius = this.radius + this.iFrames;
			drawCircle(ctx, radius, this.center, 'black');
		}
	};
	id = 'player';

	score: number = 0;
	scoreAlpha: number = 1;
	scoreFadeTimer: Timer | null = null;
	iFrames: number = 0;
	static readonly immunityOnHit = 45;
	static readonly maxhp: number = 100;
	private _hp: number = player.maxhp;
	public get hp(): number {
		return this._hp;
	}
	public set hp(value: number) {
		if (this.iFrames > 0) return;
		if (value < this.hp) {
			playSound('./sounds/hit.mp3');
			this.iFrames = player.immunityOnHit;
		}
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
		return 4.5 * distScale;
	}
	onCoinCollect() {
		this.score++;
		this.hp += 5;

		playSound('./sounds/score.mp3', 0.25);
		this.showScore();
	}
	showScore() {
		this.scoreAlpha = 1;
		let timeLeft = fps * (1 + 2 * Math.pow(0.9, this.score));
		if (this.scoreFadeTimer) this.scoreFadeTimer.end();
		this.scoreFadeTimer = new Timer(frameInterval, timeLeft, (counter) => {
			if (counter < timeLeft / 3) {
				this.scoreAlpha = counter / (timeLeft / 3);
			}
		});
		if (!getDrawableWithId('score'))
			new drawable(
				(ctx) => {
					drawCenteredText(
						ctx,
						String(getPlayer().score),
						undefined,
						undefined,
						this.scoreAlpha
					);
				},
				undefined,
				'score'
			);
	}
	public shoot() {
		let bull = new body(this.center, this.radius * 20);
		bull.draw = (ctx) => {
			drawCircle(ctx, bull.radius, bull.center, 'lime');
			fillCircle(ctx, bull.radius, bull.center, 'green', bull.alpha / 3);
		}
		this.iFrames = 60;
		new Timer(frameInterval, 60, (count) => {
			if (paused) {
				count++;
				return;
			}
			if (count <= 30)
				bull.alpha = count / 30;
			{
				let bullets: bullet[] = getDrawablesOfType(bullet);
				let collidingWith = bullets.filter((enemyBullet) => bull.collider.colliding(enemyBullet.collider));
				if (collidingWith.length != 0) {
					let foe = collidingWith[0];
					foe.delete();
				}
			}
		}, () => {
			bull.delete();
		});
	}
	get coinSpawnCooldown() {
		return (fps * 3) / Math.sqrt(1 + this.score / 3);
	}
	constructor(center: Vector2, radius: number) {
		super(center, radius);
	}
	update() {
		super.update()
		if (this.iFrames > 0) {
			this.iFrames--;
		}
	}
}
