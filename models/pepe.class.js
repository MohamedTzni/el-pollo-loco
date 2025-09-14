/**
 * Repräsentiert die Hauptfigur "Pepe" im Spiel, erweitert die MovableObject-Klasse.
 * Steuert Bewegung, Animationen und Soundeffekte des Charakters.
 * @extends MovableObject
 */
class Pepe extends MovableObject {
  // --- Eigenschaften ---
  x = 20;
  y = 128;
  acceleration = 2.2;
  ground = 128;
  height = 300;
  width = 150;
  speed = 7;
  offset = { top: 140, bottom: 160, left: 90, right: 40 };

  // --- Animation-Frames ---
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

  // --- Referenzen ---
  world;
  walking_sound = new Audio("audio/running_sand.wav");
  hurt_sound = new Audio("audio/hurt.wav");
  dead_sound = new Audio("audio/ohno.wav");
  jump_sound = new Audio("audio/jump.wav");

  // --- Inaktivitäts-Tracking ---
  lastMoveTime = Date.now();       // Zeitpunkt der letzten Aktion
  idleTimeoutMs = 4000;            // 4 Sekunden bis Long-Idle
  flippedGraphics = false;         // Richtung (false = rechts, true = links)

  // --- Death-Guard ---
  deathHandled = false;            // verhindert mehrfaches Triggern

  /**
   * Erzeugt eine neue Pepe-Instanz und initialisiert Animationen, Sounds und Bewegung.
   */
  constructor() {
    super();
    this.loadAllImages();
    this.loadImage(this.IMAGES_IDLE[0]); // Startet mit einem Idle-Frame
    this.configureSounds();
    this.applyGravity();
    this.animate();
  }

  /**
   * Lädt alle Bild-Arrays für die Animationen.
   * @private
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_LONGIDLE);
  }

  /**
   * Konfiguriert die Sound-Eigenschaften.
   * @private
   */
  configureSounds() {
    this.walking_sound.playbackRate = 2;
    this.hurt_sound.playbackRate = 2;
    this.dead_sound.playbackRate = 0.2;
    this.hurt_sound.volume = 0.3;
    this.dead_sound.volume = 0.3;
  }

  /**
   * Startet die Animations-Intervalle.
   * @private
   */
  animate() {
    setInterval(() => this.moveCharacter(), 1000 / 60);
    setInterval(() => this.playCharacterAnimations(), 8000 / 60);
  }

  /**
   * Bewegt den Charakter basierend auf Tastatureingaben.
   * @private
   */
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

  /**
   * Spielt die entsprechenden Animationen basierend auf dem Zustand des Charakters.
   * @private
   */
  playCharacterAnimations() {
    if (this.isDead && typeof this.isDead === 'function' ? this.isDead() : this.energy <= 0) {
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

  /**
   * Behandelt den Tod des Charakters (einmalig).
   * @private
   */
  handleDeath() {
    if (this.deathHandled) return;
    this.deathHandled = true;

    this.playDyingAnimation();
    this.hurt_sound.pause();
    this.walking_sound.pause();
    this.walking_sound.currentTime = 0;
    this.world.playSound(this.dead_sound);

    this.endGame(); // leitet auf stopGame() um
  }

  /**
   * Endscreen/Spielende anstoßen.
   */
  endGame() {
    if (this.world && typeof stopGame === 'function') {
      stopGame();
    }
  }

  /**
   * Behandelt den Verletzungszustand des Charakters.
   * @private
   */
  handleHurt() {
    this.hurt_sound.pause();
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Behandelt die Bewegungsanimation des Charakters.
   * @private
   */
  handleMovement() {
    this.playAnimation(this.IMAGES_WALKING);
    this.y = this.ground;
  }

  /**
   * Behandelt die Idle-Animation basierend auf Inaktivitätsdauer.
   * @private
   */
  handleIdle() {
    const now = Date.now();
    if (now - this.lastMoveTime > this.idleTimeoutMs) {
      this.playAnimation(this.IMAGES_LONGIDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  // ---- Bewegungsfunktionen ----

  canMoveRight() {
    return (
      this.world.keyboard.KEY_RIGHT && this.x < this.world.level.end_of_level_x
    );
  }

  moveRight() {
    super.moveRight();
    if (!this.isAboveGround()) this.world.playSound(this.walking_sound);
    this.flippedGraphics = false;
    this.updateLastMoveTime();
  }

  canMoveLeft() {
    return this.world.keyboard.KEY_LEFT && this.x > 0;
  }

  moveLeft() {
    super.moveLeft();
    if (!this.isAboveGround()) this.world.playSound(this.walking_sound);
    this.flippedGraphics = true;
    this.updateLastMoveTime();
  }

  isLookingLeft() {
    return this.flippedGraphics;
  }

  isMoving() {
    return this.world.keyboard.KEY_RIGHT || this.world.keyboard.KEY_LEFT;
  }

  canJump() {
    return this.world.keyboard.KEY_SPACE && !this.isAboveGround();
  }

  updateLastMoveTime() {
    this.lastMoveTime = Date.now();
  }

  /**
   * Spielt die Sterbeanimation des Charakters (einmalige Sequenz).
   */
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
