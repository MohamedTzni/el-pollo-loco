// Templates and supporting functions

/**
 * The function shows the game UI by removing the start screen and displaying various buttons.
 */
function showGameUI() {
  document.getElementById("startscreen").classList.add("d-none");
  document.getElementById("controlsdescription").classList.remove("d-none");
  document.getElementById("infobtn").classList.add("d-none");
  document.getElementById("btn-fullscreen").classList.remove("d-none");
  document.getElementById("btn-sound").classList.remove("d-none");
  document.getElementById("btn-left").classList.remove("d-none");
  document.getElementById("btn-right").classList.remove("d-none");
  document.getElementById("btn-jump").classList.remove("d-none");
  document.getElementById("btn-throw").classList.remove("d-none");
}

/**
 * The function hides certain buttons related to game UI.
 */
function hideGameUI() {
  document.getElementById("controlsdescription").classList.add("d-none");
  document.getElementById("btn-fullscreen").classList.add("d-none");
  document.getElementById("btn-sound").classList.add("d-none");
  document.getElementById("btn-left").classList.add("d-none");
  document.getElementById("btn-right").classList.add("d-none");
  document.getElementById("btn-jump").classList.add("d-none");
  document.getElementById("btn-throw").classList.add("d-none");
}

/**
 * This function renders a random game over screen with a button to reload the game.
 * Picks an index from 0..gameOverScreens.length-1.
 */
function renderRandomGameOverScreen() {
  const endScreenClass = isFullScreen ? "fullendscreen" : "defaultendscreen";
  const maxIndex = gameOverScreens.length - 1;
  const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
  return `<img src="${gameOverScreens[randomIndex]}" class="${endScreenClass}"></img>
    <div class="button flex-center" onclick="reloadGame()">Back to Start</div>`;
}

/**
 * The function renders a game won screen with an image and a button to reload the game.
 */
function renderGameWonScreen() {
  const endScreenClass = isFullScreen ? "fullendscreen" : "defaultendscreen";
  return `<img src="img/9_intro_outro_screens/game_over/gamewon2.png" class="${endScreenClass}"></img>
    <div class="button flex-center" onclick="reloadGame()">Back to Start</div>`;
}
