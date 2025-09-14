class World {
  character = new Pepe();
  level;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = [new HealthBar(), new CoinBar(), new BottleBar()];
  throwableObjects = [];
  collectedBottles = 0;
  collectedCoins = 0;

  // --- Audio ---
  backgroundMusic = new Audio("audio/background.mp3");
  chickenHurt_sound = new Audio("audio/chickenouch.wav");
  coin_sound = new Audio("audio/collect_coin.wav");
  bottle_pickup_sound = new Audio("audio/collect_bottle.wav");

  gameWon = false;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
    this.setAudio();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);

    this.drawObjects();
    this.ctx.translate(-this.camera_x, 0);

    // Fixed UI
    this.addObjectsToMap(this.statusBar);

    this.ctx.translate(this.camera_x, 0);
    this.drawEnemies();
    this.addToMap(this.character);
    this.drawThrowableObjects();
    this.ctx.translate(-this.camera_x, 0);

    requestAnimationFrame(() => this.draw());
  }

  drawEnemies() {
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.endboss);
  }

  drawObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.collectableItems);
  }

  drawThrowableObjects() {
    this.addObjectsToMap(this.throwableObjects);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(object) {
    if (object.flippedGraphics) {
      this.flipImage(object);
    }
    object.draw(this.ctx);

    if (object.flippedGraphics) {
      this.flipImageBack(object);
    }
  }

  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  flipImageBack(object) {
    object.x = object.x * -1;
    this.ctx.restore();
  }

  setAudio() {
    this.chickenHurt_sound.volume = 0.2;
    this.backgroundMusic.volume = 0.2;
    this.backgroundMusic.playbackRate = 1.2;
    this.backgroundMusic.loop = true;
    this.playSound(this.backgroundMusic);
  }

  addObjectsToMap() {}
  playSound() {}
}
