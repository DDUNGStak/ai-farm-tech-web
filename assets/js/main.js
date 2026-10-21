(function () {
  var cfg = window.SITE_CONFIG || { links: {}, company: {} };
  var root = document.documentElement;
  root.classList.add('js');

  // 외부 링크 주소 채우기 (config.js 의 links)
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var url = cfg.links[el.getAttribute('data-link')];
    if (url) {
      el.setAttribute('href', url);
      el.hidden = false;
    } else if (el.hasAttribute('data-optional')) {
      el.hidden = true;
    }
  });

  // 회사 정보 채우기 (config.js 의 company)
  document.querySelectorAll('[data-company]').forEach(function (el) {
    var key = el.getAttribute('data-company');
    var value = cfg.company[key];
    if (!value) {
      if (el.hasAttribute('data-optional')) el.hidden = true;
      return;
    }
    var target = el.querySelector('[data-value]') || el;
    target.textContent = value;
    el.hidden = false;
    if (key === 'email' && el.tagName === 'A') el.setAttribute('href', 'mailto:' + value);
  });

  // 문의 메일 버튼: 제목 미리 채움
  document.querySelectorAll('[data-mailto]').forEach(function (el) {
    if (!cfg.company.email) return;
    var subject = encodeURIComponent(el.getAttribute('data-mailto') || '');
    el.setAttribute('href', 'mailto:' + cfg.company.email + (subject ? '?subject=' + subject : ''));
  });

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 헤더: 스크롤 시 배경 고정
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 모바일 메뉴
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      // 공지 바가 보이는 위치에서도 메뉴가 헤더 바로 아래에서 열리도록
      if (open && header) root.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      root.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // 스크롤 등장 효과 (JS·IntersectionObserver 없으면 그냥 보임)
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
