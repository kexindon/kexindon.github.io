// js/gallery.js
// Automatically loads sequential JPEGs in /photos folder

const gallery = document.querySelector('.masonry');
const COL_COUNT = 2; 
const MARGIN_VW = 6; 

function addImage(num) {
  const item = document.createElement('div');
  item.className = 'masonry-item';
  item.dataset.id = `photo${num}`;
  item.innerHTML = `
    <div class="image-wrapper">
      <img src="photos/${num}.jpeg" alt="Photo ${num}">
      <button class="like-btn">❤️ <span class="count">0</span></button>
    </div>`;
  gallery.appendChild(item);
}

async function preload(num) {
  const src = `photos/${num}.jpeg`;
  try {
    const resp = await fetch(src, { method: 'HEAD' });
    if (resp.ok) {
      addImage(num);
      preload(num + 1);   // recurse
    }
  } catch (_) {
    // network error => stop
  }
}

function initLikes() {
  gallery.addEventListener('click', e => {
    if (!e.target.closest('.like-btn')) return;
    const btn = e.target.closest('.like-btn');
    const wrapper = btn.closest('.masonry-item');
    const id = wrapper.dataset.id;
    const span = btn.querySelector('.count');
    let count = parseInt(localStorage.getItem(id) || '0', 10) + 1;
    span.textContent = count;
    localStorage.setItem(id, count);
  });

  // init counts
  gallery.querySelectorAll('.masonry-item').forEach(item => {
    const id = item.dataset.id;
    const span = item.querySelector('.count');
    span.textContent = localStorage.getItem(id) || '0';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  preload(1);     // start from 0001.jpeg
  initLikes();
});
