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

/** Helper functions for the menu bar. */
function hideMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.add("d-none");
}

/** Shows the menu bar. */
function showMenuBar() {
  const menu = document.querySelector(".menu-bar");
  if (menu) menu.classList.remove("d-none");
}

// Page setup

/** Starts the page setup. */
function init() {
  initSoundSettings();
  setSoundIcon();
  detectMobileDevice();
  touchStart();
  touchEnd();
  preventContextMenu();
  bindClickButtons();
}

/** Adds desktop clicks for sound and fullscreen. */
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

/** Starts a new game. */
function startGame() {
  level1 = resetLevel();
  showGameUI();
  hideMenuBar();
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d-none");
  world = new World(canvas, keyboard);
  loadSoundSettings();
}

/** Starts the game again from the end screen. */
function reloadGame() {
  document.getElementById('endscreen').classList.add('d-none')
  startGame()
}

/** Stops the game and shows the end screen. */
function stopGame() {
  clearAllIntervals();
  setTimeout(() => {
    document.getElementById("canvas").classList.add("d-none");
    try { world.backgroundMusic.pause(); } catch {}
    showEndScreen();
    resetLevel();
  }, 1000);
}

/** Clears running intervals. */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/** Shows the win or lose screen. */
function showEndScreen() {
  let endscreen = document.getElementById("endscreen");
  if (world.gameWon) {
    endscreen.innerHTML = renderGameWonScreen();
  } else {
    endscreen.innerHTML = renderRandomGameOverScreen();
  }
  hideGameUI();
  document.getElementById("mainheadline").classList.add("d-none");
  endscreen.classList.remove("d-none");
  showMenuBar();
  playEndScreenSound(world.gameWon);
}

/** Plays the sound on the end screen. */
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

// Keyboard input

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

portrait.addEventListener("change", () => checkMobileOrientation());

/** Checks if the screen is a small mobile screen. */
function detectMobileDevice() {
  if (window.innerWidth < 500 && window.innerHeight < 900) {
    checkMobileOrientation();
  }
}

/** Shows the rotate message in portrait mode. */
function checkMobileOrientation() {
  if (portrait.matches) {
    document.getElementById("rotationAlert").classList.remove("d-none");
    document.getElementById("controlsdescription").classList.add("d-none");
  } else {
    document.getElementById("rotationAlert").classList.add("d-none");
    document.getElementById("controlsdescription").classList.remove("d-none");
  }
}

/** Prevents the context menu on control buttons. */
function preventContextMenu() {
  ["btn-left", "btn-right", "btn-jump", "btn-throw", "btn-sound", "btn-fullscreen"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("contextmenu", (e) => e.preventDefault());
  });
}

/** Adds touch start controls. */
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

/** Adds touch end controls. */
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

// Sound

function toggleSound() {
  isSoundMuted = !isSoundMuted;
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
  saveAudioSetting();
}

/** Sets the right sound icon. */
function setSoundIcon() {
  let soundicon = document.getElementById("soundicon");
  if (!soundicon) return;
  if (isSoundMuted) {
    soundicon.src = "./img/1_controls/muted.png";
  } else {
    soundicon.src = "./img/1_controls/loud.png";
  }
}

/** Saves the sound setting. */
function saveAudioSetting() {
  localStorage.setItem("isEPLSoundMuted", isSoundMuted);
}

/** Loads the saved sound setting. */
function initSoundSettings() {
  let initsound = localStorage.getItem("isEPLSoundMuted");
  if (initsound === null) {
    isSoundMuted = false;
  } else {
    isSoundMuted = (initsound === "true");
  }
}

/** Applies the sound setting. */
function loadSoundSettings() {
  initSoundSettings();
  muteAudioFiles(isSoundMuted);
  setSoundIcon();
}

/** Mutes or unmutes all game sounds. */
function muteAudioFiles(boolean) {
  if (!world) return;

  if (world.character) {
    if (world.character.walking_sound) world.character.walking_sound.muted = boolean;
    if (world.character.hurt_sound)    world.character.hurt_sound.muted    = boolean;
    if (world.character.dead_sound)    world.character.dead_sound.muted    = boolean;
    if (world.character.jump_sound)    world.character.jump_sound.muted    = boolean;
  }

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

document.addEventListener("DOMContentLoaded", () => {
  init();
});

