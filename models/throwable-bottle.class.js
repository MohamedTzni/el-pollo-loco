class ThrowableBottle extends ThrowableObject {
  height = 75;
  width = 75;
  ground = 350;
  speedY = 25;

  constructor(x, y, direction) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.throw(direction);
  }
}
