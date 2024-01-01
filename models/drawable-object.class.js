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
    } catch (e) {}
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
}
