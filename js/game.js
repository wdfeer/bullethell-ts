"use strict";
var fps = 60;
var frameInterval = 1000 / fps;
var distScale = (canv.width + canv.height) / 2600;
function randomPoint() {
    return new Vector2(Math.random() * canv.width, Math.random() * canv.height);
}
var currentBoss;
var bossTimer;
function restart() {
    paused = false;
    if (bossTimer)
        bossTimer.end();
    if (victoryTimer)
        victoryTimer.end();
    if (updateTimer)
        updateTimer.end();
    updateTimer = new Timer(frameInterval, 9999999, gameUpdate);
    drawables = [];
    if (currentBoss)
        currentBoss.delete();
    new player(new Vector2(canv.width / 2, canv.height / 2), 8.5 * distScale);
    bossTimer = new SecTimer(9, function (count, timer) {
        if (count == 1) {
            if (getPlayer().score > 0) {
                var pos = randomPoint();
                while (pos.Sub(getPlayer().center).length <
                    (canv.width + canv.height) / 3) {
                    pos = randomPoint();
                }
                currentBoss = new boss1(pos);
            }
            else
                timer.counter += 4;
        }
    });
}
restart();
function initiateVictory(counter) {
    victoryTimer = new SecTimer(counter, function (count) {
        if (count == 1)
            victory(getPlayer().score);
    });
}
var victoryTimer;
function victory(score) {
    updateTimer.end();
    new drawable(function (ctx) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canv.width, canv.height);
    }, 1, 'victoryShade');
    new drawable(function (ctx) {
        drawCenteredText(ctx, "Victory!", new Vector2(0, -120 * distScale));
        drawCenteredText(ctx, "Score: ".concat(score));
        drawCenteredText(ctx, "Press R to restart", new Vector2(0, 120 * distScale), undefined, undefined, 56);
    }, 2, 'victoryText');
}
var paused = false;
function pause() {
    var _a, _b;
    if (paused) {
        updateTimer = new Timer(frameInterval, 9999999, gameUpdate);
        (_a = getDrawableWithId('pauseShade')) === null || _a === void 0 ? void 0 : _a.delete();
        (_b = getDrawableWithId('pauseText')) === null || _b === void 0 ? void 0 : _b.delete();
    }
    else {
        updateTimer.end();
        new drawable(function (ctx) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canv.width, canv.height);
        }, 1, 'pauseShade');
        new drawable(function (ctx) {
            drawCenteredText(ctx, 'Paused');
        }, 1, 'pauseText');
    }
    paused = !paused;
}
var updateTimer;
var renderTimer = new Timer(frameInterval, 9999999, render);
function gameUpdate() {
    updateCoinSpawn();
    updateCoins(getCoins());
    updateBodies(getBodies());
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
function onKeyDown(keyCode) {
    switch (keyCode) {
        case 'KeyR':
            restart();
            break;
        case 'Space':
            pause();
            break;
        case 'KeyB':
            if (paused)
                break;
            var player_1 = getPlayer();
            var vel = cursorPos.Sub(player_1.center).normalized;
            player_1.shoot(vel);
            break;
        default:
            break;
    }
}
function onClick(event) {
    var player = getPlayer();
    player.velocity = getCursorPos(event)
        .Sub(player.center)
        .normalized.Mult(player.speed * 0.8).Add(player.velocity.Mult(0.2));
}
function getCursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
