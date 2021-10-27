const fps = 60;
const frameInterval = 1000 / fps;

const canv = document.querySelector("canvas")!;
window.onresize = () => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
}
canv.width = window.innerWidth;
canv.height = window.innerHeight;
function randomPoint(): Vector2 {
    return new Vector2(Math.random() * canv.width, Math.random() * canv.height)
}

var bodies: body[];
var pl: player;
var boss: enemy;
let bossTimer: SecTimer;
function restart(): void {
    pl = new player(new Vector2(canv.width / 2, canv.height / 2), 9);
    if (boss)
        boss.active = false;
    bossTimer.end();
    bossTimer = new SecTimer(9, (count, timer) => {
        if (count == 1) {
            if (pl.score > 0) {
                let pos = randomPoint();
                while (pos.Sub(pl.center).length < (canv.width + canv.height) / 3) {
                    pos = randomPoint();
                }
                boss = new boss1(pos, 60);
                bodies.push(boss);
            }
            else timer.counter += 4;
        }
    })
    bodies = [pl];

    coins = [];

    drawings = [(ctx) => {
        drawCircle(ctx, pl.radius, pl.center);
        fillCircle(ctx, pl.radius, pl.center, 'crimson');
    }];
}
window.onkeydown = (event) => {
    if (event.key == 'r')
        restart();
}
restart();

var coins: coin[] = [];
var coinTimer = 0;

new Timer(1000 / fps, 99999999, gameUpdate);
function gameUpdate(): void {
    coinTimer += 1;
    if (coinTimer >= pl.coinSpawnCooldown && coins.length < 3) {
        let coinPos = randomPoint();
        coins.push(new coin(coinPos));

        coinTimer = 0;
    }
    let newCoins: coin[] = [];
    coins.forEach(c => {
        let plColliding = c.collider.colliding(pl.collider);
        if (plColliding)
            c.onPlayerCollide();
        if (plColliding || (boss && c.collider.colliding(boss.collider))) {
            c.deleteDrawing();
        }
        else
            newCoins.push(c);
    });
    coins = newCoins;

    bodies.forEach(b => {
        if (!b) return;
        b.update();
        if (b instanceof enemy)
            b.AI();
    });

    render();
}

function onClick(event: MouseEvent): void {
    pl.velocity = CursorPos(event).Sub(pl.center).normalized.Mult(pl.speed);
}

function CursorPos(event: MouseEvent): Vector2 {
    return new Vector2(event.clientX, event.clientY);
}
