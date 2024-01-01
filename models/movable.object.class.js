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

  /**
   * The function checks if an object is above the ground or not.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.ground;
    }
  }

  /**
   * The function checks if an object is jumping by comparing its current height to the ground and its
   * vertical speed.
   */
  isJumping() {
    return this.y - this.ground < 0 && this.speedY < 0;
  }

  /**
   * The function checks if two objects are colliding based on their positions and dimensions.
   */
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

  /**
   * The function checks if an object has been jumped on by another object.
   */
  isJumpedOn(obj) {
    return (
      obj.isAlive &&
      this.y + this.height > obj.y + obj.offset.top &&
      this.y + this.offset.top < obj.y + obj.height
    );
  }

  /**
   * The "hit" function reduces the energy and updates lastHit.
   */
  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Recently hurt?
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  moveLeft() { this.x -= this.speed; }
  moveRight() { this.x += this.speed; }
  moveDown(fallspeed) { this.y += fallspeed; }
  moveUp(fallspeed) { this.y -= fallspeed; }
}
