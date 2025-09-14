class MovableObject extends DrawableObject {
  speed = 0.15;
  flippedGraphics = false;
  speedY = 0;
  acceleration = 2;
  ground;
  energy = 100;
  lastHit = 0;
  IMAGES_DEAD;
  isAlive = true;
  world;

  /**
   * The function applies gravity to an object by decreasing its vertical position and speed over time.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * The function checks if an object is above the ground or not.
   * @returns If the current object is an instance of the ThrowableObject class, the function will
   * return true. Otherwise, it will return whether the y-coordinate of the object is less than the
   * ground level.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.ground;
    }
  }

  /**
   * The function checks if an object is jumping by comparing its current height to the ground and its
   * vertical speed.
   * @returns The function `isJumping()` is returning a boolean value. It will return `true` if the
   * object's `y` position is above the ground and its `speedY` is negative (i.e. it is moving
   * upwards), indicating that it is currently jumping. It will return `false` otherwise.
   */
  isJumping() {
    return this.y - this.ground < 0 && this.speedY < 0;
  }

  /**
   * The function checks if two objects are colliding based on their positions and dimensions.
   * @param obj - The object that is being checked for collision with the current object.
   * @returns a boolean value indicating whether the current object is colliding with the object passed
   * as an argument.
   */
  isColliding(obj) {
    return (
      (obj.isAlive || obj instanceof Coin || obj instanceof Bottle) &&
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left / 2 &&
      this.y + this.height > obj.y + obj.offset.top &&
      this.x + this.offset.left - obj.width / 2 <
        obj.x + obj.width - obj.offset.right &&
      this.y + this.offset.top < obj.y + obj.height
    );
  }

  /**
   * The function checks if an object has been jumped on by another object.
   * @param obj - The "obj" parameter is an object that represents an entity in the game. It likely has
   * properties such as "isAlive", "y", "height", "offset", and "width". The function is checking if
   * the current object (represented by "this") has collided with the "obj"
   * @returns The function `isJumpedOn` is returning a boolean value. It is checking if the object
   * passed as an argument is alive and if the bottom of the current object is below the top of the
   * passed object, and if the top of the current object is above the bottom of the passed object. If
   * all these conditions are true, then it returns `true`, indicating that the current object has
   * jumped
   */
  isJumpedOn(obj) {
    return (
      obj.isAlive &&
      this.y + this.height > obj.y + obj.offset.top &&
      this.y + this.offset.top < obj.y + obj.height
    );
  }

  /**
   * The "hit" function reduces the energy of an object by a specified amount and updates the last hit
   * time.
   * @param damage - The amount of damage that the hit will cause to the energy of the object being
   * hit.
   */
  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * The function checks if the time since the last hit is less than one second.
   * @returns The function `isHurt()` is returning a boolean value. It will return `true` if the
   * difference between the current time and the `lastHit` time is less than 1 second, indicating that
   * the object is still considered "hurt". Otherwise, it will return `false`.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // difference in ms
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * The function checks if an object's energy is equal to zero and returns a boolean value.
   * @returns The `isDead()` function is returning a boolean value that indicates whether the `energy`
   * property of the object calling the function is equal to 0. If the `energy` property is equal to 0,
   * then the function returns `true`, indicating that the object is dead. Otherwise, the function
   * returns `false`, indicating that the object is still alive.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * The function isKilled sets the isAlive property of an enemy to false, plays a sound, sets the
   * speed to 0, and removes the enemy from the level after a delay.
   * @param enemy - The "enemy" parameter is an object representing an enemy in the game. It is used to
   * identify which enemy has been killed and remove it from the game's list of enemies.
   */
  isKilled(enemy) {
    this.isAlive = false;
    world.playSound(world.chickenHurt_sound);
    this.speed = 0;
    setTimeout(() => {
      let indexofenemy = world.getIndexOfItem(world.level.enemies, enemy);
      world.level.enemies.splice(indexofenemy, 1);
    }, 2000);
  }

  /**
   * The function moves an object to the left based on its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * The function moves an object to the right by increasing its x-coordinate based on its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * The function moves an object down by a specified speed.
   * @param fallspeed - fallspeed is a numerical value that represents the speed at which an object is
   * falling downwards. It is used as a parameter in the function to move an object downwards by adding
   * the fallspeed value to its current y-coordinate.
   */
  moveDown(fallspeed) {
    this.y += fallspeed;
  }

  /**
   * The function moves an object upwards by a specified speed.
   * @param fallspeed - The fallspeed parameter is a number that represents the speed at which an
   * object is falling. It is used in the moveUp() function to move the object upwards by subtracting
   * the fallspeed value from its current y-coordinate.
   */
  moveUp(fallspeed) {
    this.y -= fallspeed;
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

  /**
   * The function sets the vertical speed of an object to 15, allowing it to jump.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * The function sets the vertical speed of an object to 10, causing it to bounce upwards.
   */
  bounceUp() {
    this.speedY = 15;
  }

  /**
   * The function "endGame" sets a timeout of 2500 milliseconds and then calls the "stopGame" function.
   */
  endGame() {
    setTimeout(() => {
      stopGame();
    }, 2500);
  }

  /**
   * The function animates the enemy by moving it left and playing its animation.
   */
  animateEnemy() {
    this.moveEnemyLeft();
    this.playEnemyAnimation();
  }

  /**
   * This function moves an enemy to the left at a rate of 60 frames per second, as long as the enemy
   * is alive.
   */
  moveEnemyLeft() {
    setInterval(() => {
      if (this.isAlive) {
        this.moveLeft();
      } else clearInterval();
    }, 1000 / 60);
  }

  /**
   * This function plays a walking animation for an enemy character at a set interval, but stops the
   * animation if the enemy is no longer alive.
   */
  playEnemyAnimation() {
    setInterval(() => {
      if (this.isAlive) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.stopEnemyAnimation();
      }
    }, 200);
  }

  /**
   * The function stops the enemy animation, plays the dead image, and moves the enemy down after a
   * delay.
   */
  stopEnemyAnimation() {
    clearInterval();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.moveDown(50);
    }, 1800);
  }
}
