class ThrowableObject extends MovableObject {
  isBroken = false;
  throwInterval;
  animationInterval;

  /** Creates a throwable object. */
  constructor() {
    super();
  }

  /** Throws the bottle to the left or right. */
  throw(direction) {
    this.speedY = 25;
    this.applyGravity();
    if (this.throwInterval) clearInterval(this.throwInterval);
    if (direction === "right") {
      this.throwInterval = setInterval(() => {
        this.x += 15;
      }, 25);
    } else if (direction === "left") {
      this.throwInterval = setInterval(() => {
        this.x -= 15;
      }, 25);
    }
  }

  /** Stops the bottle after it breaks. */
  removeObject() {
    this.speedY = 0;
    this.acceleration = 0;
    this.y = this.ground;
    if (this.throwInterval) clearInterval(this.throwInterval);
  }
}
