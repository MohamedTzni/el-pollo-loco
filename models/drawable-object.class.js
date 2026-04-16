class DrawableObject {
  x;
  y;
  img;
  height;
  width;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /** Draws the image on the canvas. */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
    }
  }

  /** Debug frame is turned off for the final game. */
  drawFrame(ctx) {
    return;
  }

  /** Debug hitbox is turned off for the final game. */
  drawHitBox(ctx) {
    return;
  }

  /** Loads one image. */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /** Loads all images from an array. */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /** Hides an item by setting its size to zero. */
  removeItem() {
    this.height = 0;
    this.width = 0;
  }
}
