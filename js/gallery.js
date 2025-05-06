/* gallery.js — throttle probe, non‑blocking lazy load */
const BATCH = 10;                  // probes per round
const MISS_MAX = 20;               // stop after 20 consecutive misses
let idx = 1;                       // current image index
let miss = 0;                      // consecutive miss counter
let toggle = true;                 // alternate columns

// fade‑in + float up
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -40px 0px' });

// pad number to 4 digits
const pad = n => n.toString().padStart(4, '0');

// inject <div><img></div> into left / right column
function inject(src, L, R) {
  const box = document.createElement('div');
  box.className = 'photo-box';
  const img = document.createElement('img');
  img.loading = 'lazy';            // native lazy‑load
  img.src = src;
  box.appendChild(img);
  (toggle ? L : R).appendChild(box);
  toggle = !toggle;
  io.observe(box);
}

// probe a batch of images
function probeBatch(done, L, R) {
  let pending = 0;
  for (let k = 0; k < BATCH; k++) {
    const num = pad(idx++);
    const src = `photos/${num}.jpeg`;
    pending++;
    const probe = new Image();
    probe.onload = () => {
      inject(src, L, R);           // success → render image
      miss = 0;                    // reset miss counter
      if (--pending === 0) done();
    };
    probe.onerror = () => {
      miss++;                      // count only errors
      if (--pending === 0) done();
    };
    probe.src = src;
  }
}

// recursive loop until MISS_MAX reached
function loop(L, R) {
  if (miss >= MISS_MAX) return;
  probeBatch(() => loop(L, R), L, R);
}

// wait for DOM, then start
document.addEventListener('DOMContentLoaded', () => {
  const L = document.getElementById('col-left');
  const R = document.getElementById('col-right');
  loop(L, R);
});
