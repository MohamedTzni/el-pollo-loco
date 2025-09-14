class Cloud extends MovableObject {
  height = 360;
  width = 600;
  speed = 0.5;
  IMAGES = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  constructor(x, i) {
    super().loadImage(this.IMAGES[i]);
    this.x = x;
    this.y = 20;
  }
}
