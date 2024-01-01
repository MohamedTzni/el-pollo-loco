class ThrowableObject extends MovableObject {
  isBroken = false;

  constructor() {
    super();
    this.throw();
    this.animate();
  }

  throw(direction) {
    this.applyGravity();
    if (direction === "right") {
      setInterval(() => { this.x += 15; }, 25);
    } else if (direction === "left") {
      setInterval(() => { this.x -= 15; }, 25);
    }
  }
}
