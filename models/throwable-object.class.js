class ThrowableObject extends MovableObject {
  isBroken = false;

  constructor() {
    super();
    this.throw();
    this.animate();
  }

  /**
   * The function throws the character in a given direction and applies gravity.
   * @param direction - The direction in which the object is being thrown. It can be either "right" or
   * "left".
   */
  throw(direction) {
    this.applyGravity();
    if (direction === "right") {
      setInterval(() => {
        this.x += 15;
      }, 25);
    } else if (direction === "left") {
      setInterval(() => {
        this.x -= 15;
      }, 25);
    }
  }

  /* The `removeObject()` function is setting the `speedY` property of the `ThrowableObject` instance
  to 0, which means that the object will stop moving vertically. It is also setting the
  `acceleration` property to -0.1, which means that the object will start moving upwards due to the
  force of gravity. Finally, it is setting the `y` property of the object to the `ground` property,
  which means that the object will be positioned on the ground. This function is likely used to
  remove the object from the game or reset it to its initial state. */
  removeObject() {
    this.speedY = 0;
    this.acceleration = -0.1;
    this.y = this.ground;
  }
}
