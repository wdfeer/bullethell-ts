const fps = 60;
const frameInterval = 1000 / fps;

var distScale = (canv.width + canv.height) / 2600;
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
	new player(new Vector2(canv.width / 2, canv.height / 2), 8.5 * distScale);
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
	spawnCoin();
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
			drawCenteredText(ctx, `Victory!`, new Vector2(0, -120 * distScale));
			drawCenteredText(ctx, `Score: ${score}`);
			drawCenteredText(
				ctx,
				`Press R to restart`,
				new Vector2(0, 120 * distScale),
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
	if (coinTimer >= getPlayer().coinSpawnCooldown && getCoins().length < 4) {
		spawnCoin()
		coinTimer = 0;
	}
}
function spawnCoin() {
	let coinPos = randomPoint();
	new coin(coinPos);
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

function onKeyDown(keyCode: string): void {
	switch (keyCode) {
		case 'KeyR':
			restart();
			break;
		case 'Space':
			pause();
			break;
		case 'KeyB':
			if (paused)
				break;
			let player = getPlayer();
			let vel = cursorPos.Sub(player.center).normalized;
			player.shoot(vel);
			break;
		default:
			break;
	}
}
function onClick(event: MouseEvent): void {
	let player = getPlayer();
	player.velocity = getCursorPos(event)
		.Sub(player.center)
		.normalized.Mult(player.speed * 0.8);
}

function getCursorPos(event: MouseEvent): Vector2 {
	return new Vector2(event.clientX, event.clientY);
}
