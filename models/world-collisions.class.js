/**
 * Collisions, collectibles and bottle throws.
 */

/** Checks all important collisions. */
World.prototype.checkCollisions = function () {
  this.checkCharacterEnemyCollisions();
  this.checkBottleEnemyCollisions();
};

/** Checks if Pepe touches an enemy. */
World.prototype.checkCharacterEnemyCollisions = function () {
  this.level.enemies.forEach((enemy) => {
    const hasCollision = enemy instanceof Endboss
      ? this.isBossColliding(enemy)
      : this.character.isColliding(enemy);
    if (hasCollision) this.handleEnemyCollision(enemy);
  });
};

/** Checks if Pepe touches the boss. */
World.prototype.isBossColliding = function (enemy) {
  return (
    this.character.x + this.character.width - 20 >= enemy.x + 40 &&
    this.character.x + 40 <= enemy.x + enemy.width - 20 &&
    this.character.y + this.character.height - 20 >= enemy.y + 30 &&
    this.character.y + 30 <= enemy.y + enemy.height - 20
  );
};

/** Checks if a bottle hits an enemy. */
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

/** Checks if a bottle hits the boss. */
World.prototype.isBottleHittingEndboss = function (bottle, enemy) {
  return (
    bottle.x + bottle.width - 10 >= enemy.x + 35 &&
    bottle.x + 10 <= enemy.x + enemy.width - 30 &&
    bottle.y + bottle.height - 10 >= enemy.y + 55 &&
    bottle.y + 10 <= enemy.y + enemy.height - 35
  );
};

/** Handles a bottle hit. */
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

/** Handles Pepe touching an enemy. */
World.prototype.handleEnemyCollision = function (enemy) {
  if (enemy instanceof Endboss) {
    this.handleEndbossCollision();
  } else if (enemy.isAlive) {
    this.handleNormalEnemyCollision(enemy);
  }
};

/** Handles Pepe touching the boss. */
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

/** Handles Pepe touching a normal enemy. */
World.prototype.handleNormalEnemyCollision = function (enemy) {
  if (this.isJumpingOnEnemy(enemy)) {
    this.killEnemy(enemy);
  } else {
    const didHit = this.character.hit(5);
    if (didHit) {
      this.playSound(this.character.hurt_sound);
      this.statusBar.setPercentage(this.character.energy);
    }
  }
};

/** Checks if Pepe lands on an enemy. */
World.prototype.isJumpingOnEnemy = function (enemy) {
  const characterFeet = this.character.y + this.character.height - this.character.offset.bottom;
  const enemyTop = enemy.y + enemy.offset.top;
  return (
    this.character.speedY < 0 &&
    characterFeet <= enemyTop + enemy.height * 0.45
  );
};

/** Kills an enemy and removes it later. */
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

/** Checks bottles and coins. */
World.prototype.checkCollectibles = function () {
  this.checkBottleCollectibles();
  this.checkCoinCollectibles();
};

/** Checks if Pepe collects bottles. */
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

/** Checks if Pepe collects coins. */
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

/** Checks if Pepe should throw a bottle. */
World.prototype.checkThrowObjects = function () {
  if (!this.keyboard.KEY_D) {
    this.bottleThrowLocked = false;
    return;
  }

  if (this.isBottleThrowReady()) {
    this.throwBottle();
    this.updateBottleStatus();
  }
};

/** Checks if a bottle throw is allowed. */
World.prototype.isBottleThrowReady = function () {
  const currentTime = new Date().getTime();
  return (
    this.keyboard.KEY_D &&
    !this.bottleThrowLocked &&
    this.bottles > 0 &&
    currentTime - this.lastThrowTime > 500
  );
};

/** Creates and throws one bottle. */
World.prototype.throwBottle = function () {
  if (this.gameOver) return;
  this.lastThrowTime = new Date().getTime();
  this.bottleThrowLocked = true;
  let direction = this.character.isLookingLeft() ? "left" : "right";
  let bottle = new ThrowableBottle(
    this.character.x + (direction === "left" ? -20 : 60),
    this.character.y + 170,
    direction
  );
  this.playSound(this.throwBottle_sound);
  this.throwableObjects.push(bottle);
};

/** Updates the bottle bar after a throw. */
World.prototype.updateBottleStatus = function () {
  this.bottles--;
  this.bottlesStatusBar.setPercentage(
    Math.max(Math.min((this.bottles / this.maxBottles) * 100, 100), 0)
  );
};

/** Checks if the boss should start. */
World.prototype.checkEndbossSpawn = function () {
  const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
  if (endboss && !endboss.hadFirstContact && this.character.x + 500 > endboss.x) {
    endboss.hadFirstContact = true;
    this.showEndbossStatusBar = true;
  }
};

/** Updates the boss bar. */
World.prototype.updateEndbossStatusBar = function (endboss) {
  const percentage = (endboss.energy / 25) * 100;
  this.endbossStatusBar.setPercentage(percentage);
};
