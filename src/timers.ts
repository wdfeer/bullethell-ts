class Timer {
	private intervalId;
	get hasEnded(): boolean {
		return this.counter <= 0;
	}
	end() {
		clearInterval(this.intervalId);
	}
	constructor(
		public tickInterval: number,
		public counter: number,
		preTick: (counter: number, timer: Timer) => void
	) {
		this.intervalId = setInterval(() => {
			preTick(this.counter, this);
			this.counter = this.counter - 1;
			if (this.counter <= 0) this.end();
		}, tickInterval);
	}
}
class SecTimer extends Timer {
	constructor(
		public counter: number,
		preTick: (counter: number, timer: SecTimer) => void
	) {
		super(1000, counter, preTick);
	}
}
