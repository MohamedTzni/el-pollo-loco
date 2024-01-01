/**
 * @file game.js
 * @overview Core UI and input glue code for initializing the game, handling
 * device/orientation, keyboard/touch inputs, fullscreen mode, and global audio state.
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
 * @property {HTMLAudioElement} [jump_sight]
 */

/**
 * @typedef {Object} World
 * @property {Character} character
 * @property {Level} level
 * @property {boolean} gameWon
 * @property {HTMLAudioElement} backgroundMusic
 * @property {HTMLAudioElement} [chickenHurt_sound]
 */

// Externe Funktionen (müssen woanders definiert sein)
/** @function */
let generateLevel;
/** @function */
let showGameUI;
/** @function */
let hideGameUI;
/** @function */
let resetLevel;
/** @function */
let renderGameWonScreen;
/** @function */
let renderRandomGameOverScreen;

/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {World} */
let world;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {Array} */
let allIntervals = [];
/** @type {string[]} */
let gameOverScreens = [
    "img/9_intro_outro_screens/game_over/game over!.png",
    "img/9_intro_outro_screens/game_over/game over.png",
    "img/9_intro_outro_screens/game_over/oh no you lost!.png",
    "img/9_intro_outro_screens/game_over/you lost.png"
];
/** @type {boolean} Global mute flag for all game audio. */
let isSoundMuted = false;

/** @type {boolean} Tracks whether DOM fullscreen is active. */
let isFullScreen = false;
/** @type {MediaQueryList} Matches when device orientation is portrait. */
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
 * @returns {void}
 */
function bindClickButtons() {
    const btnSound = document.getElementById("btn-sound");
    const btnFs = document.getElementById("btn-fullscreen");

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
 * Bootstraps a new game round.
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
    document.getElementById("endscreen").classList.add("d-none");
    startGame();
}

/**
 * Stops the current game session.
 * @returns {void}
 */
function stopGame() {
    clearAllIntervals();
    setTimeout(() => {
        document.getElementById("canvas").classList.add("d-none");
        try {
            world.backgroundMusic.pause();
        } catch {}
        showEndScreen();
        resetLevel();
    }, 1000);
}

/**
 * Clears all intervals.
 * @returns {void}
 */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Shows end screen based on game outcome.
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

// Event listeners und weitere Funktionen bleiben gleich...