/**
 * Collision detection, enemy handling, collectibles, and throw logic for the World class.
 */

/** Checks for collisions between the character, enemies, and bottles. */
World.prototype.checkCollisions = function () {
  this.checkCharacterEnemyCollisions();
  this.checkBottleEnemyCollisions();
};

/** Checks for collisions between the character and enemies. */
World.prototype.checkCharacterEnemyCollisions = function () {
  this.level.enemies.forEach((enemy) => {
    const hasCollision = enemy instanceof Endboss
      ? this.isBossColliding(enemy)
      : this.character.isColliding(enemy);
    if (hasCollision) this.handleEnemyCollision(enemy);
  });
};

/**
 * @param {Endboss} enemy
 * @returns {boolean}
 */
World.prototype.isBossColliding = function (enemy) {
  return (
    this.character.x + this.character.width - 20 >= enemy.x + 40 &&
    this.character.x + 40 <= enemy.x + enemy.width - 20 &&
    this.character.y + this.character.height - 20 >= enemy.y + 30 &&
    this.character.y + 30 <= enemy.y + enemy.height - 20
  );
};

/** Checks for collisions between thrown bottles and enemies. */
World.prototype.checkBottleEnemyCollisions = function () {
  this.throwableObjects.forEach((bottle, bottleIndex) => {
    if (!bottle || bottle.isBroken) return;
    this.level.enemies.forEach((enemy) => {
      const hasCollision = enemy instanceof Endboss
        ? this.isBottleHittingEndboss(bottle, enemy)
        : bottle.isColliding(enemy);
      if (hasCollision) this.processBottleCollision(bottleIndex, enemy);
    });
  });
};

/**
 * @param {ThrowableBottle} bottle
 * @param {Endboss} enemy
 * @returns {boolean}
 */
World.prototype.isBottleHittingEndboss = function (bottle, enemy) {
  return (
    bottle.x + bottle.width - 10 >= enemy.x + 35 &&
    bottle.x + 10 <= enemy.x + enemy.width - 30 &&
    bottle.y + bottle.height - 10 >= enemy.y + 55 &&
    bottle.y + 10 <= enemy.y + enemy.height - 35
  );
};

/**
 * Handles a collision between a bottle and an enemy.
 * @param {number} bottleIndex - Index of the colliding bottle.
 * @param {MovableObject} enemy - The hit enemy.
 */
World.prototype.processBottleCollision = function (bottleIndex, enemy) {
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
    if (currentIndex > -1) this.throwableObjects.splice(currentIndex, 1);
  }, 180);
};

/**
 * Handles a collision between the character and an enemy.
 * @param {MovableObject} enemy - The collided enemy.
 */
World.prototype.handleEnemyCollision = function (enemy) {
  if (enemy instanceof Endboss) {
    this.handleEndbossCollision();
  } else if (enemy.isAlive) {
    this.handleNormalEnemyCollision(enemy);
  }
};

/** Handles a collision between the character and the endboss. */
World.prototype.handleEndbossCollision = function () {
  const didHit = this.character.hit(10);
  if (didHit) {
    this.playSound(this.character.hurt_sound);
    this.statusBar.setPercentage(this.character.energy);
    if (this.character.isDead()) {
      this.endScreenTriggered = true;
      setTimeout(() => this.stopGame(false), 300);
    }
  }
};

/**
 * Handles a collision between the character and a normal enemy.
 * @param {MovableObject} enemy - The collided enemy.
 */
World.prototype.handleNormalEnemyCollision = function (enemy) {
  if (this.isJumpingOnEnemy(enemy)) {
    this.killEnemy(enemy);
  } else {
    const didHit = this.character.hit();
    if (didHit) {
      this.playSound(this.character.hurt_sound);
      this.statusBar.setPercentage(this.character.energy);
    }
  }
};

/**
 * Checks if the character is jumping on an enemy.
 * @param {MovableObject} enemy
 * @returns {boolean}
 */
World.prototype.isJumpingOnEnemy = function (enemy) {
  return (
    this.character.speedY < 0 &&
    this.character.y + this.character.height - 10 < enemy.y + enemy.height / 2
  );
};

/**
 * Kills an enemy and removes it from the game world.
 * @param {MovableObject} enemy - The enemy.
 */
World.prototype.killEnemy = function (enemy) {
  if (enemy.isAlive) {
    enemy.isAlive = false;
    if (enemy.IMAGES_DEAD) enemy.playAnimation(enemy.IMAGES_DEAD);
    this.playSound(this.chickenHurt_sound);
    setTimeout(() => {
      const enemyIndex = this.level.enemies.indexOf(enemy);
      if (enemyIndex > -1) this.level.enemies.splice(enemyIndex, 1);
    }, 2000);
  }
};

/** Checks for collectible objects (coins, bottles). */
World.prototype.checkCollectibles = function () {
  this.checkBottleCollectibles();
  this.checkCoinCollectibles();
};

/** Checks if bottles can be collected. */
World.prototype.checkBottleCollectibles = function () {
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
};

/** Checks if coins can be collected. */
World.prototype.checkCoinCollectibles = function () {
  for (let index = this.level.coins.length - 1; index >= 0; index--) {
    const coin = this.level.coins[index];
    if (this.character.isColliding(coin) && this.coins < this.maxCoins) {
      this.coins++;
      this.coinsStatusBar.setPercentage((this.coins / this.maxCoins) * 100);
      this.playSound(coin.collect_sound);
      this.level.coins.splice(index, 1);
    }
  }
};

/** Checks if a bottle should be thrown. */
World.prototype.checkThrowObjects = function () {
  if (this.isBottleThrowReady()) {
    this.throwBottle();
    this.updateBottleStatus();
  }
};

/**
 * Checks if the character is ready to throw a bottle.
 * @returns {boolean}
 */
World.prototype.isBottleThrowReady = function () {
  const currentTime = new Date().getTime();
  return (
    this.keyboard.KEY_D &&
    this.bottles > 0 &&
    currentTime - this.lastThrowTime > 500
  );
};

/**
 * Creates and throws a bottle in the direction the character is facing.
 * @returns {void}
 */
World.prototype.throwBottle = function () {
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
};

/** Updates the bottle status bar after a throw. */
World.prototype.updateBottleStatus = function () {
  this.bottles--;
  this.bottlesStatusBar.setPercentage(
    Math.max(Math.min((this.bottles / this.maxBottles) * 100, 100), 0)
  );
};

/** Checks if the endboss should be activated. */
World.prototype.checkEndbossSpawn = function () {
  const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
  if (endboss && !endboss.hadFirstContact && this.character.x + 500 > endboss.x) {
    endboss.hadFirstContact = true;
    this.showEndbossStatusBar = true;
  }
};

/**
 * Updates the status bar of the endboss.
 * @param {Endboss} endboss - The endboss.
 */
World.prototype.updateEndbossStatusBar = function (endboss) {
  const percentage = (endboss.energy / 25) * 100;
  this.endbossStatusBar.setPercentage(percentage);
};
