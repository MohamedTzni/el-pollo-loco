/**
 * Properties of the game world, including the character, level, and interactions.
 */
class World {
  baseWidth = 720;
  baseHeight = 480;
  character = new Pepe();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new HealthBar();
  coinsStatusBar = new CoinBar();
  bottlesStatusBar = new BottleBar();
  endbossStatusBar = new EndBossBar();
  bottles = 0;
  coins = 0;
  maxBottles = 12;
  maxCoins = 10;
  throwableObjects = [];
  lastThrowTime = 0;
  intervals = [];
  gameOver = false;
  gameWon = false;
  endScreenTriggered = false;
  showEndbossStatusBar = false;
  chickenHurt_sound = new Audio("./audio/chickenouch.wav");
  throwBottle_sound = new Audio("./audio/collect_bottle.wav");
  backgroundMusic = new Audio("./audio/background.mp3");

  /**
   * Constructor of the World class, initializes the canvas, inputs, and game components.
   * @param {HTMLCanvasElement} canvas - The canvas element where the game is drawn.
   * @param {Keyboard} keyboard - Object for managing keyboard inputs.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;

    this.setWorld();
    this.assignCharacterToEnemies();
    this.draw();
    this.run();
  }

  /**
   * Links the world to the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Assigns the character to each endboss in the level so they can react to it.
   */
  assignCharacterToEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.character = this.character;
        enemy.world = this;
      }
    });
  }

  /**
   * Main game loop: repeatedly performs collision checks, status updates, etc.
   */
  run() {
    this.addInterval(() => {
      if (this.gameOver) return;
      this.checkCollisions();
      this.checkCollectibles();
      this.checkThrowObjects();
      this.checkEndbossSpawn();
    }, 10);

    this.addInterval(() => {
      if (this.gameOver) return;
      this.checkGameOver();
    }, 100);
  }

  /**
   * Adds a periodically executed function (interval).
   * @param {Function} fn - The function to execute.
   * @param {number} time - Execution frequency in milliseconds.
   * @returns {number} - The ID of the created interval.
   */
  addInterval(fn, time) {
    const id = setInterval(fn, time);
    this.intervals.push(id);
    return id;
  }

  /**
   * Stops all active intervals stored in the `intervals` list.
   * This ensures that no running intervals remain.
   */
  clearAllIntervals() {
    this.intervals.forEach(clearInterval);
  }

  /**
   * Ends the game and displays the corresponding end screen.
   * @param {boolean} win - Whether the player has won.
   */
  stopGame(win = false) {
    if (this.gameOver) return;
    this.gameWon = win;
    this.clearAllIntervals();
    this.gameOver = true;
    this.stopAllSounds();
    if (typeof window.stopGame === "function") {
      window.stopGame();
    }
  }

  /**
   * Stops all sounds and resets them to the beginning.
   * This includes all sounds in the `sounds` object as well as background music.
   */
  stopAllSounds() {
    const sounds = [
      this.backgroundMusic,
      this.chickenHurt_sound,
      this.throwBottle_sound,
      this.character?.walking_sound,
      this.character?.hurt_sound,
      this.character?.dead_sound,
      this.character?.jump_sound,
      this.level?.enemies?.find((enemy) => enemy instanceof Endboss)?.endbossDead_sound,
    ];

    sounds.forEach((sound) => {
      if (!sound) return;
      try {
        sound.pause();
        sound.currentTime = 0;
      } catch {}
    });
  }

  /**
   * Displays the end screen (win or lose).
   * @param {boolean} win - Whether the player has won.
   */
  showEndScreen(win) {
    this.gameWon = win;
    if (typeof window.showEndScreen === "function") {
      window.showEndScreen();
    }
  }

  playSound(sound) {
    if (!sound) return;
    sound.muted = typeof isSoundMuted !== "undefined" ? isSoundMuted : false;
    if (sound.muted) return;

    try {
      sound.currentTime = 0;
      const playPromise = sound.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch {}
  }

  getIndexOfItem(array, item) {
    return array.indexOf(item);
  }

  endGame(win = this.gameWon) {
    this.stopGame(win);
  }

  endbossStatusBarAlreadyExists() {
    return this.showEndbossStatusBar;
  }

  /**
   * Checks if the game is over based on the character's or endboss's status.
   *
   * - If the character is dead, the death animation plays and the game stops.
   * - If the endboss is defeated, its death animation plays and the game stops.
   *
   * @returns {void}
   */
  checkGameOver() {
    if (this.endScreenTriggered) return;

    if (this.character.isDead()) {
      this.endScreenTriggered = true;
      this.character.playAnimation(this.character.IMAGES_DEAD);

      setTimeout(() => {
        this.stopGame(false);
      }, 1500);
    } else if (this.isEndbossDead()) {
      const endboss = this.level.enemies.find(
        (enemy) => enemy instanceof Endboss
      );
      if (endboss) {
        endboss.playAnimation(endboss.IMAGES_DEAD);
      }

      this.endScreenTriggered = true;
      setTimeout(() => {
        this.stopGame(true);
      }, 1500);
    }
  }

  /**
   * Checks if the endboss has been defeated.
   * @returns {boolean} - True if the endboss is dead.
   */
  isEndbossDead() {
    return this.level.enemies.some(
      (enemy) => enemy instanceof Endboss && enemy.isDead()
    );
  }

  /**
   * Checks for collisions between the character, enemies, and bottles.
   */
  checkCollisions() {
    this.checkCharacterEnemyCollisions();
    this.checkBottleEnemyCollisions();
  }

  /**
   * Checks for collisions between the character and enemies.
   */
  checkCharacterEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      const hasCollision =
        enemy instanceof Endboss
          ? this.isBossColliding(enemy)
          : this.character.isColliding(enemy);

      if (hasCollision) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  isBossColliding(enemy) {
    return (
      this.character.x + this.character.width - 20 >= enemy.x + 40 &&
      this.character.x + 40 <= enemy.x + enemy.width - 20 &&
      this.character.y + this.character.height - 20 >= enemy.y + 30 &&
      this.character.y + 30 <= enemy.y + enemy.height - 20
    );
  }

  /**
   * Checks for collisions between bottles and enemies.
   */
  checkBottleEnemyCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      if (!bottle || bottle.isBroken) return;
      this.level.enemies.forEach((enemy) => {
        const hasCollision =
          enemy instanceof Endboss
            ? this.isBottleHittingEndboss(bottle, enemy)
            : bottle.isColliding(enemy);

        if (hasCollision) {
          this.processBottleCollision(bottleIndex, enemy);
        }
      });
    });
  }

  isBottleHittingEndboss(bottle, enemy) {
    return (
      bottle.x + bottle.width - 10 >= enemy.x + 35 &&
      bottle.x + 10 <= enemy.x + enemy.width - 30 &&
      bottle.y + bottle.height - 10 >= enemy.y + 55 &&
      bottle.y + 10 <= enemy.y + enemy.height - 35
    );
  }

  /**
   * Handles a collision between a bottle and an enemy.
   * @param {number} bottleIndex - Index of the colliding bottle.
   * @param {MovableObject} enemy - The hit enemy.
   */
  processBottleCollision(bottleIndex, enemy) {
    if (!enemy.isAlive && !(enemy instanceof Endboss)) return;
    const bottle = this.throwableObjects[bottleIndex];
    if (!bottle || bottle.isBroken) return;

    if (enemy instanceof Endboss) {
      const didHit = enemy.hit();
      if (didHit) {
        enemy.hadFirstHit = true;
        this.playSound(this.chickenHurt_sound);
        this.updateEndbossStatusBar(enemy);
      }
    } else {
      this.killEnemy(enemy);
    }

    bottle.isBroken = true;
    bottle.removeObject();
    setTimeout(() => {
      const currentIndex = this.throwableObjects.indexOf(bottle);
      if (currentIndex > -1) {
        this.throwableObjects.splice(currentIndex, 1);
      }
    }, 180);
  }

  /**
   * Handles a collision between the character and an enemy.
   * @param {MovableObject} enemy - The collided enemy.
   */
  handleEnemyCollision(enemy) {
    if (enemy instanceof Endboss) {
      this.handleEndbossCollision();
    } else if (enemy.isAlive) {
      this.handleNormalEnemyCollision(enemy);
    }
  }

  /**
   * Handles a collision between the character and the endboss.
   */
  handleEndbossCollision() {
    const didHit = this.character.hit(10);
    if (didHit) {
      this.playSound(this.character.hurt_sound);
      this.statusBar.setPercentage(this.character.energy);
      if (this.character.isDead()) {
        this.endScreenTriggered = true;
        setTimeout(() => this.stopGame(false), 300);
      }
    }
  }

  /**
   * Handles a collision between the character and a normal enemy.
   * @param {MovableObject} enemy - The collided enemy.
   */
  handleNormalEnemyCollision(enemy) {
    if (this.isJumpingOnEnemy(enemy)) {
      this.killEnemy(enemy);
    } else {
      const didHit = this.character.hit();
      if (didHit) {
        this.playSound(this.character.hurt_sound);
        this.statusBar.setPercentage(this.character.energy);
      }
    }
  }

  /**
   * Checks if the character is jumping on an enemy.
   * @param {MovableObject} enemy - The enemy.
   * @returns {boolean} - True if the character is jumping on the enemy.
   */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.speedY < 0 &&
      this.character.y + this.character.height - 10 < enemy.y + enemy.height / 2
    );
  }

  /**
   * Kills an enemy and removes it from the game world.
   * @param {MovableObject} enemy - The enemy.
   */
  killEnemy(enemy) {
    if (enemy.isAlive) {
      enemy.isAlive = false;
      if (enemy.IMAGES_DEAD) {
        enemy.playAnimation(enemy.IMAGES_DEAD);
      }
      this.playSound(this.chickenHurt_sound);
      setTimeout(() => {
        const enemyIndex = this.level.enemies.indexOf(enemy);
        if (enemyIndex > -1) {
          this.level.enemies.splice(enemyIndex, 1);
        }
      }, 2000);
    }
  }

  /**
   * Checks for collectible objects (coins, bottles).
   */
  checkCollectibles() {
    this.checkBottleCollectibles();
    this.checkCoinCollectibles();
  }

  /**
   * Checks if bottles can be collected.
   */
  checkBottleCollectibles() {
    for (let index = this.level.bottles.length - 1; index >= 0; index--) {
      const bottle = this.level.bottles[index];
      if (this.character.isColliding(bottle)) {
        this.bottles++;
        this.bottlesStatusBar.setPercentage(
          Math.min((this.bottles / this.maxBottles) * 100, 100)
        );
        this.playSound(bottle.collect_sound);
        this.level.bottles.splice(index, 1);
      }
    }
  }

  /**
   * Checks if coins can be collected.
   */
  checkCoinCollectibles() {
    for (let index = this.level.coins.length - 1; index >= 0; index--) {
      const coin = this.level.coins[index];
      if (this.character.isColliding(coin) && this.coins < this.maxCoins) {
        this.coins++;
        this.coinsStatusBar.setPercentage((this.coins / this.maxCoins) * 100);
        this.playSound(coin.collect_sound);
        this.level.coins.splice(index, 1);
      }
    }
  }

  /**
   * Checks if a bottle should be thrown.
   */
  checkThrowObjects() {
    if (this.isBottleThrowReady()) {
      this.throwBottle();
      this.updateBottleStatus();
    }
  }

  /**
   * Checks if the character is ready to throw a bottle.
   * @returns {boolean} - True if a bottle can be thrown.
   */
  isBottleThrowReady() {
    const currentTime = new Date().getTime();
    return (
      this.keyboard.KEY_D &&
      this.bottles > 0 &&
      currentTime - this.lastThrowTime > 500
    );
  }

  /**
   * Creates and throws a bottle in the direction of the character.
   * Plays the sound effect for throwing and adds the bottle to the list of thrown objects.
   * The bottle is positioned based on the character's direction.
   *
   * @returns {void} - The method does not return a value.
   */
  throwBottle() {
    if (this.gameOver) return;
    this.lastThrowTime = new Date().getTime();

    let direction = this.character.isLookingLeft() ? "left" : "right";
    let bottle = new ThrowableBottle(
      this.character.x + (direction === "left" ? -20 : 60),
      this.character.y + 170,
      direction
    );

    this.playSound(this.throwBottle_sound);
    this.throwableObjects.push(bottle);
  }

  /**
   * Updates the bottle status after a throw.
   * Decreases the number of available bottles and updates the bottle status bar.
   */
  updateBottleStatus() {
    this.bottles--;
    this.bottlesStatusBar.setPercentage(
      Math.max(Math.min((this.bottles / this.maxBottles) * 100, 100), 0)
    );
  }

  /**
   * Checks if the endboss should be activated.
   */
  checkEndbossSpawn() {
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss
    );
    if (
      endboss &&
      !endboss.hadFirstContact &&
      this.character.x + 500 > endboss.x
    ) {
      endboss.hadFirstContact = true;
      this.showEndbossStatusBar = true;
    }
  }

  /**
   * Updates the status bar of the endboss.
   * @param {Endboss} endboss - The endboss.
   */
  updateEndbossStatusBar(endboss) {
    const percentage = (endboss.energy / 25) * 100;
    this.endbossStatusBar.setPercentage(percentage);
  }

  /**
   * Draws the game world.
   */
  draw() {
    if (!this.gameOver) {
      this.clearCanvas();
      this.drawBackground();
      this.drawFixedObjects();
      this.drawDynamicObjects();
    }
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   * Clears the entire canvas by removing its content.
   */
  clearCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getRenderMetrics() {
    const scale = Math.max(
      this.canvas.width / this.baseWidth,
      this.canvas.height / this.baseHeight
    );
    const offsetX = (this.canvas.width - this.baseWidth * scale) / 2;
    const offsetY = (this.canvas.height - this.baseHeight * scale) / 2;
    return { scale, offsetX, offsetY };
  }

  getHudMetrics() {
    const scale = Math.min(
      this.canvas.width / this.baseWidth,
      this.canvas.height / this.baseHeight
    );
    const offsetX = Math.max((this.canvas.width - this.baseWidth * scale) / 2, 0);
    const offsetY = Math.max((this.canvas.height - this.baseHeight * scale) / 2, 0);
    return { scale, offsetX, offsetY };
  }

  /**
   * Draws the background of the game world.
   */
  drawBackground() {
    const { scale, offsetX, offsetY } = this.getRenderMetrics();
    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws static objects such as status bars.
   */
  drawFixedObjects() {
    const { scale, offsetX, offsetY } = this.getHudMetrics();
    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinsStatusBar);
    this.addToMap(this.bottlesStatusBar);
    if (this.showEndbossStatusBar) {
      this.addToMap(this.endbossStatusBar);
    }
  }

  /**
   * Draws dynamic objects such as the character and enemies.
   */
  drawDynamicObjects() {
    const { scale, offsetX, offsetY } = this.getRenderMetrics();
    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Adds multiple objects to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the map.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image of an object horizontally.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image of an object after flipping.
   */
  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}

