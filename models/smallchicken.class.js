class Smallchicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  offset = {
    top: 5,
    bottom: 10,
    left: 10,
    right: 5,
  };
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  constructor(x) {
    super();
    this.x = x;
  }
}
