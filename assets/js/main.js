/* ==========================================================================
   EvolVIT — site behaviour
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); };

  /* ---------- 1. Current year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 2. Sticky header state ---------- */
  var header = document.getElementById("header");
  var toTop = document.getElementById("totop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (toTop) toTop.classList.toggle("is-on", y > 900);
  }
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  on(toTop, "click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- 3. Mobile navigation ---------- */
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobileNav");

  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  on(burger, "click", function () {
    if (!mobileNav) return;
    var open = mobileNav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  });

  if (mobileNav) {
    Array.prototype.forEach.call(mobileNav.querySelectorAll("a"), function (a) {
      on(a, "click", closeNav);
    });
  }
  on(document, "keydown", function (e) { if (e.key === "Escape") { closeNav(); closeLightbox(); } });

  /* ---------- 4. Scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { revealObs.observe(el); });
  }

  /* ---------- 5. Stat counters ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var pad = parseInt(el.getAttribute("data-pad"), 10) || 0;
    var dur = reduceMotion ? 0 : 1100 + Math.min(target, 100) * 6;
    var start = performance.now();

    function frame(now) {
      var t = dur === 0 ? 1 : Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(target * eased);
      var text = pad ? String(val).padStart(pad, "0") : String(val);
      el.textContent = text + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(counters, countUp);
    } else {
      var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            countUp(entry.target);
            countObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(counters, function (el) { countObs.observe(el); });
    }
  }

  /* ---------- 6. Active nav link ---------- */
  var navLinks = document.querySelectorAll("#nav a[href^='#']");
  var sections = [];
  Array.prototype.forEach.call(navLinks, function (link) {
    var sec = document.querySelector(link.getAttribute("href"));
    if (sec) sections.push({ link: link, sec: sec });
  });

  if (sections.length && "IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle("is-active", s.sec === entry.target);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObs.observe(s.sec); });
  }

  /* ---------- 7. Pointer glow on cards ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
      on(card, "pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  /* ---------- 8. Seamless marquee ---------- */
  var marquee = document.getElementById("marquee");
  if (marquee && !reduceMotion) {
    marquee.innerHTML += marquee.innerHTML; // duplicate for the -50% loop
  }

  /* ---------- 9. Hero node network ---------- */
  var canvas = document.getElementById("net");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var nodes = [];
    var w = 0, h = 0, dpr = 1, raf = null, visible = true;

    function size() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.max(18, Math.min(58, Math.round((w * h) / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.7
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var linkDist = w < 700 ? 108 : 142;

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            ctx.strokeStyle = "rgba(108,123,255," + (0.2 * (1 - d / linkDist)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = i % 5 === 0 ? "rgba(46,230,197,.75)" : "rgba(150,168,255,.5)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(draw);
    }

    size();
    draw();

    var resizeTimer;
    on(window, "resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(size, 180);
    });

    // Pause the loop when the hero scrolls out of view or the tab is hidden
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting && !document.hidden;
        if (visible && !raf) raf = requestAnimationFrame(draw);
        if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
      }, { threshold: 0 }).observe(canvas);
    }
    on(document, "visibilitychange", function () {
      if (document.hidden) { visible = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }
      else { visible = true; if (!raf) raf = requestAnimationFrame(draw); }
    });
  }

  /* ---------- 10. Photo lightbox ---------- */
  var lightbox = null, lbImg = null, lbCap = null, lastFocus = null;

  function buildLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Photo viewer");
    lightbox.innerHTML =
      '<button class="lightbox__close" aria-label="Close photo">&times;</button>' +
      '<figure class="lightbox__figure"><img alt="" /><figcaption></figcaption></figure>';
    document.body.appendChild(lightbox);
    lbImg = lightbox.querySelector("img");
    lbCap = lightbox.querySelector("figcaption");

    on(lightbox, "click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lightbox__close")) closeLightbox();
    });
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-lightbox]"), function (trigger) {
    on(trigger, "click", function () {
      if (!lightbox) buildLightbox();
      var img = trigger.querySelector("img");
      lastFocus = trigger;
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.getAttribute("alt") || "";
      lbCap.textContent = trigger.getAttribute("data-caption") || img.getAttribute("alt") || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox__close").focus();
    });
  });
})();
