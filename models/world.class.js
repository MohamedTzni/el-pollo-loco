class World {
  /* Felder & constructor & draw wie in Commit 1 ... */

  constructor(canvas, keyboard, level) {
    /* ... */
    this.draw();
    this.setWorld();
    this.run();
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkCharacterIsLeftOfEndboss();
    }, 100);
    setInterval(() => {
      this.checkCollection();
    }, 25);
    setInterval(() => {
      this.checkThrowObjects();
    }, 150);
  }

  checkCollisions() {}
  checkCharacterIsLeftOfEndboss() {}
  checkCollection() {}
  checkThrowObjects() {}

  /* übrige Methoden wie in Commit 1 ... */
}
