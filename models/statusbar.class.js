class StatusBar extends DrawableObject {
  percentage;
  height = 50;
  width = 200;

  /** Creates a status bar. */
  constructor() {
    super();
  }

  /** Sets the bar percentage and image. */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /** Chooses the image for the current percentage. */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    if (this.percentage > 70) return 4;
    if (this.percentage > 50) return 3;
    if (this.percentage > 30) return 2;
    if (this.percentage > 1) return 1;
    return 0;
  }
}
