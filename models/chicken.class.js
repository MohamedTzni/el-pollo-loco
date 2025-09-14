class Chicken extends MovableObject {
  y = 343;
  height = 80;
  width = 80;
  offset = {
    top: 5,
    bottom: 10,
    left: 10,
    right: 5,
  };
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  constructor(x) {
    super().loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x + Math.random() * 400; // Zahl zwischen x und x+500
    this.speed = 0.15 + Math.random() * 0.5;

    this.animateEnemy();
  }
}
