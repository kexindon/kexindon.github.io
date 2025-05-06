/* js/gallery.js  -  Masonry auto‑loader (no like button) */
const gallery = document.querySelector('.masonry');
const pad = n => n.toString().padStart(4, '0');   // 0001 → 4‑digit names

function tryLoad(n){
  const file = pad(n);                 // "0001"
  const src  = `photos/${file}.jpeg`;

  // 用 <img> 试加载；成功就插入并递归下一个
  const probe = new Image();
  probe.onload  = () => { addImage(src); tryLoad(n + 1); };
  probe.onerror = () => {};            // 404 → 停止
  probe.src = src;
}

function addImage(src){
  const div = document.createElement('div');
  div.className = 'masonry-item';
  div.innerHTML = `
    <div class="image-wrapper">
      <img src="${src}" alt="">
    </div>`;
  gallery.appendChild(div);
}

document.addEventListener('DOMContentLoaded', () => tryLoad(1));
