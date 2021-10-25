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

let score = 0;
let plPos = new Vector2(canv.width / 2, canv.height / 2);
let plVelocity = Vector2.Zero;
let plSpeed = 4;
let plRadius = 13;
drawings.push(new drawing((ctx) => {drawCircle(ctx, plRadius, plPos)}));
new Timer(1000 / fps, 99999999, update);
function reset(): void {
    plPos = new Vector2(canvWidth / 2, canvHeight / 2);
    plVelocity = Vector2.Zero;

    timescale.ondblclick!(new MouseEvent(""));
    vLossOnHit.ondblclick!(new MouseEvent(""));
}
function update(): void {
    if ((plPos.x + plRadius > canvWidth && plVelocity.x > 0) || (plPos.x - plRadius < 0 && plVelocity.x < 0))
        plVelocity.x = -plVelocity.x * velocityMultOnHit();
    if ((plPos.y + plRadius > canvHeight && plVelocity.y > 0) || (plPos.y - plRadius < 0 && plVelocity.y < 0))
        plVelocity.y = -plVelocity.y * velocityMultOnHit();
    plPos.add(plVelocity.Mult(Number(timescale.value)));
    render();
}

function onClick(event: MouseEvent): void {
    plVelocity = CursorPos(event).Sub(plPos).normalized.Mult(plSpeed);
}

function CursorPos(event: MouseEvent): Vector2 {
    return new Vector2(event.clientX, event.clientY);
}
