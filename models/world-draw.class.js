/**
 * Rendering and drawing methods for the World class.
 */

/** Draws the game world on every animation frame. */
World.prototype.draw = function () {
  if (!this.gameOver) {
    this.clearCanvas();
    this.drawBackground();
    this.drawFixedObjects();
    this.drawDynamicObjects();
  }
  requestAnimationFrame(() => { this.draw(); });
};

/** Clears the entire canvas. */
World.prototype.clearCanvas = function () {
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Returns scale and offset for full-canvas rendering.
 * @returns {{ scale: number, offsetX: number, offsetY: number }}
 */
World.prototype.getRenderMetrics = function () {
  const scale = Math.max(
    this.canvas.width / this.baseWidth,
    this.canvas.height / this.baseHeight
  );
  const offsetX = (this.canvas.width - this.baseWidth * scale) / 2;
  const offsetY = (this.canvas.height - this.baseHeight * scale) / 2;
  return { scale, offsetX, offsetY };
};

/**
 * Returns scale and offset for HUD rendering.
 * @returns {{ scale: number, offsetX: number, offsetY: number }}
 */
World.prototype.getHudMetrics = function () {
  const scale = Math.min(
    this.canvas.width / this.baseWidth,
    this.canvas.height / this.baseHeight
  );
  const offsetX = Math.max((this.canvas.width - this.baseWidth * scale) / 2, 0);
  const offsetY = Math.max((this.canvas.height - this.baseHeight * scale) / 2, 0);
  return { scale, offsetX, offsetY };
};

/** Draws the background and clouds. */
World.prototype.drawBackground = function () {
  const { scale, offsetX, offsetY } = this.getRenderMetrics();
  this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  this.ctx.translate(this.camera_x, 0);
  this.addObjectsToMap(this.level.backgroundObjects);
  this.addObjectsToMap(this.level.clouds);
  this.ctx.translate(-this.camera_x, 0);
};

/** Draws fixed HUD elements such as status bars. */
World.prototype.drawFixedObjects = function () {
  const { scale, offsetX, offsetY } = this.getHudMetrics();
  this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  this.addToMap(this.statusBar);
  this.addToMap(this.coinsStatusBar);
  this.addToMap(this.bottlesStatusBar);
  if (this.showEndbossStatusBar) this.addToMap(this.endbossStatusBar);
};

/** Draws all dynamic objects such as the character, enemies, and items. */
World.prototype.drawDynamicObjects = function () {
  const { scale, offsetX, offsetY } = this.getRenderMetrics();
  this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  this.ctx.translate(this.camera_x, 0);
  this.addToMap(this.character);
  this.addObjectsToMap(this.level.bottles);
  this.addObjectsToMap(this.level.coins);
  this.addObjectsToMap(this.level.enemies);
  this.addObjectsToMap(this.throwableObjects);
  this.ctx.translate(-this.camera_x, 0);
};

/**
 * Adds multiple objects to the map.
 * @param {DrawableObject[]} objects
 */
World.prototype.addObjectsToMap = function (objects) {
  objects.forEach((o) => { this.addToMap(o); });
};

/**
 * Adds a single object to the map, flipping if needed.
 * @param {DrawableObject} mo
 */
World.prototype.addToMap = function (mo) {
  if (mo.otherDirection) this.flipImage(mo);
  mo.draw(this.ctx);
  if (mo.otherDirection) this.flipImageBack(mo);
};

/**
 * Flips the canvas context horizontally for an object.
 * @param {DrawableObject} mo
 */
World.prototype.flipImage = function (mo) {
  this.ctx.save();
  this.ctx.translate(mo.width, 0);
  this.ctx.scale(-1, 1);
  mo.x = mo.x * -1;
};

/**
 * Restores the canvas context after flipping.
 * @param {DrawableObject} mo
 */
World.prototype.flipImageBack = function (mo) {
  this.ctx.restore();
  mo.x = mo.x * -1;
};
