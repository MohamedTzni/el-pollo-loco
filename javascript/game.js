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

// ---- Functions start here ----

/**
 * The function initializes the webpage by detecting mobile
 * devices, and setting up touch event listeners.
 */
function init() {
  initSoundSettings();
  setSoundIcon();
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
  level1 = resetLevel();
  showGameUI();
  hideMenuBar();
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  world = new World(canvas, keyboard);
  loadSoundSettings();
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
  showMenuBar();
  playEndScreenSound(world.gameWon);
}

function playEndScreenSound(win) {
  if (isSoundMuted) return;
  try {
    if (win) {
      const endboss = world?.level?.enemies?.find((e) => e instanceof Endboss);
      const sound = endboss?.endbossDead_sound;
      if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }
    } else {
      const sound = world?.character?.dead_sound;
      if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }
    }
  } catch {}
}

// ---- Functions for keyboard usage ----

window.addEventListener("keydown", (event) => {
  if (event.code == "ArrowRight") {
    keyboard.KEY_RIGHT = true;
  }
  if (event.code == "ArrowLeft") {
    keyboard.KEY_LEFT = true;
  }
  if (event.code == "Space") {
    event.preventDefault(); // verhindert Scrollen/Seite-Fokus frisst Space
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
  if (event.code == "Escape") { // korrigiert von "KeyEscape"
    keyboard.KEY_ESC = false;
    leaveFullscreen();
  }
});

portrait.addEventListener("change", () => checkMobileOrientation());

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
    document.getElementById("rotationAlert").classList.remove("d-none");
    document.getElementById("controlsdescription").classList.add("d-none");
  } else {
    document.getElementById("rotationAlert").classList.add("d-none");
    document.getElementById("controlsdescription").classList.remove("d-none");
  }
}

/**
 * The function adds touch event listeners to buttons and updates the keyboard object accordingly.
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
 * The function sets event listeners for touch end events on specific buttons and updates corresponding
 * keyboard keys to false.
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
  // KORREKTUR: vorher versehentlich "touchstart"
  document.getElementById("btn-sound").addEventListener("touchend", (e) => {
    keyboard.KEY_M = false;
    e.preventDefault();
  });
  document.getElementById("btn-fullscreen").addEventListener("touchend", (e) => {
    keyboard.KEY_ESC = false;
    e.preventDefault();
  });
}

// ---- Functions for fullscreen functionality ----

function toggleFullscreen() {
  let fullscreen = document.getElementById("fullscreen");
  let body = document.body;
  let canvasEl = document.getElementById("canvas");

  if (!isFullScreen) {
    fullscreen.classList.add("fullscreen");
    body.classList.add("fullscreen-enabled");
    canvasEl.classList.add("fullscreen");
    document.getElementById("endscreen").classList.add("fullscreen");
    document.getElementById("mainheadline").classList.add("d-none");

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    canvasEl.style.width = "100vw";
    canvasEl.style.height = "100vh";
    canvasEl.style.objectFit = "fill";

    enterFullscreen(fullscreen);
    isFullScreen = true;

    hideMenuBar(); // <-- NEU: im Vollbild immer ausblenden
  } else {
    leaveFullscreen();
  }
}

window.addEventListener("resize", () => {
  if (isFullScreen) {
    const canvasEl = document.getElementById("canvas");
    if (!canvasEl) return;
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    canvasEl.style.width = "100vw";
    canvasEl.style.height = "100vh";
  }
});

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

document.addEventListener("fullscreenchange", fullscreenchangelog);

function fullscreenchangelog() {
  if (!document.fullscreenElement) {
    leaveFullscreen();
  }
}

function leaveFullscreen() {
  if (isFullScreen) {
    let fullscreen = document.getElementById("fullscreen");
    fullscreen.classList.remove("fullscreen");
    document.body.classList.remove("fullscreen-enabled");
    let canvasEl = document.getElementById("canvas");
    canvasEl.classList.remove("fullscreen");
    document.getElementById("endscreen").classList.remove("fullscreen");
    document.getElementById("mainheadline").classList.remove("d-none");

    // Rücksetzung der Style-Änderungen
    canvasEl.style.width = "100%";
    canvasEl.style.height = "auto";
    canvasEl.style.objectFit = "initial";

    canvasEl.width = 720;
    canvasEl.height = 480;
    isFullScreen = false;
  }

  // Nach Vollbild verlassen: Nur anzeigen, wenn kein Spiel läuft (Canvas verborgen) oder Endscreen sichtbar ist.
  const canvasHidden = document.getElementById("canvas").classList.contains("d-none");
  const onEndscreen  = !document.getElementById("endscreen").classList.contains("d-none");
  if (canvasHidden || onEndscreen) {
    showMenuBar();
  } else {
    hideMenuBar();
  }
}

// ---- Functions for audio ----

function toggleSound() {
  isSoundMuted = !isSoundMuted;
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
  saveAudioSetting();
}

function setSoundIcon() {
  let soundicon = document.getElementById("soundicon");
  if (!soundicon) return;
  if (isSoundMuted) {
    soundicon.src = "./img/1_controls/muted.png";
  } else {
    soundicon.src = "./img/1_controls/loud.png";
  }
}

function saveAudioSetting() {
  localStorage.setItem("isEPLSoundMuted", isSoundMuted);
}

function initSoundSettings() {
  let initsound = localStorage.getItem("isEPLSoundMuted");
  if (initsound === null) {
    isSoundMuted = false;
  } else {
    isSoundMuted = (initsound === "true");
  }
}

function loadSoundSettings() {
  initSoundSettings();
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
}

function muteAudioFiles(boolean) {
  if (!world) return;

  // Character
  if (world.character) {
    if (world.character.walking_sound) world.character.walking_sound.muted = boolean;
    if (world.character.hurt_sound)    world.character.hurt_sound.muted    = boolean;
    if (world.character.dead_sound)    world.character.dead_sound.muted    = boolean;
    if (world.character.jump_sound)    world.character.jump_sound.muted    = boolean;
  }

  // World / Enemies / Endboss / Music
  if (world.chickenHurt_sound) world.chickenHurt_sound.muted = boolean;
  if (world.throwBottle_sound) world.throwBottle_sound.muted = boolean;
if (world.backgroundMusic) {
  world.backgroundMusic.muted = boolean;
  if (boolean) {
    try { world.backgroundMusic.pause(); } catch (e) {}
  } else {
    try { world.backgroundMusic.play().catch(() => {}); } catch (e) {}
  }
}

  const endboss = world.level?.enemies?.find((enemy) => enemy instanceof Endboss);
  if (endboss?.endbossDead_sound) {
    endboss.endbossDead_sound.muted = boolean;
  }

  // Collectables
  const collectables = [
    ...(world.level?.bottles || []),
    ...(world.level?.coins || []),
  ];

  for (let i = 0; i < collectables.length; i++) {
    const item = collectables[i];
    if (item && item.collect_sound) {
      item.collect_sound.muted = boolean;
    }
  }
}

/* ==== Start-Button & Initialisierung ==== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});

