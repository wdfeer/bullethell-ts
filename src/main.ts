const fps = 60;
const frameInterval = 1000 / fps;

const canv = document.querySelector("canvas")!;
window.onresize = () => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
}
canv.width = window.innerWidth;
canv.height = window.innerHeight;

var pl: player;
function restart(): void {
    pl = new player(new Vector2(canv.width / 2, canv.height / 2), 13);

    coins = [];

    drawings = [(ctx) => {
        drawCircle(ctx, pl.radius, pl.center);
        fillCircle(ctx, pl.radius, pl.center, '#eeeeee');
    }];
}
window.onkeydown = (event) => {
    if (event.key == 'r')
        restart();
}
restart();

var coins: coin[] = [];
var coinTimer = 0;

new Timer(1000 / fps, 99999999, update);
function update(): void {
    coinTimer += 1;
    if (coinTimer >= pl.coinSpawnCooldown && coins.length < 3) {
        let coinPos = new Vector2(Math.random() * canv.width, Math.random() * canv.height);
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

    if ((pl.center.x + pl.radius > canv.width && pl.velocity.x > 0) || (pl.center.x - pl.radius < 0 && pl.velocity.x < 0))
        pl.velocity.x = -pl.velocity.x * 0.9;
    if ((pl.center.y + pl.radius > canv.height && pl.velocity.y > 0) || (pl.center.y - pl.radius < 0 && pl.velocity.y < 0))
        pl.velocity.y = -pl.velocity.y * 0.9;
    pl.center.add(pl.velocity);

    render();
}

function onClick(event: MouseEvent): void {
    pl.velocity = CursorPos(event).Sub(pl.center).normalized.Mult(pl.speed);
}

function CursorPos(event: MouseEvent): Vector2 {
    return new Vector2(event.clientX, event.clientY);
}
