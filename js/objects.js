"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var stationaryCircle = /** @class */ (function (_super) {
    __extends(stationaryCircle, _super);
    function stationaryCircle(center, radius) {
        var _this = _super.call(this) || this;
        _this.alpha = 1;
        _this._radius = 0;
        _this.center = center;
        _this.radius = radius;
        return _this;
    }
    Object.defineProperty(stationaryCircle.prototype, "radius", {
        get: function () {
            return this._radius * sizeMult();
        },
        set: function (value) {
            this._radius = value / sizeMult();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(stationaryCircle.prototype, "collider", {
        get: function () {
            return new CircleCollider(this.center, this.radius);
        },
        enumerable: false,
        configurable: true
    });
    return stationaryCircle;
}(drawable));
var body = /** @class */ (function (_super) {
    __extends(body, _super);
    function body(center, radius) {
        var _this = _super.call(this, center, radius) || this;
        _this.velocity = Vector2.Zero;
        return _this;
    }
    body.prototype.update = function () {
        this.center.add(this.velocity);
        if ((this.center.x + this.radius > canv.width && this.velocity.x > 0) ||
            (this.center.x - this.radius < 0 && this.velocity.x < 0))
            this.velocity.x = -this.velocity.x * 0.5;
        if ((this.center.y + this.radius > canv.height && this.velocity.y > 0) ||
            (this.center.y - this.radius < 0 && this.velocity.y < 0))
            this.velocity.y = -this.velocity.y * 0.5;
    };
    return body;
}(stationaryCircle));
var player = /** @class */ (function (_super) {
    __extends(player, _super);
    function player(center, radius) {
        var _this = _super.call(this, center, radius) || this;
        _this.draw = function (ctx) {
            drawCircle(ctx, _this.radius, _this.center);
            fillCircle(ctx, _this.radius, _this.center, 'crimson', _this.alpha);
        };
        _this.id = 'player';
        _this.score = 0;
        _this.scoreAlpha = 1;
        _this.scoreFadeTimer = null;
        _this._hp = player.maxhp;
        return _this;
    }
    Object.defineProperty(player.prototype, "hp", {
        get: function () {
            return this._hp;
        },
        set: function (value) {
            if (value < this.hp)
                playSound('./sounds/hit.mp3');
            if (value <= 0) {
                restart();
                this._hp = 0;
                return;
            }
            if (value >= player.maxhp)
                value = player.maxhp;
            this._hp = value;
            this.alpha = this.hp / player.maxhp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(player.prototype, "speed", {
        get: function () {
            return (7 - 4 * Math.pow(0.9, this.score)) * sizeMult();
        },
        enumerable: false,
        configurable: true
    });
    player.prototype.onCoinCollect = function () {
        var _this = this;
        this.score++;
        this.hp += 5;
        playSound('./sounds/score.mp3', 0.25);
        this.scoreAlpha = 1;
        var timeLeft = fps * (1 + 2 * Math.pow(0.9, this.score));
        if (this.scoreFadeTimer)
            this.scoreFadeTimer.end();
        this.scoreFadeTimer = new Timer(frameInterval, timeLeft, function (counter) {
            if (counter < timeLeft / 3) {
                _this.scoreAlpha = counter / (timeLeft / 3);
            }
        });
        if (!getDrawableWithId('score'))
            new drawable(function (ctx) {
                drawCenteredText(ctx, String(getPlayer().score), undefined, _this.scoreAlpha);
            }, undefined, 'score');
    };
    Object.defineProperty(player.prototype, "coinSpawnCooldown", {
        get: function () {
            return (fps * 3) / Math.sqrt(1 + this.score / 3);
        },
        enumerable: false,
        configurable: true
    });
    player.maxhp = 100;
    return player;
}(body));
var enemy = /** @class */ (function (_super) {
    __extends(enemy, _super);
    function enemy(center, radius) {
        var _this = _super.call(this, center, radius) || this;
        _this.damage = 100;
        _this.ai = function () { };
        return _this;
    }
    enemy.prototype.onPlayerHit = function () {
        getPlayer().hp -= this.damage;
    };
    enemy.prototype.update = function () {
        _super.prototype.update.call(this);
        if (!this.isDrawn)
            return;
        var plColliding = this.collider.colliding(getPlayer().collider);
        if (plColliding)
            this.onPlayerHit();
        this.ai();
    };
    return enemy;
}(body));
var boss1 = /** @class */ (function (_super) {
    __extends(boss1, _super);
    function boss1(center, radius) {
        var _this = _super.call(this, center, radius) || this;
        _this.id = 'boss1';
        _this.speed = 2.5 * sizeMult();
        _this.attackTimer = 0;
        _this.ai = function () {
            var diff = getPlayer().center.Sub(_this.center);
            var dist = diff.length;
            if (dist > _this.radius * 4 + _this.radius * 20 * sizeMult() * Math.random())
                _this.velocity = getPlayer()
                    .center.Sub(_this.center)
                    .normalized.Mult(_this.speed);
            _this.attackTimer++;
            if (_this.attackTimer >= _this.attackCooldown) {
                _this.rangedAttack(getPlayer().score > 5 && Math.random() < 0.2);
                _this.attackTimer = 0;
            }
        };
        _this.draw = function (ctx) {
            fillCircle(ctx, _this.radius, _this.center, '#ff10a0');
            fillCircle(ctx, _this.radius * 0.9, _this.center, 'black');
        };
        return _this;
    }
    Object.defineProperty(boss1.prototype, "attackCooldown", {
        get: function () {
            return (40 + 80 / (getPlayer().score > 9 ? Math.sqrt(getPlayer().score - 8) : 1));
        },
        enumerable: false,
        configurable: true
    });
    boss1.prototype.rangedAttack = function (homing) {
        var _this = this;
        if (homing === void 0) { homing = false; }
        var bullets = shootEvenlyInACircle(Math.random() < 0.6 ? 6 : 12, (homing ? 10 : 12) * sizeMult(), this.center, (1 + 3 * Math.random()) * sizeMult());
        bullets.forEach(function (b) {
            b.velocity.add(_this.velocity);
            b.draw = function (ctx) {
                drawCircle(ctx, b.radius, b.center, 'black', b.alpha);
                fillCircle(ctx, b.radius, b.center, homing ? '#9940ef' : '#ef4099', b.alpha);
            };
            b.preUpdate = function (timeLeft) {
                if (timeLeft <= 60) {
                    b.alpha = timeLeft / 60;
                    b.onPlayerHit = function () { };
                }
            };
            b.onTimeout = function () {
                b.delete();
            };
            if (homing) {
                b.ai = function () {
                    var direction = getPlayer().center.Sub(b.center).normalized;
                    var dist = getPlayer().center.Sub(b.center).length;
                    b.velocity.add(direction.Div(dist > 1 ? dist * dist : 1).Mult(480 * sizeMult()));
                };
            }
        });
    };
    return boss1;
}(enemy));
function shootEvenlyInACircle(count, bulletRadius, position, velocity, spawnRadius, offsetInRadians) {
    if (spawnRadius === void 0) { spawnRadius = 0; }
    if (offsetInRadians === void 0) { offsetInRadians = 0; }
    var bullets = [];
    var angle = offsetInRadians;
    for (var i = 0; i < count; i++) {
        var Vy = Math.sin(angle) * velocity;
        var Vx = Math.cos(angle) * velocity;
        var V = new Vector2(Vx, Vy);
        bullets.push(new bullet(position.Add(V.normalized.Mult(spawnRadius)), V, bulletRadius));
        angle += (Math.PI * 2) / count;
    }
    return bullets;
}
var bullet = /** @class */ (function (_super) {
    __extends(bullet, _super);
    function bullet(center, velocity, radius, lifetime) {
        if (lifetime === void 0) { lifetime = 9; }
        var _this = _super.call(this, center, radius) || this;
        _this.zIndex = -1;
        _this.damage = 35;
        _this.onPlayerHit = function () {
            _super.prototype.onPlayerHit.call(_this);
            _this.delete();
        };
        _this.preUpdate = function (timeLeft) { };
        _this.onTimeout = function () {
            _this.delete();
        };
        _this.velocity = velocity;
        _this.timer = new Timer(frameInterval, lifetime * fps, function (c) {
            _this.preUpdate(c);
            if (c == 1)
                _this.onTimeout();
        });
        return _this;
    }
    bullet.prototype.delete = function () {
        this.timer.end();
        _super.prototype.delete.call(this);
    };
    bullet.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    return bullet;
}(enemy));
var coin = /** @class */ (function (_super) {
    __extends(coin, _super);
    function coin(center) {
        var _this = _super.call(this, center, coin.radius) || this;
        _this.center = center;
        _this.draw = function (ctx) {
            drawCircle(ctx, coin.radius, _this.center, 'green');
            fillCircle(ctx, coin.radius, _this.center, '#faffde', _this.alpha);
        };
        _this.zIndex = -2;
        _this.onPlayerCollide = function () {
            getPlayer().onCoinCollect();
            _this.delete();
        };
        return _this;
    }
    Object.defineProperty(coin, "radius", {
        get: function () {
            return 22 * sizeMult();
        },
        enumerable: false,
        configurable: true
    });
    coin.prototype.update = function () {
        var plColliding = this.collider.colliding(getPlayer().collider);
        if (plColliding)
            this.onPlayerCollide();
        if (plColliding || (boss && this.collider.colliding(boss.collider))) {
            this.delete();
        }
    };
    return coin;
}(stationaryCircle));
