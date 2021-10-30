type draw = (ctx: CanvasRenderingContext2D) => void;
type drawing = {
    draw: draw,
    zIndex: number
}

var scoreDraw: draw = (ctx) => { };
var drawings: (drawing | draw)[] = [];

function render(): void {
    let ctx = canv.getContext("2d")!;
    ctx.clearRect(0, 0, canv.width, canv.height);

    let getZ = (d: drawing | draw) => {
        if (typeof d == 'function')
            return 0;
        else return d.zIndex;
    };
    console.log(drawings.min(getZ), drawings.max(getZ));
    for (let i = drawings.min(getZ); i <= drawings.max(getZ); i++) {
        drawings.forEach(d => {
            if (getZ(d) == i) {
                if (typeof d == 'function')
                    d(ctx);
                else d.draw(ctx);
            }
        });
    }
    scoreDraw(ctx);
}

function drawCircle(ctx: CanvasRenderingContext2D, radius: number, center: Vector2, color: string = 'black', alpha: number = 1): void {
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function fillCircle(ctx: CanvasRenderingContext2D, radius: number, center: Vector2, color: string = 'black', alpha: number = 1): void {
    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawCenteredText(ctx: CanvasRenderingContext2D, text: string, color: string = 'black', alpha: number = 1, fontStyle: string = '96px Bahnschrift') {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = fontStyle;
    ctx.textAlign = 'center';
    ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
}