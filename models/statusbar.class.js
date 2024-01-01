class StatusBar extends DrawableObject {
  percentage;
  height = 50;
  width = 200;

  constructor() {
    super();
  }

/**
 * The function sets the percentage and updates the image accordingly.
 * @param percentage - The percentage parameter is a number between 0 and 5 that represents the
 * progress or completion level of a task or process. It is used to update the image displayed by the
 * code.
 */
  setPercentage(percentage) {
    this.percentage = percentage; // => 0....5
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * The function returns an image index based on the percentage value.
   * @returns The function `resolveImageIndex()` returns an integer value between 0 and 5 based on the
   * value of the `percentage` property of the object calling the function. The value returned indicates
   * which image should be displayed based on the progress of a task.
   */
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
