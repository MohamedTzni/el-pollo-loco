class World {
  /* ... */

  checkEndbossBottleCollision() {
    this.throwableObjects.forEach((bottle) => {
      if (this.level.endboss[0].isColliding(bottle)) {
        bottle.isBroken = true;
        bottle.acceleration = -1;
        this.hitEndboss(10);
      }
    });
  }

  checkBottleGroundCollison() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.y > bottle.ground) {
        bottle.isBroken = true;
        bottle.removeObject();
      }
    });
  }

  checkBottleIsBroken() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isBroken) {
        let indexOfBottle = this.getIndexOfItem(this.throwableObjects, bottle);
        setTimeout(() => {
          this.throwableObjects.splice(indexOfBottle, 1);
        }, 250);
      }
    });
  }

  hitEndboss(damage) {
    this.playSound(this.chickenHurt_sound);
    this.level.endboss[0].hit(damage);
    this.level.endboss[0].hadFirstHit = true;
    this.level.endboss[0].speed = 15;
    if (this.statusBar[3]) {
      this.statusBar[3].setPercentage(this.level.endboss[0].energy);
    }
  }

  /**
   * Play only if NOT muted.
   */
  playSound(sound) {
    const muted = (typeof isSoundMuted !== "undefined") ? isSoundMuted : false;
    if (!muted) {
      try {
        if (!sound.loop) sound.currentTime = 0;
        sound.play().catch(() => {});
      } catch {}
    } else {
      if (!sound.paused) {
        try { sound.pause(); } catch {}
      }
    }
  }
}
