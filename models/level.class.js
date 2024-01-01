class Level {
    enemies;
    clouds;
    backgroundObjects;
    end_of_level_x;
    collectableItems;
    endboss;
    amountCollectableBottles;
    amountCollectableCoins;

    constructor(clouds, backgroundObjects, collectableItems, enemies, endboss,amountCollectableBottles,amountCollectableCoins, end_of_level_x){
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableItems = collectableItems;
        this.enemies = enemies;
        this.endboss = endboss;
        this.amountCollectableBottles = amountCollectableBottles;
        this.amountCollectableCoins = amountCollectableCoins;
        this.end_of_level_x = end_of_level_x;
    }

}
