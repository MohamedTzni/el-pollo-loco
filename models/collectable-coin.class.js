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
  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x) {
    super().loadImages(this.IMAGES);
    this.x = x + Math.random() * 400;
    this.y = 300 - Math.random() * 200;
    this.animate();
  }

  /**
   * The function uses setInterval to repeatedly call another function that plays an animation using a
   * set of images.
   */
  animate() {
    setInterval(() => this.playAnimation(this.IMAGES), 300);
  }
}
