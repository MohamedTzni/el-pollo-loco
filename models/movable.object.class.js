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

  /**
   * The function applies gravity to an object by decreasing its vertical position and speed over time.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  moveLeft() { this.x -= this.speed; }
  moveRight() { this.x += this.speed; }
  moveDown(fallspeed) { this.y += fallspeed; }
  moveUp(fallspeed) { this.y -= fallspeed; }
}
