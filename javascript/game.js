let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let allIntervals = [];
let gameOverScreens = [
  "img/9_intro_outro_screens/game_over/game over!.png",
  "img/9_intro_outro_screens/game_over/game over.png",
  "img/9_intro_outro_screens/game_over/oh no you lost!.png",
  "img/9_intro_outro_screens/game_over/you lost.png",
];
let isSoundMuted = false;

let isFullScreen = false;
let portrait = window.matchMedia("(orientation: portrait)");

/** Hilfsfunktionen für Menü-Leiste **/
function hideMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.add("d-none");
}
function showMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.remove("d-none");
}

// ---- Functions start here ----ich werde dir nach und nach

function init() {
  detectMobileDevice();
  touchStart();
  touchEnd();
  bindClickButtons();
}

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
 * The function starts the game by generating a level, showing the game UI, creating a canvas,
 * initializing a world object, and loading sound settings.
 */
function startGame() {
  generateLevel();
  showGameUI();
  hideMenuBar();
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  world = new World(canvas, keyboard, level1);
  loadSoundSettings();

  // >>> Beim Start IMMER entmuten und Musik starten <<<
  isSoundMuted = false;
  muteAudioFiles(false);
  setSoundIcon();
  saveAudioSetting(); // überschreibt evtl. altes "true" in localStorage
  try {
    world.backgroundMusic.currentTime = 0;
    world.backgroundMusic.play().catch(() => {});
  } catch (e) {}
}

/**
 * The function reloads the game by hiding the end screen and starting the game again.
 */
function reloadGame() {
  document.getElementById('endscreen').classList.add('d-none')
  startGame()
}

/**
 * The function stops the game by clearing all intervals, hiding the canvas and game UI, pausing the background
 * music, and showing the end screen after a delay of 1 second.
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
 * The function clears all intervals set by the window object.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * The function displays either a game won or game over screen and hides the game UI.
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
  showMenuBar(); // <-- NEU: auf dem Endscreen die Menü-Buttons wieder anzeigen
}

window.addEventListener("keydown", () => {});
window.addEventListener("keyup", () => {});
portrait.addEventListener("change", () => checkMobileOrientation());

function detectMobileDevice() {
  if (window.innerWidth < 500 && window.innerHeight < 900) {
    checkMobileOrientation();
  }
}

function checkMobileOrientation() {
  if (portrait.matches) {
    document.getElementById("rotationAlert").classList.remove("d-none");
    document.getElementById("controlsdescription").classList.add("d-none");
  } else {
    document.getElementById("rotationAlert").classList.add("d-none");
    document.getElementById("controlsdescription").classList.remove("d-none");
  }
}

function touchStart() {}
function touchEnd() {}

/* ==== Start-Button & Initialisierung ==== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});
