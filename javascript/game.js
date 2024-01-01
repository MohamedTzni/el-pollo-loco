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

/**
 * The function initializes the webpage by detecting mobile
 * devices, and setting up touch event listeners.
 */
function init() {
  detectMobileDevice();
  touchStart();
  touchEnd();
}

/**
 * The function detects if the device accessing the website has a small screen size and calls another
 * function to check its orientation if it is a mobile device.
 */
function detectMobileDevice() {
  if (window.innerWidth < 500 && window.innerHeight < 900) {
    checkMobileOrientation();
  }
}

/**
 * The function checks the orientation of a mobile device and displays or hides certain elements based
 * on whether it is in portrait or landscape mode.
 */
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

/* ==== Start-Button & Initialisierung ==== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});
