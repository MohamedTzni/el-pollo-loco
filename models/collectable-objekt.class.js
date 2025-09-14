class CollectableObject extends DrawableObject {
  collect_sound;

  constructor() {
    super();
  }

  playAudio() {
    this.collect_sound.playbackRate = 1;
    this.collect_sound.pause();
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * The function collects an item in a game world and removes it from the list of collectable items.
   * @param item - The "item" parameter is a variable that represents the collectable item that the
   * player has collected in the game. It could be a coin, a power-up, or any other item that the player
   * needs to collect to progress in the game.
   */
  collectItem(item) {
    this.isCollected = true;
    this.collect_sound.playbackRate = 2;
    world.playSound(this.collect_sound);
    let indexofitem = world.getIndexOfItem(world.level.collectableItems, item);
    world.level.collectableItems.splice(indexofitem, 1);
  }
}
