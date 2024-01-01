document.addEventListener("DOMContentLoaded", () => {
  fetch("overlay.html")
    .then((r) => r.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);

      const btnExplain = document.getElementById("btn-explain");
      const overlay = document.getElementById("explanationOverlay");
      const btnClose = document.getElementById("overlay-close");

      btnExplain.addEventListener("click", () => {
        overlay.classList.add("show");
        overlay.setAttribute("aria-hidden", "false");
      });

      const closeOverlay = () => {
        overlay.classList.remove("show");
        overlay.setAttribute("aria-hidden", "true");
      };
      btnClose.addEventListener("click", closeOverlay);
    })
    .catch((err) =>
      console.error("[overlay] overlay.html konnte nicht geladen werden:", err)
    );
});
