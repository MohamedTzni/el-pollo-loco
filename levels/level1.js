/**
 * Creates the level with enemies, clouds, background, bottles and coins.
 */
const levelLength = 7;
const backgroundWidth = 719;
const end_of_level_x = backgroundWidth * (levelLength - 1);

/** Creates a fresh level. */
function resetLevel() {
  return new Level(
    createEnemies(),
    createClouds(),
    createBackgrounds(),
    createBottles(),
    createCoins(),
    end_of_level_x
  );
}

/** Returns the list of enemies for the level. */
function createEnemies() {
  return [
    new Endboss(end_of_level_x + 200),
    new Chicken(650), new Chicken(980), new Chicken(1320), new Chicken(1680),
    new Chicken(2050), new Chicken(2410), new Chicken(2780), new Chicken(3140),
    new Smallchicken(820), new Smallchicken(1470), new Smallchicken(1880), new Smallchicken(2280),
    new Smallchicken(2660), new Smallchicken(3020), new Smallchicken(3380), new Smallchicken(3720)
  ];
}

/** Returns the list of clouds for the level. */
function createClouds() {
  return [
    new Cloud(210), new Cloud(430), new Cloud(670), new Cloud(820),
    new Cloud(1170), new Cloud(1350), new Cloud(1580), new Cloud(1900),
    new Cloud(2150), new Cloud(2430), new Cloud(2670), new Cloud(2820),
    new Cloud(3160), new Cloud(3410), new Cloud(3670), new Cloud(3820),
    new Cloud(4060), new Cloud(4250), new Cloud(4460), new Cloud(4710),
    new Cloud(4970), new Cloud(5130), new Cloud(5460), new Cloud(5750),
    new Cloud(5980)
  ];
}

/** Returns the list of background objects for the level. */
function createBackgrounds() {
  return [
    new BackgroundObject("./img/5_background/complete_background.png", -719),
    new BackgroundObject("./img/5_background/complete_background.png", 0),
    new BackgroundObject("./img/5_background/complete_background.png", 719),
    new BackgroundObject("./img/5_background/complete_background.png", 719 * 2),
    new BackgroundObject("./img/5_background/complete_background.png", 719 * 3),
    new BackgroundObject("./img/5_background/complete_background.png", 719 * 4),
    new BackgroundObject("./img/5_background/complete_background.png", 719 * 5),
    new BackgroundObject("./img/5_background/complete_background.png", 719 * 6)
  ];
}

/** Returns the list of bottles for the level. */
function createBottles() {
  return [
    new Bottle(510, 370), new Bottle(800, 370), new Bottle(1120, 370),
    new Bottle(1530, 370), new Bottle(1860, 370), new Bottle(2240, 370),
    new Bottle(2400, 370), new Bottle(2620, 370), new Bottle(2870, 370),
    new Bottle(3050, 370), new Bottle(3200, 370), new Bottle(3490, 370)
  ];
}

/** Returns the list of coins for the level. */
function createCoins() {
  return [
    new Coin(600, 140), new Coin(1100, 230), new Coin(1580, 270),
    new Coin(1860, 170), new Coin(2150, 240), new Coin(2400, 170),
    new Coin(2660, 230), new Coin(2900, 140), new Coin(3200, 220),
    new Coin(3380, 180)
  ];
}

let level1 = resetLevel();
