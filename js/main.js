"use strict";
var fps = 60;
var frameInterval = 1000 / fps;
var canv = document.querySelector("canvas");
window.onresize = function () {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
};
canv.width = window.innerWidth;
canv.height = window.innerHeight;
function randomPoint() {
    return new Vector2(Math.random() * canv.width, Math.random() * canv.height);
}
var bodies;
var pl;
var boss;
var bossTimer;
function restart() {
    pl = new player(new Vector2(canv.width / 2, canv.height / 2), 9);
    if (boss)
        boss.active = false;
    if (bossTimer)
        bossTimer.end();
    bossTimer = new SecTimer(9, function (count, timer) {
        if (count == 1) {
            if (pl.score > 0) {
                var pos = randomPoint();
                while (pos.Sub(pl.center).length < (canv.width + canv.height) / 3) {
                    pos = randomPoint();
                }
                boss = new boss1(pos, 60);
                bodies.push(boss);
            }
            else
                timer.counter += 4;
        }
    });
    bodies = [pl];
    coins = [];
    drawings = [function (ctx) {
            drawCircle(ctx, pl.radius, pl.center);
            fillCircle(ctx, pl.radius, pl.center, 'crimson');
        }];
}
window.onkeydown = function (event) {
    if (event.key == 'r')
        restart();
};
restart();
var coins = [];
var coinTimer = 0;
new Timer(1000 / fps, 99999999, gameUpdate);
function gameUpdate() {
    coinTimer += 1;
    if (coinTimer >= pl.coinSpawnCooldown && coins.length < 3) {
        var coinPos = randomPoint();
        coins.push(new coin(coinPos));
        coinTimer = 0;
    }
    var newCoins = [];
    coins.forEach(function (c) {
        var plColliding = c.collider.colliding(pl.collider);
        if (plColliding)
            c.onPlayerCollide();
        if (plColliding || (boss && c.collider.colliding(boss.collider))) {
            c.deleteDrawing();
        }
        else
            newCoins.push(c);
    });
    coins = newCoins;
    bodies.forEach(function (b) {
        if (!b)
            return;
        b.update();
        if (b instanceof enemy)
            b.AI();
    });
    render();
}
function onClick(event) {
    pl.velocity = CursorPos(event).Sub(pl.center).normalized.Mult(pl.speed);
}
function CursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
