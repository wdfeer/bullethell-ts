const fps = 60;
const frameInterval = 1000 / fps;

var sizeMult = (canv.width + canv.height) / 2600;
function randomPoint(): Vector2 {
	return new Vector2(Math.random() * canv.width, Math.random() * canv.height);
}

var currentBoss: boss;
let bossTimer: SecTimer;
function restart(): void {
	paused = false;
	if (bossTimer) bossTimer.end();
	if (victoryTimer) victoryTimer.end();
	if (updateTimer) updateTimer.end();
	updateTimer = new Timer(frameInterval, 9999999, gameUpdate);
	drawables = [];
	if (currentBoss) currentBoss.delete();
	new player(new Vector2(canv.width / 2, canv.height / 2), 8.5 * sizeMult);
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
				currentBoss = new boss1(pos);
			} else timer.counter += 4;
		}
	});
}
restart();

function initiateVictory(counter: number) {
	victoryTimer = new SecTimer(counter, (count) => {
		if (count == 1) victory(getPlayer().score);
	});
}
var victoryTimer: Timer;
function victory(score: number) {
	updateTimer.end();
	new drawable(
		(ctx) => {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canv.width, canv.height);
		},
		1,
		'victoryShade'
	);
	new drawable(
		(ctx) => {
			drawCenteredText(ctx, `Victory!`, new Vector2(0, -120 * sizeMult));
			drawCenteredText(ctx, `Score: ${score}`);
			drawCenteredText(
				ctx,
				`Press R to restart`,
				new Vector2(0, 120 * sizeMult),
				undefined,
				undefined,
				56
			);
		},
		2,
		'victoryText'
	);
}

var paused: boolean = false;
function pause() {
	if (paused) {
		updateTimer = new Timer(frameInterval, 9999999, gameUpdate);
		getDrawableWithId('pauseShade')?.delete();
		getDrawableWithId('pauseText')?.delete();
	} else {
		updateTimer.end();
		new drawable(
			(ctx) => {
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canv.width, canv.height);
			},
			1,
			'pauseShade'
		);
		new drawable(
			(ctx) => {
				drawCenteredText(ctx, 'Paused');
			},
			1,
			'pauseText'
		);
	}

	paused = !paused;
}

var updateTimer: Timer;
var renderTimer: Timer = new Timer(frameInterval, 9999999, render);
function gameUpdate(): void {
	updateCoinSpawn();

	updateCoins(getCoins());
	updateBodies(getBodies());
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

function onKeyPress(keyCode: string) {
	if (keyCode == 'KeyR') restart();
	else if (keyCode == 'Space') pause();
}
function onClick(event: MouseEvent): void {
	getPlayer().velocity = CursorPos(event)
		.Sub(getPlayer().center)
		.normalized.Mult(getPlayer().speed);
}

function CursorPos(event: MouseEvent): Vector2 {
	return new Vector2(event.clientX, event.clientY);
}
