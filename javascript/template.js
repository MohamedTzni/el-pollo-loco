function isTouchDevice(){ return ('ontouchstart' in window) || (navigator.maxTouchPoints>0); }

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
  if (isTouchDevice()) {
    document.getElementById("btn-left").classList.remove("d-none");
    document.getElementById("btn-right").classList.remove("d-none");
    document.getElementById("btn-jump").classList.remove("d-none");
    document.getElementById("btn-throw").classList.remove("d-none");
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
