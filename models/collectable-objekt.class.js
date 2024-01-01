class CollectableObject extends DrawableObject {
  collect_sound;

  constructor() {
    super();
  }

  /**
   * The function pauses a sound with a playback rate of 1.
   */
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
}
