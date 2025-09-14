/**
 * @file game.js
 * @overview Core UI and input glue code for initializing the game, handling
 * device/orientation, keyboard/touch inputs, fullscreen mode, and global audio state.
 * All logic remains unchanged; this file only provides documentation.
 */

/**
 * @typedef {Object} Keyboard
 * @property {boolean} KEY_RIGHT
 * @property {boolean} KEY_LEFT
 * @property {boolean} KEY_SPACE
 * @property {boolean} KEY_D
 * @property {boolean} KEY_M
 * @property {boolean} KEY_ESC
 */

/**
 * @typedef {Object} Level
 * @property {Array<Object>} endboss
 * @property {Array<Object>} collectableItems
 */

/**
 * @typedef {Object} Character
 * @property {HTMLAudioElement} [walking_sound]
 * @property {HTMLAudioElement} [hurt_sound]
 * @property {HTMLAudioElement} [dead_sound]
 * @property {HTMLAudioElement} [jump_sound]
 */

/**
 * @typedef {Object} World
 * @property {Character} character
 * @property {Level} level
 * @property {boolean} gameWon
 * @property {HTMLAudioElement} backgroundMusic
 */

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {number[]} */
let allIntervals = [];
/** @type {string[]} */
let gameOverScreens = [
  "img/9_intro_outro_screens/game_over/game over!.png",
  "img/9_intro_outro_screens/game_over/game over.png",
  "img/9_intro_outro_screens/game_over/oh no you lost!.png",
  "img/9_intro_outro_screens/game_over/you lost.png",
];
/** Global mute flag for all game audio. */
let isSoundMuted = false;

/** Tracks whether DOM fullscreen is active. */
let isFullScreen = false;
/** Matches when device orientation is portrait. */
let portrait = window.matchMedia("(orientation: portrait)");

/**
 * Hides the top menu bar if present.
 * @returns {void}
 */
function hideMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.add("d-none");
}

/**
 * Shows the top menu bar if present.
 * @returns {void}
 */
function showMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.remove("d-none");
}

/**
 * Initializes input handling and mobile checks.
 * Calls touch/keyboard bindings and desktop button listeners.
 * @returns {void}
 */
function init() {
  detectMobileDevice();
  touchStart();
  touchEnd();
  bindClickButtons();
}

/**
 * Binds desktop click handlers for sound toggle and fullscreen toggle.
 * Uses synthetic keyboard flags for consistency with other input paths.
 * @returns {void}
 */
function bindClickButtons() {
  const btnSound = document.getElementById("btn-sound");
  const btnFs    = document.getElementById("btn-fullscreen");

  if (btnSound) {
    btnSound.addEventListener("click", (e) => {
      e.preventDefault();
      keyboard.KEY_M = true;
      toggleSound();
      keyboard.KEY_M = false;
    });
  }

  if (btnFs) {
    btnFs.addEventListener("click", (e) => {
      e.preventDefault();
      keyboard.KEY_ESC = true;
      toggleFullscreen();
      keyboard.KEY_ESC = false;
    });
  }
}

/**
 * Bootstraps a new game round:
 * - generates level
 * - shows UI and canvas
 * - constructs {@link World}
 * - loads and enforces audio settings
 * - starts background music
 * @fires HTMLMediaElement#play
 * @returns {void}
 */
function startGame() {
  generateLevel();
  showGameUI();
  hideMenuBar();
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  world = new World(canvas, keyboard, level1);
  loadSoundSettings();

  isSoundMuted = false;
  muteAudioFiles(false);
  setSoundIcon();
  saveAudioSetting();
  try {
    world.backgroundMusic.currentTime = 0;
    world.backgroundMusic.play().catch(() => {});
  } catch (e) {}
}

/**
 * Hides the end screen and restarts the game.
 * @returns {void}
 */
function reloadGame() {
  document.getElementById('endscreen').classList.add('d-none')
  startGame()
}

/**
 * Stops the current game session:
 * - clears intervals
 * - hides canvas
 * - pauses music
 * - shows end screen after 1s
 * @returns {void}
 */
function stopGame() {
  clearAllIntervals();
  setTimeout(() => {
    document.getElementById("canvas").classList.add("d-none");
    try { world.backgroundMusic.pause(); } catch {}
    showEndScreen();
    resetLevel();
  }, 1000);
}

/**
 * Clears a broad range of interval ids.
 * Note: aggressive clear for safety; does not track individual ids.
 * @returns {void}
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Renders either the "game won" or a random "game over" screen,
 * hides the in-game UI, and shows the menu bar.
 * @returns {void}
 */
function showEndScreen() {
  let endscreen = document.getElementById("endscreen");
  if (world.gameWon) {
    endscreen.innerHTML = renderGameWonScreen();
  } else {
    endscreen.innerHTML = renderRandomGameOverScreen();
  }
  hideGameUI();
  endscreen.classList.remove("d-none");
  showMenuBar();
}

/**
 * Keyboard down event mapping for movement, actions, sound toggle and fullscreen leave.
 * Prevents page scroll on Space.
 * @listens window:keydown
 * @param {KeyboardEvent} event
 * @returns {void}
 */
window.addEventListener("keydown", (event) => {
  if (event.code == "ArrowRight") {
    keyboard.KEY_RIGHT = true;
  }
  if (event.code == "ArrowLeft") {
    keyboard.KEY_LEFT = true;
  }
  if (event.code == "Space") {
    event.preventDefault();
    keyboard.KEY_SPACE = true;
  }
  if (event.code == "KeyD") {
    keyboard.KEY_D = true;
  }
  if (event.code == "KeyM") {
    keyboard.KEY_M = true;
    toggleSound();
  }
  if (event.code == "Escape") {
    keyboard.KEY_ESC = true;
    leaveFullscreen();
  }
});

/**
 * Keyboard up event mapping to release keys and possibly leave fullscreen.
 * Prevents page scroll on Space.
 * @listens window:keyup
 * @param {KeyboardEvent} event
 * @returns {void}
 */
window.addEventListener("keyup", (event) => {
  if (event.code == "ArrowRight") {
    keyboard.KEY_RIGHT = false;
  }
  if (event.code == "ArrowLeft") {
    keyboard.KEY_LEFT = false;
  }
  if (event.code == "Space") {
    event.preventDefault();
    keyboard.KEY_SPACE = false;
  }
  if (event.code == "KeyD") {
    keyboard.KEY_D = false;
  }
  if (event.code == "KeyM") {
    keyboard.KEY_M = false;
  }
  if (event.code == "Escape") {
    keyboard.KEY_ESC = false;
    leaveFullscreen();
  }
});

/**
 * Reacts to device orientation changes to show/hide rotation hints.
 * @listens MediaQueryList#change
 * @returns {void}
 */
portrait.addEventListener("change", () => checkMobileOrientation());

/**
 * Detects small-screen devices and triggers orientation check.
 * @returns {void}
 */
function detectMobileDevice() {
  if (window.innerWidth < 500 && window.innerHeight < 900) {
    checkMobileOrientation();
  }
}

/**
 * Toggles rotation alert and control description depending on portrait/landscape.
 * @returns {void}
 */
function checkMobileOrientation() {
  if (portrait.matches) {
    document.getElementById("rotationAlert").classList.remove("d-none");
    document.getElementById("controlsdescription").classList.add("d-none");
  } else {
    document.getElementById("rotationAlert").classList.add("d-none");
    document.getElementById("controlsdescription").classList.remove("d-none");
  }
}

/**
 * Registers touchstart handlers for movement and actions, including sound and fullscreen toggles.
 * @returns {void}
 */
function touchStart() {
  document.getElementById("btn-left").addEventListener("touchstart", (e) => {
    keyboard.KEY_LEFT = true;
    e.preventDefault();
  });
  document.getElementById("btn-right").addEventListener("touchstart", (e) => {
    keyboard.KEY_RIGHT = true;
    e.preventDefault();
  });
  document.getElementById("btn-jump").addEventListener("touchstart", (e) => {
    keyboard.KEY_SPACE = true;
    e.preventDefault();
  });
  document.getElementById("btn-throw").addEventListener("touchstart", (e) => {
    keyboard.KEY_D = true;
    e.preventDefault();
  });
  document.getElementById("btn-sound").addEventListener("touchstart", (e) => {
    keyboard.KEY_M = true;
    toggleSound();
    e.preventDefault();
  });
  document.getElementById("btn-fullscreen").addEventListener("touchstart", (e) => {
    keyboard.KEY_ESC = true;
    toggleFullscreen();
    e.preventDefault();
  });
}

/**
 * Registers touchend handlers to release keys for all touch buttons.
 * @returns {void}
 */
function touchEnd() {
  document.getElementById("btn-left").addEventListener("touchend", (e) => {
    keyboard.KEY_LEFT = false;
    e.preventDefault();
  });
  document.getElementById("btn-right").addEventListener("touchend", (e) => {
    keyboard.KEY_RIGHT = false;
    e.preventDefault();
  });
  document.getElementById("btn-jump").addEventListener("touchend", (e) => {
    keyboard.KEY_SPACE = false;
    e.preventDefault();
  });
  document.getElementById("btn-throw").addEventListener("touchend", (e) => {
    keyboard.KEY_D = false;
    e.preventDefault();
  });
  document.getElementById("btn-sound").addEventListener("touchend", (e) => {
    keyboard.KEY_M = false;
    e.preventDefault();
  });
  document.getElementById("btn-fullscreen").addEventListener("touchend", (e) => {
    keyboard.KEY_ESC = false;
    e.preventDefault();
  });
}

/**
 * Toggles fullscreen mode for the canvas/endscreen container.
 * Also hides/shows the menu bar appropriately.
 * @returns {void}
 */
function toggleFullscreen() {
  let fullscreen = document.getElementById("fullscreen");
  if (!isFullScreen) {
    document.getElementById("canvas").classList.add("fullscreen");
    document.getElementById("endscreen").classList.add("fullscreen");
    document.getElementById("mainheadline").classList.add("d-none");
    enterFullscreen(fullscreen);
    isFullScreen = true;
    hideMenuBar();
  } else {
    leaveFullscreen();
  }
}

/**
 * Requests DOM fullscreen on a given element.
 * @param {HTMLElement} element
 * @returns {void}
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits DOM fullscreen mode (vendor-prefixed fallback included).
 * @returns {void}
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Ensures we leave fullscreen cleanly when the browser reports a fullscreenchange.
 * @listens document:fullscreenchange
 * @returns {void}
 */
document.addEventListener("fullscreenchange", fullscreenchangelog);

/**
 * Leaves fullscreen if no element is currently in fullscreen.
 * @returns {void}
 */
function fullscreenchangelog() {
  if (!document.fullscreenElement) {
    leaveFullscreen();
  }
}

/**
 * Cleans up DOM classes and menu visibility upon leaving fullscreen.
 * Shows menu bar if canvas is hidden or endscreen is visible.
 * @returns {void}
 */
function leaveFullscreen() {
  if (isFullScreen) {
    document.getElementById("canvas").classList.remove("fullscreen");
    document.getElementById("endscreen").classList.remove("fullscreen");
    document.getElementById("mainheadline").classList.remove("d-none");
    isFullScreen = false;
  }
  const canvasHidden = document.getElementById("canvas").classList.contains("d-none");
  const onEndscreen  = !document.getElementById("endscreen").classList.contains("d-none");
  if (canvasHidden || onEndscreen) {
    showMenuBar();
  } else {
    hideMenuBar();
  }
}

/**
 * Flips the global mute state, applies it to all audio, updates icon and persists setting.
 * @returns {void}
 */
function toggleSound() {
  isSoundMuted = !isSoundMuted;
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
  saveAudioSetting();
}

/**
 * Updates the sound icon depending on {@link isSoundMuted}.
 * @returns {void}
 */
function setSoundIcon() {
  let soundicon = document.getElementById("soundicon");
  if (isSoundMuted) {
    soundicon.src = "./img/1_controls/muted.png";
  } else {
    soundicon.src = "./img/1_controls/loud.png";
  }
}

/**
 * Persists the current mute state in localStorage.
 * @returns {void}
 */
function saveAudioSetting() {
  localStorage.setItem("isEPLSoundMuted", isSoundMuted);
}

/**
 * Initializes {@link isSoundMuted} from localStorage, defaulting to false.
 * @returns {void}
 */
function initSoundSettings() {
  let initsound = localStorage.getItem("isEPLSoundMuted");
  if (initsound === null) {
    isSoundMuted = false;
  } else {
    isSoundMuted = (initsound === "true");
  }
}

/**
 * Loads and applies stored audio settings and updates the icon.
 * @returns {void}
 */
function loadSoundSettings() {
  initSoundSettings();
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
}

/**
 * Mutes/unmutes all relevant audio sources across world, character, enemies and collectables.
 * Also starts/stops background music accordingly.
 * @param {boolean} boolean - True to mute, false to unmute.
 * @returns {void}
 */
function muteAudioFiles(boolean) {
  if (!world) return;

  if (world.character) {
    if (world.character.walking_sound) world.character.walking_sound.muted = boolean;
    if (world.character.hurt_sound)    world.character.hurt_sound.muted    = boolean;
    if (world.character.dead_sound)    world.character.dead_sound.muted    = boolean;
    if (world.character.jump_sound)    world.character.jump_sound.muted    = boolean;
  }

  if (world.chickenHurt_sound) world.chickenHurt_sound.muted = boolean;
if (world.backgroundMusic) {
  world.backgroundMusic.muted = boolean;
  if (boolean) {
    try { world.backgroundMusic.pause(); } catch (e) {}
  } else {
    try { world.backgroundMusic.play().catch(() => {}); } catch (e) {}
  }
}

  if (world.level && world.level.endboss && world.level.endboss[0]) {
    if (world.level.endboss[0].endbossDead_sound) {
      world.level.endboss[0].endbossDead_sound.muted = boolean;
    }
  }

  if (world.level && Array.isArray(world.level.collectableItems)) {
    for (let i = 0; i < world.level.collectableItems.length; i++) {
      const item = world.level.collectableItems[i];
      if (item && item.collect_sound) {
        item.collect_sound.muted = boolean;
      }
    }
  }
}

/**
 * Entry point after DOM is ready.
 * @listens document:DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  init();
});
/**
 * @file game.js
 * @overview Core UI and input glue code for initializing the game, handling
 * device/orientation, keyboard/touch inputs, fullscreen mode, and global audio state.
 * All logic remains unchanged; this file only provides documentation.
 * @author
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * @typedef {Object} Keyboard
 * @property {boolean} KEY_RIGHT
 * @property {boolean} KEY_LEFT
 * @property {boolean} KEY_SPACE
 * @property {boolean} KEY_D
 * @property {boolean} KEY_M
 * @property {boolean} KEY_ESC
 */

/**
 * @typedef {Object} Level
 * @property {Array<Object>} endboss
 * @property {Array<Object>} collectableItems
 */

/**
 * @typedef {Object} Character
 * @property {HTMLAudioElement} [walking_sound]
 * @property {HTMLAudioElement} [hurt_sound]
 * @property {HTMLAudioElement} [dead_sound]
 * @property {HTMLAudioElement} [jump_sound]
 */

/**
 * @typedef {Object} World
 * @property {Character} character
 * @property {Level} level
 * @property {boolean} gameWon
 * @property {HTMLAudioElement} backgroundMusic
 */

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {number[]} */
let allIntervals = [];
/** @type {string[]} */
let gameOverScreens = [
  "img/9_intro_outro_screens/game_over/game over!.png",
  "img/9_intro_outro_screens/game_over/game over.png",
  "img/9_intro_outro_screens/game_over/oh no you lost!.png",
  "img/9_intro_outro_screens/game_over/you lost.png",
];
/** Global mute flag for all game audio. */
let isSoundMuted = false;

/** Tracks whether DOM fullscreen is active. */
let isFullScreen = false;
/** Matches when device orientation is portrait. */
let portrait = window.matchMedia("(orientation: portrait)");

/**
 * Hides the top menu bar if present.
 * @returns {void}
 * @since 1.0.0
 */
function hideMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.add("d-none");
}

/**
 * Shows the top menu bar if present.
 * @returns {void}
 * @since 1.0.0
 */
function showMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.remove("d-none");
}

/**
 * Initializes input handling and mobile checks.
 * Calls touch/keyboard bindings and desktop button listeners.
 * @returns {void}
 * @since 1.0.0
 */
function init() {
  detectMobileDevice();
  touchStart();
  touchEnd();
  bindClickButtons();
}

/**
 * Binds desktop click handlers for sound toggle and fullscreen toggle.
 * Uses synthetic keyboard flags for consistency with other input paths.
 * @returns {void}
 * @since 1.0.0
 */
function bindClickButtons() {
  const btnSound = document.getElementById("btn-sound");
  const btnFs    = document.getElementById("btn-fullscreen");

  if (btnSound) {
    btnSound.addEventListener("click", (e) => {
      e.preventDefault();
      keyboard.KEY_M = true;
      toggleSound();
      keyboard.KEY_M = false;
    });
  }

  if (btnFs) {
    btnFs.addEventListener("click", (e) => {
      e.preventDefault();
      keyboard.KEY_ESC = true;
      toggleFullscreen();
      keyboard.KEY_ESC = false;
    });
  }
}

/**
 * Bootstraps a new game round:
 * - generates level
 * - shows UI and canvas
 * - constructs {@link World}
 * - loads and enforces audio settings
 * - starts background music
 * @fires HTMLMediaElement#play
 * @returns {void}
 * @since 1.0.0
 */
function startGame() {
  generateLevel();
  showGameUI();
  hideMenuBar();
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  world = new World(canvas, keyboard, level1);
  loadSoundSettings();

  isSoundMuted = false;
  muteAudioFiles(false);
  setSoundIcon();
  saveAudioSetting();
  try {
    world.backgroundMusic.currentTime = 0;
    world.backgroundMusic.play().catch(() => {});
  } catch (e) {}
}

/**
 * Hides the end screen and restarts the game.
 * @returns {void}
 * @since 1.0.0
 */
function reloadGame() {
  document.getElementById('endscreen').classList.add('d-none')
  startGame()
}

/**
 * Stops the current game session:
 * - clears intervals
 * - hides canvas
 * - pauses music
 * - shows end screen after 1s
 * @returns {void}
 * @since 1.0.0
 */
function stopGame() {
  clearAllIntervals();
  setTimeout(() => {
    document.getElementById("canvas").classList.add("d-none");
    try { world.backgroundMusic.pause(); } catch {}
    showEndScreen();
    resetLevel();
  }, 1000);
}

/**
 * Clears a broad range of interval ids.
 * Note: aggressive clear for safety; does not track individual ids.
 * @returns {void}
 * @since 1.0.0
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Renders either the "game won" or a random "game over" screen,
 * hides the in-game UI, and shows the menu bar.
 * @returns {void}
 * @since 1.0.0
 */
function showEndScreen() {
  let endscreen = document.getElementById("endscreen");
  if (world.gameWon) {
    endscreen.innerHTML = renderGameWonScreen();
  } else {
    endscreen.innerHTML = renderRandomGameOverScreen();
  }
  hideGameUI();
  endscreen.classList.remove("d-none");
  showMenuBar();
}

/**
 * Keyboard down event mapping for movement, actions, sound toggle and fullscreen leave.
 * Prevents page scroll on Space.
 * @listens window:keydown
 * @param {KeyboardEvent} event
 * @returns {void}
 * @since 1.0.0
 */
window.addEventListener("keydown", (event) => {
  if (event.code == "ArrowRight") {
    keyboard.KEY_RIGHT = true;
  }
  if (event.code == "ArrowLeft") {
    keyboard.KEY_LEFT = true;
  }
  if (event.code == "Space") {
    event.preventDefault();
    keyboard.KEY_SPACE = true;
  }
  if (event.code == "KeyD") {
    keyboard.KEY_D = true;
  }
  if (event.code == "KeyM") {
    keyboard.KEY_M = true;
    toggleSound();
  }
  if (event.code == "Escape") {
    keyboard.KEY_ESC = true;
    leaveFullscreen();
  }
});

/**
 * Keyboard up event mapping to release keys and possibly leave fullscreen.
 * Prevents page scroll on Space.
 * @listens window:keyup
 * @param {KeyboardEvent} event
 * @returns {void}
 * @since 1.0.0
 */
window.addEventListener("keyup", (event) => {
  if (event.code == "ArrowRight") {
    keyboard.KEY_RIGHT = false;
  }
  if (event.code == "ArrowLeft") {
    keyboard.KEY_LEFT = false;
  }
  if (event.code == "Space") {
    event.preventDefault();
    keyboard.KEY_SPACE = false;
  }
  if (event.code == "KeyD") {
    keyboard.KEY_D = false;
  }
  if (event.code == "KeyM") {
    keyboard.KEY_M = false;
  }
  if (event.code == "Escape") {
    keyboard.KEY_ESC = false;
    leaveFullscreen();
  }
});

/**
 * Reacts to device orientation changes to show/hide rotation hints.
 * @listens MediaQueryList#change
 * @returns {void}
 * @since 1.0.0
 */
portrait.addEventListener("change", () => checkMobileOrientation());

/**
 * Detects small-screen devices and triggers orientation check.
 * @returns {void}
 * @since 1.0.0
 */
function detectMobileDevice() {
  if (window.innerWidth < 500 && window.innerHeight < 900) {
    checkMobileOrientation();
  }
}

/**
 * Toggles rotation alert and control description depending on portrait/landscape.
 * @returns {void}
 * @since 1.0.0
 */
function checkMobileOrientation() {
  if (portrait.matches) {
    document.getElementById("rotationAlert").classList.remove("d-none");
    document.getElementById("controlsdescription").classList.add("d-none");
  } else {
    document.getElementById("rotationAlert").classList.add("d-none");
    document.getElementById("controlsdescription").classList.remove("d-none");
  }
}

/**
 * Registers touchstart handlers for movement and actions, including sound and fullscreen toggles.
 * @returns {void}
 * @since 1.0.0
 */
function touchStart() {
  document.getElementById("btn-left").addEventListener("touchstart", (e) => {
    keyboard.KEY_LEFT = true;
    e.preventDefault();
  });
  document.getElementById("btn-right").addEventListener("touchstart", (e) => {
    keyboard.KEY_RIGHT = true;
    e.preventDefault();
  });
  document.getElementById("btn-jump").addEventListener("touchstart", (e) => {
    keyboard.KEY_SPACE = true;
    e.preventDefault();
  });
  document.getElementById("btn-throw").addEventListener("touchstart", (e) => {
    keyboard.KEY_D = true;
    e.preventDefault();
  });
  document.getElementById("btn-sound").addEventListener("touchstart", (e) => {
    keyboard.KEY_M = true;
    toggleSound();
    e.preventDefault();
  });
  document.getElementById("btn-fullscreen").addEventListener("touchstart", (e) => {
    keyboard.KEY_ESC = true;
    toggleFullscreen();
    e.preventDefault();
  });
}

/**
 * Registers touchend handlers to release keys for all touch buttons.
 * @returns {void}
 * @since 1.0.0
 */
function touchEnd() {
  document.getElementById("btn-left").addEventListener("touchend", (e) => {
    keyboard.KEY_LEFT = false;
    e.preventDefault();
  });
  document.getElementById("btn-right").addEventListener("touchend", (e) => {
    keyboard.KEY_RIGHT = false;
    e.preventDefault();
  });
  document.getElementById("btn-jump").addEventListener("touchend", (e) => {
    keyboard.KEY_SPACE = false;
    e.preventDefault();
  });
  document.getElementById("btn-throw").addEventListener("touchend", (e) => {
    keyboard.KEY_D = false;
    e.preventDefault();
  });
  document.getElementById("btn-sound").addEventListener("touchend", (e) => {
    keyboard.KEY_M = false;
    e.preventDefault();
  });
  document.getElementById("btn-fullscreen").addEventListener("touchend", (e) => {
    keyboard.KEY_ESC = false;
    e.preventDefault();
  });
}

/**
 * Toggles fullscreen mode for the canvas/endscreen container.
 * Also hides/shows the menu bar appropriately.
 * @returns {void}
 * @since 1.0.0
 */
function toggleFullscreen() {
  let fullscreen = document.getElementById("fullscreen");
  if (!isFullScreen) {
    document.getElementById("canvas").classList.add("fullscreen");
    document.getElementById("endscreen").classList.add("fullscreen");
    document.getElementById("mainheadline").classList.add("d-none");
    enterFullscreen(fullscreen);
    isFullScreen = true;
    hideMenuBar();
  } else {
    leaveFullscreen();
  }
}

/**
 * Requests DOM fullscreen on a given element.
 * @param {HTMLElement} element
 * @returns {void}
 * @since 1.0.0
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exits DOM fullscreen mode (vendor-prefixed fallback included).
 * @returns {void}
 * @since 1.0.0
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Ensures we leave fullscreen cleanly when the browser reports a fullscreenchange.
 * @listens document:fullscreenchange
 * @returns {void}
 * @since 1.0.0
 */
document.addEventListener("fullscreenchange", fullscreenchangelog);

/**
 * Leaves fullscreen if no element is currently in fullscreen.
 * @returns {void}
 * @since 1.0.0
 */
function fullscreenchangelog() {
  if (!document.fullscreenElement) {
    leaveFullscreen();
  }
}

/**
 * Cleans up DOM classes and menu visibility upon leaving fullscreen.
 * Shows menu bar if canvas is hidden or endscreen is visible.
 * @returns {void}
 * @since 1.0.0
 */
function leaveFullscreen() {
  if (isFullScreen) {
    document.getElementById("canvas").classList.remove("fullscreen");
    document.getElementById("endscreen").classList.remove("fullscreen");
    document.getElementById("mainheadline").classList.remove("d-none");
    isFullScreen = false;
  }
  const canvasHidden = document.getElementById("canvas").classList.contains("d-none");
  const onEndscreen  = !document.getElementById("endscreen").classList.contains("d-none");
  if (canvasHidden || onEndscreen) {
    showMenuBar();
  } else {
    hideMenuBar();
  }
}

/**
 * Flips the global mute state, applies it to all audio, updates icon and persists setting.
 * @returns {void}
 * @since 1.0.0
 */
function toggleSound() {
  isSoundMuted = !isSoundMuted;
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
  saveAudioSetting();
}

/**
 * Updates the sound icon depending on {@link isSoundMuted}.
 * @returns {void}
 * @since 1.0.0
 */
function setSoundIcon() {
  let soundicon = document.getElementById("soundicon");
  if (isSoundMuted) {
    soundicon.src = "./img/1_controls/muted.png";
  } else {
    soundicon.src = "./img/1_controls/loud.png";
  }
}

/**
 * Persists the current mute state in localStorage.
 * @returns {void}
 * @since 1.0.0
 */
function saveAudioSetting() {
  localStorage.setItem("isEPLSoundMuted", isSoundMuted);
}

/**
 * Initializes {@link isSoundMuted} from localStorage, defaulting to false.
 * @returns {void}
 * @since 1.0.0
 */
function initSoundSettings() {
  let initsound = localStorage.getItem("isEPLSoundMuted");
  if (initsound === null) {
    isSoundMuted = false;
  } else {
    isSoundMuted = (initsound === "true");
  }
}

/**
 * Loads and applies stored audio settings and updates the icon.
 * @returns {void}
 * @since 1.0.0
 */
function loadSoundSettings() {
  initSoundSettings();
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
}

/**
 * Mutes/unmutes all relevant audio sources across world, character, enemies and collectables.
 * Also starts/stops background music accordingly.
 * @param {boolean} boolean - True to mute, false to unmute.
 * @returns {void}
 * @since 1.0.0
 */
function muteAudioFiles(boolean) {
  if (!world) return;

  if (world.character) {
    if (world.character.walking_sound) world.character.walking_sound.muted = boolean;
    if (world.character.hurt_sound)    world.character.hurt_sound.muted    = boolean;
    if (world.character.dead_sound)    world.character.dead_sound.muted    = boolean;
    if (world.character.jump_sound)    world.character.jump_sound.muted    = boolean;
  }

  if (world.chickenHurt_sound) world.chickenHurt_sound.muted = boolean;
if (world.backgroundMusic) {
  world.backgroundMusic.muted = boolean;
  if (boolean) {
    try { world.backgroundMusic.pause(); } catch (e) {}
  } else {
    try { world.backgroundMusic.play().catch(() => {}); } catch (e) {}
  }
}

  if (world.level && world.level.endboss && world.level.endboss[0]) {
    if (world.level.endboss[0].endbossDead_sound) {
      world.level.endboss[0].endbossDead_sound.muted = boolean;
    }
  }

  if (world.level && Array.isArray(world.level.collectableItems)) {
    for (let i = 0; i < world.level.collectableItems.length; i++) {
      const item = world.level.collectableItems[i];
      if (item && item.collect_sound) {
        item.collect_sound.muted = boolean;
      }
    }
  }
}

/**
 * Entry point after DOM is ready.
 * @listens document:DOMContentLoaded
 * @returns {void}
 * @since 1.0.0
 */
document.addEventListener("DOMContentLoaded", () => {
  init();
});
