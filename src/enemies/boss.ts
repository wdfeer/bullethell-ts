abstract class boss extends enemy {
	id = 'boss1';
	speed = 2 * sizeMult();
	get attackCooldown(): number {
		return (
			40 + 80 / (getPlayer().score > 9 ? Math.sqrt(getPlayer().score - 8) : 1)
		);
	}
	attackTimer = 0;
	attack() {
		this.attacks[this.currentAttack]();
		this.attackTimer = 0;
	}
	attacks: ((arg?: any) => void)[] = [];
	private _currentAttack = 0;
	public get currentAttack() {
		return this._currentAttack;
	}
	public set currentAttack(value) {
		if (value < 0) value = this.attacks.length - 1;
		else if (value >= this.attacks.length) value = 0;
		this._currentAttack = value;
	}
	constructor(center: Vector2, radius: number) {
		super(center, radius);
	}
}
