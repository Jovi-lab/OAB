// ====== utilidades e estado ======
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

let state = {
  name: "",
  route: "home",
  quiz: { index: 0, selected: {}, checked: {}, score: 0 }
};

// ====== navegação ======
function routeTo(r) {
  state.route = r;
  $$(".nav-item").forEach(a => a.classList.toggle("active", a.getAttribute("data-route") === r));
  $("#homeView").classList.toggle("hidden", r !== "home");
  $("#estudosView").classList.toggle("hidden", r !== "estudos");
  $("#testeView").classList.toggle("hidden", r !== "teste");
  $("#descansoView").classList.toggle("hidden", r !== "descanso");
  $("#filmesView").classList.toggle("hidden", r !== "filmes");
  if (r === "estudos") renderStudies();
  if (r === "teste") initQuiz();
  if (r === "descanso") initDescanso();
}

// ====== header ======
const greetName = $("#greetName");
$("#btnClear").addEventListener("click", () => { $("#playerName").value = ""; greetName.textContent = "concurseiro"; state.name = ""; });
$("#btnGo").addEventListener("click", () => {
  const val = $("#playerName").value.trim();
  state.name = val || "concurseiro";
  greetName.textContent = state.name;
  routeTo("home");
});
$$(".nav-item, .card .actions .btn").forEach(el => {
  el.addEventListener("click", () => {
    const r = el.getAttribute("data-route");
    if (r) routeTo(r);
  });
});
// ====== dados de estudos ======
const STUDIES = [
  {
    id: "dia-prova",
    title: "O que devo saber no dia da prova",
    area: "Guia prático",
    cover: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Exam_papers.jpg",
    rights: "Imagem: Wikimedia Commons — CC BY-SA",
    parts: [
      { h: "Checklist de itens", p: "Leve documento oficial com foto, caneta preta de tubo transparente, alimentação leve e água. Evite eletrônicos e objetos vedados no edital." },
      { h: "Estratégias de tempo", p: "Divida em blocos: leitura rápida, resolução das fáceis, marcação das difíceis para retorno. Evite gastar mais de 3–4 minutos por item inicialmente." },
      { h: "Saúde e foco", p: "Durma bem, mantenha hidratação e faça pausas mentais curtas. Chegue com antecedência e revise fórmulas-chave, não tudo." }
    ],
    links: [
      { label: "OAB — editais", url: "https://www.oab.org.br/" },
      { label: "Dicas de preparação", url: "https://www.estrategiaconcursos.com.br/blog/dicas-de-prova/" },
      { label: "Gestão do tempo", url: "https://pt.wikipedia.org/wiki/Gest%C3%A3o_do_tempo" }
    ]
  },
  {
    id: "etica-publicidade",
    title: "Publicidade na advocacia",
    area: "Ética/Estatuto",
    cover: "https://upload.wikimedia.org/wikipedia/commons/3/39/Justice_%282007%29.jpg",
    rights: "Imagem: Wikimedia Commons — CC BY-SA",
    parts: [
      { h: "Princípios", p: "A publicidade deve ser informativa e discreta. É vedada a promessa de resultado, a captação indevida de clientela e a mercantilização da profissão." },
      { h: "Base normativa", p: "Regras no Estatuto da Advocacia (Lei 8.906/94) e no Código de Ética e Disciplina da OAB." },
      { h: "Exemplos práticos", p: "É permitido divulgar áreas de atuação e contatos, mas proibido usar slogans comerciais ou promoções." }
    ],
    links: [
      { label: "Estatuto da Advocacia", url: "https://www.planalto.gov.br/ccivil_03/leis/L8906.htm" },
      { label: "Código de Ética OAB", url: "https://www.oab.org.br/leisnormas" },
      { label: "Artigo sobre publicidade", url: "https://www.conjur.com.br/2020/07/publicidade-advocacia-limites" }
    ]
  },
  {
    id: "liberdade-expressao",
    title: "Liberdade de expressão e prisões",
    area: "Constitucional/Processual",
    cover: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Brazil_Supreme_Federal_Court.jpg",
    rights: "Imagem: Wikimedia Commons — CC BY-SA",
    parts: [
      { h: "Liberdade de expressão", p: "Direito protegido pela CF/88. Críticas a agentes públicos são amparadas, desde que sem abuso, injúria ou difamação." },
      { h: "Prisões", p: "Em regra, prisões exigem ordem judicial. Exceções: flagrante delito e hipóteses legais específicas com controle judicial." }
    ],
    links: [
      { label: "Constituição Federal — art. 5º", url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" },
      { label: "Comentário doutrinário", url: "https://www.jusbrasil.com.br/artigos/liberdade-de-expressao" }
    ]
  }
  // ... continue ampliando os outros estudos
];

// ====== renderização de estudos ======
function renderStudies() {
  const grid = $("#studyGrid");
  grid.innerHTML = "";
  STUDIES.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="pill pill-area">${s.area}</div>
      <h3>${s.title}</h3>
      <p>${s.rights}</p>
      <div class="actions"><button class="btn btn-primary">Ler</button></div>
    `;
    card.querySelector("button").addEventListener("click", () => renderStudyContent(s.id));
    grid.appendChild(card);
  });
  $("#studyContent").classList.add("hidden");
}

function renderStudyContent(id) {
  const s = STUDIES.find(x => x.id === id);
  if (!s) return;
  const box = $("#studyContent");
  box.innerHTML = `
    <h2>${s.title} <span class="pill pill-area">${s.area}</span></h2>
    ${s.cover ? `<img src="${s.cover}" alt="${s.title}"/><p class="muted">${s.rights}</p>` : ""}
    ${s.parts.map(p => `<h3>${p.h}</h3><p>${p.p}</p>`).join("")}
    <h3>Fontes</h3>
    <ul>${s.links.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`).join("")}</ul>
    <div class="actions"><button class="btn btn-secondary" data-route="teste">Ir ao Simulado</button></div>
  `;
  box.classList.remove("hidden");
  box.querySelector(".btn").addEventListener("click", () => routeTo("teste"));
}
// ====== funções auxiliares para questões ======
function A(t){return{key:"A",text:t}}
function B(t){return{key:"B",text:t}}
function C(t){return{key:"C",text:t}}
function D(t){return{key:"D",text:t}}
function srcLabel(url){
  if(url.includes("planalto")) return "Planalto";
  if(url.includes("oab.org")) return "OAB";
  if(url.includes("wikipedia")) return "Wikipedia";
  return "Fonte";
}
function Q(studyId, area, title, options, correct, explanation, sources){
  return {studyId, area, title, options, correct, explanation, sources:sources.map(u=>({label:srcLabel(u),url:u}))}
}

// ====== banco de questões (adicione até 20) ======
const QUESTIONS = [
  Q("etica-publicidade","Ética","É permitido anunciar 'garantia de vitória'?",
    [A("Sim, é permitido"),B("Não, é vedado"),C("Sim, em redes sociais"),D("Só outdoors são proibidos")],
    "B","Promessa de resultado é vedada pela ética e Estatuto.",
    ["https://www.oab.org.br/leisnormas"]
  ),
  Q("etica-publicidade","Ética","Honorários 'imbatíveis' em propaganda",
    [A("Permitido"),B("Vedado por mercantilização"),C("Permitido sem citar concorrentes"),D("Permitido com autorização da seccional")],
    "B","Mercantilização da advocacia é vedada.",
    ["https://www.oab.org.br/leisnormas"]
  ),
  Q("liberdade-expressao","Constitucional","Crítica a agente público e prisão sem ordem",
    [A("Detenção válida"),B("Exige ordem judicial salvo flagrante"),C("Crítica retira proteção"),D("Detenção administrativa dispensa juiz")],
    "B","Prisões exigem ordem judicial, salvo flagrante.",
    ["https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"]
  ),
  Q("contratos-imprevisao","Civil","Contrato longo e fato extraordinário",
    [A("Revisão por imprevisão"),B("Nulidade automática"),C("Jamais há revisão"),D("Sem intervenção judicial")],
    "A","Teoria da imprevisão autoriza revisão.",
    ["https://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm"]
  ),
  Q("provas-ilicitas","Processo Penal","Interceptação sem ordem judicial",
    [A("Admitida"),B("Ilícita e contamina derivadas"),C("Depende de ordem judicial"),D("B e C")],
    "D","Interceptação exige ordem; provas ilícitas contaminam derivadas.",
    ["https://www.planalto.gov.br/ccivil_03/leis/L9296.htm"]
  ),
  Q("dia-prova","Guia","Itens obrigatórios no dia da prova",
    [A("Documento e caneta preta"),B("Notebook"),C("Celular"),D("Impressora")],
    "A","Editais exigem documento oficial e caneta preta.",
    ["https://www.oab.org.br/"]
  )
  // ... adicione mais questões até completar 20
];
// ====== elementos do quiz ======
const qIndex=$("#qIndex"),qTotal=$("#qTotal"),scoreSpan=$("#score"),progressBar=$("#progressBar"),quizCase=$("#quizCase");
const btnPrev=$("#btnPrev"),btnNext=$("#btnNext"),btnCheck=$("#btnCheck"),btnFinish=$("#btnFinish");
const resultCard=$("#resultCard"),finalName=$("#finalName"),finalScore=$("#finalScore"),finalTotal=$("#finalTotal"),answersList=$("#answersList");
const btnReplay=$("#btnReplay"),btnExportMD=$("#btnExportMD");

function initQuiz(){
  qTotal.textContent=QUESTIONS.length;
  resultCard.classList.add("hidden");
  $("#quizCase").classList.remove("hidden");
  state.quiz={index:0,selected:{},checked:{},score:0};
  renderQuestion();
}

function studyTitle(id){
  const s=STUDIES.find(x=>x.id===id);
  return s?s.title:"Estudo";
}

function renderQuestion(){
  const i=state.quiz.index;
  const q=QUESTIONS[i];
  qIndex.textContent=i+1;
  scoreSpan.textContent=state.quiz.score;
  progressBar.style.width=(i/(QUESTIONS.length-1))*100+"%";
  btnPrev.disabled=i===0;
  btnNext.classList.toggle("hidden",i===QUESTIONS.length-1);
  btnFinish.classList.toggle("hidden",i!==QUESTIONS.length-1);

  quizCase.innerHTML=`
    <div class="content">
      <h2>${q.title} <span class="pill pill-area">${q.area}</span></h2>
      <p class="muted">Relacionado a: <a href="#" data-study="${q.studyId}">${studyTitle(q.studyId)}</a></p>
      <div class="question">Assinale a alternativa correta:</div>
      <div class="options" id="options"></div>
    </div>`;
  quizCase.querySelector("[data-study]").addEventListener("click",e=>{
    e.preventDefault();routeTo("estudos");renderStudyContent(q.studyId);
  });
  const optionsDiv=$("#options");
  q.options.forEach(opt=>{
    const chosen=state.quiz.selected[i]===opt.key;
    const checked=state.quiz.checked[i]===true;
    const isCorrect=opt.key===q.correct;
    const label=document.createElement("label");
    label.className="option";
    if(checked) label.classList.add(isCorrect?"correct":(chosen?"wrong":""));
    label.innerHTML=`<input type="radio" name="opt" value="${opt.key}" ${chosen?"checked":""}/> <div><strong>${opt.key})</strong> ${opt.text}</div>`;
    label.addEventListener("click",()=>{state.quiz.selected[i]=opt.key;});
    optionsDiv.appendChild(label);
  });
}

btnPrev.addEventListener("click",()=>{if(state.quiz.index>0){state.quiz.index--;renderQuestion();}});
btnNext.addEventListener("click",()=>{if(state.quiz.index<QUESTIONS.length-1){state.quiz.index++;renderQuestion();}});
btnCheck.addEventListener("click",()=>{
  const i=state.quiz.index,q=QUESTIONS[i];
  const choice=document.querySelector('input[name="opt"]:checked');
  if(!choice){alert("Escolha uma alternativa!");return;}
  if(state.quiz.checked[i])return;
  state.quiz.selected[i]=choice.value;
  state.quiz.checked[i]=true;
  if(choice.value===q.correct) state.quiz.score++;
  renderQuestion();
});
btnFinish.addEventListener("click",()=>{
  $("#quizCase").classList.add("hidden");
  resultCard.classList.remove("hidden");
  finalName.textContent=state.name||"concurseiro";
  finalScore.textContent=state.quiz.score;
  finalTotal.textContent=QUESTIONS.length;
  answersList.innerHTML="";
  QUESTIONS.forEach((q,i)=>{
    const chosen=state.quiz.selected[i]||"-";
    const ok=chosen===q.correct;
    const card=document.createElement("div");
    card.className="answer-card";
    card.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3>${q.title} <span class="pill pill-area">${q.area}</span></h3>
        <span class="tag ${ok?"tag-right":"tag-wrong"}">${ok?"Acertou":"Errou"}</span>
      </div>
      <p><strong>Você marcou:</strong> ${chosen} | <strong>Correta:</strong> ${q.correct}</p>
      <p><strong>Explicação:</strong> ${q.explanation}</p>
      <p><strong>Estudo relacionado:</strong> <a href="#" data-study="${q.studyId}">${studyTitle(q.studyId)}</a></p>
      <div><strong>Fontes:</strong><ul>
        ${q.sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join("")}
      </ul></div>`;
    card.querySelector("[data-study]").addEventListener("click",e=>{
      e.preventDefault();routeTo("estudos");renderStudyContent(q.studyId);
    });
    answersList.appendChild(card);
  });
});
// ====== exportar gabarito ======
btnReplay.addEventListener("click",()=>{initQuiz();});

btnExportMD.addEventListener("click",()=>{
  const md=exportMarkdown();
  downloadFile(md,"gabarito-universo-oab.md","text/markdown;charset=utf-8");
});

function exportMarkdown(){
  let md=`# Gabarito — Universo OAB\n\n`;
  md+=`- Nome: ${state.name||"concurseiro"}\n`;
  md+=`- Pontuação: ${state.quiz.score}/${QUESTIONS.length}\n\n`;
  QUESTIONS.forEach((q,i)=>{
    const chosen=state.quiz.selected[i]||"-";
    md+=`## ${q.title} — ${q.area}\n`;
    md+=`Você marcou: ${chosen} | Correta: ${q.correct}\n\n`;
    md+=`Explicação: ${q.explanation}\n\n`;
    md+=`Estudo relacionado: ${studyTitle(q.studyId)}\n\n`;
    md+=`Fontes:\n`;
    q.sources.forEach(s=>md+=`- [${s.label}](${s.url})\n`);
    md+=`\n`;
  });
  return md;
}

function downloadFile(content, filename, mime){
  const blob=new Blob([content],{type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// ====== Descanso: palavras cruzadas ======
const TERMS = [
  { term: "ETICA", clue: "Publicidade discreta e informativa; vedadas promessas." },
  { term: "IMPREVISAO", clue: "Teoria que permite revisão por fatos extraordinários." },
  { term: "LIBERDADE", clue: "Direito de expressão protegido pela CF/88." },
  { term: "FLAGRANTE", clue: "Exceção que dispensa ordem judicial para prender." },
  { term: "INTERCEPTACAO", clue: "Depende de ordem judicial (Lei 9.296/96)." }
];

// layout limpo (sem blocos fixos)
const CROSS_LAYOUT = Array(12).fill("............");

const crossGrid = $("#crossGrid");
const clueList = $("#clueList");
const crossWin = $("#crossWin");
const btnClearCross = $("#btnClearCross");
const btnCheckCross = $("#btnCheckCross");

function crossCell(r,c){return crossGrid.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);}

function initCrossword(){
  crossGrid.innerHTML="";
  clueList.innerHTML="";
  crossWin.style.display="none";
  CROSS_LAYOUT.forEach((row,r)=>{
    [...row].forEach((ch,c)=>{
      const cell=document.createElement("div");
      cell.className="cell"; cell.dataset.r=r; cell.dataset.c=c;
      const input=document.createElement("input");
      input.maxLength=1;
      input.addEventListener("input",e=>{
        e.target.value=e.target.value.toUpperCase().replace(/[^A-ZÇÃÕÉÊÁÂÍÓÔÚ]/,"");
      });
      cell.appendChild(input);
      crossGrid.appendChild(cell);
    });
  });
  const placements=[
    {term:"ETICA",r:0,c:0,dir:"H"},
    {term:"IMPREVISAO",r:2,c:2,dir:"H"},
    {term:"LIBERDADE",r:4,c:1,dir:"H"},
    {term:"FLAGRANTE",r:6,c:0,dir:"H"},
    {term:"INTERCEPTACAO",r:0,c:8,dir:"V"}
  ];
  TERMS.forEach(t=>{
    const p=placements.find(x=>x.term===t.term);
    if(!p)return;
    const num=clueList.children.length+1;
    const li=document.createElement("li");
    li.innerHTML=`<strong>${num}.</strong> (${p.dir==="H"?"Horizontal":"Vertical"}) ${t.clue}`;
    clueList.appendChild(li);
    for(let i=0;i<t.term.length;i++){
      const r=p.r+(p.dir==="V"?i:0);
      const c=p.c+(p.dir==="H"?i:0);
      const cell=crossCell(r,c);
      if(cell){cell.dataset.term=t.term;cell.dataset.index=i;}
    }
  });
}

btnClearCross.addEventListener("click",()=>{
  $$("#crossGrid .cell input").forEach(inp=>inp.value="");
  crossWin.style.display="none";
  $$("#crossGrid .cell").forEach(cell=>cell.style.borderColor="rgba(255,255,255,0.2)");
});
btnCheckCross.addEventListener("click",()=>{
  let allGood=true;
  TERMS.forEach(t=>{
    for(let i=0;i<t.term.length;i++){
      const cell=crossGrid.querySelector(`.cell[data-term="${t.term}"][data-index="${i}"]`);
      if(!cell)continue;
      const inp=cell.querySelector("input");
      const chr=t.term[i];
      if(!inp || inp.value.toUpperCase()!==chr){
        allGood=false; cell.style.borderColor="var(--bad)";
      } else {
        cell.style.borderColor="var(--ok)";
      }
    }
  });
  crossWin.style.display=allGood?"block":"none";
});

// ====== Descanso: jogo da forca ======
const hangmanGame=$("#hangmanGame");
const hangmanFigure=$("#hangmanFigure");
const hangmanWord=$("#hangmanWord");
const hangmanLetters=$("#hangmanLetters");
const hangmanStatus=$("#hangmanStatus");
const btnHangStart=$("#btnHangStart");
const btnCrossStart=$("#btnCrossStart");
const btnHangReset=$("#btnHangReset");

const HANGMAN_QUESTIONS=[
  {question:"Qual princípio rege a publicidade na advocacia?",answer:"ETICA"},
  {question:"Teoria que permite revisão contratual por fatos extraordinários?",answer:"IMPREVISAO"},
  {question:"Direito protegido pela CF/88?",answer:"LIBERDADE"}
];

let hangmanState={word:"",progress:[],errors:0,maxErrors:6};

function initHangman(){
  const q=HANGMAN_QUESTIONS[Math.floor(Math.random()*HANGMAN_QUESTIONS.length)];
  hangmanState.word=q.answer;
  hangmanState.progress=Array(q.answer.length).fill("_");
  hangmanState.errors=0;
  hangmanFigure.textContent="Algemas: [ ]  Boneco: ( )  Carro: [ ]";
  hangmanWord.textContent=hangmanState.progress.join(" ");
  hangmanStatus.textContent=q.question;
  hangmanLetters.innerHTML="";
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(l=>{
    const btn=document.createElement("button");
    btn.textContent=l;
    btn.addEventListener("click",()=>playHangman(l,btn));
    hangmanLetters.appendChild(btn);
  });
}

function playHangman(letter,btn){
  btn.disabled=true;
  let ok=false;
  for(let i=0;i<hangmanState.word.length;i++){
    if(hangmanState.word[i]===letter){
      hangmanState.progress[i]=letter; ok=true;
    }
  }
  if(!ok){hangmanState.errors++; updateFigure();}
  hangmanWord.textContent=hangmanState.progress.join(" ");
  if(hangmanState.progress.join("")===hangmanState.word){
    hangmanFigure.textContent="🎉 Você libertou o boneco!"; hangmanLetters.innerHTML="";
  }
  if(hangmanState.errors>=hangmanState.maxErrors){
    hangmanFigure.textContent="🚔 UFA! ELE Morreu... Mas foi pro Céu! :) "; hangmanLetters.innerHTML="";
  }
}

function updateFigure(){
  const e=hangmanState.errors;
  if(e===1) hangmanFigure.textContent="Ixi, o policial pegou a algema!";
  if(e===2) hangmanFigure.textContent="Opa, Ou você acerta alguma coisa ai ou vai dar ruim, o policial já está colocando droga no carro!";
  if(e===3) hangmanFigure.textContent="Meu DEUS DO CÉU, O MELIANTE FALOU PARA O POLICIAL OLHAR PRO LADO E SAIU CORRENDO!";
  if(e===4) hangmanFigure.textContent="🚨 O POLICIAL SACOU O REVOLVER! :|";
  if(e===5) hangmanFigure.textContent="🚔 MEU JESUS, O POLICIAL ATIROU! PETECO! PETECO! PETECO!";
  if(e===6) hangmanFigure.textContent="...Fim de jogo: o boneco morreu! :( ";
}

// ====== inicialização descanso ======
function initDescanso(){
  $("#crosswordGame").classList.add("hidden");
  $("#hangmanGame").classList.add("hidden");
}

btnCrossStart.addEventListener("click",()=>{
  $("#crosswordGame").classList.remove("hidden");
  initCrossword();
});
btnHangStart.addEventListener("click",()=>{
  $("#hangmanGame").classList.remove("hidden");
  initHangman();
});
btnHangReset.addEventListener("click",()=>initHangman());

// start on home
routeTo("home");
function routeTo(r) {
  state.route = r;
  $$(".nav-item").forEach(a => a.classList.toggle("active", a.getAttribute("data-route") === r));
  $("#homeView").classList.toggle("hidden", r !== "home");
  $("#estudosView").classList.toggle("hidden", r !== "estudos");
  $("#testeView").classList.toggle("hidden", r !== "teste");
  $("#descansoView").classList.toggle("hidden", r !== "descanso");
  $("#filmesView").classList.toggle("hidden", r !== "filmes");
  $("#academiaView").classList.toggle("hidden", r !== "academia"); // <-- nova aba
  if (r === "estudos") renderStudies();
  if (r === "teste") initQuiz();
  if (r === "descanso") initDescanso();
}
