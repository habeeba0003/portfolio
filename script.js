// ===== TYPED TEXT =====
const roles = ["Software Engineer","AI/ML Developer","Full-Stack Engineer","Data Scientist","Software Tester","ACM Hackathon Winner"];
let ri=0,ci=0,deleting=false;
const typedEl=document.getElementById("typed-text");
function type(){
  const word=roles[ri];
  typedEl.textContent=deleting?word.slice(0,ci--):word.slice(0,ci++);
  let delay=deleting?60:100;
  if(!deleting&&ci>word.length){delay=1800;deleting=true;}
  if(deleting&&ci<0){deleting=false;ri=(ri+1)%roles.length;delay=400;}
  setTimeout(type,delay);
}
type();

// ===== CUSTOM CURSOR =====
const cur=document.getElementById("cursor"),trail=document.getElementById("cursor-trail");
let mx=0,my=0,tx=0,ty=0;
document.addEventListener("mousemove",e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+"px"; cur.style.top=my+"px";
});
function animTrail(){
  tx+=(mx-tx)*0.15; ty+=(my-ty)*0.15;
  trail.style.left=tx+"px"; trail.style.top=ty+"px";
  requestAnimationFrame(animTrail);
}
animTrail();

// ===== PARTICLES =====
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();
window.addEventListener("resize",()=>{resize();initParticles();});
function initParticles(){
  particles=[];
  const count=Math.floor(W*H/18000);
  for(let i=0;i<count;i++) particles.push({
    x:Math.random()*W, y:Math.random()*H,
    r:Math.random()*1.5+0.5,
    vx:(Math.random()-0.5)*0.3,
    vy:(Math.random()-0.5)*0.3,
    alpha:Math.random()*0.5+0.1
  });
}
initParticles();
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(100,255,218,${p.alpha})`;
    ctx.fill();
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;
    if(p.y<0||p.y>H)p.vy*=-1;
  });
  particles.forEach((p,i)=>{
    particles.slice(i+1).forEach(q=>{
      const d=Math.hypot(p.x-q.x,p.y-q.y);
      if(d<100){
        ctx.beginPath();
        ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=`rgba(100,255,218,${0.08*(1-d/100)})`;
        ctx.lineWidth=0.5;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== NAVBAR SCROLL =====
const navbar=document.getElementById("navbar");
window.addEventListener("scroll",()=>navbar.classList.toggle("scrolled",scrollY>50));

// ===== HAMBURGER =====
const hamburger=document.getElementById("hamburger");
const navLinks=document.querySelector(".nav-links");
hamburger.addEventListener("click",()=>navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

// ===== SCROLL REVEAL =====
const revealEls=document.querySelectorAll(".reveal-up,.reveal-left,.reveal-right");
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");});
},{threshold:0.12});
revealEls.forEach(el=>revealObs.observe(el));

// ===== COUNTER ANIMATION =====
const counters=document.querySelectorAll(".counter");
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target, target=+el.dataset.target, dur=1500, step=dur/target;
      let val=0;
      const timer=setInterval(()=>{
        val++;
        el.textContent=val+"+";
        if(val>=target){el.textContent=target+"+";clearInterval(timer);}
      },step);
      counterObs.unobserve(el);
    }
  });
},{threshold:0.5});
counters.forEach(c=>counterObs.observe(c));

// ===== ACTIVE NAV ON SCROLL =====
const sections=document.querySelectorAll("section[id]");
window.addEventListener("scroll",()=>{
  const sy=scrollY+100;
  sections.forEach(sec=>{
    const link=document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if(link) link.style.color=sy>=sec.offsetTop&&sy<sec.offsetTop+sec.offsetHeight?"var(--accent)":"";
  });
});

// ===== SKILL TAG STAGGER =====
document.querySelectorAll(".skill-tags span").forEach((el,i)=>{
  el.style.transitionDelay=`${i*40}ms`;
});