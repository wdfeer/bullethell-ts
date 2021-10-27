class player {
    score: number = 0;
    center: Vector2 = Vector2.Zero;
    velocity: Vector2 = Vector2.Zero;
    radius: number = 0;
    get speed() {
        return 4 + this.score / 2;
    }
    get collider() {
        return new Circle(this.center.Add(new Vector2(this.radius, this.radius)), this.radius)
    }
    get coinSpawnCooldown() {
        return fps * 3 / Math.sqrt(1 + pl.score / 3);
    }
    constructor(center: Vector2, radius?: number) {
        this.center = center;
        if (radius)
            this.radius = radius;
    }
}
class coin {
    static radius = 25;
    draw: draw;
    drawingId: number;
    collider: Circle;
    onPlayerCollide: () => void = () => {
        delete drawings[this.drawingId];
        pl.score++;

        let alpha = 1;
        let timeLeft = fps * 2;
        new Timer(frameInterval, timeLeft, (counter) => {
            if (counter < timeLeft / 3){
                alpha = counter / (timeLeft / 3);
            }
        });
        scoreDraw = (ctx) => {
            drawCenteredText(ctx, String(pl.score), undefined, alpha);
        };
    };
    constructor(public pos: Vector2) {
        this.draw = ctx => {
            drawCircle(ctx, coin.radius, pos, 'brown');
            fillCircle(ctx, coin.radius, pos, '#ffffde');
        };
        this.drawingId = drawings.length;
        drawings.push(this.draw);
        this.collider = new Circle(pos, coin.radius);
    }
}

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
