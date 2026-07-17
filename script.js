/* Abolfazl Sajadi — CV site v4 ("Dark silicon — signal path, hardened")
   Progressive enhancement only: all content is fully readable without JS.
   Shared by index.html and the thesis-*.html subpages: every block guards
   for the elements it needs. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- Theme toggle (persisted; respects prefers-color-scheme) ---------- */
  var themeBtn = document.querySelector('.theme-btn');

  function currentTheme() {
    var forced = root.getAttribute('data-theme');
    if (forced === 'light' || forced === 'dark') return forced;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function updateThemeBtn() {
    if (!themeBtn) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      updateThemeBtn();
    });
    updateThemeBtn();
    if (prefersDark.addEventListener) {
      prefersDark.addEventListener('change', function () {
        var stored = null;
        try { stored = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
        if (stored !== 'dark' && stored !== 'light') root.removeAttribute('data-theme');
        updateThemeBtn();
      });
    }
  }

  /* ---------- Mobile menu ---------- */
  var head = document.querySelector('.site-head');
  var menuBtn = document.querySelector('.menu-btn');
  var navList = document.getElementById('nav-list');

  if (head && menuBtn && navList) {
    menuBtn.addEventListener('click', function () {
      var open = head.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        head.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && head.classList.contains('nav-open')) {
        head.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  /* ---------- Active-section highlight (same-page anchors only) ---------- */
  var navLinks = navList ? Array.prototype.slice.call(navList.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var activeId = null;
    var setActive = function (id) {
      if (id === activeId) return;
      activeId = id;
      navLinks.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var visible = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      var best = null;
      var bestRatio = 0;
      sections.forEach(function (sec) {
        var r = visible.get(sec.id) || 0;
        if (r > bestRatio) { bestRatio = r; best = sec.id; }
      });
      if (best) setActive(best);
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75] });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal (synchronous for in-viewport elements) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (revealEls.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      root.classList.add('js-anim');
      /* Show anything already in the viewport immediately — no first-paint flash */
      var vh = window.innerHeight || root.clientHeight;
      revealEls = revealEls.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) {
          el.classList.add('in');
          return false;
        }
        return true;
      });
      if (revealEls.length) {
        var revealer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              revealer.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        revealEls.forEach(function (el) { revealer.observe(el); });
      }
      if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener('change', function (e) {
          if (e.matches) {
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
          }
        });
      }
    }
  }

  /* ---------- Waveform separators + decor animation gating ----------
     Mandatory refinement: each section separator is a waveform-viewer row
     whose square-wave trace runs like a live clock while the section is in
     the viewport (.live) and idles out of view. The same observer parks the
     perpetual hero/floorplan/CPA animations when their block is off-screen
     (.anim-idle -> animation-play-state: paused). Reduced motion keeps
     everything static via the global reduced-motion rules. */
  var waveTargets = Array.prototype.slice.call(
    document.querySelectorAll('.sec-rule, .hero-bg, .floorplan, .cpa-divider')
  );
  if ('IntersectionObserver' in window && waveTargets.length) {
    var waveObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target.classList.contains('sec-rule')) {
          entry.target.classList.toggle('live', entry.isIntersecting);
        } else {
          entry.target.classList.toggle('anim-idle', !entry.isIntersecting);
        }
      });
    }, { rootMargin: '60px 0px 60px 0px' });
    waveTargets.forEach(function (el) { waveObs.observe(el); });
  }

  /* ---------- Collapse progressive-enhancement <details> ----------
     Shipped open so no-JS visitors (and no-JS printing) never lose the
     content; collapsed here for the interactive experience. beforeprint
     re-expands below. */
  Array.prototype.slice.call(document.querySelectorAll('details[data-collapse]'))
    .forEach(function (d) { d.open = false; });

  /* ---------- Security layer: slowly flipping binary streams ----------
     Populates the .bin-col columns with 0/1 characters and occasionally
     flips a couple of bits. Text-node updates only (no layout change:
     monospace glyphs, fixed count), throttled to ~1 flip/second, paused
     when the tab is hidden or reduced motion is requested. */
  var binHost = document.querySelector('.binstream');
  if (binHost) {
    var cols = Array.prototype.slice.call(binHost.querySelectorAll('.bin-col'));
    var ROWS = 26;
    var colBits = cols.map(function (col) {
      var bits = [];
      for (var i = 0; i < ROWS; i++) bits.push(Math.random() < 0.5 ? '0' : '1');
      col.textContent = bits.join('\n');
      return bits;
    });

    var binTimer = null;
    function flipOnce() {
      var c = Math.floor(Math.random() * colBits.length);
      var flips = 1 + Math.floor(Math.random() * 2);
      for (var i = 0; i < flips; i++) {
        var r = Math.floor(Math.random() * ROWS);
        colBits[c][r] = colBits[c][r] === '0' ? '1' : '0';
      }
      cols[c].textContent = colBits[c].join('\n');
      binTimer = window.setTimeout(flipOnce, 650 + Math.random() * 900);
    }
    function startBin() {
      if (binTimer === null && !reduceMotion.matches && !document.hidden) {
        binTimer = window.setTimeout(flipOnce, 800);
      }
    }
    function stopBin() {
      if (binTimer !== null) {
        window.clearTimeout(binTimer);
        binTimer = null;
      }
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopBin(); else startBin();
    });
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', function (e) {
        if (e.matches) stopBin(); else startBin();
      });
    }
    startBin();
  }

  /* ---------- Security layer: one-shot hex "decrypt" of every [data-scramble] ----------
     Runs on the hero eyebrow AND both portrait-caption lines; each element is
     staggered slightly and resolves to its real text (which stays the accessible
     content). Skipped entirely under reduced motion. */
  var scrambleEls = Array.prototype.slice.call(document.querySelectorAll('[data-scramble]'));
  if (scrambleEls.length && !reduceMotion.matches && 'requestAnimationFrame' in window) {
    var HEX = '0123456789abcdef';
    scrambleEls.forEach(function (el, idx) {
      var finalText = el.textContent;
      var start = null;
      var DURATION = 1100;
      var DELAY = idx * 260;
      var step = function (ts) {
        if (start === null) start = ts;
        var elapsed = ts - start - DELAY;
        var t = elapsed <= 0 ? 0 : Math.min(1, elapsed / DURATION);
        var solved = Math.floor(t * finalText.length);
        var out = finalText.slice(0, solved);
        for (var i = solved; i < finalText.length; i++) {
          var ch = finalText[i];
          out += (ch === ' ' ? ' ' : HEX[Math.floor(Math.random() * 16)]);
        }
        el.textContent = out;
        if (t < 1) window.requestAnimationFrame(step);
        else el.textContent = finalText;
      };
      window.requestAnimationFrame(step);
    });
  }

  /* ---------- Print: expand collapsed details so content is not lost ---------- */
  var detailsEls = Array.prototype.slice.call(document.querySelectorAll('details'));
  if (detailsEls.length && 'onbeforeprint' in window) {
    var wasOpen = [];
    window.addEventListener('beforeprint', function () {
      wasOpen = detailsEls.map(function (d) { return d.open; });
      detailsEls.forEach(function (d) { d.open = true; });
    });
    window.addEventListener('afterprint', function () {
      detailsEls.forEach(function (d, i) { d.open = wasOpen[i]; });
    });
  }
})();
