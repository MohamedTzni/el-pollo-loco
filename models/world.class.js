/**
 * Main game world.
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
  bottleThrowLocked = false;
  intervals = [];
  gameOver = false;
  gameWon = false;
  endScreenTriggered = false;
  showEndbossStatusBar = false;
  chickenHurt_sound = new Audio("./audio/chickenouch.mp3");
  throwBottle_sound = new Audio("./audio/collect_bottle.mp3");
  backgroundMusic = new Audio("./audio/background.mp3");

  /** Sets up the world. */
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

  /** Gives Pepe access to the world. */
  setWorld() {
    this.character.world = this;
    if (typeof this.character.resetIdleTimer === "function") {
      this.character.resetIdleTimer();
    }
  }

  /** Gives the endboss access to Pepe. */
  assignCharacterToEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.character = this.character;
        enemy.world = this;
      }
    });
  }

  /** Starts the game checks. */
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

  /** Adds an interval and saves its id. */
  addInterval(fn, time) {
    const id = setInterval(fn, time);
    this.intervals.push(id);
    return id;
  }

  /** Stops all saved intervals. */
  clearAllIntervals() {
    this.intervals.forEach(clearInterval);
  }

  /** Stops the game. */
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

  /** Stops all game sounds. */
  stopAllSounds() {
    const sounds = this.getAllSounds();
    sounds.forEach((sound) => {
      if (!sound) return;
      try { sound.pause(); sound.currentTime = 0; } catch {}
    });
  }

  /** Returns all game sounds as an array. */
  getAllSounds() {
    return [
      this.backgroundMusic,
      this.chickenHurt_sound,
      this.throwBottle_sound,
      this.character?.walking_sound,
      this.character?.hurt_sound,
      this.character?.dead_sound,
      this.character?.jump_sound,
      this.level?.enemies?.find((enemy) => enemy instanceof Endboss)?.endbossDead_sound,
    ];
  }

  /** Shows the end screen. */
  showEndScreen(win) {
    this.gameWon = win;
    if (typeof window.showEndScreen === "function") {
      window.showEndScreen();
    }
  }

  /** Plays a sound when sound is on. */
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

  /** Gets the index of an item. */
  getIndexOfItem(array, item) {
    return array.indexOf(item);
  }

  /** Ends the game. */
  endGame(win = this.gameWon) {
    this.stopGame(win);
  }

  /** Checks if the endboss bar is shown. */
  endbossStatusBarAlreadyExists() {
    return this.showEndbossStatusBar;
  }

  /** Checks if the game is over. */
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

  /** Checks if the endboss is dead. */
  isEndbossDead() {
    return this.level.enemies.some(
      (enemy) => enemy instanceof Endboss && enemy.isDead()
    );
  }
}
