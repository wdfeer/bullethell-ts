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
function restart(): void {
    pl = new player(new Vector2(canv.width / 2, canv.height / 2), 9);
    new SecTimer(8, (count) => {
        if (count == 1)
            boss = new boss1(randomPoint(), 60);
        bodies.push(boss);
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
        if (c.collider.colliding(pl.collider)) {
            c.onPlayerCollide();
        } else {
            newCoins.push(c);
        }
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
