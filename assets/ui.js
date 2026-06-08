/* ============================================================================
   Datasulus UI — поведение контента страниц: табы, карусель, аккордеон, reveal,
   модалки (demo / stub / newsletter), языковой переключатель.
   Vanilla IIFE, без зависимостей. Работает поверх chrome из site.js.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- модалки --------------------------------------------------------- */
  function open(id) { var m = document.getElementById(id); if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function close(m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  function openDemo() {
    open('demoModal');
    var f = document.getElementById('demoForm'), ok = document.getElementById('demoOk');
    if (f && ok) { f.style.display = ''; ok.style.display = 'none'; }
  }
  function openStub(kind) {
    var map = {
      legal: ['Юридические документы', 'Политика конфиденциальности, условия и cookie готовятся к публикации. Это прототип лендинга.'],
      social: ['Соцсети скоро', 'Официальные аккаунты Datasulus появятся к публичному запуску.'],
      app: ['Личный кабинет', 'Вход в платформу открывается клиентам в раннем доступе. Запросите демо, чтобы получить доступ.']
    };
    var t = map[kind] || ['Раздел в подготовке', 'Этот раздел появится в следующей версии прототипа.'];
    var ti = document.getElementById('stubTitle'), tx = document.getElementById('stubText');
    if (ti) ti.textContent = t[0];
    if (tx) tx.textContent = t[1];
    open('stubModal');
  }
  window.openDemo = openDemo;

  document.addEventListener('click', function (e) {
    var t = e.target;
    var demo = t.closest('[data-demo]');
    if (demo) { e.preventDefault(); openDemo(); return; }
    var stub = t.closest('[data-stub]');
    if (stub) { e.preventDefault(); openStub(stub.getAttribute('data-stub')); return; }
    var ov = t.closest('.modal-overlay');
    if (t.closest('[data-close]')) { if (ov) close(ov); return; }
    if (t.classList && t.classList.contains('modal-overlay')) close(t);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(close);
  });

  /* ---- формы (demo + newsletter) → прототипный success ----------------- */
  document.addEventListener('submit', function (e) {
    if (e.target.id === 'demoForm') {
      e.preventDefault();
      var f = document.getElementById('demoForm'), ok = document.getElementById('demoOk');
      if (f && ok) { f.style.display = 'none'; ok.style.display = 'block'; }
    }
    if (e.target.id === 'newsletterForm') {
      e.preventDefault();
      e.target.style.display = 'none';
      var d = document.getElementById('newsletterDone'); if (d) d.style.display = 'block';
    }
  });

  /* ---- табы (data-tabs / data-tab / data-panel) ------------------------ */
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('[data-tab]');
    if (!tab) return;
    var scope = tab.closest('[data-tabs]'); if (!scope) return;
    var key = tab.getAttribute('data-tab');
    scope.querySelectorAll('[data-tab]').forEach(function (t) { t.classList.toggle('on', t === tab); });
    scope.querySelectorAll('[data-panel]').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-panel') === key); });
  });

  /* ---- аккордеон (FAQ) ------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var q = e.target.closest('.faq-q');
    if (!q) return;
    var item = q.closest('.faq-item'); if (!item) return;
    var openNow = item.classList.contains('is-open');
    var scope = item.closest('.faq');
    if (scope) scope.querySelectorAll('.faq-item.is-open').forEach(function (i) { i.classList.remove('is-open'); i.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); });
    if (!openNow) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
  });

  /* ---- карусель (data-carousel) ---------------------------------------- */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (car) {
      var track = car.querySelector('.carousel-track');
      if (!track) return;
      var slides = track.children.length;
      var idx = 0;
      var dotsWrap = car.querySelector('.carousel-dots');
      if (dotsWrap && !dotsWrap.children.length) {
        for (var i = 0; i < slides; i++) {
          var b = document.createElement('button');
          b.setAttribute('aria-label', 'Слайд ' + (i + 1));
          if (i === 0) b.className = 'on';
          dotsWrap.appendChild(b);
        }
      }
      function go(n) {
        idx = (n + slides) % slides;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        if (dotsWrap) Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.classList.toggle('on', i === idx); });
      }
      car.addEventListener('click', function (e) {
        if (e.target.closest('.next')) go(idx + 1);
        else if (e.target.closest('.prev')) go(idx - 1);
        else if (e.target.closest('.carousel-dots button')) {
          var ds = Array.prototype.indexOf.call(dotsWrap.children, e.target.closest('button'));
          if (ds > -1) go(ds);
        }
      });
      var timer = setInterval(function () { go(idx + 1); }, 6000);
      car.addEventListener('mouseenter', function () { clearInterval(timer); });
    });
  }

  /* ---- язык (визуальный) ----------------------------------------------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lang button'); if (!b) return;
    b.parentElement.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
  });

  /* ---- scroll reveal --------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (el) { el.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function boot() { initCarousels(); initReveal(); }
  // site.js рендерит chrome на DOMContentLoaded; контент в разметке доступен сразу
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
