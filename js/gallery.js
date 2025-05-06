/* gallery.js — throttle probe, non‑blocking lazy load */
const L = document.getElementById('col-left');
const R = document.getElementById('col-right');
const pad = n => n.toString().padStart(4,'0');

/* 淡入上浮 */
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
},{rootMargin:'0px 0px -40px 0px'});

/* 参数 */
const BATCH = 10;          // 每轮探测数量
let idx = 1;               // 当前编号
let toggle = true;         // 左右列交替

function inject(src){
  const box = document.createElement('div');
  box.className = 'photo-box';
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.src = src;
  box.appendChild(img);
  (toggle ? L : R).appendChild(box);
  toggle = !toggle;
  io.observe(box);
}

function probeBatch(done){
  let pending = 0;
  for(let k=0;k<BATCH;k++){
    const num = pad(idx++);
    const src = `photos/${num}.jpeg`;
    pending++;
    const probe = new Image();
    probe.onload = ()=>{ inject(src); if(--pending===0) done(); };
    probe.onerror = ()=>{ if(--pending===0) done(); };
    probe.src = src;
  }
}

/* 递归批处理，直到 N 连续 miss 停止 */
let miss = 0;
const MISS_MAX = 1000;
function loop(){
  if(miss >= MISS_MAX) return;
  probeBatch(()=>{ miss += BATCH; loop(); });   // 先假设都 miss
}

document.addEventListener('DOMContentLoaded', loop);
