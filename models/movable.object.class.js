class MovableObject extends DrawableObject {
  speed = 0.15;
  flippedGraphics = false;
  speedY = 0;
  acceleration = 2;
  ground;
  energy = 100;
  lastHit = 0;
  IMAGES_DEAD;
  isAlive = true;
  world;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.ground;
    }
  }

  isJumping() { return this.y - this.ground < 0 && this.speedY < 0; }

  isColliding(obj) {
    return (
      (obj.isAlive || obj instanceof Coin || obj instanceof Bottle) &&
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left / 2 &&
      this.y + this.height > obj.y + obj.offset.top &&
      this.x + this.offset.left - obj.width / 2 <
        obj.x + obj.width - obj.offset.right &&
      this.y + this.offset.top < obj.y + obj.height
    );
  }

  isJumpedOn(obj) {
    return (
      obj.isAlive &&
      this.y + this.height > obj.y + obj.offset.top &&
      this.y + this.offset.top < obj.y + obj.height
    );
  }

  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() { return this.energy == 0; }

  isKilled(enemy) {
    this.isAlive = false;
    world.playSound(world.chickenHurt_sound);
    this.speed = 0;
    setTimeout(() => {
      let indexofenemy = world.getIndexOfItem(world.level.enemies, enemy);
      world.level.enemies.splice(indexofenemy, 1);
    }, 2000);
  }

  moveLeft() { this.x -= this.speed; }
  moveRight() { this.x += this.speed; }
  moveDown(fallspeed) { this.y += fallspeed; }
  moveUp(fallspeed) { this.y -= fallspeed; }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() { this.speedY = 20; }
  bounceUp() { this.speedY = 15; }

  endGame() {
    setTimeout(() => {
      stopGame();
    }, 2500);
  }

  /**
   * The function animates the enemy by moving it left and playing its animation.
   */
  animateEnemy() {
    this.moveEnemyLeft();
    this.playEnemyAnimation();
  }

  /**
   * This function moves an enemy to the left at a rate of 60 frames per second, as long as the enemy
   * is alive.
   */
  moveEnemyLeft() {
    setInterval(() => {
      if (this.isAlive) {
        this.moveLeft();
      } else clearInterval();
    }, 1000 / 60);
  }

  /**
   * This function plays a walking animation for an enemy character at a set interval, but stops the
   * animation if the enemy is no longer alive.
   */
  playEnemyAnimation() {
    setInterval(() => {
      if (this.isAlive) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.stopEnemyAnimation();
      }
    }, 200);
  }

  /**
   * The function stops the enemy animation, plays the dead image, and moves the enemy down after a
   * delay.
   */
  stopEnemyAnimation() {
    clearInterval();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.moveDown(50);
    }, 1800);
  }
}
