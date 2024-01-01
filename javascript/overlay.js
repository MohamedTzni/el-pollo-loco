document.addEventListener("DOMContentLoaded", () => { 
  fetch("overlay.html")
    .then((r) => {
      if (!r.ok) throw new Error(`overlay.html ${r.status}`);
      return r.text();
    })
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
      overlay.addEventListener("click", (e) => {
        if (e.target.id === "explanationOverlay") closeOverlay();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeOverlay();
      });

      const btnImpressum = document.getElementById("btn-impressum");
      if (btnImpressum) {
        btnImpressum.addEventListener("click", () => {
          window.location.href = "impressum.html";
        });
      }
    })
    .catch((err) =>
      console.error("[overlay] Konnte overlay.html nicht laden:", err)
    );
});
