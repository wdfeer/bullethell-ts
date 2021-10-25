class drawing {
    draw: (ctx: CanvasRenderingContext2D) => void;
    constructor(draw: (ctx: CanvasRenderingContext2D) => void) {
        this.draw = draw;
    }
}

let drawings: drawing[] = [];

function render(): void {
    let ctx = canv.getContext("2d")!;
    ctx.clearRect(0, 0, canv.width, canv.height);

    drawings.forEach(obj => {
        obj.draw(ctx);
    });
}
function drawCircle(ctx: CanvasRenderingContext2D, radius: number, position: Vector2): void {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}