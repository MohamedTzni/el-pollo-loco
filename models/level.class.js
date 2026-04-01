class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    end_of_level_x;

    constructor(enemies, clouds, backgroundObjects, bottles, coins, end_of_level_x){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.bottles = bottles;
        this.coins = coins;
        this.end_of_level_x = end_of_level_x;
    }

}
