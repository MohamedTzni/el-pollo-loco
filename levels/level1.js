const levelLength = 6; // Defines the background width and amount of background elements, also the amount of enemies and collectable items;

// Enemy elements
const amountEndboss = 1;
const amountEnemies = levelLength;
let enemies = [];
let endboss = [];

//Background Elements
const backgroundImg = [
  "img/5_background/layers/air.png",
  "img/5_background/layers/3_third_layer/2.png",
  "img/5_background/layers/2_second_layer/2.png",
  "img/5_background/layers/1_first_layer/2.png",
  "img/5_background/layers/air.png",
  "img/5_background/layers/3_third_layer/1.png",
  "img/5_background/layers/2_second_layer/1.png",
  "img/5_background/layers/1_first_layer/1.png",
];
let backgroundObjects = [];
const amountClouds = levelLength;
const backgroundWidth = 719;
const end_of_level_x = backgroundWidth * (levelLength - 1);
let clouds = [];

//Collectable Items
const amountCollectableBottles = 10;
const amountCollectableCoins = 10;
let collectableObjects = [];

//Level Setup
let level1;

/**
 * The function generates a level with a background, clouds, collectable items, enemies, and an end
 * boss.
 */
function generateLevel() {
  generateBackground();
  generateClouds();
  generateCollectableItems();
  generateEnemies();
  generateEndboss();
  setNewLevel()
}

/**
 * The function sets a new level with specified objects and parameters.
 */
function setNewLevel() {
  level1 = new Level(
    clouds,
    backgroundObjects,
    collectableObjects,
    enemies,
    endboss,
    amountCollectableBottles,
    amountCollectableCoins,
    end_of_level_x
  )
}

/**
 * The function resets various arrays used in a game level.
 */
function resetLevel() {
clouds = [];
enemies = [];
endboss = [];
backgroundObjects = []
collectableObjects = [];
}

/**
 * This function generates a background by creating multiple instances of BackgroundObject with
 * different images and widths.
 */
function generateBackground() {
  let bgObject;
  for (let i = 0; i < levelLength; i++) {
    for (let j = 0; j < backgroundImg.length; j++) {
      let bgImage = backgroundImg[j];
      if (j < backgroundImg.length / 2) {
        bgWidth = backgroundWidth * (i * 2 - 1);
        bgObject = new BackgroundObject(bgImage, bgWidth, 0);
      } else {
        bgWidth = backgroundWidth * (i * 2);
        bgObject = new BackgroundObject(bgImage, bgWidth, 0);
      }
      backgroundObjects.push(bgObject);
    }
  }
}

/**
 * The function generates a specified number of clouds with random images and locations on the
 * background.
 */
function generateClouds() {
  for (let i = 0; i < amountClouds; i++) {
    let cloudLocation = backgroundWidth * (i + 1) - 500;
    let imageNumber = Math.round(Math.random()); // either 0 or 1
    let cloud = new Cloud(cloudLocation, imageNumber);
    clouds.push(cloud);
  }
}

/**
 * This function generates a specified number of Endboss objects and adds them to an array.
 */
function generateEndboss() {
  for (let i = 0; i < amountEndboss; i++) {
    let boss = new Endboss();
    endboss.push(boss);
  }
}

/**
 * This function generates a specified number of enemies and adds them to an array.
 */
function generateEnemies() {
  for (let i = 0; i < amountEnemies; i++) {
    let enemylocation = (backgroundWidth - 300) * (i + 1);
    let chicken = new Chicken(enemylocation);
    let smallchicken = new Smallchicken(enemylocation);
    enemies.push(chicken, smallchicken);
  }
}

/**
 * The function generates collectable coins and bottles.
 */
function generateCollectableItems() {
  generateCollectableCoins();
  generateCollectableBottles();
}

/**
 * This function generates a specified number of collectable coins and adds them to an array of
 * collectable objects.
 */
function generateCollectableCoins() {
  for (let i = 0; i < amountCollectableCoins; i++) {
    let location = (backgroundWidth - 550) * (i + 1);
    let coin = new Coin(location);
    collectableObjects.push(coin);
  }
}

/**
 * This function generates a specified number of collectable bottles and adds them to an array of
 * collectable objects.
 */
function generateCollectableBottles() {
  for (let i = 0; i < amountCollectableBottles; i++) {
    let location = (backgroundWidth - 550) * (i + 1);
    let bottle = new Bottle(location);
    collectableObjects.push(bottle);
  }
}
