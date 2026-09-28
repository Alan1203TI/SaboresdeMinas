
const screens = {
  home: document.getElementById('homeScreen'),
  guess: document.getElementById('guessScreen'),
  memory: document.getElementById('memoryScreen')
};
const globalMessage = document.getElementById('globalMessage');
const installBtn = document.getElementById('installAppBtn');

function showScreen(name){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  if(name==='home') globalMessage.textContent = 'Escolha um jogo para começar!';
  if(name==='guess') globalMessage.textContent = 'Adivinhação dos Sabores em andamento!';
  if(name==='memory') globalMessage.textContent = 'Memória Mineira em andamento!';
}
function shuffle(arr){ return [...arr].sort(() => Math.random() - 0.5); }
function formatTime(seconds){
  const m = String(Math.floor(seconds/60)).padStart(2,'0');
  const s = String(seconds%60).padStart(2,'0');
  return `${m}:${s}`;
}

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
    guessResultBox.innerHTML = `🏁 Fim da partida! Você fez <strong>${guessScore} pontos</strong> e acertou <strong>${guessHits}</strong> de ${guessPool.length}. Na próxima partida, as rodadas podem vir diferentes!`;
    nextGuessBtn.disabled = true;
    moreClueBtn.disabled = true;
    globalMessage.textContent = 'Partida concluída! Você pode jogar novamente.';
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
    back.innerHTML = '🍽️';

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
        memoryMessage.innerHTML = `🏆 Parabéns! Você encontrou todos os pares em <strong>${moves} jogadas</strong> e <strong>${formatTime(timerSeconds)}</strong>.`;
        globalMessage.textContent = 'Você concluiu a Memória Mineira!';
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

// ---------------- Navegação ----------------
document.getElementById('startGuessBtn').addEventListener('click', startGuessGame);
document.getElementById('startMemoryBtn').addEventListener('click', startMemoryGame);
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
