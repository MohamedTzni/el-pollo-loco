class BottleBar extends StatusBar {
  x = 10;
  y = 100;
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  constructor() {
    super().loadImages(this.IMAGES);
    this.setPercentage(0);
  }

/**
 * The function returns an image index based on a percentage value.
 * @returns The function `resolveImageIndex()` returns a number between 0 and 5 based on the value of
 * the `percentage` property of the object calling the function. If the `percentage` is 100, it returns
 * 5. If the `percentage` is greater than 80, it returns 4. If the `percentage` is greater than 60, it
 * returns 3. If
 */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 1) {
      return 1;
    } else {
      return 0;
    }
  }
}
