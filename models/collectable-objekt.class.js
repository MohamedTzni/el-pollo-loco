class CollectableObject extends DrawableObject {
  collect_sound;

  constructor() {
    super();
  }

  /**
   * The function plays an animation by cycling through a list of images.
   * @param images - The parameter "images" is an array of strings that represent the file paths of the
   * images to be used in the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
