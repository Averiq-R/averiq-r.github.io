/* AVERIQ — shared site behaviour */
(function () {
  'use strict';

  // ---- year in footer ----
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---- mobile nav ----
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  // ---- scroll reveal ----
  var items = document.querySelectorAll('.reveal');
  if (items.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  // ---- contact form ----
  // The form only posts anywhere once a real Formspree endpoint is set on the
  // <form action="...">. Until then we do NOT pretend it was sent: we hand the
  // message to the visitor's own email client instead.
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') === -1 && action.indexOf('formspree.io/f/') !== -1) {
        return; // real endpoint configured — let it post normally
      }
      e.preventDefault();
      var get = function (n) {
        var f = form.elements[n];
        return f ? String(f.value || '').trim() : '';
      };
      var subject = '[AVERIQ enquiry] ' + (get('category') || 'General') +
                    (get('subject') ? ' — ' + get('subject') : '');
      var body = 'Name: ' + get('name') + '\n' +
                 'Email: ' + get('email') + '\n' +
                 'Enquiry type: ' + get('category') + '\n\n' +
                 get('message');
      window.location.href = 'mailto:mohammedshukurresearch@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }
})();

/* ---- services mega-menu (click/tap support alongside CSS hover) ---- */
(function () {
  'use strict';
  var mega = document.querySelector('.has-mega');
  if (!mega) return;
  var btn = mega.querySelector('.mega-toggle');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = mega.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', function (e) {
    if (!mega.contains(e.target)) {
      mega.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      mega.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ---- open the service accordion named in the URL hash ---- */
(function () {
  'use strict';
  function openFromHash() {
    var id = (location.hash || '').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === 'DETAILS') {
      el.open = true;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
