
const screens = {
  home: document.getElementById('homeScreen'),
  guess: document.getElementById('guessScreen'),
  memory: document.getElementById('memoryScreen'),
  plate: document.getElementById('plateScreen'),
  origin: document.getElementById('originScreen')
};
const globalMessage = document.getElementById('globalMessage');
const installBtn = document.getElementById('installAppBtn');

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  if(name==='home') globalMessage.textContent = 'Escolha um jogo para começar!';
  if(name==='guess') globalMessage.textContent = 'Adivinhação dos Sabores em andamento!';
  if(name==='memory') globalMessage.textContent = 'Memória Mineira em andamento!';
  if(name==='plate') globalMessage.textContent = 'Monte o Prato Mineiro em andamento!';
  if(name==='origin') globalMessage.textContent = 'De Onde Vem? em andamento!';
}
function shuffle(arr){ return [...arr].sort(() => Math.random() - 0.5); }
function formatTime(seconds){
  const m = String(Math.floor(seconds/60)).padStart(2,'0');
  const s = String(seconds%60).padStart(2,'0');
  return `${m}:${s}`;
}

const celebrationModal = document.getElementById('celebrationModal');
const celebrationTitle = document.getElementById('celebrationTitle');
const celebrationSubtitle = document.getElementById('celebrationSubtitle');
const celebrationPoints = document.getElementById('celebrationPoints');
const celebrationDetail = document.getElementById('celebrationDetail');
const celebrationExtra = document.getElementById('celebrationExtra');
const celebrationReplayBtn = document.getElementById('celebrationReplayBtn');
const celebrationHomeBtn = document.getElementById('celebrationHomeBtn');
let replayHandler = null;

function showCelebration({title, subtitle, points, detail, extra, onReplay}){
  celebrationTitle.textContent = title;
  celebrationSubtitle.textContent = subtitle;
  celebrationPoints.textContent = points;
  celebrationDetail.textContent = detail;
  celebrationExtra.innerHTML = extra;
  replayHandler = onReplay;
  celebrationModal.hidden = false;
}
function closeCelebration(){
  celebrationModal.hidden = true;
}
celebrationReplayBtn.addEventListener('click', ()=>{
  closeCelebration();
  if(typeof replayHandler === 'function') replayHandler();
});
celebrationHomeBtn.addEventListener('click', ()=>{
  closeCelebration();
  showScreen('home');
});

// ---------------- Adivinhação ----------------
const guessImage = document.getElementById('guessImage');
const guessBlurOverlay = document.getElementById('guessBlurOverlay');
const guessCategory = document.getElementById('guessCategory');
const guessClueTitle = document.getElementById('guessClueTitle');
const guessClueText = document.getElementById('guessClueText');
const guessOptions = document.getElementById('guessOptions');
const guessResultBox = document.getElementById('guessResultBox');
const guessScoreEl = document.getElementById('guessScore');
const guessHitsEl = document.getElementById('guessHits');
const guessClueLevelEl = document.getElementById('guessClueLevel');
const guessRoundLabel = document.getElementById('guessRoundLabel');
const moreClueBtn = document.getElementById('moreClueBtn');
const nextGuessBtn = document.getElementById('nextGuessBtn');

let guessPool = [];
let currentGuessIndex = 0;
let currentClueIndex = 0;
let guessScore = 0;
let guessHits = 0;
let answeredCurrent = false;
const ROUNDS_PER_GAME = 6;

function startGuessGame(){
  guessPool = shuffle(FOODS).slice(0, ROUNDS_PER_GAME);
  currentGuessIndex = 0;
  currentClueIndex = 0;
  guessScore = 0;
  guessHits = 0;
  answeredCurrent = false;
  updateGuessStats();
  showScreen('guess');
  loadGuessRound();
}
function blurByLevel(){
  return [18, 12, 7, 2][currentClueIndex] ?? 0;
}
function updateGuessStats(){
  guessScoreEl.textContent = guessScore;
  guessHitsEl.textContent = guessHits;
  guessClueLevelEl.textContent = currentClueIndex + 1;
  guessRoundLabel.textContent = `${currentGuessIndex + 1} / ${guessPool.length}`;
}
function loadGuessRound(){
  const food = guessPool[currentGuessIndex];
  currentClueIndex = 0;
  answeredCurrent = false;
  nextGuessBtn.disabled = true;
  moreClueBtn.disabled = false;
  guessImage.src = food.image;
  guessImage.alt = food.name;
  guessCategory.textContent = `${food.category} • ${food.region}`;
  guessResultBox.textContent = 'Escolha uma resposta para jogar.';
  renderCurrentClue();
  renderGuessOptions(food);
  updateGuessStats();
}
function renderCurrentClue(){
  const food = guessPool[currentGuessIndex];
  guessClueTitle.textContent = `Pista ${currentClueIndex + 1}`;
  guessClueText.textContent = food.clues[currentClueIndex];
  const blur = blurByLevel();
  guessBlurOverlay.style.backdropFilter = `blur(${blur}px)`;
  guessBlurOverlay.style.background = blur > 0 ? 'rgba(255,255,255,.06)' : 'transparent';
}
function renderGuessOptions(correctFood){
  const others = shuffle(FOODS.filter(f => f.id !== correctFood.id)).slice(0,3);
  const opts = shuffle([correctFood, ...others]);
  guessOptions.innerHTML = '';
  opts.forEach(food => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = food.name;
    btn.addEventListener('click', () => handleGuessAnswer(btn, food.id === correctFood.id, correctFood.name));
    guessOptions.appendChild(btn);
  });
}
function handleGuessAnswer(button, isCorrect, correctName){
  if(answeredCurrent) return;
  answeredCurrent = true;
  const buttons = [...guessOptions.querySelectorAll('.option-btn')];
  buttons.forEach(btn => btn.disabled = true);

  if(isCorrect){
    button.classList.add('correct');
    const points = [100, 75, 50, 25][currentClueIndex] ?? 20;
    guessScore += points;
    guessHits += 1;
    guessResultBox.innerHTML = `🎉 Acertou! A resposta era <strong>${correctName}</strong>.`;
  } else {
    button.classList.add('wrong');
    buttons.forEach(btn => { if(btn.textContent === correctName) btn.classList.add('correct'); });
    guessResultBox.innerHTML = `😄 Quase! A resposta correta era <strong>${correctName}</strong>.`;
  }

  guessBlurOverlay.style.backdropFilter = 'blur(0px)';
  guessBlurOverlay.style.background = 'transparent';
  moreClueBtn.disabled = true;
  nextGuessBtn.disabled = false;
  updateGuessStats();
}
moreClueBtn.addEventListener('click', () => {
  if(answeredCurrent) return;
  const food = guessPool[currentGuessIndex];
  if(currentClueIndex < food.clues.length - 1){
    currentClueIndex += 1;
    renderCurrentClue();
    updateGuessStats();
  } else {
    moreClueBtn.disabled = true;
  }
});
nextGuessBtn.addEventListener('click', () => {
  if(currentGuessIndex < guessPool.length - 1){
    currentGuessIndex += 1;
    loadGuessRound();
  } else {
    guessResultBox.innerHTML = `🏁 Fim da partida!`;
    nextGuessBtn.disabled = true;
    moreClueBtn.disabled = true;
    globalMessage.textContent = 'Partida concluída! Você pode jogar novamente.';
    showCelebration({
      title:'Campeão dos Sabores!',
      subtitle:'Você concluiu a Adivinhação dos Sabores',
      points:String(guessScore),
      detail:`${guessHits} / ${guessPool.length}`,
      extra:`Você acertou <strong>${guessHits}</strong> comidas e pode jogar novamente para receber rodadas diferentes!`,
      onReplay:startGuessGame
    });
  }
});

// ---------------- Memória ----------------
const memoryBoard = document.getElementById('memoryBoard');
const memoryMovesEl = document.getElementById('memoryMoves');
const memoryMatchesEl = document.getElementById('memoryMatches');
const memoryTimeEl = document.getElementById('memoryTime');
const restartMemoryBtn = document.getElementById('restartMemoryBtn');
const memoryMessage = document.getElementById('memoryMessage');

let memoryDeck = [];
let flipped = [];
let matchedPairs = 0;
let moves = 0;
let timerSeconds = 0;
let timerId = null;
let boardLocked = false;
let timerStarted = false;

function startMemoryGame(){
  const memoryFoods = FOODS.filter(f => f.memory).slice(0, 12);
  memoryDeck = shuffle([...memoryFoods, ...memoryFoods].map((food, idx) => ({
    uid: `${food.id}-${idx}-${Math.random().toString(36).slice(2,7)}`,
    pairId: food.id,
    name: food.name,
    image: food.image
  })));
  flipped = [];
  matchedPairs = 0;
  moves = 0;
  timerSeconds = 0;
  boardLocked = false;
  timerStarted = false;
  if(timerId) clearInterval(timerId);
  timerId = null;
  updateMemoryStats();
  renderMemoryBoard();
  memoryMessage.textContent = 'Toque nas cartas para encontrar os pares.';
  showScreen('memory');
}
function updateMemoryStats(){
  memoryMovesEl.textContent = moves;
  memoryMatchesEl.textContent = `${matchedPairs} / 12`;
  memoryTimeEl.textContent = formatTime(timerSeconds);
}
function startMemoryTimerIfNeeded(){
  if(timerStarted) return;
  timerStarted = true;
  timerId = setInterval(() => {
    timerSeconds += 1;
    memoryTimeEl.textContent = formatTime(timerSeconds);
  }, 1000);
}
function renderMemoryBoard(){
  memoryBoard.innerHTML = '';
  memoryDeck.forEach(card => {
    const wrap = document.createElement('div');
    wrap.className = 'memory-card';
    wrap.dataset.uid = card.uid;
    wrap.dataset.pair = card.pairId;

    const inner = document.createElement('div');
    inner.className = 'memory-card-inner';

    const back = document.createElement('div');
    back.className = 'memory-face memory-back';
    back.innerHTML = `<div class="memory-back-badge"><strong>Sabores</strong><span>DE MINAS</span></div>`;

    const front = document.createElement('div');
    front.className = 'memory-face memory-front';
    front.innerHTML = `<img src="${card.image}" alt="${card.name}">`;

    inner.appendChild(back);
    inner.appendChild(front);
    wrap.appendChild(inner);
    wrap.addEventListener('click', () => flipMemoryCard(wrap, card));
    memoryBoard.appendChild(wrap);
  });
}
function flipMemoryCard(el, card){
  if(boardLocked || el.classList.contains('flipped') || el.classList.contains('matched')) return;
  startMemoryTimerIfNeeded();
  el.classList.add('flipped');
  flipped.push({el, card});
  if(flipped.length === 2){
    moves += 1;
    updateMemoryStats();
    const [a,b] = flipped;
    if(a.card.pairId === b.card.pairId){
      a.el.classList.add('matched');
      b.el.classList.add('matched');
      matchedPairs += 1;
      flipped = [];
      updateMemoryStats();
      memoryMessage.textContent = '🎉 Muito bem! Você encontrou um par!';
      if(matchedPairs === 12){
        if(timerId) clearInterval(timerId);
        memoryMessage.innerHTML = `🏆 Parabéns!`;
        globalMessage.textContent = 'Você concluiu a Memória Mineira!';
        const memScore = Math.max(100, Math.round(3000 - (moves*25 + timerSeconds*3)));
        showCelebration({
          title:'Campeão da Memória!',
          subtitle:'Você encontrou todos os pares',
          points:String(memScore),
          detail:`${moves} jogadas`,
          extra:`Tempo final: <strong>${formatTime(timerSeconds)}</strong> • Desempenho incrível na Memória Mineira!`,
          onReplay:startMemoryGame
        });
      }
    } else {
      boardLocked = true;
      memoryMessage.textContent = '🙂 Essas imagens não formam um par. Tente novamente!';
      setTimeout(() => {
        a.el.classList.remove('flipped');
        b.el.classList.remove('flipped');
        flipped = [];
        boardLocked = false;
      }, 800);
    }
  }
}
restartMemoryBtn.addEventListener('click', startMemoryGame);



// ---------------- Monte o Prato Mineiro ----------------
const plateRecipes = [
  {
    title:'Almoço bem mineiro',
    clue:'Escolha o prato com frango e quiabo, o acompanhamento amarelo feito de milho e o petisco crocante de porco.',
    ids:['frango_com_quiabo','angu','torresmo']
  },
  {
    title:'Mesa de tropeiro',
    clue:'Escolha o prato que leva feijão e farinha, o petisco crocante e o queijo símbolo de Minas.',
    ids:['feijao_tropeiro','torresmo','queijo_minas']
  },
  {
    title:'Café da tarde mineiro',
    clue:'Escolha a bolinha assada com queijo, a quitanda de fubá e o doce cremoso caramelado.',
    ids:['pao_de_queijo','broa_de_fuba','doce_de_leite']
  },
  {
    title:'Sabores do milho',
    clue:'Escolha três preparos em que o milho é protagonista: um embrulhado em palha, um cremoso salgado e uma quitanda de fubá.',
    ids:['pamonha','canjiquinha','broa_de_fuba']
  },
  {
    title:'Dupla doce e companhia',
    clue:'Escolha a goiabada, o queijo mineiro e o doce cremoso feito de leite.',
    ids:['goiabada','queijo_minas','doce_de_leite']
  },
  {
    title:'Trio de quitandas',
    clue:'Escolha pão de queijo, broa de fubá e biscoito de polvilho.',
    ids:['pao_de_queijo','broa_de_fuba','biscoito_de_polvilho']
  }
];

const plateRoundLabel = document.getElementById('plateRoundLabel');
const plateTitle = document.getElementById('plateTitle');
const plateClue = document.getElementById('plateClue');
const plateSlots = document.getElementById('plateSlots');
const plateOptions = document.getElementById('plateOptions');
const plateScoreEl = document.getElementById('plateScore');
const plateHitsEl = document.getElementById('plateHits');
const plateMessage = document.getElementById('plateMessage');
const clearPlateBtn = document.getElementById('clearPlateBtn');
const checkPlateBtn = document.getElementById('checkPlateBtn');
const nextPlateBtn = document.getElementById('nextPlateBtn');

let plateRounds = [];
let plateRoundIndex = 0;
let plateSelected = [];
let plateScore = 0;
let plateHits = 0;
let plateLocked = false;

function startPlateGame(){
  plateRounds = shuffle(plateRecipes).slice(0,5);
  plateRoundIndex = 0;
  plateSelected = [];
  plateScore = 0;
  plateHits = 0;
  plateLocked = false;
  showScreen('plate');
  loadPlateRound();
}
function foodById(id){ return FOODS.find(f=>f.id===id); }
function loadPlateRound(){
  const round = plateRounds[plateRoundIndex];
  plateSelected = [];
  plateLocked = false;
  plateRoundLabel.textContent = `${plateRoundIndex+1} / ${plateRounds.length}`;
  plateTitle.textContent = round.title;
  plateClue.textContent = round.clue;
  plateScoreEl.textContent = plateScore;
  plateHitsEl.textContent = plateHits;
  plateMessage.textContent = 'Escolha 3 alimentos.';
  clearPlateBtn.disabled = false;
  checkPlateBtn.disabled = true;
  checkPlateBtn.hidden = false;
  nextPlateBtn.hidden = true;
  renderPlateSlots();
  renderPlateOptions();
}
function renderPlateSlots(){
  plateSlots.innerHTML = '';
  for(let i=0;i<3;i++){
    const slot = document.createElement('div');
    slot.className='plate-slot';
    const food = foodById(plateSelected[i]);
    if(food) slot.innerHTML = `<img src="${food.image}" alt="${food.name}">`;
    else slot.innerHTML = `<span>${i+1}</span>`;
    plateSlots.appendChild(slot);
  }
}
function renderPlateOptions(){
  const round = plateRounds[plateRoundIndex];
  const extra = shuffle(FOODS.filter(f=>!round.ids.includes(f.id))).slice(0,5).map(f=>f.id);
  const optionIds = shuffle([...round.ids, ...extra]);
  plateOptions.innerHTML='';
  optionIds.forEach(id=>{
    const food = foodById(id);
    const btn = document.createElement('button');
    btn.className='plate-option';
    btn.dataset.id=id;
    btn.innerHTML=`<img src="${food.image}" alt="${food.name}" title="${food.name}">`;
    btn.addEventListener('click',()=>{
      if(plateLocked)return;
      if(plateSelected.includes(id)) plateSelected = plateSelected.filter(x=>x!==id);
      else if(plateSelected.length<3) plateSelected.push(id);
      btn.classList.toggle('selected',plateSelected.includes(id));
      renderPlateSlots();
      checkPlateBtn.disabled = plateSelected.length!==3;
    });
    plateOptions.appendChild(btn);
  });
}
clearPlateBtn.addEventListener('click',()=>{
  if(plateLocked)return;
  plateSelected=[];
  renderPlateSlots();
  [...plateOptions.children].forEach(el=>el.classList.remove('selected'));
  checkPlateBtn.disabled=true;
  plateMessage.textContent='Escolha 3 alimentos.';
});
checkPlateBtn.addEventListener('click',()=>{
  if(plateLocked || plateSelected.length!==3)return;
  plateLocked=true;
  const round=plateRounds[plateRoundIndex];
  const correct = round.ids.every(id=>plateSelected.includes(id));
  [...plateOptions.children].forEach(el=>{
    const id=el.dataset.id;
    if(round.ids.includes(id))el.classList.add('correct');
    else if(plateSelected.includes(id))el.classList.add('wrong');
  });
  if(correct){
    plateScore += 100;
    plateHits += 1;
    plateMessage.innerHTML='🎉 Perfeito! Você montou a combinação certa e ganhou <strong>100 pontos</strong>.';
  }else{
    const names=round.ids.map(id=>foodById(id).name).join(' + ');
    plateMessage.innerHTML=`🙂 Quase! A combinação correta era <strong>${names}</strong>.`;
  }
  plateScoreEl.textContent=plateScore;
  plateHitsEl.textContent=plateHits;
  clearPlateBtn.disabled=true;
  checkPlateBtn.hidden=true;
  nextPlateBtn.hidden=false;
});
nextPlateBtn.addEventListener('click',()=>{
  if(plateRoundIndex < plateRounds.length-1){
    plateRoundIndex++;
    loadPlateRound();
  }else{
    plateMessage.innerHTML=`🏆 Fim do jogo!`;
    nextPlateBtn.disabled=true;
    globalMessage.textContent='Monte o Prato Mineiro concluído!';
    showCelebration({
      title:'Chef Campeão!',
      subtitle:'Você concluiu o Monte o Prato Mineiro',
      points:String(plateScore),
      detail:`${plateHits} / ${plateRounds.length}`,
      extra:`Você montou <strong>${plateHits}</strong> pratos corretamente. Continue treinando seus sabores mineiros!`,
      onReplay:startPlateGame
    });
  }
});

// ---------------- De Onde Vem? ----------------
const originQuestions = [
  {id:'pao_de_queijo', q:'Qual ingrediente é essencial para a massa tradicional?', a:'Polvilho', opts:['Polvilho','Arroz','Aveia','Trigo integral']},
  {id:'broa_de_fuba', q:'Qual ingrediente dá nome a esta quitanda?', a:'Fubá', opts:['Fubá','Cacau','Arroz','Batata']},
  {id:'doce_de_leite', q:'Qual ingrediente é a base deste doce?', a:'Leite', opts:['Leite','Café','Milho','Goiaba']},
  {id:'goiabada', q:'De qual fruta vem este doce?', a:'Goiaba', opts:['Goiaba','Uva','Maçã','Banana']},
  {id:'romeu_e_julieta', q:'Quais dois alimentos formam esta combinação?', a:'Queijo e goiabada', opts:['Queijo e goiabada','Milho e leite','Feijão e farinha','Frango e quiabo']},
  {id:'pamonha', q:'Qual alimento é a base da pamonha?', a:'Milho', opts:['Milho','Arroz','Feijão','Mandioca']},
  {id:'biscoito_de_polvilho', q:'Qual ingrediente dá nome a este biscoito?', a:'Polvilho', opts:['Polvilho','Fubá','Coco','Aveia']},
  {id:'canjiquinha', q:'A canjiquinha é feita principalmente a partir de quê?', a:'Milho', opts:['Milho','Trigo','Cacau','Goiaba']},
  {id:'queijo_minas', q:'Qual alimento é usado para produzir o queijo?', a:'Leite', opts:['Leite','Milho','Feijão','Café']},
  {id:'frango_com_quiabo', q:'Qual vegetal verde acompanha o frango neste prato?', a:'Quiabo', opts:['Quiabo','Couve-flor','Abobrinha','Ervilha']},
  {id:'feijao_tropeiro', q:'Qual grão aparece no nome deste prato?', a:'Feijão', opts:['Feijão','Arroz','Milho','Grão-de-bico']},
  {id:'angu', q:'Qual cereal é a base tradicional do angu?', a:'Milho', opts:['Milho','Arroz','Trigo','Cevada']},
  {id:'torresmo', q:'O torresmo tradicional é preparado a partir de qual carne?', a:'Porco', opts:['Porco','Frango','Peixe','Boi']}
];

const originRoundLabel=document.getElementById('originRoundLabel');
const originImage=document.getElementById('originImage');
const originFoodName=document.getElementById('originFoodName');
const originQuestion=document.getElementById('originQuestion');
const originOptions=document.getElementById('originOptions');
const originScoreEl=document.getElementById('originScore');
const originHitsEl=document.getElementById('originHits');
const originMessage=document.getElementById('originMessage');
const nextOriginBtn=document.getElementById('nextOriginBtn');

let originRounds=[];
let originIndex=0;
let originScore=0;
let originHits=0;
let originAnswered=false;

function startOriginGame(){
  originRounds=shuffle(originQuestions).slice(0,10);
  originIndex=0;
  originScore=0;
  originHits=0;
  originAnswered=false;
  showScreen('origin');
  loadOriginQuestion();
}
function loadOriginQuestion(){
  const item=originRounds[originIndex];
  const food=foodById(item.id);
  originAnswered=false;
  originRoundLabel.textContent=`${originIndex+1} / ${originRounds.length}`;
  originImage.src=food.image;
  originImage.alt=food.name;
  originFoodName.textContent=food.name;
  originQuestion.textContent=item.q;
  originScoreEl.textContent=originScore;
  originHitsEl.textContent=originHits;
  originMessage.textContent='Escolha uma resposta.';
  nextOriginBtn.disabled=true;
  originOptions.innerHTML='';
  shuffle(item.opts).forEach(option=>{
    const btn=document.createElement('button');
    btn.className='origin-option';
    btn.textContent=option;
    btn.addEventListener('click',()=>answerOrigin(btn,option,item.a));
    originOptions.appendChild(btn);
  });
}
function answerOrigin(btn,choice,answer){
  if(originAnswered)return;
  originAnswered=true;
  const buttons=[...originOptions.children];
  buttons.forEach(b=>b.disabled=true);
  if(choice===answer){
    btn.classList.add('correct');
    originScore+=100;
    originHits+=1;
    originMessage.innerHTML='🎉 Acertou! Muito bem!';
  }else{
    btn.classList.add('wrong');
    buttons.forEach(b=>{if(b.textContent===answer)b.classList.add('correct')});
    originMessage.innerHTML=`🙂 A resposta correta é <strong>${answer}</strong>.`;
  }
  originScoreEl.textContent=originScore;
  originHitsEl.textContent=originHits;
  nextOriginBtn.disabled=false;
}
nextOriginBtn.addEventListener('click',()=>{
  if(originIndex < originRounds.length-1){
    originIndex++;
    loadOriginQuestion();
  }else{
    originMessage.innerHTML=`🏆 Fim!`;
    nextOriginBtn.disabled=true;
    globalMessage.textContent='De Onde Vem? concluído!';
    showCelebration({
      title:'Explorador dos Ingredientes!',
      subtitle:'Você concluiu o De Onde Vem?',
      points:String(originScore),
      detail:`${originHits} / ${originRounds.length}`,
      extra:`Você acertou <strong>${originHits}</strong> respostas e descobriu a origem de vários sabores mineiros!`,
      onReplay:startOriginGame
    });
  }
});


// ---------------- Navegação ----------------
document.getElementById('startGuessBtn').addEventListener('click', startGuessGame);
document.getElementById('startMemoryBtn').addEventListener('click', startMemoryGame);
document.getElementById('startPlateBtn').addEventListener('click', startPlateGame);
document.getElementById('startOriginBtn').addEventListener('click', startOriginGame);
document.querySelectorAll('[data-back-home]').forEach(btn => btn.addEventListener('click', () => showScreen('home')));

// ---------------- PWA ----------------
let deferredPrompt = null;
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if(installBtn) installBtn.hidden = false;
});
if(installBtn){
  installBtn.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch(e){}
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}
window.addEventListener('appinstalled', () => {
  if(installBtn) installBtn.hidden = true;
});
