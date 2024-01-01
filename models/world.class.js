class World {
  /* ... */

  checkCollisions() {
    this.checkEnemyCollision();
    this.checkEndbossCollision();
    this.checkEndbossBottleCollision();
    this.checkBottleGroundCollison();
    this.checkBottleIsBroken();
  }

  checkEnemyCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.isJumpingOnEnemy(enemy)) {
        enemy.isKilled(enemy);
        this.character.bounceUp();
        this.playSound(this.chickenHurt_sound);
      }
      if (this.character.isColliding(enemy)) {
        this.hitCharacter(5);
      }
    });
  }

  checkEndbossCollision() {
    this.level.endboss.forEach((endboss) => {
      if (this.character.isColliding(endboss)) {
        this.hitCharacter(20);
      }
    });
  }

  checkCharacterIsLeftOfEndboss() {
    if (this.isBehindEndboss()) {
      this.hitCharacter(100);
    }
  }

  isJumpingOnEnemy(enemy) {
    return this.character.isJumping() && this.character.isColliding(enemy);
  }

  isBehindEndboss() {
    return (
      this.level.endboss[0].x + this.level.endboss[0].width <
      this.character.x + this.character.width
    );
  }

  hitCharacter(damage) {
    this.character.hit(damage);
    this.playSound(this.character.hurt_sound);
    this.statusBar[0].setPercentage(this.character.energy);
  }
}
