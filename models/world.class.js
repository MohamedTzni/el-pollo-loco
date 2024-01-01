class World {
  character = new Pepe();
  level;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = [new HealthBar(), new CoinBar(), new BottleBar()];
  throwableObjects = [];
  collectedBottles = 0;
  collectedCoins = 0;

  // --- Audio ---
  backgroundMusic = new Audio("./audio/background.mp3");
  chickenHurt_sound = new Audio("./audio/chickenouch.wav");
  coin_sound = new Audio("./audio/collect_coin.wav");
  bottle_pickup_sound = new Audio("./audio/collect_bottle.wav");

  gameWon = false;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;

    // Reihenfolge-Fix: erst Welt setzen, dann zeichnen/laufen lassen
    this.setWorld();
    this.draw();
    this.run();
  }

  /**
   * The function sets the world and audio for a character in JavaScript.
   */
  setWorld() {
    this.character.world = this;
    this.setAudio();
  }

  /**
   * Loops for collisions, collection and throw checks.
   */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCharacterIsLeftOfEndboss();
    }, 100);
    setInterval(() => {
      this.checkCollection();
    }, 25);
    setInterval(() => {
      this.checkThrowObjects();
      this.checkBottleIsBroken();
    }, 100);
  }

  setAudio() {
    this.backgroundMusic.volume = 0.1;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
  }

  // ---- Checks ----

  checkCollisions() {
    if (this.endbossIsInRangeOfCharacter()) {
      this.character.enemyHitsCharacter(this.level.endboss[0]);
      this.activateEndBossStatusBar();
    }
    this.checkEnemyCollision();
    this.checkBottleHitsEnemy();
  }

  activateEndBossStatusBar() {
    if (!this.endbossStatusBarAlreadyExists()) {
      this.statusBar.push(new EndBossBar());
    }
  }

  endbossIsInRangeOfCharacter() {
    return (
      Math.abs(this.character.x - this.level.endboss[0].x) < 600 &&
      this.level.endboss[0].isAlive
    );
  }

  endbossStatusBarAlreadyExists() {
    return this.statusBar.some((bar) => bar instanceof EndBossBar);
  }

  checkEnemyCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.isJumpingOnEnemy(enemy)) {
        enemy.isKilled(enemy);
        this.character.bounceUp();
        this.playSound(this.chickenHurt_sound);
      } else if (
        this.character.isColliding(enemy) &&
        this.characterCanGetDamage(enemy)
      ) {
        this.character.enemyHitsCharacter(enemy);
      }
    });
  }

  // ---- Supporting functions ----

  getIndexOfItem(array, item) {
    return array.indexOf(item, 0);
  }

  /**
   * Nur „von oben“: Unterkante des Charakters liegt (mit Toleranz) über Oberkante des Gegners.
   */
  isJumpingOnEnemy(enemy) {
    if (!this.character.isColliding(enemy)) return false;
    const charBottom =
      this.character.y +
      this.character.height -
      this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    // kleine Toleranz von 10px, damit knappe Top-Down-Kontakte zählen
    return charBottom <= enemyTop + 10;
  }

  isBottleAvailabe() {
    return this.keyboard.KEY_D && this.collectedBottles > 0;
  }

  isBehindEndboss() {
    return (
      this.level.endboss[0].x + this.level.endboss[0].width <
      this.character.x + this.character.width
    );
  }

  checkThrowObjects() {
    if (this.isBottleAvailabe()) {
      let bottle = new Throwablebottle(
        this.character.x + this.character.width - 65,
        this.character.y + this.character.height - 245
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.updateBottleStatusBar();
    }
  }

  updateBottleStatusBar() {
    this.statusBar[2].setPercentage(20 * this.collectedBottles);
  }

  updateCoinStatusBar() {
    this.statusBar[1].setPercentage(10 * this.collectedCoins);
  }

  checkCharacterIsLeftOfEndboss() {
    if (!this.level.endboss[0].isAlive) return;
    if (this.isBehindEndboss()) {
      this.level.endboss[0].characterLeftOfEndboss = false;
    } else {
      this.level.endboss[0].characterLeftOfEndboss = true;
    }
  }

  checkBottleHitsEnemy() {
    this.throwableObjects.forEach((b) => {
      this.level.enemies.forEach((e) => {
        if (b.isCollidingEnemy(e) && !b.bottleBroken) {
          b.bottleHitsEnemy(e);
        }
      });
      if (
        this.level.endboss[0] &&
        b.isCollidingEndboss(this.level.endboss[0]) &&
        !b.bottleBroken
      ) {
        b.bottleHitsEndboss(this.level.endboss[0]);
      }
    });
  }

  checkBottleIsBroken() {
    this.throwableObjects.forEach((b) => {
      if (b.y >= 360 && !b.bottleBroken) {
        b.bottleBreaks();
      }
    });
  }

  collect(o) {
    o.collect();
  }

  checkCollection() {
    this.level.collectableObjects.forEach((obj) => {
      if (this.character.isColliding(obj) && obj instanceof Bottle) {
        this.collect(obj);
        this.collectedBottles++;
        this.updateBottleStatusBar();
        this.playSound(this.bottle_pickup_sound);
      }
      if (this.character.isColliding(obj) && obj instanceof Coin) {
        this.collect(obj);
        this.collectedCoins++;
        this.updateCoinStatusBar();
        this.playSound(this.coin_sound);
      }
    });
  }

  characterCanGetDamage(enemy) {
    return (
      !this.character.isAboveGround() &&
      enemy.isAlive &&
      !this.character.invulnerable
    );
  }

  draw() {
    this.ctx.clearRect(
      -this.camera_x,
      0,
      this.canvas.width + 1200,
      this.canvas.height
    );
    this.ctx.translate(this.camera_x, 0);
    this.addElementsToMap(this.level.backgroundObjects);
    this.addElementsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addElementsToMap(this.level.collectableObjects);
    this.addElementsToMap(this.level.enemies);
    this.ctx.translate(-this.camera_x, 0);
    this.addStatusBarToMap(this.statusBar);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  playSound(sound) {
    try {
      if (sound && sound.play) {
        sound.currentTime = 0;
        sound.play();
      }
    } catch (e) {
      console.warn("[sound] play() unterdrückt:", e);
    }
  }

  addElementsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addStatusBarToMap(objects) {
    objects.forEach((o) => {
      this.ctx.translate(this.camera_x, 0);
      this.addToMap(o);
      this.ctx.translate(-this.camera_x, 0);
    });
  }

  addToMap(mo) {
    if (mo.flippedGraphics) mo.flipImage(this.ctx);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.flippedGraphics) mo.flipImageBack(this.ctx);
  }
}
