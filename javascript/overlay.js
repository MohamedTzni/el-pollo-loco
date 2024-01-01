document.addEventListener("DOMContentLoaded", () => {
  fetch("overlay.html")
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
    })
    .catch((err) => console.error("[overlay] overlay.html konnte nicht geladen werden:", err));
});
