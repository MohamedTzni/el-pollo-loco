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
