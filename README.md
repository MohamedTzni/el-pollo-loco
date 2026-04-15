# El Pollo Loco

El Pollo Loco is a small 2D jump-and-run game built with HTML, CSS and vanilla JavaScript. The game runs in the browser and uses the HTML5 canvas for the main game area.

You play as Pepe, collect coins and salsa bottles, avoid chickens and defeat the endboss.

## Features

- Canvas based jump-and-run gameplay
- Keyboard controls for desktop
- Touch controls for mobile landscape mode
- Collectable coins and salsa bottles
- Bottle throwing mechanic
- Normal chickens, small chickens and an endboss
- Health, coin, bottle and endboss status bars
- Win and game over screens
- Restart and back-to-start options
- Sound effects and background music
- Mute button with saved setting in local storage
- Fullscreen button
- Explanation overlay
- Imprint overlay
- Responsive layout for desktop and mobile landscape
- Rotate-device message in portrait mode

## Controls

### Keyboard

| Key | Action |
| --- | --- |
| Left Arrow | Move left |
| Right Arrow | Move right |
| Space | Jump |
| D | Throw a bottle |
| M | Mute or unmute sound |
| Escape | Leave fullscreen |

### Mobile

Mobile control buttons are shown only on small screens. The game is meant to be played in landscape mode on phones and tablets.

| Button | Action |
| --- | --- |
| Left | Move left |
| Right | Move right |
| Jump | Jump |
| Bottle | Throw a bottle |

## Gameplay

Pepe starts in the desert and has to move through the level. Coins increase the coin bar, and salsa bottles fill the bottle bar. Bottles can be thrown at enemies.

Normal chickens can be defeated by jumping on them or by hitting them with a bottle. The endboss takes damage from thrown bottles. The game is won when the endboss has no energy left. The game is lost when Pepe has no health left.

## Project Structure

```text
el-pollo-loco/
|-- index.html
|-- overlay.html
|-- impressum.html
|-- style.css
|-- README.md
|-- audio/
|-- fonts/
|-- img/
|-- javascript/
|   |-- game.js
|   |-- game-fullscreen.js
|   |-- overlay.js
|   |-- template.js
|   |-- template-additions.js
|-- levels/
|   |-- level1.js
|-- models/
|   |-- background-object.class.js
|   |-- bottlebar.class.js
|   |-- chicken.class.js
|   |-- cloud.class.js
|   |-- coinbar-class.js
|   |-- collectable-bottle.class.js
|   |-- collectable-coin.class.js
|   |-- collectable-objekt.class.js
|   |-- drawable-object.class.js
|   |-- endboss.class.js
|   |-- endbossbar.class.js
|   |-- healthbar.class.js
|   |-- keyboard.class.js
|   |-- level.class.js
|   |-- movable.object.class.js
|   |-- pepe.class.js
|   |-- smallchicken.class.js
|   |-- statusbar.class.js
|   |-- throwable-bottle.class.js
|   |-- throwable-object.class.js
|   |-- world-collisions.class.js
|   |-- world-draw.class.js
|   |-- world.class.js
```

## How To Start

Because the overlays are loaded with `fetch()`, the project should be opened through a local server.

With Python:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000
```

You can also use the Live Server extension in VS Code.

## Notes

- No build step is needed.
- No external JavaScript framework is used.
- All used sound files are MP3 files.
- The game is optimized for desktop and mobile landscape mode.

## Author

Mohamed Touzani
