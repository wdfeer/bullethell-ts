class body {
    alpha: number = 1;

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
        if ((this.center.x + this.radius > canv.width && this.velocity.x > 0) || (this.center.x - this.radius < 0 && this.velocity.x < 0))
            this.velocity.x = -this.velocity.x * 0.5;
        if ((this.center.y + this.radius > canv.height && this.velocity.y > 0) || (this.center.y - this.radius < 0 && this.velocity.y < 0))
            this.velocity.y = -this.velocity.y * 0.5;
    }
}
class player extends body {
    score: number = 0;
    private _hp: number = 100;
    public get hp(): number {
        return this._hp;
    }
    public set hp(value: number) {
        if (value <= 0)
            restart();
        this._hp = value;
    }
    get speed() {
        return (3 + this.score / 2) * sizeMult();
    }
    get coinSpawnCooldown() {
        return fps * 3 / Math.sqrt(1 + this.score / 3);
    }
    constructor(center: Vector2, radius: number) {
        super(center, radius);
    }
}
abstract class enemy extends body {
    active: boolean = true;
    constructor(center: Vector2, radius: number) {
        super(center, radius);
    }
    onPlayerHit = () => { };
    ai = () => { };
    public get AI(): () => void {
        if (!this.active)
            return () => { };
        if (this.collider.colliding(pl.collider))
            this.onPlayerHit();
        return this.ai;
    }
}
class boss1 extends enemy {
    speed = 2.5 * sizeMult();
    onPlayerHit = () => {
        pl.hp -= 100;
    }
    get attackCooldown(): number {
        return 40 + 80 / (pl.score > 9 ? Math.sqrt(pl.score - 8) : 1);
    }
    attackTimer = 0;
    ai = () => {
        let diff: Vector2 = pl.center.Sub(this.center);
        let dist: number = diff.length;
        if (dist > this.radius * 4 + this.radius * 20 * Math.random())
            this.velocity = pl.center.Sub(this.center).normalized.Mult(this.speed);
        this.attackTimer++;
        if (this.attackTimer >= this.attackCooldown) {
            this.rangedAttack(pl.score > 5 && Math.random() < 0.2);
            this.attackTimer = 0;
        }
    }
    rangedAttack(homing: boolean = false) {
        let bullets = shootEvenlyInACircle(Math.random() < 0.6 ? 6 : 12, (homing ? 10 : 12) * sizeMult(), this.center, (1 + 3 * Math.random()) * sizeMult());
        bullets.forEach(b => {
            b.velocity.add(this.velocity);
            bodies.push(b);
            let drawingsLen = drawings.length;
            drawings.push({
                draw: (ctx) => {
                    drawCircle(ctx, b.radius, b.center, 'black', b.alpha);
                    fillCircle(ctx, b.radius, b.center, homing ? '#9940ef' : '#ef4099', b.alpha)
                }, zIndex: bullet.zIndex
            });
            b.timerPreTick = (timeLeft) => {
                if (timeLeft <= 60) {
                    this.alpha = timeLeft / 60;
                    delete bodies[bodies.indexOf(b)];
                }
            }
            b.onTimeout = () => {
                delete drawings[drawingsLen];
            }
            if (homing) {
                b.ai = () => {
                    let direction = pl.center.Sub(b.center).normalized;
                    let dist = pl.center.Sub(b.center).length;
                    b.velocity.add(direction.Div(dist > 1 ? dist * dist : 1).Mult(480 * sizeMult()));
                }
            }
        });
    }
    constructor(center: Vector2, radius: number) {
        super(center, radius);
        drawings.push((ctx) => {
            fillCircle(ctx, this.radius, this.center, '#ff10a0');
            fillCircle(ctx, this.radius * 0.9, this.center, 'black');
        });
    }
}
class bullet extends enemy {
    static zIndex = -1;
    onPlayerHit = () => {
        pl.hp -= 100;
    }
    timerPreTick = (timeLeft: number) => { };
    onTimeout = () => { };
    constructor(center: Vector2, velocity: Vector2, radius: number, lifetime: number = 9) {
        super(center, radius);
        this.velocity = velocity;
        new Timer(frameInterval, lifetime * fps, (c) => {
            this.timerPreTick(c);
            if (c <= 1)
                this.onTimeout();
        });
    }
}
function shootEvenlyInACircle(count: number, bulletRadius: number, pos: Vector2, velocity: number, spawnRadius: number = 0): bullet[] {
    let bullets: bullet[] = [];
    let angle = 0;
    for (let i = 0; i < count; i++) {
        let Vy = Math.sin(angle) * velocity;
        let Vx = Math.cos(angle) * velocity;
        let V = new Vector2(Vx, Vy);
        bullets.push(new bullet(pos.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius))
        angle += 360 / count;
    }
    return bullets;
}
class coin {
    static get radius() {
        return 22 * sizeMult();
    }
    drawing: drawing;
    drawingId: number;
    collider: CircleCollider;
    deleteDrawing() {
        delete drawings[this.drawingId];
    }
    onPlayerCollide: () => void = () => {
        this.deleteDrawing();
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
        this.drawing = {
            draw: ctx => {
                drawCircle(ctx, coin.radius, pos, 'green');
                fillCircle(ctx, coin.radius, pos, '#ffffde');
            }, zIndex: -2
        };
        this.drawingId = drawings.length;
        drawings.push(this.drawing);
        this.collider = new CircleCollider(pos, coin.radius);
    }
}