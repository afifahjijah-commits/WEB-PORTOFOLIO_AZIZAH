// Tandai bahwa JavaScript aktif (agar konten tetap terlihat jika JS mati)
document.documentElement.classList.add('js');

const navbar  = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const toTop   = document.getElementById('toTop');
const links   = navMenu.querySelectorAll('a');

// 1. Menu mobile
menuBtn.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
links.forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// 2. Animasi muncul saat scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// 3. Menu aktif sesuai bagian yang sedang dilihat + tombol kembali ke atas
const sections = [...links]
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function onScroll() {
  const y = window.scrollY + 120;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  toTop.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 4. Filter project
const filterBtns = document.querySelectorAll('.filter');
const projects   = document.querySelectorAll('.project');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  projects.forEach(p => {
    p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f);
    p.classList.add('visible');
  });
}));

// 5. Link project yang belum diisi
document.querySelectorAll('[data-placeholder]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); alert('Link project belum diisi. Ganti atribut href pada index.html.'); })
);

// 6. Lightbox: klik foto dokumentasi / sertifikat untuk memperbesar
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
function closeLightbox() { lightbox.hidden = true; lbImg.src = ''; }
document.addEventListener('click', e => {
  const img = e.target.closest('.shot img, .cert-img img, .thumb img');
  if (img) { lbImg.src = img.src; lbImg.alt = img.alt; lightbox.hidden = false; }
});
lightbox.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// 7. Tahun otomatis di footer
document.getElementById('year').textContent = new Date().getFullYear();