class Coin extends CollectableObject {
  height = 175;
  width = 175;
  y = 245;
  offset = {
    top: 45,
    bottom: 45,
    left: 45,
    right: 45,
  };
  collect_sound = new Audio("./audio/collect_coin.mp3");
  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /** Creates one coin. */
  constructor(x) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x + Math.random() * 400;
    this.y = 300 - Math.random() * 200;
    this.animate();
  }

  /** Animates the coin. */
  animate() {
    setInterval(() => this.playAnimation(this.IMAGES), 300);
  }
}
