/* gallery.js — alternate columns + robust endless loader */
const leftCol  = document.getElementById('col-left');
const rightCol = document.getElementById('col-right');
const pad      = n => n.toString().padStart(4, '0');

const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
},{rootMargin:"0px 0px -40px 0px"});

/* 迭代变量 */
let i = 1;          // 当前尝试编号
let miss = 0;       // 连续 miss 计数
const MISS_MAX = 200;   // 连续 200 个 404 即视为结束
let toggle = true;  // true->左列 false->右列 交替

function next(){
  if(miss >= MISS_MAX) return;       // 终止条件

  const file = pad(i++);
  const src  = `photos/${file}.jpeg`;
  const img  = new Image();
  img.loading = "lazy";
  img.src = src;

  img.onload = ()=>{
    miss = 0;                        // 重置 miss
    const box = document.createElement('div');
    box.className = 'photo-box';
    box.appendChild(img);

    (toggle ? leftCol : rightCol).appendChild(box);
    toggle = !toggle;                // 交替列
    io.observe(box);
    setTimeout(next,0);              // 继续
  };

  img.onerror = ()=>{
    miss++;
    setTimeout(next,0);              // 跳过缺号继续
  };
}

document.addEventListener('DOMContentLoaded',next);
