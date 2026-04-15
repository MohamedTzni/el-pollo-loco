document.addEventListener("DOMContentLoaded", () => {
  fetch("overlay.html")
    .then((response) => {
      if (!response.ok) throw new Error(`overlay.html ${response.status}`);
      return response.text();
    })
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      bindOverlayButton("btn-explain", "explanationOverlay");
      bindOverlayButton("btn-impressum", "impressumOverlay");
      bindOverlayCloseEvents();
    })
    .catch(() => {});
});

/** Connects one button with one overlay. */
function bindOverlayButton(buttonId, overlayId) {
  const button = document.getElementById(buttonId);
  const overlay = document.getElementById(overlayId);
  if (!button || !overlay) return;

  button.addEventListener("click", () => openOverlay(overlay));
}

/** Adds all close events for the overlays. */
function bindOverlayCloseEvents() {
  document.querySelectorAll("[data-close-overlay]").forEach((button) => {
    button.addEventListener("click", () => closeOverlay(button.closest(".overlay")));
  });

  document.querySelectorAll(".overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeOverlay(overlay);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllOverlays();
  });
}

/** Opens one overlay. */
function openOverlay(overlay) {
  closeAllOverlays();
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

/** Closes one overlay. */
function closeOverlay(overlay) {
  if (!overlay) return;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

/** Closes all open overlays. */
function closeAllOverlays() {
  document.querySelectorAll(".overlay.show").forEach(closeOverlay);
}
