class CollectableObject extends DrawableObject {
  collect_sound;

  /** Creates a collectable object. */
  constructor() {
    super();
  }

  /** Stops the collect sound. */
  playAudio() {
    this.collect_sound.playbackRate = 1;
    this.collect_sound.pause();
  }

  /** Plays the next image of an animation. */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** Collects an item and removes it from the game. */
  collectItem(item) {
    this.isCollected = true;
    this.collect_sound.playbackRate = 2;
    world.playSound(this.collect_sound);
    let indexofitem = world.getIndexOfItem(world.level.collectableItems, item);
    world.level.collectableItems.splice(indexofitem, 1);
  }

  /** Short name for collectItem(). */
  collect() {
    this.collectItem(this);
  }
}
