class ThrowableObject extends MovableObject {
  isBroken = false;

  constructor() {
    super();
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
}
