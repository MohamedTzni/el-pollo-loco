/** Checks if the device can use touch. */
function isTouchDevice(){ return ('ontouchstart' in window) || (navigator.maxTouchPoints>0); }

/** Checks if mobile buttons should be shown. */
function shouldShowMobileControls() {
  return window.innerWidth <= 914;
}

/** Returns the canvas HTML. */
function showCanvasSection() {
  return /*html*/ `
  <section id="canvas-section" class="flex-center">
      <canvas id="canvas" width="720" height="480"></canvas>
  </section>
`;
}

/** Returns the control info HTML. */
function showGameControl() {
  return /*html*/ `
  <section id="controlsdescription" class="flex-center d-none">
    <img class="controls" src="img/1_controls/arrow-left.png">
    <img class="controls" src="img/1_controls/arrow-right.png">
    <img class="controls" src="img/1_controls/arrow-up.png">
    <img class="controls" src="img/1_controls/throwbottle.png">
  </section>
`;
}

/** Shows the game buttons and hides the start screen. */
function showGameUI() {
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("controlsdescription").classList.remove("d-none");
  document.getElementById("infobtn").classList.add("d-none");
  document.getElementById("btn-fullscreen").classList.remove("d-none");
  document.getElementById("btn-sound").classList.remove("d-none");
  setMobileControlButtons();
}

/** Shows mobile buttons only on small screens. */
function setMobileControlButtons() {
  ["btn-left", "btn-right", "btn-jump", "btn-throw"].forEach((id) => {
    let button = document.getElementById(id);
    button.classList.toggle("d-none", !shouldShowMobileControls());
    button.classList.toggle("hide", !shouldShowMobileControls());
  });
}

/** Returns the mobile button HTML. */
function showMobileButtons() {
  return /*html*/ `
  <section id="mobilebuttons" class="d-none">
    <div id="control-left-right">
      <button id="btn-left"><img class="img-ctrl" src="./img/1_controls/left.png" alt="left"></button>
      <button id="btn-right"><img class="img-ctrl" src="./img/1_controls/right.png" alt="right"></button>
    </div>
    <div id="control-jump-throw">
      <button id="btn-jump"><img class="img-ctrl" src="./img/1_controls/jump.png" alt="jump"></button>
      <button id="btn-throw"><img class="img-ctrl" src="./img/1_controls/throw.png" alt="throw"></button>
    </div>
  </section>
`;
}

/** Returns the fullscreen button HTML. */
function showFullscreenSection() {
  return /*html*/ `
  <section id="fullscreen-controls" class="flex-center">
    <button title="Fullscreen" id="btn-fullscreen" class="d-none"><img class="img-ctrl" src="img/1_controls/fullscreen.png"></button>
    <button title="Sound an/aus" id="btn-sound" class="d-none"><img class="img-ctrl" id="img-sound" src="img/1_controls/loud.png"></button>
    <button title="Info" id="infobtn"><img class="img-ctrl" src="img/1_controls/info.png"></button>
  </section>
`;
}

/** Returns the rotate message HTML. */
function showRotateSection() {
  return /*html*/ `
  <section id="rotate" class="flex-center d-none">
    <img id="rotate" src="./img/1_controls/rotate.png" alt="rotate">
  </section>
`;
}

/** Returns the start screen HTML. */
function showStartScreen() {
  return /*html*/ `
  <section id="startscreen" class="flex-center">
      <img src="./img/9_intro_outro_screens/start/startscreen_3.png" alt="Background" class="startscreen-img">
      <div id="startscreen-btns" class="flex-center">
          <button onclick="startGame()" class="button">
              <span class="button__icon-wrapper">
                  <svg class="button__icon-svg" viewBox="0 0 20 20">
                      <path fill="none" d="M0,0h20v20H0V0z"></path>
                      <path d="M15.8,8.8L8.3,4.2C7.3,3.6,6,4.3,6,5.4v9.1c0,1,1.1,1.7,2.1,1.2l7.6-4.2c0.9-0.5,0.9-1.8,0.1-2.2z"></path>
                  </svg>
              </span>
              Play now
          </button>
          <button id="btn-explain" class="cta">
              Spiel-Erklaerung
          </button>
          <button id="btn-impressum" class="cta">
              Impressum
          </button>
      </div>
  </section>
`;
}

/** Returns the game over HTML. */
function showGameOverScreen() {
  return /*html*/ `
    <section id="endscreen" class="flex-center">
      <div id="gameOver" class="end">
        <p id="headline">Game Over</p>
        <button onclick="reloadGame()">Try Again</button>
        <button onclick="backToStart()">Back to Start</button>
      </div>
    </section>
`;
}

/** Returns the win screen HTML. */
function showWinScreen() {
  return /*html*/ `
    <section id="endscreen" class="flex-center">
      <div id="gameOver" class="win">
        <p id="headline">You won!!</p>
        <button onclick="reloadGame()">Play Again</button>
        <button onclick="backToStart()">Back to Start</button>
      </div>
    </section>
`;
}

/** Hides all game buttons. */
function hideGameUI() {
  document.getElementById("controlsdescription").classList.add("d-none");
  document.getElementById("btn-fullscreen").classList.add("d-none");
  document.getElementById("btn-sound").classList.add("d-none");
  document.getElementById("btn-left").classList.add("d-none");
  document.getElementById("btn-left").classList.add("hide");
  document.getElementById("btn-right").classList.add("d-none");
  document.getElementById("btn-right").classList.add("hide");
  document.getElementById("btn-jump").classList.add("d-none");
  document.getElementById("btn-jump").classList.add("hide");
  document.getElementById("btn-throw").classList.add("d-none");
  document.getElementById("btn-throw").classList.add("hide");
}

/** Returns a random win screen. */
function renderGameWonScreen() {
  const winScreens = [
    "./img/10_You won, you lost/You Win A.png",
    "./img/10_You won, you lost/You win B.png",
    "./img/10_You won, you lost/You Won B.png",
    "./img/10_You won, you lost/You won A.png",
  ];
  const randomScreen = winScreens[Math.floor(Math.random() * winScreens.length)];
  return `
    <div class="endscreen-content">
      <img src="${randomScreen}" alt="You won!">
      <div class="endscreen-actions">
        <button onclick="reloadGame()" class="endscreen-btn">Play Again</button>
        <button onclick="backToStart()" class="endscreen-btn">Back to Start</button>
      </div>
    </div>`;
}

/** Returns a random game over screen. */
function renderRandomGameOverScreen() {
  const gameOverScreens = [
    "./img/10_You won, you lost/Game Over.png",
    "./img/10_You won, you lost/Game over A.png",
    "./img/10_You won, you lost/You lost b.png",
    "./img/10_You won, you lost/You lost.png",
  ];
  const randomScreen = gameOverScreens[Math.floor(Math.random() * gameOverScreens.length)];
  return `
    <div class="endscreen-content">
      <img src="${randomScreen}" alt="Game Over">
      <div class="endscreen-actions">
        <button onclick="reloadGame()" class="endscreen-btn">Try Again</button>
        <button onclick="backToStart()" class="endscreen-btn">Back to Start</button>
      </div>
    </div>`;
}

/** Goes back to the start screen. */
function backToStart() {
  if (world) world.stopAllSounds();
  document.getElementById("endscreen").classList.add("d-none");
  document.getElementById("canvas").classList.add("d-none");
  document.getElementById("startscreen").classList.remove("d-none");
  document.getElementById("mainheadline").classList.remove("d-none");
  hideGameUI();
  showMenuBar();
  level1 = resetLevel();
  world = null;
}
