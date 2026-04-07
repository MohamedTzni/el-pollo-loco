# El Pollo Loco

A browser based 2D jump and run game built with vanilla JavaScript and HTML5 Canvas.
Play as Pepe, fight off chickens, collect coins and bottles, and defeat the final boss to win.

> This project was developed as part of my fullstack web development training at the **Developer Akademie**.

---

## Table of Contents

1. [Demo](#demo)
2. [Gameplay](#gameplay)
3. [Controls](#controls)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Author](#author)

---

## Demo

Open `index.html` in any modern browser. No build step or server setup required.

---

## Gameplay

You control Pepe, a fearless adventurer making his way through a desert full of enemies.
Collect salsa bottles scattered across the level to use as weapons against the final boss.
Gather coins along the way and avoid taking hits from the chickens.
Reach the end of the level, trigger the final boss fight, and throw your bottles to defeat him.

**You win** when the final boss runs out of energy.  
**You lose** when Pepe runs out of health.

---

## Controls

### Keyboard

| Key | Action |
|---|---|
| Arrow Right | Move right |
| Arrow Left | Move left |
| Space | Jump |
| D | Throw bottle |
| M | Toggle sound |
| Escape | Leave fullscreen |

### Mobile / Touch

On touch devices, four on screen buttons appear at the bottom of the screen:

* Left / Right for movement
* Jump button
* Throw button

---

## Features

* Smooth character animation with idle, walk, jump, hurt and death states
* Collectible coins and salsa bottles with status bars
* Multiple enemy types: normal chickens, small chickens, and a final boss
* Final boss with alert, attack, hurt and death animations
* Boss flies off screen when defeated
* Randomised win and game over screens
* Fullscreen mode
* Sound toggle with persistent setting via localStorage
* Mobile responsive layout with touch controls
* Rotate device hint for portrait orientation on mobile
* Impressum page

---

## Project Structure

```
el-pollo-loco/
├── index.html
├── impressum.html
├── overlay.html
├── style.css
├── javascript/
│   ├── game.js          # Game init, keyboard input, UI logic
│   ├── template.js      # HTML template functions
│   └── overlay.js       # Explanation overlay logic
├── models/
│   ├── drawable-object.class.js
│   ├── movable.object.class.js
│   ├── pepe.class.js
│   ├── chicken.class.js
│   ├── smallchicken.class.js
│   ├── endboss.class.js
│   ├── collectable-bottle.class.js
│   ├── collectable-coin.class.js
│   ├── throwable-bottle.class.js
│   ├── throwable-object.class.js
│   ├── world.class.js
│   ├── level.class.js
│   ├── cloud.class.js
│   ├── background-object.class.js
│   ├── healthbar.class.js
│   ├── bottlebar.class.js
│   ├── coinbar-class.js
│   └── endbossbar.class.js
├── levels/
│   └── level1.js
├── img/
│   └── ...              # All game assets
└── audio/
    └── ...              # Sound effects and background music
```

---

## Getting Started

1. Clone or download the repository
2. Open `index.html` directly in your browser

No dependencies, no npm, no build tools needed.

> For full audio support, serve the files through a local server such as VS Code Live Server,
> since some browsers block audio autoplay on file:// URLs.

---

## Author

**Mohamed Touzani**  
Fullstack Developer  
Contact: kontakt@mohamed-touzani.de
