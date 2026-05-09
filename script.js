// ===== CINEMATIC INTRO =====
const intro = document.getElementById('introScreen');
setTimeout(() => intro.classList.add('fade-out'), 3200);

// ===== TYPED TEXT (starts after intro) =====
const roles = ["Software Engineer","AI/ML Developer","Full-Stack Engineer","Data Scientist","Software Tester","ACM Hackathon Winner"];
let ri=0,ci=0,deleting=false;
const typedEl = document.getElementById('typed-text');
function type(){
  const word=roles[ri];
  typedEl.textContent=deleting?word.slice(0,ci--):word.slice(0,ci++);
  let d=deleting?60:100;
  if(!deleting&&ci>word.length){d=1800;deleting=true;}
  if(deleting&&ci<0){deleting=false;ri=(ri+1)%roles.length;d=400;}
  setTimeout(type,d);
}
setTimeout(type,3500);

// ===== GOLD FIREFLY CURSOR =====
const goldCursor = document.getElementById('goldCursor');
const fc = document.getElementById('fireflyCanvas');
const fctx = fc.getContext('2d');
fc.width=window.innerWidth; fc.height=window.innerHeight;
window.addEventListener('resize',()=>{fc.width=window.innerWidth;fc.height=window.innerHeight;});

let mx=window.innerWidth/2, my=window.innerHeight/2;
const particles=[];

document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  goldCursor.style.left=mx+'px';
  goldCursor.style.top=my+'px';
  // spawn firefly particles
  for(let i=0;i<4;i++){
    particles.push({
      x:mx+(Math.random()-0.5)*10,
      y:my+(Math.random()-0.5)*10,
      vx:(Math.random()-0.5)*1.2,
      vy:(Math.random()-0.5)*1.2-0.5,
      r:Math.random()*3+1,
      alpha:1,
      gold:Math.random()>0.4
    });
  }
});

// Click shimmer bloom
document.addEventListener('click', e=>{
  const el = e.target.closest('.shimmer-btn') || e.target.closest('.btn');
  if(el){
    el.classList.add('blooming');
    setTimeout(()=>el.classList.remove('blooming'),600);
  }
  // burst of particles on click
  for(let i=0;i<20;i++){
    const angle=Math.random()*Math.PI*2;
    const speed=Math.random()*3+1;
    particles.push({
      x:mx, y:my,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      r:Math.random()*4+2,
      alpha:1,
      gold:true
    });
  }
});

function drawFirefly(){
  fctx.clearRect(0,0,fc.width,fc.height);
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    fctx.save();
    fctx.globalAlpha=p.alpha;
    // glow
    const grd=fctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2);
    grd.addColorStop(0,p.gold?'rgba(255,215,0,0.9)':'rgba(100,255,218,0.9)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    fctx.beginPath(); fctx.arc(p.x,p.y,p.r*2,0,Math.PI*2);
    fctx.fillStyle=grd; fctx.fill();
    // core dot
    fctx.beginPath(); fctx.arc(p.x,p.y,p.r*0.5,0,Math.PI*2);
    fctx.fillStyle=p.gold?'#fff8b0':'#e0fff8'; fctx.fill();
    fctx.restore();
    p.x+=p.vx; p.y+=p.vy;
    p.vy+=0.04; // gravity
    p.alpha-=0.03; p.r*=0.97;
    if(p.alpha<=0) particles.splice(i,1);
  }
  requestAnimationFrame(drawFirefly);
}
drawFirefly();

// ===== STATIC PARTICLES BG =====
const pc=document.getElementById('particles');
const pctx=pc.getContext('2d');
let pw,ph,pts=[];
function resizeP(){pw=pc.width=window.innerWidth;ph=pc.height=window.innerHeight;}
resizeP(); window.addEventListener('resize',()=>{resizeP();initPts();});
function initPts(){
  pts=[];
  const n=Math.floor(pw*ph/20000);
  for(let i=0;i<n;i++) pts.push({x:Math.random()*pw,y:Math.random()*ph,r:Math.random()+0.3,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,a:Math.random()*.3+.05});
}
initPts();
function drawPts(){
  pctx.clearRect(0,0,pw,ph);
  pts.forEach(p=>{
    pctx.beginPath();pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pctx.fillStyle=`rgba(100,255,218,${p.a})`;pctx.fill();
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>pw)p.vx*=-1;if(p.y<0||p.y>ph)p.vy*=-1;
  });
  requestAnimationFrame(drawPts);
}
drawPts();

// ===== NAVBAR =====
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',scrollY>50));
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('.nav-links a:not(.nav-resume-btn)').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));

// ===== RESUME MODAL =====
const modal=document.getElementById('resumeModal');
function openModal(){modal.classList.add('open');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
document.getElementById('navResumeBtn').addEventListener('click',e=>{e.preventDefault();openModal();});
document.getElementById('heroResumeBtn').addEventListener('click',openModal);
document.getElementById('resumeCloseBtn').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});

// ===== DOWNLOAD WITH DATA ANIMATION =====
document.getElementById('downloadResumeBtn').addEventListener('click',()=>{
  closeModal();
  const overlay=document.getElementById('dlOverlay');
  const bar=document.getElementById('dlBar');
  overlay.classList.add('show');
  bar.style.width='0%';
  let pct=0;
  const iv=setInterval(()=>{
    pct+=Math.random()*4+1;
    if(pct>=100){pct=100;clearInterval(iv);
      setTimeout(()=>{
        overlay.classList.remove('show');
        // trigger actual download
        const a=document.createElement('a');
        a.href='resume.pdf'; // place your resume.pdf in the same folder
        a.download='Syeda_Umme_Habeeba_Resume.pdf';
        a.click();
      },400);
    }
    bar.style.width=pct+'%';
  },60);
});

// ===== SCROLL REVEAL =====
const revEls=document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.12});
revEls.forEach(el=>revObs.observe(el));

// ===== COUNTER =====
const counters=document.querySelectorAll('.counter');
const cObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target,target=+el.dataset.target,dur=1500,step=dur/target;
      let v=0;const t=setInterval(()=>{v++;el.textContent=v+'+';if(v>=target){el.textContent=target+'+';clearInterval(t);}},step);
      cObs.unobserve(el);
    }
  });
},{threshold:0.5});
counters.forEach(c=>cObs.observe(c));

// ===== ACHIEVEMENTS CAROUSEL =====
const achCards = Array.from(document.querySelectorAll('.ach-card'));
const achDotsEl = document.getElementById('achDots');
let achActive = 0;
let achAuto;

// build dots
achCards.forEach((_,i)=>{
  const d = document.createElement('div');
  d.className = 'ach-dot' + (i===0?' active':'');
  d.addEventListener('click',()=>goTo(i));
  achDotsEl.appendChild(d);
});

function getClass(i){
  const total = achCards.length;
  const diff = ((i - achActive) % total + total) % total;
  const ndiff = ((achActive - i) % total + total) % total;
  const rel = diff <= ndiff ? diff : -ndiff;
  if(rel===0) return 'active';
  if(rel===1) return 'next1';
  if(rel===-1) return 'prev1';
  if(rel===2) return 'next2';
  if(rel===-2) return 'prev2';
  return 'hidden';
}

function render(){
  achCards.forEach((c,i)=>{
    c.className = 'ach-card ' + getClass(i);
  });
  document.querySelectorAll('.ach-dot').forEach((d,i)=>{
    d.classList.toggle('active', i===achActive);
  });
}

function goTo(idx){
  achActive = (idx + achCards.length) % achCards.length;
  render();
}

// hover to focus
achCards.forEach((c,i)=>{
  c.addEventListener('mouseenter',()=>{ clearInterval(achAuto); goTo(i); });
  c.addEventListener('mouseleave',()=>{ startAuto(); });
});

function startAuto(){
  clearInterval(achAuto);
  achAuto = setInterval(()=>goTo(achActive+1), 2500);
}

render();
startAuto();
const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
  const sy=scrollY+100;
  sections.forEach(sec=>{
    const lnk=document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if(lnk) lnk.style.color=sy>=sec.offsetTop&&sy<sec.offsetTop+sec.offsetHeight?'var(--gold)':'';
  });
});