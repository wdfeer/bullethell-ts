"use strict";
var fps = 60;
var frameInterval = 1000 / fps;
function sizeMult() {
    return (canv.width + canv.height) / 2600;
}
function randomPoint() {
    return new Vector2(Math.random() * canv.width, Math.random() * canv.height);
}
function getCircles() {
    return drawables.filter(function (x) { return x instanceof stationaryCircle; });
}
function getBodies() {
    return drawables.filter(function (x) { return x instanceof body; });
}
function getPlayer() {
    return drawables.filter(function (x) { return x instanceof player; })[0];
}
var boss;
var bossTimer;
function restart() {
    drawables = [];
    new player(new Vector2(canv.width / 2, canv.height / 2), 8.5 * sizeMult());
    if (bossTimer)
        bossTimer.end();
    bossTimer = new SecTimer(9, function (count, timer) {
        if (count == 1) {
            if (getPlayer().score > 0) {
                var pos = randomPoint();
                while (pos.Sub(getPlayer().center).length <
                    (canv.width + canv.height) / 3) {
                    pos = randomPoint();
                }
                boss = new boss1(pos, 55 * sizeMult());
            }
            else
                timer.counter += 4;
        }
    });
}
restart();
function getCoins() {
    return drawables.filter(function (x) { return x instanceof coin; });
}
var updateTimer = new Timer(1000 / fps, 99999999, gameUpdate);
function gameUpdate() {
    updateCoinSpawn();
    updateCoins(getCoins());
    updateBodies(getBodies());
    render();
}
var coinTimer = 0;
function updateCoinSpawn() {
    coinTimer += 1;
    if (coinTimer >= getPlayer().coinSpawnCooldown && getCoins().length < 3) {
        var coinPos = randomPoint();
        new coin(coinPos);
        coinTimer = 0;
    }
}
function updateCoins(coins) {
    coins.forEach(function (c) {
        c.update();
    });
}
function updateBodies(bodies) {
    bodies.forEach(function (b) {
        if (!b)
            return;
        b.update();
    });
}
function onKeyPress(key) {
    if (key == 'r')
        restart();
}
function onClick(event) {
    getPlayer().velocity = CursorPos(event)
        .Sub(getPlayer().center)
        .normalized.Mult(getPlayer().speed);
}
function CursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
