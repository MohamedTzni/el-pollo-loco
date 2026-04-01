class Endboss extends MovableObject {
  y = 135;
  height = 300;
  width = 280;
  energy = 25;
  offset = {
    top: 50,
    bottom: 65,
    left: 30,
    right: 20,
  };
  world;
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  endbossDead_sound = new Audio("./audio/win.wav");
  hadFirstHit = false;
  hadFirstContact = false;

  constructor(x = 3600) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = x;
    this.speed = 1.2;

    this.animate();
  }

  /**
   * Handles boss damage separately from the default character damage logic.
   * The boss should take small, frequent bottle hits instead of using Pepe's long hit cooldown.
   * @returns {boolean} True when the hit was accepted.
   */
  hit() {
    const now = new Date().getTime();
    if (now - this.lastHit < 200 || this.isDead()) {
      return false;
    }

    this.lastHit = now;
    this.energy -= 5;
    this.hadFirstHit = true;

    if (this.energy <= 0) {
      this.energy = 0;
      if (this.world) {
        this.world.playSound(this.endbossDead_sound);
      }
    }

    return true;
  }

  /**
   * The function animates the endboss character and displays its health bar when the player character
   * comes within a certain distance.
   */
  animate() {
    setInterval(() => {
      if (!this.character || !this.hadFirstContact || this.isDead()) return;
      if (this.character.x < this.x - 120) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.character) return;

      if (this.character.x > this.x - 500 && !this.hadFirstContact) {
        this.hadFirstContact = true;
        if (this.world) {
          this.world.showEndbossStatusBar = true;
        }
      }

      if (!this.hadFirstContact) return;

      if (this.isDead()) {
        this.playEndbossDying();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.hadFirstHit) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 180);
  }

  /**
   * The function checks if the endboss is dead or hurt and plays the appropriate sound or animation.
   */
  playEndbossGotHit() {
    if (this.isDead()) {
      if (this.world) {
        this.world.gameWon = true;
      }
      this.playEndbossDying();
      if (this.world) {
        this.world.endGame();
      }
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  /**
   * The function plays an animation of the end boss dying and moves it down by 30 units.
   */
  playEndbossDying() {
    this.playAnimation(this.IMAGES_DEAD);
    this.moveDown(30);
  }

  /**
   * The function plays different animations for an end boss character based on the value of the input
   * parameter.
   * @param i - The parameter "i" is a number that is used to determine which animation to play in the
   * "playEndbossAnimationLoop" function. It is likely used as a counter or timer to control the timing
   * and sequence of the different animations.
   */
  playEndbossAnimationLoop() {}
}
