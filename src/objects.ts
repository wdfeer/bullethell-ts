class body {
    center: Vector2 = Vector2.Zero;
    velocity: Vector2 = Vector2.Zero;
    radius: number = 0;
    get collider() {
        return new CircleCollider(this.center, this.radius)
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
    update() {
        this.center.add(this.velocity);
        if ((this.center.x + this.radius > canv.width && this.velocity.x > 0) || (this.center.x - this.radius < 0 && this.velocity.x < 0))
            this.velocity.x = -this.velocity.x * 0.9;
        if ((this.center.y + this.radius > canv.height && this.velocity.y > 0) || (this.center.y - this.radius < 0 && this.velocity.y < 0))
            this.velocity.y = -this.velocity.y * 0.9;
    }
}
abstract class enemy extends body {
    active: boolean = true;
    constructor(center: Vector2, radius: number) {
        super(center, radius);
    }
    protected ai = () => { };
    public get AI(): () => void {
        if (!this.active)
            return () => { };
        return this.ai;
    }
}
class boss1 extends enemy {
    speed = 6;
    constructor(center: Vector2, radius: number) {
        super(center, radius);
        drawings.push((ctx) => {
            fillCircle(ctx, this.radius, this.center, 'red');
            fillCircle(ctx, this.radius * 0.9, this.center, 'black');
        });
    }
    ai = () => {
        let diff: Vector2 = pl.center.Sub(this.center);
        let dist: number = diff.length;
        if (dist > 200 + 1000 * Math.random())
            this.velocity = pl.center.Sub(this.center).normalized.Mult(this.speed);
    }
}
class bullet extends enemy {
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