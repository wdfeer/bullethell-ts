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
    onPlayerCollide: () => void;
    constructor(public pos: Vector2) {
        this.drawing = new drawing(ctx => { drawCircle(ctx, coin.radius, pos, 'brown') });
        this.drawingId = drawings.length;
        drawings.push(this.drawing);
        this.collider = new Circle(pos, coin.radius);
        this.onPlayerCollide = () => { drawings.splice(this.drawingId); score++; };
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
let plPos: Vector2;
let plVelocity: Vector2;
let plSpeed: number;
let plRadius: number;
let plCollider: Circle;
function reset(): void {
    score = 0;
    plPos = new Vector2(canvWidth / 2, canvHeight / 2);
    plVelocity = Vector2.Zero;
    plSpeed = 4;
    plRadius = 13;
    plCollider = new Circle(plPos.Sub(new Vector2(plRadius, plRadius)), plRadius);

    timescale.ondblclick!(new MouseEvent(""));
    vLossOnHit.ondblclick!(new MouseEvent(""));

    drawings = [new drawing((ctx) => { drawCircle(ctx, plRadius, plPos) })];
}
reset();

drawings.push(new drawing((ctx) => { drawCircle(ctx, plRadius, plPos) }));

new Timer(1000 / fps, 99999999, update);
let coins: coin[] = [];
let coinTimer = 0;
function update(): void {
    coinTimer += Number(timescale.value);
    if (coinTimer >= 180 && coins.length < 3) {
        let pos = new Vector2(Math.random() * canvWidth, Math.random() * canvHeight);
        coins.push(new coin(pos));

        coinTimer = 0;
    }
    let newCoins: coin[] = [];
    coins.forEach(c => {
        if (c.collider.colliding(plCollider)) {
            c.onPlayerCollide();
        } else {
            newCoins.push(c);
        }
    });
    coins = newCoins;

    if ((plPos.x + plRadius > canvWidth && plVelocity.x > 0) || (plPos.x - plRadius < 0 && plVelocity.x < 0))
        plVelocity.x = -plVelocity.x * velocityMultOnHit();
    if ((plPos.y + plRadius > canvHeight && plVelocity.y > 0) || (plPos.y - plRadius < 0 && plVelocity.y < 0))
        plVelocity.y = -plVelocity.y * velocityMultOnHit();
    plPos.add(plVelocity.Mult(Number(timescale.value)));
    render();
    document.querySelector("#score")!.innerHTML = String(score);
}

function onClick(event: MouseEvent): void {
    plVelocity = CursorPos(event).Sub(plPos).normalized.Mult(plSpeed);
}

function CursorPos(event: MouseEvent): Vector2 {
    return new Vector2(event.clientX, event.clientY);
}
