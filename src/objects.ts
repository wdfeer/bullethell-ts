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