// js/gallery.js
// Automatically loads sequential JPEGs in /photos folder

const gallery = document.querySelector('.masonry');
const COL_COUNT = 2; 
const MARGIN_VW = 6; 

function pad(n){
    return n.toString().padStart(4, '0');   // 1 -> "0001"
  }
  
  async function preload(num){
    const name = pad(num);                      // <──★
    const src  = `photos/${name}.jpeg`;         // <──★
    try{
      const resp = await fetch(src, {method:'HEAD'});
      if(resp.ok){
        addImage(name);        // 传四位名
        preload(num+1);        // 递归下一个
      }
    }catch(e){ /* stop on error */ }
  }
  
  function addImage(name){
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.dataset.id = `photo${name}`;
    item.innerHTML = `
      <div class="image-wrapper">
        <img src="photos/${name}.jpeg" alt="Photo ${name}">
        <button class="like-btn">❤️ <span class="count">0</span></button>
      </div>`;
    gallery.appendChild(item);
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
