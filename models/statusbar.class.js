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
}
