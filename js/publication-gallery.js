
const BATCH = 12;
const MISS_MAX = 20;
let idx = 1;
let miss = 0;

// Mapping image number to external links (optional fallback to image itself)
const linkMap = {
  '0001': 'https://www.nature.com/articles/s41587-024-02172-9',
  '0002': 'https://www.biorxiv.org/content/10.1101/2025.02.23.639770v1',
  '0003': 'https://www.biorxiv.org/content/10.1101/2025.02.23.639784v1'
  // Add more mappings as needed
};

// Fade-in + staggered animation
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -40px 0px' });

const pad = n => n.toString().padStart(4, '0');

// Inject into specific column
function inject(src, cols, colIndex, delay, link) {
  const box = document.createElement('div');
  box.className = 'photo-box';
  box.style.animationDelay = `${delay}s`;

  const anchor = document.createElement('a');
  anchor.href = link;
  anchor.target = '_blank';

  const img = document.createElement('img');
  img.loading = 'lazy';
  img.src = src;

  anchor.appendChild(img);
  box.appendChild(anchor);
  cols[colIndex].appendChild(box);
  io.observe(box);
}

function probeBatch(done, cols) {
  let pending = 0;
  for (let k = 0; k < BATCH; k++) {
    const num = pad(idx++);
    const src = `pub/${num}.jpeg`;
    const colIndex = k % 4;
    const delay = (k % 4) * 0.1;
    const link = linkMap[num] || src;

    pending++;
    const probe = new Image();
    probe.onload = () => {
      inject(src, cols, colIndex, delay, link);
      miss = 0;
      if (--pending === 0) done();
    };
    probe.onerror = () => {
      miss++;
      if (--pending === 0) done();
    };
    probe.src = src;
  }
}

function loop(cols) {
  if (miss >= MISS_MAX) return;
  probeBatch(() => loop(cols), cols);
}

document.addEventListener('DOMContentLoaded', () => {
  const cols = [
    document.getElementById('col-0'),
    document.getElementById('col-1'),
    document.getElementById('col-2'),
    document.getElementById('col-3')
  ];
  loop(cols);
});
