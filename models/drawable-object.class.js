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

  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (e) {
      // console.warn("Error loading image", this.img);
    }
  }

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
}
