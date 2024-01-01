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
  bindClickButtons(); // Desktop-Click-Listener für Sound/Fullscreen
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

function reloadGame() {
  document.getElementById('endscreen').classList.add('d-none')
  startGame()
}

function stopGame() {
  clearAllIntervals();
  setTimeout(() => {
    document.getElementById("canvas").classList.add("d-none");
    try { world.backgroundMusic.pause(); } catch {}
    showEndScreen();
    resetLevel();
  }, 1000);
}

function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

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
  if (!isFullScreen) {
    document.getElementById("canvas").classList.add("fullscreen");
    document.getElementById("endscreen").classList.add("fullscreen");
    document.getElementById("mainheadline").classList.add("d-none");
    enterFullscreen(fullscreen);
    isFullScreen = true;

    hideMenuBar(); // <-- NEU: im Vollbild immer ausblenden
  } else {
    leaveFullscreen();
  }
}

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
    document.getElementById("canvas").classList.remove("fullscreen");
    document.getElementById("endscreen").classList.remove("fullscreen");
    document.getElementById("mainheadline").classList.remove("d-none");
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

  // Collectables
  if (world.level && Array.isArray(world.level.collectableItems)) {
    for (let i = 0; i < world.level.collectableItems.length; i++) {
      const item = world.level.collectableItems[i];
      if (item && item.collect_sound) {
        item.collect_sound.muted = boolean;
      }
    }
  }
}

/* ==== Start-Button & Initialisierung ==== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});
