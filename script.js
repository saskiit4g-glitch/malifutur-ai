/* ===== MaliFutur.ai — logique (léger, aucune dépendance) ===== */
"use strict";

/* ---- Menu mobile ---- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

/* ---- Cours ---- */
const COURSES = [
  { emoji:"🐍", title:"Python pour débutants",
    desc:"Variables, conditions, boucles et premiers petits programmes — pas à pas, en français simple.",
    lessons:12, level:"Débutant", progress:15 },
  { emoji:"🧠", title:"Bases de l'Intelligence Artificielle",
    desc:"Comprendre ce qu'est l'IA, le machine learning et entraîner son premier modèle simple.",
    lessons:10, level:"Intermédiaire", progress:0 },
  { emoji:"🤖", title:"Principes de la Robotique",
    desc:"Capteurs, moteurs et logique : comment un robot "comprend" et bouge dans le monde réel.",
    lessons:8, level:"Intermédiaire", progress:0 }
];
document.getElementById("coursesGrid").innerHTML = COURSES.map(c => `
  <article class="card">
    <span class="emoji">${c.emoji}</span>
    <h3>${c.title}</h3>
    <p>${c.desc}</p>
    <div class="meta"><span>📖 ${c.lessons} leçons</span><span>🏷 ${c.level}</span></div>
    <div class="bar"><i style="width:${c.progress}%"></i></div>
    <a class="btn btn-ghost" href="#tuteur">Commencer</a>
  </article>`).join("");

/* ---- Thème sombre (économie de batterie) ---- */
const themeBtn = document.getElementById("themeBtn");
function applyTheme(t){ document.documentElement.setAttribute("data-theme", t);
  try{ localStorage.setItem("mf-theme", t); }catch(e){} }
try{ const saved = localStorage.getItem("mf-theme");
  if(saved) applyTheme(saved); }catch(e){}
themeBtn.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
});

/* ---- Compteur de poids téléchargé ---- */
(function(){
  let total = 0;
  ["index.html","style.css","app.js"].forEach(async f => {
    try{ const r = await fetch(f, {method:"HEAD"});
      const n = +(r.headers.get("content-length")||0);
      if(n){ total += n; document.getElementById("speedNum").innerHTML =
        (total/1024).toFixed(1) + "<small> Ko</small>"; }
    }catch(e){ document.getElementById("speedNum").innerHTML = "≈14<small> Ko</small>"; }
  });
})();

/* ---- Tuteur virtuel (démo hors-ligne, réponses par mots-clés) ---- */
const BRAIN = [
  { keys:["python","piton"], ans:"🐍 Python est un langage de programmation simple et très utilisé en IA. C'est le premier parcours de MaliFutur.ai ! Exemple :\n\nprint("Bonjour Mali !")" },
  { keys:["ia","intelligence","algorithme","machine learning"], ans:"🧠 L'IA (Intelligence Artificielle) permet aux ordinateurs d'apprendre à partir de données. Exemples : la reconnaissance vocale, la traduction, les recommandations." },
  { keys:["robot","robotique","capteur","moteur"], ans:"🤖 Un robot est une machine qui perçoit (capteurs), réfléchit (programme) et agit (moteurs). Le parcours Robotique t'explique tout ça pas à pas !" },
  { keys:["ciar"], ans:"🏛 Le CIAR-Mali (Centre Malien d'IA et de Robotique) forme les experts du numérique du Mali. Nos cours te préparent à l'intégrer !" },
  { keys:["internet","data","donnée","connexion"], ans:"📶 MaliFutur.ai est conçu pour la faible connexion : la page entière pèse moins de 15 Ko et le tuteur fonctionne hors-ligne." },
  { keys:["apprendre","débuter","commencer","cours"], ans:"📚 Commence par « Python pour débutants » (12 leçons). Conseil : 20 minutes par jour suffisent. Tu peux faire ! 💪" },
  { keys:["gratuit","payer","prix","argent"], ans:"🎉 Tout est 100% gratuit, pour toujours. Notre mission : un accès égal à la tech pour tous les jeunes du Mali." },
  { keys:["bonjour","salut","coucou"], ans:"👋 Bonjour ! Je suis ton tuteur virtuel. Pose-moi une question sur Python, l'IA, la robotique ou le CIAR-Mali." },
  { keys:["merci"], ans:"😊 Avec plaisir ! Continue d'apprendre, l'avenir du Mali est entre tes mains." }
];
const FALLBACK = "🤔 Bonne question ! Essaie avec un mot-clé comme « Python », « IA », « robot », « CIAR » ou « gratuit ». (Version complète avec IA connectée à venir !)";

const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addMsg(text, who){
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.textContent = text;               /* textContent = sécurité anti-XSS */
  chatLog.appendChild(d);
  chatLog.scrollTop = chatLog.scrollHeight;
}
function botReply(q){
  const clean = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hit = BRAIN.find(b => b.keys.some(k => clean.includes(k)));
  addMsg(hit ? hit.ans : FALLBACK, "bot");
}
addMsg("👋 Salut ! Je suis le tuteur virtuel de MaliFutur.ai. Pose ta question sur la technologie 😊", "bot");
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const q = chatInput.value.trim();
  if(!q) return;
  addMsg(q, "user");
  chatInput.value = "";
  setTimeout(() => botReply(q), 450);  /* petit délai réaliste */
});
