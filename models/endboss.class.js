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
  endbossDead_sound = new Audio("./audio/win.mp3");
  hadFirstHit = false;
  hadFirstContact = false;

  /** Creates the endboss. */
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
   * Reduces the boss energy when a bottle hits him.
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
   * Starts the movement and animation intervals.
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Moves the boss after he sees Pepe.
   */
  startMovementLoop() {
    setInterval(() => {
      if (!this.character || !this.hadFirstContact || this.isDead()) return;
      if (this.character.x < this.x - 30) {
        this.moveLeft();
      } else if (this.character.x > this.x + 30) {
        this.moveRight();
      }
    }, 1000 / 60);
  }

  /**
   * Starts the boss animation loop.
   */
  startAnimationLoop() {
    setInterval(() => {
      if (!this.character) return;

      this.activateOnCharacterDistance();

      if (!this.hadFirstContact) return;

      this.playCurrentAnimation();
    }, 180);
  }

  /**
   * Shows the boss bar when Pepe is close enough.
   */
  activateOnCharacterDistance() {
    if (this.character.x > this.x - 500 && !this.hadFirstContact) {
      this.hadFirstContact = true;
      if (this.world) this.world.showEndbossStatusBar = true;
    }
  }

  /**
   * Plays the right boss animation.
   */
  playCurrentAnimation() {
    if (this.isDead()) {
      this.playEndbossDying();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.hadFirstHit) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Plays the hit or death animation.
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
   * Plays the death animation.
   */
  playEndbossDying() {
    if (!this.dyingStarted) {
      this.dyingStarted = true;
      this._flySpeed = 3;
      this._flyInterval = setInterval(() => {
        this._flySpeed += 1.2;
        this.y -= this._flySpeed;
      }, 1000 / 60);
      setTimeout(() => clearInterval(this._flyInterval), 2000);
    }
    this.playAnimation(this.IMAGES_DEAD);
  }

  /**
   * Old animation helper, kept so older calls do not break.
   */
  playEndbossAnimationLoop() {}
}
