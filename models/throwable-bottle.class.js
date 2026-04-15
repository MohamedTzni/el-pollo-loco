class ThrowableBottle extends ThrowableObject {
  height = 75;
  width = 75;
  ground = 350;
  speedY = 25;
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /** Creates a thrown bottle. */
  constructor(x, y, direction) {
    super();
    this.loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.throw(direction);
    this.animate();
  }

  /** Animates the flying or broken bottle. */
  animate() {    
      if (this.animationInterval) clearInterval(this.animationInterval);
      this.animationInterval = setInterval(() => {
        if (!this.isBroken) {
        this.playAnimation(this.IMAGES_ROTATION);
        } 
        else {
        this.playAnimation(this.IMAGES_SPLASH);
        }
      }, 50);
  }
}
