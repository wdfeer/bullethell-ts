const fps = 60;
const frameInterval = 1000 / fps;

function sizeMult() {
	return (canv.width + canv.height) / 2600;
}
function randomPoint(): Vector2 {
	return new Vector2(Math.random() * canv.width, Math.random() * canv.height);
}

var currentBoss: enemy;
let bossTimer: SecTimer;
function restart(): void {
	drawables = [];
	new player(new Vector2(canv.width / 2, canv.height / 2), 8.5 * sizeMult());
	if (bossTimer) bossTimer.end();
	bossTimer = new SecTimer(9, (count, timer) => {
		if (count == 1) {
			if (getPlayer().score > 0) {
				let pos = randomPoint();
				while (
					pos.Sub(getPlayer().center).length <
					(canv.width + canv.height) / 3
				) {
					pos = randomPoint();
				}
				currentBoss = new boss1(pos, 55 * sizeMult());
			} else timer.counter += 4;
		}
	});
}
restart();

function getCoins(): coin[] {
	return drawables.filter((x) => x instanceof coin) as coin[];
}

var updateTimer = new Timer(1000 / fps, 99999999, gameUpdate);
function gameUpdate(): void {
	updateCoinSpawn();

	updateCoins(getCoins());
	updateBodies(getBodies());

	render();
}
var coinTimer = 0;
function updateCoinSpawn(): void {
	coinTimer += 1;
	if (coinTimer >= getPlayer().coinSpawnCooldown && getCoins().length < 3) {
		let coinPos = randomPoint();
		new coin(coinPos);

		coinTimer = 0;
	}
}
function updateCoins(coins: coin[]): void {
	coins.forEach((c) => {
		c.update();
	});
}
function updateBodies(bodies: body[]): void {
	bodies.forEach((b) => {
		if (!b) return;
		b.update();
	});
}

function onKeyPress(key: string) {
	if (key == 'r') restart();
}
function onClick(event: MouseEvent): void {
	getPlayer().velocity = CursorPos(event)
		.Sub(getPlayer().center)
		.normalized.Mult(getPlayer().speed);
}

function CursorPos(event: MouseEvent): Vector2 {
	return new Vector2(event.clientX, event.clientY);
}
