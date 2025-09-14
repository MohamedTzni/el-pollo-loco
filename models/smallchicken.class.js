class Smallchicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
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
