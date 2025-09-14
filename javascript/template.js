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
 * @returns a string that contains an HTML `img` element with a randomly selected image from an array
 * of game over screens, and a `div` element with a "Back to Start" button that, when clicked, will
 * reload the game. The class of the `img` element is determined by the value of the `endScreenClass`
 * variable, which is set based on the value
 */
function renderRandomGameOverScreen() {
  let endScreenClass;
  if (isFullScreen) {
    endScreenClass = "fullendscreen";
  } else {
    endScreenClass = "defaultendscreen";
  }
  let max = gameOverScreens.length - 1;
  let randomScreen = Math.floor(Math.random() * (max - +1));
  return `<img src="${gameOverScreens[randomScreen]}" class="${endScreenClass}"></img>
    <div class="button flex-center" onclick="reloadGame()">Back to Start</div>`;
}

/**
 * The function renders a game won screen with an image and a button to reload the game.
 * @returns a string that contains an HTML code for an image and a button. The image source is
 * "img/9_intro_outro_screens/game_over/gamewon2.png" and its class is determined by the value of the
 * variable `endScreenClass`. The button has a class of "button flex-center" and an onclick event that
 * calls the `reloadGame()` function.
 */
function renderGameWonScreen() {
  let endScreenClass;
  if (isFullScreen) {
    endScreenClass = "fullendscreen";
  } else {
    endScreenClass = "defaultendscreen";
  }
  return `<img src="img/9_intro_outro_screens/game_over/gamewon2.png" class= ${endScreenClass}></img>
    <div class="button flex-center" onclick="reloadGame()">Back to Start</div>`;
} 
