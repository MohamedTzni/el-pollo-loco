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

  /**
   * This function draws an image on a canvas context and logs a warning if there is an error loading
   * the image.
   * @param ctx - ctx stands for "context" and refers to the 2D rendering context of a canvas element.
   * It is used to draw and manipulate graphics on the canvas.
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      // console.warn("Error loading image", this.img);
    }
  }

  /**
   * The function draws a blue rectangular frame around certain game objects.
   * @param ctx - ctx stands for "context" and refers to the canvas context on which the frame is being
   * drawn. It is an object that provides methods and properties for drawing on the canvas.
   */
  drawFrame(ctx) {
    if (
      this instanceof Pepe ||
      this instanceof Chicken ||
      this instanceof Smallchicken ||
      this instanceof Endboss ||
      this instanceof Coin ||
      this instanceof Bottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * This function draws a red rectangular hitbox around certain game objects in a canvas context.
   * @param ctx - ctx stands for "context" and refers to the canvas context on which the hit box will
   * be drawn. It is typically obtained by calling the getContext() method on a canvas element.
   */
  drawHitBox(ctx) {
    if (
      this instanceof Pepe ||
      this instanceof Chicken ||
      this instanceof Smallchicken ||
      this instanceof Endboss ||
      this instanceof Coin ||
      this instanceof Bottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.right,
        this.y + this.offset.top,
        this.width - this.offset.left,
        this.height - this.offset.bottom
      );
      ctx.stroke();
    }
  }

  /**
   * The function loads an image from a specified path.
   * @param path - The path parameter is a string that represents the URL or file path of the image
   * that needs to be loaded.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * The function loads images from an array and caches them using their file paths as keys.
   * @param arr - an array of image file paths that need to be loaded and cached in the `imageCache`
   * object.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * The function removes the height and width properties of an object.
   */
  removeItem() {
    this.height = 0;
    this.width = 0;
  }
}
