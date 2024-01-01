class Bottle extends CollectableObject {
  height = 75;
  width = 75;
  y = 345;
  offset = {
    top: 15,
    bottom: 25,
    left: 40,
    right: 20,
  };
  collect_sound = new Audio("audio/collect_bottle.wav");

  constructor(x) {
    super().loadImage("img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    this.x = x + Math.random() * 400;
  }
}
