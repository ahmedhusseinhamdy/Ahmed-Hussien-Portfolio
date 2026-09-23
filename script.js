/* ================= LOADER ================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 2000);
});

/* ================= CUSTOM CURSOR ================= */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing(){
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .chip, .proj-card, .tl-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
});

/* ================= PARTICLE NETWORK ================= */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles;
const COLORS = ['#4f46e5', '#ec4899', '#22d3ee', '#f5a623'];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function initParticles(){
  const count = Math.min(90, Math.floor((W*H)/16000));
  particles = Array.from({length: count}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    vx: (Math.random()-0.5)*0.35,
    vy: (Math.random()-0.5)*0.35,
    r: Math.random()*1.8+1,
    color: COLORS[Math.floor(Math.random()*COLORS.length)]
  }));
}
initParticles();
window.addEventListener('resize', initParticles);

function drawParticles(){
  ctx.clearRect(0,0,W,H);
  for(let p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0 || p.x > W) p.vx *= -1;
    if(p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 130){
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = a.color;
        ctx.globalAlpha = (1 - dist/130) * 0.25;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ================= SCROLL REVEAL ================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
    }
  });
}, {threshold:0.15});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ================= SKILL BARS ================= */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const fill = entry.target;
      const level = fill.getAttribute('data-level');
      fill.style.width = level + '%';
      fill.classList.add('filled');
      skillObserver.unobserve(fill);
    }
  });
}, {threshold:0.4});

document.querySelectorAll('.skill-fill').forEach(el => skillObserver.observe(el));

/* ================= CHIP CLOUD ================= */
const skillsAndTech = [
  'Manual Testing','Functional Testing','Regression Testing','Bug Reporting','Technical Support',
  'SQL','Postman','HTML','CSS','JavaScript','TypeScript','Angular','SCSS','Flutter','Firebase',
  'PHP','MySQL','UI/UX Design','Visual Studio Code','Microsoft Office',
  'Communication','Time Management','Presentation Skills'
];
const chipCloud = document.getElementById('chipCloud');
skillsAndTech.forEach(item => {
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.textContent = item;
  chipCloud.appendChild(chip);
});

/* ================= MARQUEE ================= */
const marqueeItems = ['HTML','CSS','JavaScript','TypeScript','Angular','SCSS','SQL','Postman','PHP','MySQL'];
const track = document.getElementById('marqueeTrack');
function buildMarquee(){
  track.innerHTML = '';
  for(let r=0;r<2;r++){
    const span = document.createElement('span');
    marqueeItems.forEach((item, idx) => {
      const wrap = document.createElement('span');
      wrap.style.display = 'inline-flex';
      wrap.style.alignItems = 'center';
      wrap.style.gap = '60px';
      wrap.innerHTML = item + '<i></i>';
      span.appendChild(wrap);
    });
    track.appendChild(span);
  }
}
buildMarquee();
