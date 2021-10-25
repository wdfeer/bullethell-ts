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
let playerPos = new Vector2(canv.width / 2, canv.height / 2);
let playerVelocity = Vector2.Zero;
let playerRadius = 10;
drawings.push(new drawing((ctx) => {drawCircle(ctx, playerRadius, playerPos)}));
new Timer(1000 / fps, 99999999, update);
function reset(): void {
    playerPos = new Vector2(canvWidth / 2, canvHeight / 2);
    playerVelocity = Vector2.Zero;

    timescale.ondblclick!(new MouseEvent(""));
    vLossOnHit.ondblclick!(new MouseEvent(""));
}
function update(): void {
    if ((playerPos.x + playerRadius > canvWidth && playerVelocity.x > 0) || (playerPos.x - playerRadius < 0 && playerVelocity.x < 0))
        playerVelocity.x = -playerVelocity.x * velocityMultOnHit();
    if ((playerPos.y + playerRadius > canvHeight && playerVelocity.y > 0) || (playerPos.y - playerRadius < 0 && playerVelocity.y < 0))
        playerVelocity.y = -playerVelocity.y * velocityMultOnHit();
    playerPos.add(playerVelocity.Mult(Number(timescale.value)));
    render();
}

function onClick(event: MouseEvent): void {
    playerVelocity = CursorPos(event).Sub(playerPos).normalized.Mult(4);
}

function CursorPos(event: MouseEvent): Vector2 {
    return new Vector2(event.clientX, event.clientY);
}
