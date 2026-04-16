/** Switches fullscreen on or off. */
function toggleFullscreen() {
  let fullscreen = document.getElementById("fullscreen");
  let canvasEl = document.getElementById("canvas");
  if (!isFullScreen) {
    applyFullscreenClasses(fullscreen, canvasEl);
    enterFullscreen(fullscreen);
    isFullScreen = true;
    hideMenuBar();
  } else {
    leaveFullscreen();
  }
}

/** Adds the fullscreen CSS classes and resizes the canvas. */
function applyFullscreenClasses(fullscreen, canvasEl) {
  fullscreen.classList.add("fullscreen");
  document.body.classList.add("fullscreen-enabled");
  canvasEl.classList.add("fullscreen");
  document.getElementById("endscreen").classList.add("fullscreen");
  document.getElementById("mainheadline").classList.add("d-none");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  canvasEl.style.width = "100vw";
  canvasEl.style.height = "100vh";
  canvasEl.style.objectFit = "fill";
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

/** Opens the browser fullscreen mode. */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/** Leaves the browser fullscreen mode. */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

document.addEventListener("fullscreenchange", fullscreenchangelog);

/** Reacts when fullscreen is closed by the browser. */
function fullscreenchangelog() {
  if (!document.fullscreenElement) {
    leaveFullscreen();
  }
}

/** Resets the page after fullscreen mode. */
function leaveFullscreen() {
  if (isFullScreen) {
    removeFullscreenClasses();
    isFullScreen = false;
  }
  updateMenuBarAfterFullscreen();
}

/** Removes fullscreen CSS classes and resets the canvas size. */
function removeFullscreenClasses() {
  let fullscreen = document.getElementById("fullscreen");
  let canvasEl = document.getElementById("canvas");
  fullscreen.classList.remove("fullscreen");
  document.body.classList.remove("fullscreen-enabled");
  canvasEl.classList.remove("fullscreen");
  document.getElementById("endscreen").classList.remove("fullscreen");
  document.getElementById("mainheadline").classList.remove("d-none");
  canvasEl.style.width = "100%";
  canvasEl.style.height = "auto";
  canvasEl.style.objectFit = "initial";
  canvasEl.width = 720;
  canvasEl.height = 480;
}

/** Shows or hides the menu bar after leaving fullscreen. */
function updateMenuBarAfterFullscreen() {
  const canvasHidden = document.getElementById("canvas").classList.contains("d-none");
  const onEndscreen = !document.getElementById("endscreen").classList.contains("d-none");
  if (canvasHidden || onEndscreen) {
    showMenuBar();
  } else {
    hideMenuBar();
  }
}
