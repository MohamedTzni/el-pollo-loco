/**
 * Normal chicken enemy.
 */
class Chicken extends MovableObject {
  y = 343;
  height = 80;
  width = 80;
  offset = {
    top: 10,
    bottom: 10,
    left: 15,
    right: 15,
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

  /**
   * Creates a chicken at a random position near x.
   */
  constructor(x = 400) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x + Math.random() * 400;
    this.speed = 0.15 + Math.random() * 0.5;

    this.animateEnemy();
  }
}
