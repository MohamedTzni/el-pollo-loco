class DrawableObject {
  x;
  y;
  img;
  height;
  width;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
}
