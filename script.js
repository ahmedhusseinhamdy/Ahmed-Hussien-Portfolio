/* ================= MOBILE NAV TOGGLE ================= */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

function setNav(open) {
  navList.classList.toggle('open', open);
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    setNav(!navList.classList.contains('open'));
  });
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNav(false));
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setNav(false);
  });
}

/* ================= LOADER ================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 2000);
});

/* ================= CUSTOM CURSOR ================= */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .chip, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });
}

/* ================= SCROLL REVEAL ================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));

/* ================= LET'S CONNECT FORM ================= */
/* Opens the visitor's mail app with the message ready to send to you. */
const connectForm = document.getElementById('connectForm');
const connectStatus = document.getElementById('connectStatus');
const MY_EMAIL = 'ahmedhussienhamdy@gmail.com';

if (connectForm) {
  connectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = connectForm.email.value.trim();
    const subject = connectForm.subject.value.trim();
    const message = connectForm.message.value.trim();

    [connectForm.email, connectForm.subject, connectForm.message]
      .forEach(f => f.classList.remove('invalid'));
    connectStatus.className = 'connect-status';

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk || !subject || !message) {
      if (!emailOk) connectForm.email.classList.add('invalid');
      if (!subject) connectForm.subject.classList.add('invalid');
      if (!message) connectForm.message.classList.add('invalid');
      connectStatus.textContent = 'Please fill in all fields with a valid email.';
      connectStatus.classList.add('error');
      return;
    }

    const body = message + '\n\n— From: ' + email;
    window.location.href = 'mailto:' + MY_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    connectStatus.textContent = 'Opening your email app… just press send.';
    connectStatus.classList.add('ok');
    connectForm.reset();
  });
}

/* ================= ABOUT TABS ================= */
const aboutTabs = document.querySelectorAll('.about-tab');
const aboutPanels = document.querySelectorAll('.about-panel');

aboutTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    aboutTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    aboutPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

/* ================= PROJECT FILTERS ================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projCards.forEach(card => {
      const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
      card.classList.toggle('hide', !show);
    });
  });
});

/* filter buttons react to the custom cursor */
if (cursorRing) {
  filterBtns.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });
}


/* ================= HIDE NAV ON SCROLL DOWN / SHOW ON SCROLL UP ================= */
const siteHeader = document.querySelector('header');
let lastScrollY = window.scrollY;
let ticking = false;

function handleHeaderScroll() {
  const y = window.scrollY;
  const menuOpen = navList && navList.classList.contains('open');

  if (y < 80 || menuOpen) {
    siteHeader.classList.remove('nav-hidden');          // top of page or menu open: always show
  } else if (y > lastScrollY + 5) {
    siteHeader.classList.add('nav-hidden');             // scrolling down: hide
  } else if (y < lastScrollY - 5) {
    siteHeader.classList.remove('nav-hidden');          // scrolling up: show
  }

  lastScrollY = y;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(handleHeaderScroll);
    ticking = true;
  }
}, { passive: true });


/* ================= HERO NAME: TYPE & ERASE LOOP ================= */
const typedName = document.getElementById('typedName');
if (typedName && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fullName = typedName.textContent.trim();
  let i = fullName.length, erasing = false;
  typedName.parentElement.setAttribute('aria-label', fullName);

  (function tick() {
    typedName.textContent = fullName.slice(0, i) || '\u200B';
    let delay = erasing ? 60 : 110;
    if (!erasing && i === fullName.length) { erasing = true; delay = 1800; }   // full name: pause
    else if (erasing && i === 0)           { erasing = false; delay = 500; }    // erased: start typing again
    else i += erasing ? -1 : 1;
    setTimeout(tick, delay);
  })();
}