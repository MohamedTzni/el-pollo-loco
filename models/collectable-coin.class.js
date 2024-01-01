class Coin extends CollectableObject {
  height = 175;
  width = 175;
  y = 245;
  offset = {
    top: 60,
    bottom: 120,
    left: 120,
    right: 60,
  };
  collect_sound = new Audio("audio/collect_coin.wav");

  constructor(x) {
    super();
    this.x = x;
  }
}
