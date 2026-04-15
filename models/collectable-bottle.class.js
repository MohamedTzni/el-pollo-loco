class Bottle extends CollectableObject {
  height = 75;
  width = 75;
  y = 345;
  offset = {
    top: 12,
    bottom: 12,
    left: 18,
    right: 18,
  };
  collect_sound = new Audio("./audio/collect_bottle.mp3");

  /** Creates one bottle on the ground. */
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    this.x = x;
    if (y !== undefined) this.y = y;
  }
}
