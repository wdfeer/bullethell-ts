class body {
    center: Vector2 = Vector2.Zero;
    velocity: Vector2 = Vector2.Zero;
    radius: number = 0;
    get collider() {
        return new CircleCollider(this.center.Add(new Vector2(this.radius, this.radius)), this.radius)
    }
    constructor(center: Vector2, radius: number) {
        this.center = center;
        this.radius = radius;
    }
    update() {
        this.center.add(this.velocity);
    }
}
class player extends body {
    score: number = 0;
    get speed() {
        return 4 + this.score / 2;
    }
    get coinSpawnCooldown() {
        return fps * 3 / Math.sqrt(1 + this.score / 3);
    }
    constructor(center: Vector2, radius: number) {
        super(center, radius);
    }
}
class enemy extends body {
    constructor(center: Vector2, radius: number) {
        super(center, radius);
    }
}
class bullet extends body {
    constructor(center: Vector2, velocity: Vector2, radius: number) {
        super(center, radius);
        this.velocity = velocity;
    }
}
class coin {
    static radius = 25;
    draw: draw;
    drawingId: number;
    collider: CircleCollider;
    onPlayerCollide: () => void = () => {
        delete drawings[this.drawingId];
        pl.score++;

        let alpha = 1;
        let timeLeft = fps * 2;
        new Timer(frameInterval, timeLeft, (counter) => {
            if (counter < timeLeft / 3) {
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
        this.collider = new CircleCollider(pos, coin.radius);
    }
}