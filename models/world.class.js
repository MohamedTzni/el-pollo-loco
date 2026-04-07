/**
 * Properties of the game world, including the character, level, and interactions.
 */
class World {
  baseWidth = 720;
  baseHeight = 480;
  character = new Pepe();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new HealthBar();
  coinsStatusBar = new CoinBar();
  bottlesStatusBar = new BottleBar();
  endbossStatusBar = new EndBossBar();
  bottles = 0;
  coins = 0;
  maxBottles = 12;
  maxCoins = 10;
  throwableObjects = [];
  lastThrowTime = 0;
  intervals = [];
  gameOver = false;
  gameWon = false;
  endScreenTriggered = false;
  showEndbossStatusBar = false;
  chickenHurt_sound = new Audio("./audio/chickenouch.wav");
  throwBottle_sound = new Audio("./audio/collect_bottle.wav");
  backgroundMusic = new Audio("./audio/background.mp3");

  /**
   * Constructor of the World class, initializes the canvas, inputs, and game components.
   * @param {HTMLCanvasElement} canvas - The canvas element where the game is drawn.
   * @param {Keyboard} keyboard - Object for managing keyboard inputs.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;

    this.setWorld();
    this.assignCharacterToEnemies();
    this.draw();
    this.run();
  }

  /**
   * Links the world to the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Assigns the character to each endboss in the level so they can react to it.
   */
  assignCharacterToEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.character = this.character;
        enemy.world = this;
      }
    });
  }

  /**
   * Main game loop: repeatedly performs collision checks, status updates, etc.
   */
  run() {
    this.addInterval(() => {
      if (this.gameOver) return;
      this.checkCollisions();
      this.checkCollectibles();
      this.checkThrowObjects();
      this.checkEndbossSpawn();
    }, 10);

    this.addInterval(() => {
      if (this.gameOver) return;
      this.checkGameOver();
    }, 100);
  }

  /**
   * Adds a periodically executed function (interval).
   * @param {Function} fn - The function to execute.
   * @param {number} time - Execution frequency in milliseconds.
   * @returns {number} - The ID of the created interval.
   */
  addInterval(fn, time) {
    const id = setInterval(fn, time);
    this.intervals.push(id);
    return id;
  }

  /**
   * Stops all active intervals stored in the intervals list.
   */
  clearAllIntervals() {
    this.intervals.forEach(clearInterval);
  }

  /**
   * Ends the game and displays the corresponding end screen.
   * @param {boolean} win - Whether the player has won.
   */
  stopGame(win = false) {
    if (this.gameOver) return;
    this.gameWon = win;
    this.clearAllIntervals();
    this.gameOver = true;
    this.stopAllSounds();
    if (typeof window.stopGame === "function") {
      window.stopGame();
    }
  }

  /**
   * Stops all sounds and resets them to the beginning.
   */
  stopAllSounds() {
    const sounds = [
      this.backgroundMusic,
      this.chickenHurt_sound,
      this.throwBottle_sound,
      this.character?.walking_sound,
      this.character?.hurt_sound,
      this.character?.dead_sound,
      this.character?.jump_sound,
      this.level?.enemies?.find((enemy) => enemy instanceof Endboss)?.endbossDead_sound,
    ];

    sounds.forEach((sound) => {
      if (!sound) return;
      try { sound.pause(); sound.currentTime = 0; } catch {}
    });
  }

  /**
   * Displays the end screen (win or lose).
   * @param {boolean} win - Whether the player has won.
   */
  showEndScreen(win) {
    this.gameWon = win;
    if (typeof window.showEndScreen === "function") {
      window.showEndScreen();
    }
  }

  /**
   * Plays a sound if sound is not muted.
   * @param {HTMLAudioElement} sound - The sound to play.
   */
  playSound(sound) {
    if (!sound) return;
    sound.muted = typeof isSoundMuted !== "undefined" ? isSoundMuted : false;
    if (sound.muted) return;
    try {
      sound.currentTime = 0;
      const playPromise = sound.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch {}
  }

  /** @returns {number} Index of item in array. */
  getIndexOfItem(array, item) {
    return array.indexOf(item);
  }

  /** Ends the game. */
  endGame(win = this.gameWon) {
    this.stopGame(win);
  }

  /** @returns {boolean} Whether the endboss status bar is already shown. */
  endbossStatusBarAlreadyExists() {
    return this.showEndbossStatusBar;
  }

  /**
   * Checks if the game is over based on character or endboss status.
   * @returns {void}
   */
  checkGameOver() {
    if (this.endScreenTriggered) return;

    if (this.character.isDead()) {
      this.endScreenTriggered = true;
      this.character.playAnimation(this.character.IMAGES_DEAD);
      setTimeout(() => { this.stopGame(false); }, 1500);
    } else if (this.isEndbossDead()) {
      const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
      if (endboss) endboss.playAnimation(endboss.IMAGES_DEAD);
      this.endScreenTriggered = true;
      setTimeout(() => { this.stopGame(true); }, 1500);
    }
  }

  /**
   * Checks if the endboss has been defeated.
   * @returns {boolean} - True if the endboss is dead.
   */
  isEndbossDead() {
    return this.level.enemies.some(
      (enemy) => enemy instanceof Endboss && enemy.isDead()
    );
  }
}
