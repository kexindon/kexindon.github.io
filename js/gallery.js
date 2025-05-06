// js/gallery.js  —— Masonry auto‑loader (4‑digit names)
const gallery = document.querySelector('.masonry');
const pad = n => n.toString().padStart(4, '0');

function tryLoad(num){
  const name = pad(num);            // e.g. "0001"
  const src  = `photos/${name}.jpeg`;

  const tester = new Image();
  tester.onload = () => {           // 只要加载成功就加入页面
    addImage(name, src);
    tryLoad(num + 1);               // 递归下一张
  };
  tester.onerror = () => { /* 停止递归 */ };
  tester.src = src;                 // 开始测试
}

function addImage(name, src){
  const div = document.createElement('div');
  div.className = 'masonry-item';
  div.dataset.id = `photo${name}`;
  div.innerHTML = `
    <div class="image-wrapper">
      <img src="${src}" alt="Photo ${name}">
      <button class="like-btn">❤️ <span class="count">0</span></button>
    </div>`;
  gallery.appendChild(div);
  initLike(div);
}

function initLike(div){
  const btn  = div.querySelector('.like-btn');
  const span = btn.querySelector('.count');
  const id   = div.dataset.id;
  span.textContent = localStorage.getItem(id) || '0';
  btn.onclick = () => {
    let c = parseInt(span.textContent, 10) + 1;
    span.textContent = c;
    localStorage.setItem(id, c);
  };
}

document.addEventListener('DOMContentLoaded', () => tryLoad(1));
