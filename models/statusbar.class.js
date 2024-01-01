class StatusBar extends DrawableObject {
  percentage;
  height = 50;
  width = 200;

  constructor() {
    super();
  }

  setPercentage(percentage) {
    this.percentage = percentage; // => 0....5
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 70) {
      return 4;
    } else if (this.percentage > 50) {
      return 3;
    } else if (this.percentage > 30) {
      return 2;
    } else if (this.percentage > 1) {
      return 1;
    } else {
      return 0;
    }
  }
}
