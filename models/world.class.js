class World {
  /* ... */

  checkCollection() {
    this.level.collectableItems.forEach((item) => {
      if (this.canCollectItem(item, Bottle)) {
        item.collectItem(item);
        this.collectBottle();
      }
      if (this.canCollectItem(item, Coin)) {
        item.collectItem(item);
        this.collectCoin();
      }
    });
  }

  canCollectItem(item, Obj) {
    return this.character.isColliding(item) && item instanceof Obj && !item.isCollected;
  }

  collectBottle() {
    this.collectedBottles++;
    this.playSound(this.bottle_pickup_sound);
    this.statusBar[2].setPercentage((this.collectedBottles / amountCollectableBottles) * 100);
  }

  collectCoin() {
    this.collectedCoins++;
    this.playSound(this.coin_sound);
    this.statusBar[1].setPercentage(
      (this.collectedCoins / amountCollectableCoins) * 100
    );
  }

  checkThrowObjects() {
    if (this.isBottleAvailabe() && this.character.isLookingLeft()) {
      let bottle = new ThrowableBottle(this.character.x - 25, this.character.y + 100, "left");
      this.throwBottle(bottle);
    } else if (this.isBottleAvailabe()) {
      let bottle = new ThrowableBottle(this.character.x + 100, this.character.y + 100, "right");
      this.throwBottle(bottle);
    }
  }

  isBottleAvailabe() {
    return this.keyboard.KEY_D && this.collectedBottles > 0;
  }

  throwBottle(bottle) {
    this.throwableObjects.push(bottle);
    this.collectedBottles--;
    this.statusBar[2].setPercentage((this.collectedBottles / 8) * 100);
  }

  getIndexOfItem(array, item) {
    return array.indexOf(item, 0);
  }
}
