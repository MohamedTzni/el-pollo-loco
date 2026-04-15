/** Renders the win screen. */
function renderGameWonScreen() {
  return `<img src="./img/9_intro_outro_screens/game_over/you won.png" alt="You won!" style="width: 100%; height: auto; display: block;">
  <div style="position: absolute; bottom: 60px; width: 100%; text-align: center;">
    <button onclick="reloadGame()" class="button" style="margin: 0 auto 10px; display: block;">Play Again</button>
    <button onclick="backToStart()" class="button" style="margin: 0 auto; display: block;">Back to Start</button>
  </div>`;
}

/** Renders a random game over screen. */
function renderRandomGameOverScreen() {
  const gameOverScreens = [
    "img/9_intro_outro_screens/game_over/game over!.png",
    "img/9_intro_outro_screens/game_over/game over.png",
    "img/9_intro_outro_screens/game_over/oh no you lost!.png",
    "img/9_intro_outro_screens/game_over/you lost.png",
  ];
  let randomScreen = gameOverScreens[Math.floor(Math.random() * gameOverScreens.length)];
  return `<img src="./${randomScreen}" alt="Game Over" style="width: 100%; height: auto; display: block;">
  <div style="position: absolute; bottom: 60px; width: 100%; text-align: center;">
    <button onclick="reloadGame()" class="button" style="margin: 0 auto 10px; display: block;">Try Again</button>
    <button onclick="backToStart()" class="button" style="margin: 0 auto; display: block;">Back to Start</button>
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
