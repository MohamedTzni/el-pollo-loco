class Chicken extends MovableObject {
  y = 343;
  height = 80;
  width = 80;
  offset = {
    top: 5,
    bottom: 10,
    left: 10,
    right: 5,
  };

  constructor(x) {
    super();
    this.x = x;
  }
}
