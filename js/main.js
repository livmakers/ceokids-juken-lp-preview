(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var C = window.LP_CONFIG || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // frame-busting(meta CSPでは frame-ancestors が効かないため)
  if (window.top !== window.self) {
    try { window.top.location = window.location.href; } catch (e) { document.body.innerHTML = ""; }
  }

  /* ---- 設定値の反映(CTA URL・料金・講座データ) ---- */
  if (C.cta) {
    document.querySelectorAll("[data-cta]").forEach(function (a) {
      var url = C.cta[a.getAttribute("data-cta")];
      if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    });
  }
  var yen = function (n) { return Number(n).toLocaleString("ja-JP"); };
  if (C.price) {
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var v = C.price[el.getAttribute("data-price")];
      if (v != null) el.textContent = yen(v);
    });
  }
  if (C.course) {
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var v = C.course[el.getAttribute("data-bind")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-key]").forEach(function (el) {
      var v = C.course[el.getAttribute("data-key")];
      if (v != null) el.setAttribute("data-count", v);
    });
  }

  /* ---- ヒーロー見出し:文字単位フェードイン ---- */
  var h1 = document.querySelector(".hero__title");
  if (!reduce && h1) {
    var i = 0;
    h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, ""));
    document.querySelectorAll(".split").forEach(function (line) {
      var text = line.textContent;
      line.textContent = "";
      Array.from(text).forEach(function (ch) {
        var s = document.createElement("span");
        s.className = "ch";
        s.setAttribute("aria-hidden", "true");
        s.textContent = ch;
        s.style.animationDelay = (0.15 + i * 0.05) + "s";
        line.appendChild(s);
        i++;
      });
    });
  }

  /* ---- ヘッダー状態・ヘッダーCTA出現・SP固定CTA ---- */
  var hd = document.querySelector(".hd");
  var sticky = document.querySelector(".sticky");
  var hero = document.querySelector(".hero");
  var finalSec = document.querySelector(".final");
  var tl = document.querySelector("[data-timeline]");
  var photo = document.querySelector("[data-parallax]");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var heroH = hero ? hero.offsetHeight : vh;
    hd.classList.toggle("is-scrolled", y > 10);
    hd.classList.toggle("show-cta", y > heroH * 0.6);
    if (sticky) {
      var nearEnd = finalSec && finalSec.getBoundingClientRect().top < vh;
      sticky.classList.toggle("is-on", y > heroH * 0.6 && !nearEnd);
    }
    // タイムラインの線がスクロール量に応じて伸びる
    if (tl) {
      var r = tl.getBoundingClientRect();
      var p = (vh * 0.75 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      tl.style.setProperty("--tl", (p * 100).toFixed(1) + "%");
    }
    // 写真の軽いパララックス
    if (photo && !reduce && y < heroH) {
      photo.style.transform = "translate3d(0," + (y * 0.12).toFixed(1) + "px,0)";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- フェード/スライドイン・ロードマップ・カウントアップ ---- */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = to; return; }
    var start = null, dur = 1200;
    function step(t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) window.requestAnimationFrame(step);
    }
    el.textContent = "0";
    window.requestAnimationFrame(step);
  }

  var targets = document.querySelectorAll(".reveal, [data-roadmap], [data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.hasAttribute("data-count")) countUp(el);
        else el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
