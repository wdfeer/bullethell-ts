class Timer {
    get hasEnded(): boolean {
        return this.counter <= 0;
    }
    constructor(public tickInterval: number, public counter: number, preTick: (counter: number) => void) {
        let intervalId = setInterval(() => {
            preTick(this.counter);
            this.counter = this.counter - 1;
            if (this.counter <= 0) clearInterval(intervalId)
        }, tickInterval)
    }
}
class SecTimer extends Timer {
    constructor(public counter: number, preTick: (counter: number) => void) {
        super(1000, counter, preTick);
    }
}

class coin {
    static radius = 25;
    drawing: drawing;
    drawingId: number;
    collider: Circle;
    onPlayerCollide: () => void = () => { delete drawings[this.drawingId]; score++; };
    constructor(public pos: Vector2) {
        this.drawing = new drawing(ctx => { drawCircle(ctx, coin.radius, pos, 'brown') });
        this.drawingId = drawings.length;
        drawings.push(this.drawing);
        this.collider = new Circle(pos, coin.radius);
    }
}

const fps = 60;

const canv = document.querySelector("canvas")!;
const canvWidth = canv.width;
const canvHeight = canv.height;
const timescale = document.querySelector("#timescale") as HTMLInputElement;
timescale.ondblclick = (event) => {
    timescale.value = "1.00";
    timescale.onchange!(new Event("click"));
}
const vLossOnHit = document.querySelector("#vLossOnHit") as HTMLInputElement;
vLossOnHit.ondblclick = (event) => {
    vLossOnHit.value = "10";
    vLossOnHit.onchange!(new Event("click"));
}
function velocityMultOnHit(): number {
    return 1 - Number(vLossOnHit.value) / 100;
}

let score: number;
let plCenter: Vector2;
let plVelocity: Vector2;
function plSpeed() {
    return 4 + score / 2;
}
let plRadius: number;
function plCollider() {
    return new Circle(plCenter.Add(new Vector2(plRadius, plRadius)), plRadius)
}
function coinSpawnCooldown() {
    return fps * 3 / Math.sqrt(1 + score / 3);
}
function reset(): void {
    score = 0;
    plCenter = new Vector2(canvWidth / 2, canvHeight / 2);
    plVelocity = Vector2.Zero;
    plRadius = 13;

    timescale.ondblclick!(new MouseEvent(""));
    vLossOnHit.ondblclick!(new MouseEvent(""));

    drawings = [new drawing((ctx) => { drawCircle(ctx, plRadius, plCenter) })];
}
reset();

drawings.push(new drawing((ctx) => { drawCircle(ctx, plRadius, plCenter) }));

new Timer(1000 / fps, 99999999, update);
let coins: coin[] = [];
let coinTimer = 0;
const clickCooldown = fps * 0.4;
let clickTimer = 0;
function update(): void {
    clickTimer += Number(timescale.value);
    coinTimer += Number(timescale.value);
    if (coinTimer >= coinSpawnCooldown() && coins.length < 3) {
        let coinPos = new Vector2(Math.random() * canvWidth, Math.random() * canvHeight);
        coins.push(new coin(coinPos));

        coinTimer = 0;
    }
    let newCoins: coin[] = [];
    coins.forEach(c => {
        if (c.collider.colliding(plCollider())) {
            c.onPlayerCollide();
        } else {
            newCoins.push(c);
        }
    });
    coins = newCoins;

    if ((plCenter.x + plRadius > canvWidth && plVelocity.x > 0) || (plCenter.x - plRadius < 0 && plVelocity.x < 0))
        plVelocity.x = -plVelocity.x * velocityMultOnHit();
    if ((plCenter.y + plRadius > canvHeight && plVelocity.y > 0) || (plCenter.y - plRadius < 0 && plVelocity.y < 0))
        plVelocity.y = -plVelocity.y * velocityMultOnHit();
    plCenter.add(plVelocity.Mult(Number(timescale.value)));
    render();
    document.querySelector("#score")!.innerHTML = String(score);
}

function onClick(event: MouseEvent): void {
    if (clickTimer < clickCooldown) return;
    plVelocity = CursorPos(event).Sub(plCenter).normalized.Mult(plSpeed());
    clickTimer = 0;
}

function CursorPos(event: MouseEvent): Vector2 {
    return new Vector2(event.clientX, event.clientY);
}
