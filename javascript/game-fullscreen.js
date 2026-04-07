// ---- Functions for fullscreen functionality ----

function toggleFullscreen() {
  let fullscreen = document.getElementById("fullscreen");
  let body = document.body;
  let canvasEl = document.getElementById("canvas");

  if (!isFullScreen) {
    fullscreen.classList.add("fullscreen");
    body.classList.add("fullscreen-enabled");
    canvasEl.classList.add("fullscreen");
    document.getElementById("endscreen").classList.add("fullscreen");
    document.getElementById("mainheadline").classList.add("d-none");

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    canvasEl.style.width = "100vw";
    canvasEl.style.height = "100vh";
    canvasEl.style.objectFit = "fill";

    enterFullscreen(fullscreen);
    isFullScreen = true;

    hideMenuBar();
  } else {
    leaveFullscreen();
  }
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
    let fullscreen = document.getElementById("fullscreen");
    fullscreen.classList.remove("fullscreen");
    document.body.classList.remove("fullscreen-enabled");
    let canvasEl = document.getElementById("canvas");
    canvasEl.classList.remove("fullscreen");
    document.getElementById("endscreen").classList.remove("fullscreen");
    document.getElementById("mainheadline").classList.remove("d-none");

    canvasEl.style.width = "100%";
    canvasEl.style.height = "auto";
    canvasEl.style.objectFit = "initial";

    canvasEl.width = 720;
    canvasEl.height = 480;
    isFullScreen = false;
  }

  const canvasHidden = document.getElementById("canvas").classList.contains("d-none");
  const onEndscreen  = !document.getElementById("endscreen").classList.contains("d-none");
  if (canvasHidden || onEndscreen) {
    showMenuBar();
  } else {
    hideMenuBar();
  }
}
