function isTouchDevice(){ return ('ontouchstart' in window) || (navigator.maxTouchPoints>0); }

function shouldShowMobileControls() {
  return isTouchDevice() || window.innerWidth <= 914;
}

function showCanvasSection() {
  return /*html*/ `
  <section id="canvas-section" class="flex-center">
      <canvas id="canvas" width="720" height="480"></canvas>
  </section>
`;
}

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

function showGameUI() {
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("controlsdescription").classList.remove("d-none");
  document.getElementById("infobtn").classList.add("d-none");
  document.getElementById("btn-fullscreen").classList.remove("d-none");
  document.getElementById("btn-sound").classList.remove("d-none");
  if (shouldShowMobileControls()) {
    document.getElementById("btn-left").classList.remove("d-none");
    document.getElementById("btn-left").classList.remove("hide");
    document.getElementById("btn-right").classList.remove("d-none");
    document.getElementById("btn-right").classList.remove("hide");
    document.getElementById("btn-jump").classList.remove("d-none");
    document.getElementById("btn-jump").classList.remove("hide");
    document.getElementById("btn-throw").classList.remove("d-none");
    document.getElementById("btn-throw").classList.remove("hide");
  }
}

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

function showFullscreenSection() {
  return /*html*/ `
  <section id="fullscreen-controls" class="flex-center">
    <button title="Fullscreen" id="btn-fullscreen" class="d-none"><img class="img-ctrl" src="img/1_controls/fullscreen.png"></button>
    <button title="Sound an/aus" id="btn-sound" class="d-none"><img class="img-ctrl" id="img-sound" src="img/1_controls/loud.png"></button>
    <button title="Info" id="infobtn"><img class="img-ctrl" src="img/1_controls/info.png"></button>
  </section>
`;
}

function showRotateSection() {
  return /*html*/ `
  <section id="rotate" class="flex-center d-none">
    <img id="rotate" src="./img/1_controls/rotate.png" alt="rotate">
  </section>
`;
}

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
              Spiel-Erklärung
          </button>
          <button id="btn-impressum" class="cta">
              Impressum
          </button>
      </div>
  </section>
`;
}

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

function renderGameWonScreen() {
  const winScreens = [
    "./img/10_you won, you lost/You Win A.png",
    "./img/10_you won, you lost/You win B.png",
    "./img/10_you won, you lost/You Won B.png",
    "./img/10_you won, you lost/You won A.png",
  ];
  const randomScreen = winScreens[Math.floor(Math.random() * winScreens.length)];
  return `
    <div style="display:flex; flex-direction:column; align-items:center;">
      <img src="${randomScreen}" alt="You won!" style="width:100%; height:auto; display:block; max-height:70vh; object-fit:contain;">
      <div style="display:flex; gap:16px; justify-content:center; padding:20px 0;">
        <button onclick="reloadGame()" class="endscreen-btn">Play Again</button>
        <button onclick="backToStart()" class="endscreen-btn">Back to Start</button>
      </div>
    </div>`;
}

function renderRandomGameOverScreen() {
  const gameOverScreens = [
    "./img/10_you won, you lost/Game Over.png",
    "./img/10_you won, you lost/Game over A.png",
    "./img/10_you won, you lost/You lost b.png",
    "./img/10_you won, you lost/You lost.png",
  ];
  const randomScreen = gameOverScreens[Math.floor(Math.random() * gameOverScreens.length)];
  return `
    <div style="display:flex; flex-direction:column; align-items:center;">
      <img src="${randomScreen}" alt="Game Over" style="width:100%; height:auto; display:block; max-height:70vh; object-fit:contain;">
      <div style="display:flex; gap:16px; justify-content:center; padding:20px 0;">
        <button onclick="reloadGame()" class="endscreen-btn">Try Again</button>
        <button onclick="backToStart()" class="endscreen-btn">Back to Start</button>
      </div>
    </div>`;
}

function backToStart() {
  location.reload();
}
