abstract class boss extends enemy {
	baseRadius: number;
	baseTimeLeft: number;
	timeLeft: number;
	preTick(timeLeft: number) {
		this.radius =
			this.baseRadius * 0.35 +
			this.baseRadius * 0.65 * (timeLeft / this.baseTimeLeft);
	}
	abstract onTimeout(): void;
	delete() {
		super.delete();
	}
	speed = 2 * sizeMult();
	get attackCooldown(): number {
		return (
			40 + 80 / (getPlayer().score > 9 ? Math.sqrt(getPlayer().score - 8) : 1)
		);
	}
	attackTimer = 0;
	attack() {
		this.attacks[this.currentAttack]();
		this.currentAttack++;
		this.attackTimer = 0;
	}
	attacks: ((arg?: any) => void)[] = [];
	private _currentAttack: number = 0;
	public get currentAttack() {
		return this._currentAttack;
	}
	public set currentAttack(value) {
		if (value < 0) value = this.attacks.length - 1;
		else if (value >= this.attacks.length) value = 0;
		this._currentAttack = value;
	}
	constructor(center: Vector2, radius: number, timeLeft: number) {
		super(center, radius);
		this.baseTimeLeft = timeLeft;
		this.timeLeft = timeLeft;
		this.baseRadius = radius;
	}
	update() {
		this.preTick(this.timeLeft);
		this.timeLeft--;
		if (this.timeLeft == 1) {
			this.onTimeout();
			this.delete();
		}
		super.update();
	}
}
