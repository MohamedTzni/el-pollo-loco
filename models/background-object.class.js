class BackgroundObject extends MovableObject {
  height = 480;
  width = 720;

  /** Creates one background image. */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = typeof y === "number" ? y : 480 - this.height;
  }
}
