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
  backgroundMusic = new Audio("audio/background.mp3");
  chickenHurt_sound = new Audio("audio/chickenouch.wav");
  coin_sound = new Audio("audio/collect_coin.wav");
  bottle_pickup_sound = new Audio("audio/collect_bottle.wav");

  gameWon = false;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.draw();
    this.setWorld();
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
    }, 150);
  }

  /**
   * Main draw loop.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.drawObjects();
    this.ctx.translate(-this.camera_x, 0);

    // Fixed UI
    this.addObjectsToMap(this.statusBar);

    this.ctx.translate(this.camera_x, 0);
    this.drawEnemies();
    this.addToMap(this.character);
    this.drawThrowableObjects();
    this.ctx.translate(-this.camera_x, 0);

    // repeat
    requestAnimationFrame(() => this.draw());
  }

  drawEnemies() {
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.endboss);
  }

  drawObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.collectableItems);
  }

  drawThrowableObjects() {
    this.addObjectsToMap(this.throwableObjects);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(object) {
    if (object.flippedGraphics) {
      this.flipImage(object);
    }
    object.draw(this.ctx);

    if (object.flippedGraphics) {
      this.flipImageBack(object);
    }
  }

  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0); // move by width of object
    this.ctx.scale(-1, 1); // mirror
    object.x = object.x * -1; // turn x-axis
  }

  flipImageBack(object) {
    object.x = object.x * -1; // turn x-axis
    this.ctx.restore();
  }

  // ---- Enemy collision functions ----

  checkCollisions() {
    this.checkEnemyCollision();
    this.checkEndbossCollision();
    this.checkEndbossBottleCollision();
    this.checkBottleGroundCollison();
    this.checkBottleIsBroken();
  }

  checkEnemyCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.isJumpingOnEnemy(enemy)) {
        enemy.isKilled(enemy);
        this.character.bounceUp();
        // SFX beim Draufspringen aufs Huhn
        this.playSound(this.chickenHurt_sound);
      }
      if (this.character.isColliding(enemy)) {
        this.hitCharacter(5);
      }
    });
  }

  checkEndbossCollision() {
    this.level.endboss.forEach((endboss) => {
      if (this.character.isColliding(endboss)) {
        this.hitCharacter(20);
      }
    });
  }

  checkEndbossBottleCollision() {
    this.throwableObjects.forEach((bottle) => {
      if (this.level.endboss[0].isColliding(bottle)) {
        bottle.isBroken = true;
        bottle.acceleration = -1;
        this.hitEndboss(10);
      }
    });
  }

  checkBottleGroundCollison() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.y > bottle.ground) {
        bottle.isBroken = true;
        bottle.removeObject();
      }
    });
  }

  checkBottleIsBroken() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isBroken) {
        let indexOfBottle = this.getIndexOfItem(this.throwableObjects, bottle);
        setTimeout(() => {
          this.throwableObjects.splice(indexOfBottle, 1);
        }, 250);
      }
    });
  }

  checkCharacterIsLeftOfEndboss() {
    if (this.isBehindEndboss()) {
      this.hitCharacter(100);
    }
  }

  // ---- Item collection functions ----

  checkCollection() {
    this.level.collectableItems.forEach((item) => {
      if (this.canCollectItem(item, Bottle)) {
        item.collectItem(item);
        this.collectBottle();
      }
      if (this.canCollectItem(item, Coin)) {
        item.collectItem(item);
        this.collectCoin();
      }
    });
  }

  canCollectItem(item, Obj) {
    return this.character.isColliding(item) && item instanceof Obj && !item.isCollected;
  }

  collectBottle() {
    this.collectedBottles++;
    this.playSound(this.bottle_pickup_sound); // SFX: Bottle aufgenommen
    this.statusBar[2].setPercentage((this.collectedBottles / amountCollectableBottles) * 100);
  }

  collectCoin() {
    this.collectedCoins++;
    this.playSound(this.coin_sound); // SFX: Coin aufgenommen
    this.statusBar[1].setPercentage(
      (this.collectedCoins / amountCollectableCoins) * 100
    );
  }

  checkThrowObjects() {
    if (this.isBottleAvailabe() && this.character.isLookingLeft()) {
      let bottle = new ThrowableBottle(this.character.x - 25, this.character.y + 100, "left");
      this.throwBottle(bottle);
    } else if (this.isBottleAvailabe()) {
      let bottle = new ThrowableBottle(this.character.x + 100, this.character.y + 100, "right");
      this.throwBottle(bottle);
    }
  }

  // ---- Sound functions ----

  /**
   * Play only if NOT muted.
   * Respektiert ein globales Flag `isSoundMuted` (z. B. vom UI-Toggle).
   */
  playSound(sound) {
    const muted = (typeof isSoundMuted !== "undefined") ? isSoundMuted : false;
    if (!muted) {
      try {
        // kurze Effekte resetten; Loops (z. B. Walking) lassen wir so
        if (!sound.loop) sound.currentTime = 0;
        sound.play().catch(() => {});
      } catch {}
    } else {
      // Bei Mute auch die Musik zuverlässig stoppen
      if (!sound.paused) {
        try { sound.pause(); } catch {}
      }
    }
  }

  setAudio() {
    // Grundkonfiguration
    this.chickenHurt_sound.volume = 0.2;
    this.backgroundMusic.volume = 0.2;
    this.backgroundMusic.playbackRate = 1.2;
    this.backgroundMusic.loop = true;

    // Hintergrundmusik startet jetzt über die gleiche Mute-Logik wie SFX
    this.playSound(this.backgroundMusic);
  }

  // ---- Supporting functions ----

  getIndexOfItem(array, item) {
    return array.indexOf(item, 0);
  }

  isJumpingOnEnemy(enemy) {
    return this.character.isJumping() && this.character.isColliding(enemy);
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

  throwBottle(bottle) {
    this.throwableObjects.push(bottle);
    this.collectedBottles--;
    this.statusBar[2].setPercentage((this.collectedBottles / 8) * 100);
  }

  hitEndboss(damage) {
    this.playSound(this.chickenHurt_sound);
    this.level.endboss[0].hit(damage);
    this.level.endboss[0].hadFirstHit = true;
    this.level.endboss[0].speed = 15;
    // defensiv: Endboss-Bar existiert evtl. nicht
    if (this.statusBar[3]) {
      this.statusBar[3].setPercentage(this.level.endboss[0].energy);
    }
  }

  hitCharacter(damage) {
    this.character.hit(damage);
    this.playSound(this.character.hurt_sound);
    this.statusBar[0].setPercentage(this.character.energy);
  }
}
