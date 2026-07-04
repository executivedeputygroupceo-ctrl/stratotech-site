/* StratoTech — shared behaviour for the warm-paper pages.
   No external requests, no tracking. Safe to edit. */
(function () {
  "use strict";

  // 1. Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // 2. Highlight the current page in the nav
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav] a[href]").forEach(function (a) {
    var target = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (target && target === here) {
      a.classList.remove("text-navy/70");
      a.classList.add("text-navy");
      a.setAttribute("aria-current", "page");
    }
  });

  // 3. Mobile nav toggle
  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-nav-panel]");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  // 4. Auto year in footers
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 5. Auto image loader — drop a file named in data-img into assets/images/
  //    and it appears here. The extension doesn't matter: it tries .jpg, .png,
  //    .jpeg, .webp automatically. If no matching file exists, the placeholder
  //    stays (no broken-image icons). So you never edit HTML to add photos.
  var EXTS = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP", "avif"];
  document.querySelectorAll(".imgslot[data-img]").forEach(function (fig) {
    var raw = (fig.getAttribute("data-img") || "").trim();
    if (!raw) return;
    var base = raw.replace(/\.(jpe?g|png|webp|gif|avif)$/i, ""); // strip any extension
    var i = 0;
    (function tryNext() {
      if (i >= EXTS.length) return;                    // ran out → keep placeholder
      var img = new Image();
      img.alt = fig.getAttribute("data-alt") || "";
      img.decoding = "async";
      img.onload = function () { fig.appendChild(img); };   // success → cover placeholder
      img.onerror = function () { i++; tryNext(); };        // try next extension
      img.src = "assets/images/" + base + "." + EXTS[i];
    })();
  });
})();
