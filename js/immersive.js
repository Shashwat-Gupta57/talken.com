/* Talken — immersive layer. Vanilla, dependency-free, Pages-safe.
   Every motion-heavy effect checks prefers-reduced-motion. */
(function () {
  "use strict";
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- scroll progress spine ---------- */
  (function () {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    var tick = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    document.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
  })();

  /* ---------- reveal on scroll ---------- */
  (function () {
    var targets = $$("[data-reveal],[data-reveal-stagger]");
    if (!targets.length) return;
    if (RM || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    $$("[data-reveal-stagger]").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) {
        c.style.transitionDelay = (i * 80) + "ms";
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  })();

  /* ---------- helpers ---------- */
  function fmt(n) { return Math.round(n).toLocaleString("en-US"); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-countup"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = parseInt(el.getAttribute("data-dur") || "1500", 10);
    if (RM) { el.textContent = fmt(target) + suffix; return; }
    var start = performance.now();
    (function step(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = fmt(target * easeOut(p)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* observe count-ups + the security number + lattice + cascade so they
     fire when scrolled into view */
  (function () {
    var nums = $$("[data-countup]");
    var fire = function (el) {
      if (el.dataset.done) return; el.dataset.done = "1"; countUp(el);
    };
    if (RM || !("IntersectionObserver" in window)) { nums.forEach(fire); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { fire(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- headline scramble ---------- */
  (function () {
    var els = $$("[data-scramble]");
    if (!els.length) return;
    var glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&$@/<>{}";
    els.forEach(function (el) {
      var final = el.getAttribute("data-scramble") || el.textContent;
      var seed = el.textContent || final;
      if (RM) { el.textContent = final; return; }
      var duration = parseInt(el.getAttribute("data-scramble-duration") || "1700", 10);
      var delay = parseInt(el.getAttribute("data-scramble-delay") || "350", 10);
      var tick = 42;
      var frame = 0, total = Math.max(24, Math.round(duration / tick)), locked = false;
      // Lock the word's box to its final size so wider random glyphs can't
      // reflow the headline (1 line -> 2 lines -> 1 line jitter).
      var lock = function () {
        var clone = el.cloneNode(true);
        clone.textContent = final;
        clone.style.position = "fixed";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.display = "inline-block";
        clone.style.width = "auto";
        clone.style.whiteSpace = "nowrap";
        document.body.appendChild(clone);
        var w = Math.max(el.getBoundingClientRect().width, clone.getBoundingClientRect().width);
        document.body.removeChild(clone);
        if (!w) return;
        el.style.display = "inline-block";
        el.style.width = w + "px";
        el.style.whiteSpace = "nowrap";
        el.style.textAlign = "left";
        locked = true;
      };
      var unlock = function () {
        el.style.textAlign = "";
      };
      var run = function () {
        if (!locked) lock();
        var out = "";
        for (var i = 0; i < final.length; i++) {
          if (final[i] === " ") { out += " "; continue; }
          var settle = Math.floor((frame / total) * (final.length + 1));
          var near = i === settle && frame % 3 === 0;
          out += i < settle || near ? final[i] : (seed[i] && frame < 2 ? seed[i] : glyphs[(Math.random() * glyphs.length) | 0]);
        }
        el.textContent = out;
        if (frame++ < total) setTimeout(run, tick);
        else { el.textContent = final; unlock(); }
      };
      // start shortly after load
      setTimeout(run, delay);
    });
  })();

  /* ---------- lattice ignition sweep ---------- */
  (function () {
    var grid = $(".lattice");
    if (!grid) return;
    var COLS = 24, ROWS = 18, total = COLS * ROWS;
    var frag = document.createDocumentFragment();
    var cells = [];
    for (var i = 0; i < total; i++) { var c = document.createElement("i"); frag.appendChild(c); cells.push(c); }
    grid.appendChild(frag);
    var ignite = function () {
      if (RM) { cells.forEach(function (c, i) { c.classList.add(i % 3 ? "lit" : "dim"); }); return; }
      cells.forEach(function (c, i) {
        var x = i % COLS, y = (i / COLS) | 0;
        var delay = (x + y) * 16 + Math.random() * 120;
        setTimeout(function () { c.classList.add(Math.random() < 0.72 ? "lit" : "dim"); }, delay);
      });
    };
    if (!("IntersectionObserver" in window)) { ignite(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { ignite(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(grid);
  })();

  /* ---------- encryption cascade: hex shimmer on final ciphertext ---------- */
  (function () {
    var el = $("[data-cipher]");
    if (!el || RM) return;
    var hex = "0123456789abcdef";
    var len = parseInt(el.getAttribute("data-cipher") || "48", 10);
    var make = function () {
      var s = "";
      for (var i = 0; i < len; i++) {
        s += hex[(Math.random() * 16) | 0] + hex[(Math.random() * 16) | 0];
        if (i % 2 === 1 && i < len - 1) s += " ";
      }
      return s;
    };
    var running = false, timer;
    var loop = function () { el.textContent = make(); timer = setTimeout(loop, 90); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; loop(); }
        else if (!e.isIntersecting && running) { running = false; clearTimeout(timer); }
      });
    }, { threshold: 0.2 });
    io.observe(el);
  })();

  /* ---------- crack simulation terminal ---------- */
  (function () {
    var box = $("#crackBody");
    var btn = $("#crackRun");
    if (!box || !btn) return;
    var busy = false;
    var line = function (html, cls) {
      var d = document.createElement("div");
      d.className = "ln" + (cls ? " " + cls : "");
      d.innerHTML = html; box.appendChild(d); box.scrollTop = box.scrollHeight; return d;
    };
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, RM ? 0 : ms); }); };
    function run() {
      if (busy) return; busy = true; btn.disabled = true; box.innerHTML = "";
      var seq = Promise.resolve();
      var steps = [
        function () { line('<span class="c-teal">talken@vault</span><span class="c-dim">:~$</span> ./attack --target message.tkn --mode brute-force'); return wait(500); },
        function () { line('<span class="c-dim">[*]</span> cipher selected at random from <span class="c-num">32,768</span> · chained &amp; evolving key'); return wait(450); },
        function () { line('<span class="c-dim">[*]</span> must guess the cipher AND the chained key · space ≈ <span class="c-num">2^4096</span> · attempting…'); return wait(500); },
        function () { return spin(); },
        function () { line('<span class="c-dim">[*]</span> throughput: <span class="c-num">10^18</span> keys/sec (idealized GPU farm)'); return wait(400); },
        function () { line('<span class="c-dim">[*]</span> estimated time to break: <span class="c-num">~10^4930</span> years'); return wait(400); },
        function () { line('<span class="c-dim">[*]</span> (the universe is ~10^10 years old)'); return wait(650); },
        function () { line('<span class="c-deny">[✕] ACCESS DENIED — message remains sealed.</span>'); return wait(200); },
        function () { line('<span class="c-teal">talken@vault</span><span class="c-dim">:~$</span> <span class="crack-cursor"></span>'); return wait(0); }
      ];
      steps.forEach(function (s) { seq = seq.then(s); });
      seq.then(function () { busy = false; btn.disabled = false; });
    }
    function spin() {
      var d = line('<span class="c-dim">[*]</span> attempts: <span class="c-num" id="crackN">0</span>');
      var n = d.querySelector("#crackN");
      return new Promise(function (resolve) {
        if (RM) { n.textContent = "847,329,113,402,556"; return resolve(); }
        var v = 0, t0 = performance.now();
        (function go(now) {
          var e = (now - t0) / 1400;
          v = Math.pow(10, 4 + e * 11);
          n.textContent = fmt(v);
          if (e < 1) requestAnimationFrame(go);
          else { n.textContent = "847,329,113,402,556"; resolve(); }
        })(t0);
      });
    }
    btn.addEventListener("click", run);
  })();

  /* ---------- code rain (built-from-scratch section) ---------- */
  (function () {
    var host = $(".code-rain");
    if (!host || RM) return;
    var glyphs = "{}();=<>/*+-_abcdefghijklmnopqrstuvwxyz0123456789".split("");
    var build = function () {
      host.innerHTML = "";
      var w = host.offsetWidth || 1200;
      var cols = Math.min(40, Math.floor(w / 26));
      for (var c = 0; c < cols; c++) {
        var col = document.createElement("div");
        col.className = "col";
        col.style.left = (c / cols) * 100 + "%";
        col.style.animationDuration = (6 + Math.random() * 8) + "s";
        col.style.animationDelay = (-Math.random() * 10) + "s";
        var s = "";
        for (var r = 0; r < 30; r++) s += glyphs[(Math.random() * glyphs.length) | 0] + "\n";
        col.textContent = s;
        host.appendChild(col);
      }
    };
    build();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 250); });
  })();

  /* ---------- v2 route console pulse ---------- */
  (function () {
    var log = $("[data-network-log]");
    if (!log || RM) return;
    var lines = [
      "> finding your friend",
      "> making a private path",
      "> skipping the company server",
      "> message goes direct",
      "> private path ready"
    ];
    var i = 0;
    setInterval(function () {
      var p = document.createElement("p");
      p.textContent = lines[i++ % lines.length];
      log.appendChild(p);
      while (log.children.length > 4) log.removeChild(log.firstElementChild);
    }, 1800);
  })();

  /* ---------- v2 offline delivery timeline ---------- */
  (function () {
    var flow = $("[data-offline-flow]");
    if (!flow || RM) return;
    var steps = $$(".time-step", flow);
    if (!steps.length) return;
    var run = function () {
      var i = 0;
      steps.forEach(function (s) { s.classList.remove("is-lit"); });
      steps[0].classList.add("is-lit");
      setInterval(function () {
        steps.forEach(function (s) { s.classList.remove("is-lit"); });
        steps[i % steps.length].classList.add("is-lit");
        i++;
      }, 1400);
    };
    if (!("IntersectionObserver" in window)) { run(); return; }
    var started = false;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !started) { started = true; run(); io.disconnect(); }
      });
    }, { threshold: .4 });
    io.observe(flow);
  })();

  /* ---------- v2 cipher engine ---------- */
  (function () {
    var selector = $("[data-cipher-selector]");
    var stream = $("[data-cipher-stream]");
    if ((!selector && !stream) || RM) return;
    var hex = "0123456789abcdef";
    function bytes(n) {
      var out = "";
      for (var i = 0; i < n; i++) {
        out += hex[(Math.random() * 16) | 0] + hex[(Math.random() * 16) | 0];
        if (i < n - 1) out += " ";
      }
      return out;
    }
    function tick() {
      if (selector) selector.textContent = String(1 + ((Math.random() * 32768) | 0)).padStart(5, "0");
      if (stream) stream.textContent = bytes(18);
    }
    var timer;
    var start = function () { tick(); timer = setInterval(tick, 640); };
    var stop = function () { clearInterval(timer); };
    if (!("IntersectionObserver" in window)) { start(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: .25 });
    if (selector) io.observe(selector);
    else io.observe(stream);
  })();

  /* ---------- cursor-reactive glow on glass cards ---------- */
  (function () {
    if (RM) return;
    $$(".card,.shot,.feature-module,.control-panel,.install-card,.version-card,.founder-sigil,.flagship-grid article,.mini-projects div").forEach(function (el) {
      el.addEventListener("pointermove", function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (ev.clientX - r.left) + "px");
        el.style.setProperty("--my", (ev.clientY - r.top) + "px");
      });
    });
  })();
})();
