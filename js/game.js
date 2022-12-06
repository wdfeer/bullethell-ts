"use strict";
var fps = 60;
var frameInterval = 1000 / fps;
var distScale = (canvas.width + canvas.height) / 2600;
function randomPoint() {
    return new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
}
var currentBoss;
var bossTimer;
function restart() {
    gameFrames = 0;
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
    new player(new Vector2(canvas.width / 2, canvas.height / 2), 8.5 * distScale);
    bossTimer = new SecTimer(3, function (count) {
        if (count == 1) {
            var pos = randomPoint();
            while (pos.Sub(getPlayer().center).length <
                (canvas.width + canvas.height) / 3) {
                pos = randomPoint();
            }
            currentBoss = new boss1(pos);
        }
    });
    new coin(getPlayer().center.Add(Vector2.rotate(new Vector2(150, 0), Math.random() * 360)));
}
restart();
function initiateVictory(seconds) {
    console.log("Victory initiated for ".concat(seconds, " seconds"));
    victoryTimer = new Timer(frameInterval, seconds * fps, undefined, function () {
        victory(getPlayer().score, (gameFrames / fps).toFixed(2));
    });
}
var victoryTimer;
function victory(score, time) {
    updateTimer.end();
    new drawable(function (ctx) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, 1, 'victoryShade');
    new drawable(function (ctx) {
        drawCenteredText(ctx, "Victory!", new Vector2(0, -180 * distScale));
        drawCenteredText(ctx, "Score: ".concat(score), new Vector2(0, -60 * distScale));
        drawCenteredText(ctx, "Time: ".concat(time, " s"), new Vector2(0, 60 * distScale));
        drawCenteredText(ctx, "Press R to restart", new Vector2(0, 180 * distScale), undefined, undefined, 56);
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
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 1, 'pauseShade');
        new drawable(function (ctx) {
            drawCenteredText(ctx, 'Paused');
        }, 1, 'pauseText');
    }
    paused = !paused;
}
var gameFrames;
var updateTimer;
var renderTimer = new Timer(frameInterval, 9999999, render);
function gameUpdate() {
    gameFrames++;
    updateCoinSpawn();
    updateCoins(getCoins());
    updateBodies(getBodies());
}
var coinTimer = 0;
function updateCoinSpawn() {
    coinTimer += 1;
    if (coinTimer >= getPlayer().coinSpawnCooldown && getCoins().length < 4) {
        spawnCoin();
        coinTimer = 0;
    }
}
function spawnCoin() {
    var coinPos = randomPoint();
    new coin(coinPos);
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
    var player = getPlayer();
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
            if (player.score <= 0)
                break;
            player.shoot();
            player.score--;
            player.showScore();
            player.hp += 20;
            break;
        default:
            break;
    }
}
function onClick(event) {
    var player = getPlayer();
    player.velocity = getCursorPos(event)
        .Sub(player.center)
        .normalized.Mult(player.speed * 0.8);
}
function getCursorPos(event) {
    return new Vector2(event.clientX, event.clientY);
}
