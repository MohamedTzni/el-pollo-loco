class MovableObject extends DrawableObject {
  speed = 0.15;
  flippedGraphics = false;
  speedY = 0;
  acceleration = 2;
  ground;
  energy = 100;
  lastHit = 0;
  hitCooldown = 1000;
  IMAGES_DEAD;
  isAlive = true;
  isActive = true;
  world;

  /** Makes the object fall down. */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /** Checks if the object is in the air. */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.ground;
    }
  }

  /** Checks if the object is jumping. */
  isJumping() {
    return this.y - this.ground < 0 && this.speedY < 0;
  }

  /** Checks if this object touches another object. */
  isColliding(obj) {
    return (
      (obj.isAlive || obj instanceof Coin || obj instanceof Bottle) &&
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }

  /** Checks if this object is on another object. */
  isJumpedOn(obj) {
    return (
      obj.isAlive &&
      this.y + this.height > obj.y + obj.offset.top &&
      this.y + this.offset.top < obj.y + obj.height
    );
  }

  /** Reduces the energy after a hit. */
  hit(damage = 10) {
    const now = new Date().getTime();
    if (now - this.lastHit < this.hitCooldown) return false;

    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.lastHit = now;
    return true;
  }

  /** Checks if the object was hit shortly before. */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /** Checks if the object has no energy left. */
  isDead() {
    return this.energy == 0;
  }

  /** Marks an enemy as killed and removes it later. */
  isKilled(enemy) {
    this.isAlive = false;
    world.playSound(world.chickenHurt_sound);
    this.speed = 0;
    setTimeout(() => {
      let indexofenemy = world.getIndexOfItem(world.level.enemies, enemy);
      world.level.enemies.splice(indexofenemy, 1);
    }, 2000);
  }

  /** Moves the object left. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Moves the object right. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object down. */
  moveDown(fallspeed) {
    this.y += fallspeed;
  }

  /** Moves the object up. */
  moveUp(fallspeed) {
    this.y -= fallspeed;
  }

  /** Plays the next image of an animation. */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** Lets the object jump. */
  jump() {
    this.speedY = 20;
  }

  /** Makes the object bounce up. */
  bounceUp() {
    this.speedY = 15;
  }

  /** Ends the game after a short wait. */
  endGame() {
    setTimeout(() => {
      stopGame();
    }, 2500);
  }

  /** Starts the enemy movement and animation. */
  animateEnemy() {
    this.moveEnemyLeft();
    this.playEnemyAnimation();
  }

  /** Moves the enemy left while it is alive. */
  moveEnemyLeft() {
    setInterval(() => {
      if (this.isAlive && this.isActive) {
        this.moveLeft();
      } else if (!this.isAlive) clearInterval();
    }, 1000 / 60);
  }

  /** Plays the enemy walk animation. */
  playEnemyAnimation() {
    setInterval(() => {
      if (this.isAlive && this.isActive) {
        this.playAnimation(this.IMAGES_WALKING);
      } else if (!this.isAlive) {
        this.stopEnemyAnimation();
      }
    }, 200);
  }

  /** Shows the dead enemy image and moves it down. */
  stopEnemyAnimation() {
    clearInterval();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.moveDown(50);
    }, 1800);
  }
}
