class Cloud extends MovableObject {
  height = 360;
  width = 600;
  speed = 0.5;
  IMAGES = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  /** Creates one cloud. */
  constructor(x, i = 0) {
    super().loadImage(this.IMAGES[i % this.IMAGES.length]);
    this.x = x + Math.random() * 100;
    this.y = 20 + Math.random() * 10;
    this.animate();
  }

  /** Moves the cloud to the left. */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 100);
  }
}
