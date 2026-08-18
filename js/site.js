/* Talken site — nav, scroll reveals, and the home-page "screen recording" demo.
   No dependencies. Everything degrades to a sensible static state. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= mobile nav ================= */
  var burger = document.getElementById('navBurger');
  if (burger) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-sheet a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* optional images: real photos when present, letter/gradient fallbacks otherwise */
  document.querySelectorAll('img[data-optional]').forEach(function (img) {
    img.addEventListener('error', function () { img.remove(); });
    if (img.complete && img.naturalWidth === 0) img.remove();
  });

  /* ================= scroll reveals ================= */
  var revealed = document.querySelectorAll('[data-reveal]');
  if (revealed.length && 'IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealed.forEach(function (el) { ro.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* ================= the message race ================= */
  (function () {
    var race = document.getElementById('race');
    if (!race) return;
    var input = document.getElementById('raceInput');
    var sendBtn = document.getElementById('raceSend');
    var bubbleA = document.getElementById('bubbleA');
    var bubbleB = document.getElementById('bubbleB');
    var server = document.getElementById('serverStation');
    var lockSt = document.getElementById('lockStation');
    var stack = document.getElementById('copyStack');
    var countEl = document.getElementById('copyCount');
    var copies = 0, racing = false;

    function text() {
      var t = (input.value || '').trim() || 'my passport scan';
      return t.length > 28 ? t.slice(0, 27) + '\u2026' : t;
    }
    function setBubbles(t) {
      bubbleA.textContent = t;
      bubbleB.querySelector('span').textContent = t;
    }
    function addCopy(t) {
      copies++;
      countEl.textContent = copies;
      var chip = document.createElement('span');
      chip.className = 'copy-chip';
      chip.textContent = 'copy kept \u00b7 ' + t;
      if (stack.children.length >= 3) stack.removeChild(stack.firstChild);
      stack.appendChild(chip);
      requestAnimationFrame(function () { requestAnimationFrame(function () { chip.classList.add('on'); }); });
    }
    function run() {
      if (racing) return;
      racing = true;
      var t = text();
      setBubbles(t);
      /* reset to the start */
      [bubbleA, bubbleB].forEach(function (b) {
        b.classList.remove('go', 'pop');
        b.style.transition = 'none';
        b.style.left = '7%';
        void b.offsetWidth;
        b.style.transition = '';
      });
      if (reduceMotion) { /* static outcome, no travel */
        bubbleA.classList.add('go'); bubbleB.classList.add('go');
        bubbleA.style.left = '70%'; bubbleB.style.left = '70%';
        addCopy(t);
        racing = false;
        return;
      }
      bubbleA.classList.add('go');
      bubbleB.classList.add('go');
      /* lane B: sealed and straight across */
      setTimeout(function () { lockSt.classList.add('snap'); }, 150);
      setTimeout(function () { lockSt.classList.remove('snap'); }, 650);
      setTimeout(function () { bubbleB.style.left = '72%'; }, 200);
      setTimeout(function () { bubbleB.classList.add('pop'); }, 1300);
      setTimeout(function () { bubbleB.classList.remove('pop'); bubbleB.classList.remove('go'); }, 2400);
      /* lane A: stops at the server, leaves a copy behind */
      setTimeout(function () { bubbleA.style.left = '40%'; }, 200);
      setTimeout(function () { server.classList.add('flash'); addCopy(t); }, 1300);
      setTimeout(function () { server.classList.remove('flash'); bubbleA.style.left = '72%'; }, 2150);
      setTimeout(function () { bubbleA.classList.add('pop'); }, 3200);
      setTimeout(function () { bubbleA.classList.remove('pop'); bubbleA.classList.remove('go'); racing = false; }, 4000);
    }
    sendBtn.addEventListener('click', run);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    /* play once by itself when the section scrolls into view */
    if ('IntersectionObserver' in window && !reduceMotion) {
      var seen = false;
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !seen) { seen = true; setTimeout(run, 500); rio.disconnect(); }
        });
      }, { threshold: 0.45 });
      rio.observe(race);
    } else {
      run();
    }
  })();

  /* ================= demo ================= */
  var stage = document.getElementById('demoStage');
  if (!stage) return;

  var frame = document.getElementById('demoScale');
  var cursor = document.getElementById('demoCursor');
  var caption = document.getElementById('demoCaption');
  var BASE_W = 760, BASE_H = 470, scale = 1;

  function fit() {
    scale = Math.min(1, frame.clientWidth / BASE_W);
    stage.style.transform = 'scale(' + scale + ')';
    frame.style.height = (BASE_H * scale) + 'px';
  }
  fit();
  window.addEventListener('resize', fit);

  function say(text) { caption.textContent = text; }

  /* cursor moves to the centre of a live element, in unscaled stage coordinates */
  function moveTo(sel, dx, dy) {
    var t = stage.querySelector(sel);
    if (!t) return;
    var tr = t.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    cursor.style.left = ((tr.left - sr.left + tr.width / 2) / scale + (dx || 0)) + 'px';
    cursor.style.top = ((tr.top - sr.top + tr.height / 2) / scale + (dy || 0)) + 'px';
  }
  function click() {
    cursor.classList.remove('click');
    void cursor.offsetWidth; /* restart the ripple */
    cursor.classList.add('click');
  }

  function resetState() {
    stage.dataset.scene = 'chat';
    stage.classList.remove('uploading', 'uploaded', 'toast');
    var gear = stage.querySelector('.d-gear'); if (gear) gear.classList.remove('hl');
    var acc = stage.querySelector('.d-acc'); if (acc) acc.classList.remove('hl');
    cursor.style.left = '390px'; cursor.style.top = '330px';
  }

  /* the recording, as a list of [delay-before, action] steps */
  var steps = [
    [400,  function () { resetState(); say('This is Talken — your chats, on your desktop.'); }],
    [1900, function () { say('First, connect a Google Drive. Your photos and files will live there — not on our servers.'); moveTo('.d-gear'); }],
    [1300, function () { click(); stage.querySelector('.d-gear').classList.add('hl'); }],
    [340,  function () { stage.dataset.scene = 'settings'; }],
    [900,  function () { moveTo('.d-connect-btn'); }],
    [1300, function () { click(); }],
    [340,  function () { stage.dataset.scene = 'picker'; say('Pick your Google account…'); }],
    [800,  function () { moveTo('.d-acc'); }],
    [1200, function () { stage.querySelector('.d-acc').classList.add('hl'); click(); }],
    [400,  function () { stage.dataset.scene = 'connected'; stage.classList.add('toast');
                         say('Done. Your Drive is connected — everything you share stays inside it.'); }],
    [2300, function () { stage.classList.remove('toast'); moveTo('.d-back'); }],
    [1300, function () { click(); }],
    [340,  function () { stage.dataset.scene = 'chat'; say('Now send the whole wedding shoot — 4.2 GB, as it is.'); }],
    [700,  function () { moveTo('.d-attach'); }],
    [1300, function () { click(); }],
    [500,  function () { stage.classList.add('uploading'); say('It uploads to your own Drive — no size caps from us, no shrinking…'); moveTo('.d-send'); }],
    [2100, function () { stage.classList.remove('uploading'); stage.classList.add('uploaded');
                         say('…and Ananya gets it straight from your Drive. Full quality, no expiry links.'); }],
    [3200, function () { /* loop */ }]
  ];

  var running = false, timer = null, idx = 0;
  function tick() {
    if (!running) return;
    var s = steps[idx];
    timer = setTimeout(function () {
      s[1]();
      idx = (idx + 1) % steps.length;
      tick();
    }, s[0]);
  }
  function start() { if (running) return; running = true; idx = 0; tick(); }
  function stop() { running = false; clearTimeout(timer); }

  if (reduceMotion) {
    /* static final frame: Drive connected, photo delivered */
    resetState();
    stage.classList.add('uploaded');
    cursor.style.display = 'none';
    say('Even a 4 GB file sends whole — through your own Google Drive, never our servers.');
    return;
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.25 });
    io.observe(stage);
  } else {
    start();
  }
})();
