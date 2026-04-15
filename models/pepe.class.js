/**
 * Main character Pepe.
 */
class Pepe extends MovableObject {
  x = 20;
  y = 128;
  acceleration = 2.2;
  ground = 128;
  height = 300;
  width = 150;
  speed = 7;
  offset = { top: 115, bottom: 20, left: 45, right: 35 };

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
  ];

  IMAGES_LONGIDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  world;
  walking_sound = new Audio("./audio/running_sand.mp3");
  hurt_sound = new Audio("./audio/hurt.mp3");
  dead_sound = new Audio("./audio/ohno.mp3");
  jump_sound = new Audio("./audio/jump.mp3");
  lastMoveTime = Date.now();
  idleTimeoutMs = 12000;
  flippedGraphics = false;
  deathHandled = false;
  hitCooldown = 1400;

  /** Creates Pepe and starts his animation. */
  constructor() {
    super();
    this.loadAllImages();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.resetIdleTimer();
    this.configureSounds();
    this.applyGravity();
    this.animate();
  }

  /** Loads all Pepe images. */
  loadAllImages() {
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_LONGIDLE);
  }

  /** Sets the sound values. */
  configureSounds() {
    this.walking_sound.playbackRate = 2;
    this.hurt_sound.playbackRate = 2;
    this.dead_sound.playbackRate = 0.2;
    this.hurt_sound.volume = 0.3;
    this.dead_sound.volume = 0.3;
  }

  /** Starts Pepe's intervals. */
  animate() {
    setInterval(() => this.moveCharacter(), 1000 / 60);
    setInterval(() => this.playCharacterAnimations(), 8000 / 60);
  }

  /** Moves Pepe with the keyboard. */
  moveCharacter() {
    this.walking_sound.pause();
    if (this.canMoveRight()) this.moveRight();
    if (this.canMoveLeft()) this.moveLeft();
    if (this.canJump()) {
      this.world.playSound(this.jump_sound);
      this.jump();
      this.updateLastMoveTime();
    }
    this.world.camera_x = -this.x + 75;
  }

  /** Plays the right Pepe animation. */
  playCharacterAnimations() {
    if (this.isDead && typeof this.isDead === "function" ? this.isDead() : this.energy <= 0) {
      this.handleDeath();
    } else if (this.isHurt && this.isHurt()) {
      this.handleHurt();
    } else if (this.isAboveGround && this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.isMoving()) {
      this.handleMovement();
    } else {
      this.handleIdle();
    }
  }

  /** Starts the death animation once. */
  handleDeath() {
    if (this.deathHandled) return;
    this.deathHandled = true;
    this.playDyingAnimation();
    this.hurt_sound.pause();
    this.walking_sound.pause();
    this.walking_sound.currentTime = 0;
    this.world.playSound(this.dead_sound);
  }

  /** Shows the hurt animation. */
  handleHurt() {
    this.hurt_sound.pause();
    this.playAnimation(this.IMAGES_HURT);
  }

  /** Shows the walk animation. */
  handleMovement() {
    this.playAnimation(this.IMAGES_WALKING);
    this.y = this.ground;
  }

  /** Shows idle or sleeping animation. */
  handleIdle() {
    const now = Date.now();
    if (!this.hasBeenInactiveLongEnough()) {
      this.playAnimation(this.IMAGES_IDLE);
    } else if (this.world?.showEndbossStatusBar || this.isEnemyNearby()) {
      this.playAnimation(this.IMAGES_IDLE);
    } else if (now - this.lastMoveTime > this.idleTimeoutMs) {
      this.playAnimation(this.IMAGES_LONGIDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /** Checks if Pepe was idle long enough. */
  hasBeenInactiveLongEnough() {
    return Date.now() - this.lastMoveTime > this.idleTimeoutMs;
  }

  /** Checks if an enemy is close to Pepe. */
  isEnemyNearby() {
    return this.world?.level?.enemies?.some(
      (enemy) => enemy?.isAlive !== false && Math.abs(enemy.x - this.x) < 500
    );
  }

  /** Checks if Pepe can move right. */
  canMoveRight() {
    return (
      this.world.keyboard.KEY_RIGHT && this.x < this.world.level.end_of_level_x
    );
  }

  /** Moves Pepe right. */
  moveRight() {
    super.moveRight();
    if (!this.isAboveGround()) this.world.playSound(this.walking_sound);
    this.flippedGraphics = false;
    this.otherDirection = false;
    this.updateLastMoveTime();
  }

  /** Checks if Pepe can move left. */
  canMoveLeft() {
    return this.world.keyboard.KEY_LEFT && this.x > 0;
  }

  /** Moves Pepe left. */
  moveLeft() {
    super.moveLeft();
    if (!this.isAboveGround()) this.world.playSound(this.walking_sound);
    this.flippedGraphics = true;
    this.otherDirection = true;
    this.updateLastMoveTime();
  }

  /** Checks if Pepe looks left. */
  isLookingLeft() {
    return this.otherDirection === true;
  }

  /** Checks if Pepe is moving. */
  isMoving() {
    return this.world.keyboard.KEY_RIGHT || this.world.keyboard.KEY_LEFT;
  }

  /** Checks if Pepe can jump. */
  canJump() {
    return this.world.keyboard.KEY_SPACE && !this.isAboveGround();
  }

  /** Saves the current time as last move time. */
  updateLastMoveTime() {
    this.lastMoveTime = Date.now();
  }

  /** Resets the idle timer. */
  resetIdleTimer() {
    this.lastMoveTime = Date.now();
    this.currentImage = 0;
    this.loadImage(this.IMAGES_IDLE[0]);
  }

  /** Plays Pepe's death move. */
  playDyingAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.moveUp(30);
      setTimeout(() => {
        this.moveDown(150);
      }, 1000);
    }, 1000);
  }
}
