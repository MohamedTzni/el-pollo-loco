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

/**
 * The function initializes the webpage by detecting mobile
 * devices, and setting up touch event listeners.
 */
function init() {
  detectMobileDevice();
  touchStart();
  touchEnd();
  bindClickButtons(); // Desktop-Click-Listener für Sound/Fullscreen
}

/**
 * Desktop-Click-Listener für Sound/Fullscreen (ohne Touch).
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
      // Fullscreen-Handling folgt in späterem Commit
      keyboard.KEY_ESC = false;
    });
  }
}

function detectMobileDevice() {
  if (window.innerWidth < 500 && window.innerHeight < 900) {
    checkMobileOrientation();
  }
}

function checkMobileOrientation() {
  if (portrait.matches) {
    const rot = document.getElementById("rotationAlert");
    const ctrl = document.getElementById("controlsdescription");
    if (rot) rot.classList.remove("d-none");
    if (ctrl) ctrl.classList.add("d-none");
  } else {
    const rot = document.getElementById("rotationAlert");
    const ctrl = document.getElementById("controlsdescription");
    if (rot) rot.classList.add("d-none");
    if (ctrl) ctrl.classList.remove("d-none");
  }
}

function touchStart() {}
function touchEnd() {}

/* ==== Start-Button & Initialisierung ==== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});
