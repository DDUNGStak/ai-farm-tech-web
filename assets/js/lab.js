/*
 * 연구소(Lab) 테마 움직임 — index.html 전용 (main.js 다음에 로드)
 *  1) 연구 현장 섹션 빛줄기 배경 (canvas)
 *  2) 핵심 숫자 카운트업
 *  3) 인삼 부위별 활용 지도 (부위 선택 · 자동 순환)
 * '동작 줄이기' 설정이면 움직임 없이 최종 화면만 보여 줍니다.
 */
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function whenVisible(el, cb, threshold) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      cb(entries[0].isIntersecting);
    }, { threshold: threshold || 0 }).observe(el);
  }

  /* ---------- 1) 빛줄기 배경 ----------
   * 가운데로 모인 가는 빛줄기들이 천천히 흔들리고, 포인터가 지나가면 물결처럼 튕깁니다. */
  (function beams() {
    var canvas = document.querySelector('.beam-sweep');
    if (!canvas || !canvas.getContext) return;
    var host = canvas.parentElement;
    var ctx = canvas.getContext('2d');

    // 색·세기 조절은 여기서
    var GLOW = '111, 216, 168';   // 번짐 색 (--signal)
    var CORE = '205, 255, 232';   // 빛줄기 심지 색
    var STEP = 10;                // 세로 샘플 간격(px) — 작을수록 매끄럽고 무거움

    var W = 0, H = 0, beams = [];
    var pointer = { x: 0, y: 0, on: false, power: 0 };
    var running = false, start = performance.now();

    function rand(a, b) { return a + Math.random() * (b - a); }

    function setup() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = W < 640 ? 28 : 52;
      beams = [];
      for (var i = 0; i < count; i++) {
        // 세 난수의 평균 → 가운데로 몰린 분포
        var offset = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
        beams.push({
          x: W * (0.5 + offset * 0.42),
          tilt: rand(-0.12, 0.12),     // 위아래로 갈수록 벌어지는 정도
          amp: rand(3, 12),
          waves: rand(0.6, 2.2),       // 한 줄에 들어가는 흔들림 수
          speed: rand(0.25, 0.9),
          phase: rand(0, Math.PI * 2),
          bright: rand(0.3, 1),
          side: Math.random() < 0.5 ? -1 : 1
        });
      }
    }

    function frame(now) {
      var t = (now - start) / 1000;
      pointer.power += ((pointer.on ? 1 : 0) - pointer.power) * 0.06;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      for (var i = 0; i < beams.length; i++) {
        var b = beams[i];
        ctx.beginPath();
        for (var y = -STEP; y <= H + STEP; y += STEP) {
          var x = b.x + b.tilt * (y - H * 0.35)
            + Math.sin((y / H) * b.waves * Math.PI * 2 + t * b.speed + b.phase) * b.amp;
          if (pointer.power > 0.01) {
            // 포인터에서 멀어질수록 늦게·약하게 퍼지는 물결
            var dx = x - pointer.x, dy = y - pointer.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            x += b.side * Math.sin(d * 0.035 - t * 7) * 22 * Math.exp(-d / 180) * pointer.power;
          }
          if (y === -STEP) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(' + GLOW + ',' + (0.07 * b.bright) + ')';
        ctx.lineWidth = 9;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(' + CORE + ',' + (0.5 * b.bright) + ')';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      if (running) requestAnimationFrame(frame);
    }

    function play(on) {
      if (still) { if (on) frame(start); return; }
      if (on && !running) { running = true; requestAnimationFrame(frame); }
      running = on;
    }

    setup();
    window.addEventListener('resize', function () {
      setup();
      if (!running) frame(performance.now());
    });
    host.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = pointer.y >= 0 && pointer.y <= H;
    });
    host.addEventListener('pointerleave', function () { pointer.on = false; });
    whenVisible(canvas, play);
  })();

  /* ---------- 2) 핵심 숫자 카운트업 ("3~5배" → 0~0에서 3~5까지) ----------
   * 화면에 처음 들어오는 순간 시작. 그 전까지는 원래 숫자 그대로 둡니다(검색엔진·스크롤 건너뜀 대비). */
  if (!still) {
    document.querySelectorAll('.facts .v').forEach(function (el) {
      var node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      var text = node.nodeValue;
      var done = false;
      whenVisible(el, function (on) {
        if (!on || done) return;
        done = true;
        var t0 = performance.now(), dur = 1400;
        (function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          node.nodeValue = text.replace(/\d+/g, function (n) { return Math.round(n * e); });
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    });
  }

  /* ---------- 3) 인삼 부위별 활용 지도 ---------- */
  (function useMap() {
    var map = document.querySelector('.usemap');
    if (!map) return;
    var order = ['berry', 'leaf', 'root', 'fine'];
    var current = 'root';
    var items = map.querySelectorAll('[data-part], [data-panel], [data-for]');
    var timer = 0, auto = !still;

    function select(part) {
      current = part;
      items.forEach(function (el) {
        var keys = (el.getAttribute('data-part') || el.getAttribute('data-panel') || el.getAttribute('data-for')).split(' ');
        var on = keys.indexOf(part) > -1;
        el.classList.toggle('is-on', on);
        if (el.tagName === 'BUTTON') el.setAttribute('aria-pressed', String(on));
      });
    }

    function stopAuto() {
      auto = false;
      clearInterval(timer);
      map.classList.remove('is-running');
    }

    map.addEventListener('click', function (e) {
      var el = e.target.closest('[data-part]');
      if (!el) return;
      stopAuto();
      select(el.getAttribute('data-part'));
    });

    select(current);
    if (auto) {
      whenVisible(map, function (on) {
        clearInterval(timer);
        // is-running 동안 선택된 버튼 아래 진행 막대가 4.5초에 걸쳐 찹니다 (CSS)
        map.classList.toggle('is-running', on && auto);
        if (on && auto) {
          timer = setInterval(function () {
            select(order[(order.indexOf(current) + 1) % order.length]);
          }, 4500);
        }
      }, 0.35);
    }
  })();
})();
