/* ============================================================
   PlayDot v0.1 — App Logic (clean)
   ============================================================ */

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const store = {
  get: (k, d) => { const v = localStorage.getItem(k); return v === null ? d : v; },
  set: (k, v) => localStorage.setItem(k, String(v)),
  del: (k) => localStorage.removeItem(k),
  clear: () => localStorage.clear()
};

/* ---------- Audio (Web Audio API, no files) ---------- */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
  }
  return audioCtx;
}
function tone(freq, dur = 0.1, type = 'sine', vol = 0.05) {
  const c = ensureAudio(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = vol; o.connect(g); g.connect(c.destination);
  const t = c.currentTime;
  o.start(t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.stop(t + dur);
}
const SFX = {
  click:   () => tone(520, 0.06, 'sine', 0.04),
  focus:   () => tone(880, 0.03, 'sine', 0.015),
  correct: () => { tone(660, 0.09); setTimeout(() => tone(880, 0.12), 80); },
  wrong:   () => tone(260, 0.14, 'sawtooth', 0.05),
  win:     () => [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,0.15, 'sine', 0.07), i*110)),
  pop:     () => tone(880, 0.06),
  flip:    () => tone(440, 0.05),
  match:   () => { tone(700, 0.07); setTimeout(()=>tone(1047, 0.1), 70); }
};
function vibrate(p = 15) { if (navigator.vibrate) try { navigator.vibrate(p); } catch(e){} }
function feedback(type = 'click') {
  (SFX[type] || SFX.click)();
  if (type === 'correct' || type === 'win') vibrate(30);
  else if (type === 'wrong') vibrate([40,40,40]);
  else vibrate(12);
}

/* ---------- Confetti ---------- */
function confetti() {
  const colors = ['#FFB300','#4FC3F7','#81C784','#FF8A65','#FF5252','#9C27B0'];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(wrap);
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = 8 + Math.random()*10;
    const color = colors[Math.floor(Math.random()*colors.length)];
    const sx = Math.random()*window.innerWidth;
    const sy = -20 - Math.random()*60;
    const rot = Math.random()*360;
    const dur = 1800 + Math.random()*1400;
    const drift = (Math.random()-0.5)*200;
    p.style.cssText = `position:absolute;left:${sx}px;top:${sy}px;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random()>0.5?'50%':'3px'};transform:rotate(${rot}deg);`;
    wrap.appendChild(p);
    const start = performance.now();
    (function loop(now) {
      const t = Math.min(1, (now-start)/dur);
      const e = 1 - Math.pow(1-t,3);
      const y = sy + (window.innerHeight+40 - sy)*e;
      const x = sx + drift*t;
      p.style.transform = `translate(${x-sx}px, ${y-sy}px) rotate(${rot+t*540}deg)`;
      p.style.opacity = t > 0.85 ? String(1-(t-0.85)/0.15) : '1';
      if (t < 1) requestAnimationFrame(loop); else p.remove();
    })(start);
  }
  setTimeout(() => wrap.remove(), 3500);
}
function celebrate() { feedback('win'); confetti(); }

/* ---------- Screen Router ---------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(id); if (!el) return;
  el.classList.add('active');
  if (id === 'screen-home') staggerCards();
  setTimeout(() => {
    const first = el.querySelector('.focusable');
    if (first) first.focus();
  }, 60);
}
function staggerCards() {
  document.querySelectorAll('#screen-home .game-card').forEach((c, i) => {
    c.style.animation = 'none'; void c.offsetWidth;
    c.style.animation = `cardIn 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i*35}ms both`;
  });
}

/* ---------- Global D-pad nav ---------- */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
  const screen = document.querySelector('.screen.active'); if (!screen) return;
  const cur = document.activeElement;
  const focusables = Array.from(screen.querySelectorAll('.focusable')).filter(el => el.offsetParent !== null);
  const idx = focusables.indexOf(cur);

  // Grid-aware navigation
  const gridMap = {
    'screen-tictactoe': { sel: '.ttt-cell', cols: 3, attr: 'data-index' },
    'screen-puzzle':    { sel: '.memory-card', cols: 4, attr: 'data-index' },
    'screen-odd':       { sel: '.odd-cell', cols: 3, attr: 'data-index' },
    'screen-whack':     { sel: '.whack-hole', cols: 3, attr: 'data-index' },
    'screen-simon':     { sel: '.simon-pad', cols: 2, attr: 'data-index' },
    'screen-gk':        { sel: '.gk-option', cols: 2, attr: 'data-index' }
  };
  const gm = gridMap[screen.id];
  if (gm && cur.matches && cur.matches(gm.sel)) {
    const ci = parseInt(cur.getAttribute(gm.attr));
    let ni = ci;
    const cols = gm.cols;
    const total = screen.querySelectorAll(gm.sel).length;
    if (e.key === 'ArrowRight' && ci % cols < cols-1 && ci+1 < total) ni = ci+1;
    else if (e.key === 'ArrowLeft' && ci % cols > 0) ni = ci-1;
    else if (e.key === 'ArrowDown' && ci+cols < total) ni = ci+cols;
    else if (e.key === 'ArrowUp' && ci-cols >= 0) ni = ci-cols;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cur.click(); return; }
    else return;
    e.preventDefault();
    const next = screen.querySelector(`${gm.sel}[${gm.attr}="${ni}"]`);
    if (next) { next.focus(); feedback('focus'); }
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (idx < focusables.length-1) { focusables[idx+1].focus(); feedback('focus'); }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (idx > 0) { focusables[idx-1].focus(); feedback('focus'); }
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (cur && (cur.tagName === 'BUTTON' || cur.classList.contains('focusable')) && !cur.matches('input')) {
      e.preventDefault(); cur.click();
    }
  }
});

/* Auto-scroll focused element into view */
document.addEventListener('focusin', (e) => {
  const el = e.target;
  if (!el || !el.matches || !el.matches('.focusable')) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.bottom > vh - 20 || r.top < 90) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

/* Global click feedback */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, .game-card, .focusable');
  if (!t) return;
  if (t.matches('.gk-option, .memory-card, .ttt-cell, .simon-pad, .dot-node, .odd-cell, .whack-hole')) return;
  feedback('click');
});

/* ============================================================
   ONBOARDING
   ============================================================ */
$('btn-start').addEventListener('click', () => showScreen('screen-age'));

document.querySelectorAll('.age-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const age = parseInt(btn.textContent, 10);
    if (age >= 5 && age <= 12) { store.set('pd_age', age); showScreen('screen-name'); }
  });
});

const nameInput = $('name-input');
const funNames = ['Star','Sunny','Bunny','Panda','Rocket','Comet','Pixel','Joy','Doodle','Fuzz','Sparkle','Zippy'];
$('btn-random-name').addEventListener('click', () => {
  nameInput.value = funNames[Math.floor(Math.random()*funNames.length)];
});
$('btn-name-next').addEventListener('click', () => {
  const n = nameInput.value.trim();
  if (n) { store.set('pd_name', n); showScreen('screen-avatar'); }
  else nameInput.focus();
});

/* Avatar */
let avatarColor = store.get('pd_avatar', '#FFB300');
const avatarCircle = $('avatar-circle');
const colorBtns = document.querySelectorAll('.color-btn');
function refreshAvatarSelection() {
  avatarCircle.style.backgroundColor = avatarColor;
  colorBtns.forEach(b => {
    const on = b.dataset.color === avatarColor;
    b.dataset.active = on ? 'true' : 'false';
    b.style.borderColor = on ? 'var(--text)' : 'white';
  });
}
colorBtns.forEach(b => b.addEventListener('click', () => {
  avatarColor = b.dataset.color;
  refreshAvatarSelection();
}));
refreshAvatarSelection();

$('btn-avatar-save').addEventListener('click', () => {
  store.set('pd_avatar', avatarColor);
  store.set('pd_onboarded', '1');
  applyProfile();
  showScreen('screen-home');
});

function applyProfile() {
  const n = store.get('pd_name', 'Player');
  const c = store.get('pd_avatar', '#FFB300');
  $('display-name').textContent = n;
  $('home-avatar').style.backgroundColor = c;
}

/* Settings */
$('btn-open-settings').addEventListener('click', () => showScreen('screen-settings'));
$('btn-settings-back').addEventListener('click', () => showScreen('screen-home'));
$('btn-reset-app').addEventListener('click', () => {
  store.clear();
  avatarColor = '#FFB300';
  applyProfile();
  refreshAvatarSelection();
  showScreen('screen-welcome');
});

/* ============================================================
   GAME 1 — MEMORY MATCH (Puzzle)
   ============================================================ */
const puzzleIcons = [
  `<svg width="60" height="60" viewBox="0 0 64 64"><path d="M32 6 L40 24 L60 24 L44 38 L50 58 L32 46 L14 58 L20 38 L4 24 L24 24 Z" fill="#FFB300"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><path d="M32 56 C32 56 6 38 6 20 C6 8 18 4 26 10 C30 14 32 18 32 18 C32 18 34 14 38 10 C46 4 58 8 58 20 C58 38 32 56 32 56 Z" fill="#FF8A65"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><rect x="10" y="26" width="44" height="18" rx="6" fill="#4FC3F7"/><path d="M20 26 L24 14 L40 14 L44 26 Z" fill="#4FC3F7"/><rect x="26" y="16" width="12" height="8" rx="2" fill="#FFF8E7"/><circle cx="20" cy="46" r="6" fill="#3E2723"/><circle cx="44" cy="46" r="6" fill="#3E2723"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FFB300"/><g stroke="#FFB300" stroke-width="4" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="58"/><line x1="6" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="58" y2="32"/><line x1="14" y1="14" x2="20" y2="20"/><line x1="50" y1="14" x2="44" y2="20"/><line x1="14" y1="50" x2="20" y2="44"/><line x1="50" y1="50" x2="44" y2="44"/></g></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><path d="M32 16 C32 16 26 8 18 10 C10 12 8 24 16 38 C24 52 32 58 32 58 C32 58 40 52 48 38 C56 24 54 12 46 10 C38 8 32 16 32 16 Z" fill="#FF5252"/><path d="M32 16 L32 6" stroke="#3E2723" stroke-width="4" stroke-linecap="round"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="34" r="20" fill="#FFB300"/><polygon points="14,22 22,6 30,20" fill="#FFB300"/><polygon points="50,22 42,6 34,20" fill="#FFB300"/><circle cx="24" cy="32" r="3" fill="#3E2723"/><circle cx="40" cy="32" r="3" fill="#3E2723"/></svg>`
];
let memoryScore = parseInt(store.get('pd_puzzle_score', 0), 10);
let memFirst = null, memLock = false, memMatched = 0;

function initPuzzle() {
  const grid = $('memory-grid'); grid.innerHTML = '';
  const deck = [...puzzleIcons, ...puzzleIcons].sort(() => Math.random() - 0.5);
  memFirst = null; memLock = false; memMatched = 0;
  $('puzzle-status').textContent = 'Find the pairs!';
  $('puzzle-score').textContent = memoryScore;
  deck.forEach((icon, i) => {
    const c = document.createElement('button');
    c.className = 'memory-card focusable';
    c.dataset.index = i;
    c.dataset.icon = icon;
    c.innerHTML = `<div class="card-inner"><div class="card-back"></div><div class="card-front">${icon}</div></div>`;
    c.addEventListener('click', () => flipMemory(c));
    grid.appendChild(c);
  });
  setTimeout(() => grid.firstChild && grid.firstChild.focus(), 60);
}
function flipMemory(card) {
  if (memLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  feedback('flip');
  card.classList.add('flipped');
  if (!memFirst) { memFirst = card; return; }
  const a = memFirst, b = card; memFirst = null;
  if (a.dataset.icon === b.dataset.icon) {
    a.classList.add('matched'); b.classList.add('matched');
    a.insertAdjacentHTML('beforeend', '<div class="match-text">Matched!</div>');
    b.insertAdjacentHTML('beforeend', '<div class="match-text">Matched!</div>');
    feedback('match');
    memoryScore += 5;
    store.set('pd_puzzle_score', memoryScore);
    $('puzzle-score').textContent = memoryScore;
    memMatched++;
    if (memMatched === puzzleIcons.length) { $('puzzle-status').textContent = 'You Win!'; celebrate(); }
  } else {
    memLock = true;
    setTimeout(() => {
      a.classList.remove('flipped'); b.classList.remove('flipped');
      memLock = false;
    }, 800);
  }
}
$('card-puzzle').addEventListener('click', () => { initPuzzle(); showScreen('screen-puzzle'); });
$('btn-puzzle-back').addEventListener('click', () => showScreen('screen-home'));
$('btn-puzzle-restart').addEventListener('click', initPuzzle);

/* ============================================================
   GAME 2 — TIC-TAC-TOE
   ============================================================ */
let ttt = Array(9).fill('');
let tttPlayerTurn = true, tttActive = false;
const tttWins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function tttWin(b, p) { return tttWins.some(w => w.every(i => b[i] === p)); }
function tttFull(b) { return b.every(c => c !== ''); }
function tttReset() {
  ttt = Array(9).fill('');
  tttPlayerTurn = true; tttActive = true;
  $('ttt-status').textContent = 'Your Turn';
  document.querySelectorAll('.ttt-cell').forEach(c => { c.className = 'ttt-cell focusable'; });
  document.querySelector('.ttt-cell[data-index="0"]').focus();
}
function tttBot() {
  if (!tttActive) return;
  let mv = -1;
  for (let i = 0; i < 9; i++) if (!ttt[i]) { ttt[i]='O'; if (tttWin(ttt,'O')){mv=i;ttt[i]='';break;} ttt[i]=''; }
  if (mv === -1) for (let i = 0; i < 9; i++) if (!ttt[i]) { ttt[i]='X'; if (tttWin(ttt,'X')){mv=i;ttt[i]='';break;} ttt[i]=''; }
  if (mv === -1 && !ttt[4]) mv = 4;
  if (mv === -1) { const e = ttt.map((v,i)=>v?'':i).filter(v=>v!==''); mv = e[Math.floor(Math.random()*e.length)]; }
  ttt[mv] = 'O';
  document.querySelector(`.ttt-cell[data-index="${mv}"]`).classList.add('o-move');
  if (tttWin(ttt,'O')) { $('ttt-status').textContent = 'Bot Wins! Try Again.'; tttActive = false; feedback('wrong'); }
  else if (tttFull(ttt)) { $('ttt-status').textContent = "It's a Tie!"; tttActive = false; }
  else { tttPlayerTurn = true; $('ttt-status').textContent = 'Your Turn'; }
}
document.querySelectorAll('.ttt-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const i = parseInt(cell.dataset.index, 10);
    if (!tttActive || !tttPlayerTurn || ttt[i]) return;
    ttt[i] = 'X';
    cell.classList.add('x-move');
    feedback('click');
    if (tttWin(ttt,'X')) { $('ttt-status').textContent = 'You Win! Great Job!'; tttActive = false; celebrate(); return; }
    if (tttFull(ttt)) { $('ttt-status').textContent = "It's a Tie!"; tttActive = false; return; }
    tttPlayerTurn = false;
    $('ttt-status').textContent = "Bot's Turn...";
    setTimeout(tttBot, 550);
  });
});
$('card-tictactoe').addEventListener('click', () => { tttReset(); showScreen('screen-tictactoe'); });
$('btn-ttt-back').addEventListener('click', () => { tttActive = false; showScreen('screen-home'); });
$('btn-ttt-restart').addEventListener('click', tttReset);

/* ============================================================
   GAME 3 — GK QUIZ
   ============================================================ */
const gkQs = [
  { q: 'What color is the sky?', o: ['Blue','Red','Green','Yellow'], a: 0 },
  { q: 'How many legs does a dog have?', o: ['2','3','4','5'], a: 2 },
  { q: 'Who is the King of the Jungle?', o: ['Tiger','Lion','Elephant','Monkey'], a: 1 },
  { q: 'What is 2 + 2?', o: ['3','4','5','6'], a: 1 },
  { q: 'Which fruit is yellow and curved?', o: ['Apple','Banana','Grapes','Orange'], a: 1 },
  { q: 'What do bees make?', o: ['Milk','Honey','Bread','Water'], a: 1 },
  { q: 'How many days in a week?', o: ['5','6','7','8'], a: 2 },
  { q: 'Which shape has 3 sides?', o: ['Square','Circle','Triangle','Rectangle'], a: 2 },
  { q: 'Where does a fish live?', o: ['Tree','Water','Ground','Sky'], a: 1 },
  { q: 'What color is an apple?', o: ['Blue','Red','Purple','Black'], a: 1 }
];
let gkIdx = 0, gkCan = true, gkScore = parseInt(store.get('pd_gk_score', 0), 10);

function gkInit() {
  gkIdx = 0; gkCan = true;
  $('gk-score').textContent = gkScore;
  $('gk-feedback').textContent = '';
  gkHideNext();
  gkLoadQ();
}
function gkHideNext() {
  const nb = $('btn-gk-next');
  nb.style.display = 'none';
}
function gkShowNext() {
  const nb = $('btn-gk-next');
  nb.style.display = 'inline-flex';
}
function gkLoadQ() {
  if (gkIdx >= gkQs.length) {
    $('gk-question').textContent = 'Quiz Complete!';
    $('gk-options').innerHTML = '';
    gkHideNext();
    return;
  }
  const q = gkQs[gkIdx];
  $('gk-question').textContent = q.q;
  const wrap = $('gk-options'); wrap.innerHTML = '';
  q.o.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'gk-option focusable';
    b.dataset.index = i;
    b.textContent = opt;
    b.addEventListener('click', () => gkAnswer(i, b));
    wrap.appendChild(b);
  });
  setTimeout(() => wrap.firstChild && wrap.firstChild.focus(), 60);
}
function gkAnswer(i, btn) {
  if (!gkCan) return;
  gkCan = false;
  const q = gkQs[gkIdx];
  const opts = document.querySelectorAll('#gk-options .gk-option');
  if (i === q.a) {
    gkScore += 10;
    btn.classList.add('correct');
    $('gk-feedback').textContent = 'Correct! +10';
    $('gk-feedback').style.color = 'var(--success)';
    feedback('correct');
  } else {
    gkScore = Math.max(0, gkScore - 5);
    btn.classList.add('wrong');
    opts[q.a].classList.add('correct');
    $('gk-feedback').textContent = 'Oops! -5';
    $('gk-feedback').style.color = 'var(--error)';
    feedback('wrong');
  }
  store.set('pd_gk_score', gkScore);
  $('gk-score').textContent = gkScore;
  gkShowNext();
  setTimeout(() => { $('btn-gk-next').focus(); $('btn-gk-next').scrollIntoView({behavior:'smooth', block:'center'}); }, 150);
}
$('btn-gk-next').addEventListener('click', () => {
  gkIdx++; gkCan = true;
  $('gk-feedback').textContent = '';
  gkHideNext();
  gkLoadQ();
});
$('card-gk').addEventListener('click', () => { gkInit(); showScreen('screen-gk'); });
$('btn-gk-back').addEventListener('click', () => showScreen('screen-home'));

/* ============================================================
   GAME 4 — COLORING BOOK
   ============================================================ */
const colorTemplates = [
  `<svg viewBox="0 0 300 300"><circle cx="50" cy="50" r="30" class="colorable focusable" tabindex="0" fill="#FFF" stroke="#3E2723" stroke-width="4"/><polygon points="50,150 150,50 250,150" class="colorable focusable" tabindex="0" fill="#FFF" stroke="#3E2723" stroke-width="4"/><rect x="80" y="150" width="140" height="120" class="colorable focusable" tabindex="0" fill="#FFF" stroke="#3E2723" stroke-width="4"/><rect x="130" y="200" width="40" height="70" class="colorable focusable" tabindex="0" fill="#FFF" stroke="#3E2723" stroke-width="4"/><rect x="100" y="170" width="30" height="30" class="colorable focusable" tabindex="0" fill="#FFF" stroke="#3E2723" stroke-width="4"/></svg>`,
  `<svg viewBox="0 0 300 300"><line x1="150" y1="280" x2="150" y2="150" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><ellipse cx="110" cy="220" rx="30" ry="15" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="190" cy="240" rx="30" ry="15" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="150" r="30" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="90" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="210" cy="150" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="210" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="90" cy="150" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><ellipse cx="130" cy="150" rx="80" ry="50" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="210,150 280,100 280,200" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="80" cy="130" r="10" fill="#3E2723"/><circle cx="160" cy="130" r="15" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="15" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="100" cy="110" rx="40" ry="50" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="200" cy="110" rx="40" ry="50" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="100" cy="190" rx="35" ry="45" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="200" cy="190" rx="35" ry="45" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><rect x="50" y="150" width="200" height="80" rx="20" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M80 150 L100 100 L200 100 L220 150 Z" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="100" cy="230" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="200" cy="230" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><rect x="130" y="150" width="40" height="100" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="100" r="60" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="90" cy="140" r="40" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="210" cy="140" r="40" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="60" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="40" x2="150" y2="70" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="150" y1="230" x2="150" y2="260" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="40" y1="150" x2="70" y2="150" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="230" y1="150" x2="260" y2="150" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><polygon points="150,50 180,120 260,120 200,170 220,250 150,210 80,250 100,170 40,120 120,120" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><path d="M150 250 C150 250 50 180 50 110 C50 60 90 40 120 60 C135 70 150 90 150 90 C150 90 165 70 180 60 C210 40 250 60 250 110 C250 180 150 250 150 250 Z" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><polygon points="50,180 250,180 220,250 80,250" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="50" x2="150" y2="180" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="150,50 150,150 80,150" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="150,50 150,150 220,150" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><path d="M150 30 C120 30 100 80 100 150 L100 230 L200 230 L200 150 C200 80 180 30 150 30 Z" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="120" r="25" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="100,200 60,260 100,260" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="200,200 240,260 200,260" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="80" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="80,100 100,40 130,80" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="220,100 200,40 170,80" fill="#FFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="120" cy="140" r="10" fill="#3E2723"/><circle cx="180" cy="140" r="10" fill="#3E2723"/><path d="M130 180 Q150 200 170 180" fill="none" stroke="#3E2723" stroke-width="4"/></svg>`
];
let colorPick = '#FFB300';
let colorIdx = 0;

function initColoring() {
  colorIdx = 0;
  $('btn-coloring-next').textContent = 'Next Picture';
  loadColoring();
}
function loadColoring() {
  const c = $('coloring-canvas');
  c.innerHTML = colorTemplates[colorIdx];
  c.querySelectorAll('.colorable').forEach(shape => {
    shape.addEventListener('click', () => {
      shape.setAttribute('fill', colorPick);
      feedback('pop');
      shape.style.transformOrigin = 'center';
      shape.style.transform = 'scale(1.06)';
      setTimeout(() => shape.style.transform = 'scale(1)', 150);
    });
  });
  setTimeout(() => {
    const first = c.querySelector('.focusable');
    if (first) first.focus();
  }, 60);
}
document.querySelectorAll('.color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    colorPick = sw.dataset.color;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    sw.classList.add('selected');
    const first = document.querySelector('#coloring-canvas .focusable');
    if (first) first.focus();
  });
});
$('card-coloring').addEventListener('click', () => { initColoring(); showScreen('screen-coloring'); });
$('btn-coloring-back').addEventListener('click', () => showScreen('screen-home'));
$('btn-coloring-next').addEventListener('click', () => {
  colorIdx = (colorIdx + 1) % colorTemplates.length;
  loadColoring();
});

/* ============================================================
   GAME 5 — SIMON SAYS
   ============================================================ */
let simonSeq = [], simonPlayerIx = 0, simonPlaying = false, simonAccepting = false;
let simonLevel = 0, simonBest = parseInt(store.get('pd_simon_best', 0), 10);

function simonLight(ix, dur = 500) {
  return new Promise(res => {
    const pads = document.querySelectorAll('.simon-pad');
    if (!pads[ix]) return res();
    pads[ix].classList.add('lit');
    tone(400 + ix * 200, 0.15, 'sine', 0.06);
    setTimeout(() => {
      pads[ix].classList.remove('lit');
      setTimeout(res, 160);
    }, dur);
  });
}
async function simonPlay() {
  simonPlaying = true; simonAccepting = false;
  $('simon-status').textContent = 'Watch the pattern!';
  await new Promise(r => setTimeout(r, 400));
  for (const ix of simonSeq) await simonLight(ix, Math.max(250, 600 - simonLevel * 25));
  simonPlaying = false; simonAccepting = true; simonPlayerIx = 0;
  $('simon-status').textContent = 'Your turn!';
}
function simonAddStep() {
  simonSeq.push(Math.floor(Math.random() * 4));
  simonLevel = simonSeq.length;
  $('simon-level').textContent = simonLevel;
}
function simonStart() {
  simonSeq = []; simonLevel = 0; simonPlayerIx = 0;
  simonPlaying = false; simonAccepting = false;
  $('simon-level').textContent = '0';
  $('simon-best').textContent = simonBest;
  $('btn-simon-start').classList.add('hidden');
  simonAddStep();
  simonPlay();
}
function simonPress(ix) {
  if (!simonAccepting) return;
  const pads = document.querySelectorAll('.simon-pad');
  pads[ix].classList.add('pressed');
  tone(400 + ix * 200, 0.1, 'sine', 0.05);
  setTimeout(() => pads[ix].classList.remove('pressed'), 180);
  if (simonSeq[simonPlayerIx] === ix) {
    simonPlayerIx++;
    if (simonPlayerIx === simonSeq.length) {
      simonAccepting = false;
      $('simon-status').textContent = 'Great! Next level...';
      setTimeout(() => { simonAddStep(); simonPlay(); }, 700);
    }
  } else {
    simonAccepting = false;
    const reached = simonLevel - 1;
    if (reached > simonBest) { simonBest = reached; store.set('pd_simon_best', simonBest); }
    $('simon-status').textContent = `Oops! Reached Level ${reached}`;
    $('simon-best').textContent = simonBest;
    const b = $('btn-simon-start');
    b.classList.remove('hidden'); b.textContent = 'Play Again';
    feedback('wrong');
    setTimeout(() => b.focus(), 100);
  }
}
document.querySelectorAll('.simon-pad').forEach(p => {
  p.addEventListener('click', () => simonPress(parseInt(p.dataset.index, 10)));
});
$('card-simon').addEventListener('click', () => {
  $('simon-best').textContent = simonBest;
  $('simon-level').textContent = '0';
  $('simon-status').textContent = 'Press Start to play!';
  const b = $('btn-simon-start');
  b.classList.remove('hidden'); b.textContent = 'Start Game';
  showScreen('screen-simon');
});
$('btn-simon-start').addEventListener('click', simonStart);
$('btn-simon-back').addEventListener('click', () => { simonAccepting = false; simonPlaying = false; showScreen('screen-home'); });

/* ============================================================
   GAME 6 — BUBBLE POP
   ============================================================ */
const B_LANES = 5, B_W = 320, B_H = 400;
let bubActive = false, bubScore = 0, bubTime = 60, bubLane = 2;
let bubTimer = null, bubSpawner = null, bubLoop = null, bubBest = parseInt(store.get('pd_bubble_best', 0), 10);
let bubList = [];
const B_COLORS = ['#4FC3F7','#FFB300','#81C784','#FF8A65','#FF5252','#9C27B0'];
const B_SIZES = [45, 55, 65];

function bubLaneX(l) { const w = B_W / B_LANES; return l * w + w / 2; }
function bubZoneUpdate() {
  const z = $('bubble-pop-zone');
  const x = bubLaneX(bubLane);
  z.style.left = (x - 35) + 'px';
}
function bubSpawn() {
  if (!bubActive) return;
  const size = B_SIZES[Math.floor(Math.random()*B_SIZES.length)];
  const x = 20 + Math.random()*(B_W - 40 - size);
  const color = B_COLORS[Math.floor(Math.random()*B_COLORS.length)];
  const el = document.createElement('div');
  el.className = 'bubble';
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.left = x + 'px';
  el.style.top = B_H + 'px';
  el.style.backgroundColor = color + 'CC';
  $('bubble-area').appendChild(el);
  bubList.push({ el, x: x + size/2, y: B_H, speed: 1.6 + Math.random()*0.9, size, pts: size >= 60 ? 10 : (size >= 50 ? 5 : 3) });
}
function bubTick() {
  if (!bubActive) return;
  for (let i = bubList.length-1; i >= 0; i--) {
    const b = bubList[i];
    b.y -= b.speed;
    b.el.style.top = b.y + 'px';
    if (b.y + b.size < 0) { b.el.remove(); bubList.splice(i,1); }
  }
  bubLoop = requestAnimationFrame(bubTick);
}
function bubPop(zoneX) {
  if (!bubActive) return;
  const area = $('bubble-area');
  let popped = 0;
  for (let i = bubList.length-1; i >= 0; i--) {
    const b = bubList[i];
    if (b.y > B_H - 140 && Math.abs(b.x - zoneX) < 55) {
      const fx = document.createElement('div');
      fx.className = 'pop-effect';
      fx.style.left = (b.x - 30) + 'px';
      fx.style.top = (b.y - 30) + 'px';
      area.appendChild(fx);
      setTimeout(() => fx.remove(), 500);
      bubScore += b.pts;
      $('bubble-score').textContent = bubScore;
      feedback('pop');
      b.el.remove();
      bubList.splice(i,1);
      popped++;
      if (popped >= 3) break;
    }
  }
  const z = $('bubble-pop-zone');
  z.style.transform = 'scale(1.2)';
  setTimeout(() => z.style.transform = 'scale(1)', 120);
}
function bubInit() {
  bubActive = true; bubScore = 0; bubTime = 60; bubLane = 2; bubList = [];
  $('bubble-score').textContent = '0';
  $('bubble-time').textContent = '60';
  $('bubble-game-over').classList.add('hidden');
  $('btn-bubble-start').classList.add('hidden');
  $('bubble-area').querySelectorAll('.bubble, .pop-effect').forEach(e => e.remove());
  bubZoneUpdate();
  clearInterval(bubTimer); clearInterval(bubSpawner);
  if (bubLoop) cancelAnimationFrame(bubLoop);
  bubTimer = setInterval(() => {
    bubTime--;
    $('bubble-time').textContent = bubTime;
    if (bubTime <= 0) bubEnd();
  }, 1000);
  bubSpawner = setInterval(bubSpawn, 750);
  bubLoop = requestAnimationFrame(bubTick);
}
function bubMove(dir) {
  if (!bubActive) return;
  bubLane = Math.max(0, Math.min(B_LANES-1, bubLane + dir));
  bubZoneUpdate();
}
function bubEnd() {
  bubActive = false;
  clearInterval(bubTimer); clearInterval(bubSpawner);
  if (bubLoop) cancelAnimationFrame(bubLoop);
  bubList.forEach(b => b.el.remove()); bubList = [];
  if (bubScore > bubBest) { bubBest = bubScore; store.set('pd_bubble_best', bubBest); }
  $('bubble-final-score').textContent = bubScore;
  $('bubble-game-over').classList.remove('hidden');
  setTimeout(() => $('btn-bubble-restart').focus(), 100);
}
$('card-bubble').addEventListener('click', () => {
  $('bubble-game-over').classList.add('hidden');
  $('btn-bubble-start').classList.remove('hidden');
  $('bubble-score').textContent = bubBest;
  $('bubble-time').textContent = '60';
  showScreen('screen-bubble');
});
$('btn-bubble-start').addEventListener('click', bubInit);
$('btn-bubble-restart').addEventListener('click', bubInit);
$('btn-bubble-back').addEventListener('click', () => {
  bubActive = false;
  clearInterval(bubTimer); clearInterval(bubSpawner);
  if (bubLoop) cancelAnimationFrame(bubLoop);
  bubList.forEach(b => b.el.remove()); bubList = [];
  showScreen('screen-home');
});
/* Tap or click on bubble area = move zone to tap & pop */
const bubbleArea = $('bubble-area');
function handleBubbleTap(clientX) {
  if (!bubActive) return;
  const rect = bubbleArea.getBoundingClientRect();
  const tapX = clientX - rect.left;
  const laneW = B_W / B_LANES;
  let lane = Math.floor(tapX / laneW);
  lane = Math.max(0, Math.min(B_LANES-1, lane));
  bubLane = lane;
  bubZoneUpdate();
  bubPop(bubLaneX(bubLane));
}
bubbleArea.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  handleBubbleTap(e.clientX);
});
/* D-pad on bubble screen */
document.addEventListener('keydown', (e) => {
  const s = document.querySelector('.screen.active');
  if (!s || s.id !== 'screen-bubble' || !bubActive) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); bubMove(-1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); bubMove(1); }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bubPop(bubLaneX(bubLane)); }
}, true);

/* ============================================================
   GAME 7 — WHACK-A-MOLE
   ============================================================ */
let whackActive = false, whackScore = 0, whackTime = 60;
let whackTimer = null, whackSpawner = null, whackHide = null;
let whackBest = parseInt(store.get('pd_whack_best', 0), 10);
const moleSVGs = [
  `<svg width="80" height="80" viewBox="0 0 80 80"><ellipse cx="30" cy="22" rx="6" ry="18" fill="#FFF" stroke="#3E2723" stroke-width="3"/><ellipse cx="50" cy="22" rx="6" ry="18" fill="#FFF" stroke="#3E2723" stroke-width="3"/><circle cx="40" cy="55" r="20" fill="#FFF" stroke="#3E2723" stroke-width="3"/><circle cx="33" cy="52" r="3" fill="#3E2723"/><circle cx="47" cy="52" r="3" fill="#3E2723"/><ellipse cx="40" cy="62" rx="4" ry="3" fill="#FFB6C1"/></svg>`,
  `<svg width="80" height="80" viewBox="0 0 80 80"><polygon points="22,32 28,10 40,26" fill="#FFB300" stroke="#3E2723" stroke-width="3"/><polygon points="58,32 52,10 40,26" fill="#FFB300" stroke="#3E2723" stroke-width="3"/><circle cx="40" cy="52" r="22" fill="#FFB300" stroke="#3E2723" stroke-width="3"/><circle cx="32" cy="50" r="3" fill="#3E2723"/><circle cx="48" cy="50" r="3" fill="#3E2723"/><path d="M34 60 Q40 65 46 60" stroke="#3E2723" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
  `<svg width="80" height="80" viewBox="0 0 80 80"><circle cx="22" cy="32" r="10" fill="#8B4513" stroke="#3E2723" stroke-width="3"/><circle cx="58" cy="32" r="10" fill="#8B4513" stroke="#3E2723" stroke-width="3"/><circle cx="40" cy="52" r="22" fill="#8B4513" stroke="#3E2723" stroke-width="3"/><circle cx="32" cy="50" r="3" fill="#3E2723"/><circle cx="48" cy="50" r="3" fill="#3E2723"/><ellipse cx="40" cy="60" rx="6" ry="4" fill="#FFE0B2"/></svg>`
];
function whackBuildGrid() {
  const g = $('whack-grid'); g.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const h = document.createElement('button');
    h.className = 'whack-hole focusable';
    h.dataset.index = i;
    h.innerHTML = '<div class="whack-mole"></div>';
    h.addEventListener('click', () => whackHit(h));
    g.appendChild(h);
  }
}
function whackInit() {
  whackActive = true; whackScore = 0; whackTime = 60;
  $('whack-score').textContent = '0';
  $('whack-time').textContent = '60';
  $('whack-game-over').classList.add('hidden');
  $('btn-whack-start').classList.add('hidden');
  whackBuildGrid();
  document.querySelector('.whack-hole[data-index="4"]').focus();
  clearInterval(whackTimer); clearTimeout(whackSpawner); clearTimeout(whackHide);
  whackTimer = setInterval(() => {
    whackTime--;
    $('whack-time').textContent = whackTime;
    if (whackTime <= 0) whackEnd();
  }, 1000);
  whackNext();
}
function whackNext() {
  if (!whackActive) return;
  whackSpawn();
  whackSpawner = setTimeout(whackNext, 700 + Math.random()*500);
}
function whackSpawn() {
  document.querySelectorAll('.whack-hole.active').forEach(h => h.classList.remove('active'));
  const holes = document.querySelectorAll('.whack-hole');
  const h = holes[Math.floor(Math.random()*9)];
  const m = h.querySelector('.whack-mole');
  m.innerHTML = moleSVGs[Math.floor(Math.random()*moleSVGs.length)];
  h.classList.add('active');
  h.dataset.active = 'true';
  clearTimeout(whackHide);
  whackHide = setTimeout(() => {
    h.classList.remove('active');
    h.dataset.active = 'false';
  }, 950);
}
function whackHit(hole) {
  if (!whackActive) return;
  if (hole.dataset.active !== 'true') return;
  whackScore += 5;
  feedback('pop');
  hole.dataset.active = 'false';
  hole.classList.remove('active');
  hole.classList.add('hit');
  setTimeout(() => hole.classList.remove('hit'), 320);
  const p = document.createElement('div');
  p.className = 'whack-popup';
  p.textContent = '+5';
  hole.appendChild(p);
  setTimeout(() => p.remove(), 700);
  $('whack-score').textContent = whackScore;
}
function whackEnd() {
  whackActive = false;
  clearInterval(whackTimer); clearTimeout(whackSpawner); clearTimeout(whackHide);
  document.querySelectorAll('.whack-hole.active').forEach(h => h.classList.remove('active'));
  if (whackScore > whackBest) { whackBest = whackScore; store.set('pd_whack_best', whackBest); }
  $('whack-final-score').textContent = whackScore;
  $('whack-game-over').classList.remove('hidden');
  setTimeout(() => $('btn-whack-restart').focus(), 100);
}
$('card-whack').addEventListener('click', () => {
  whackBuildGrid();
  $('whack-game-over').classList.add('hidden');
  $('btn-whack-start').classList.remove('hidden');
  $('whack-score').textContent = whackBest;
  $('whack-time').textContent = '60';
  showScreen('screen-whack');
});
$('btn-whack-start').addEventListener('click', whackInit);
$('btn-whack-restart').addEventListener('click', whackInit);
$('btn-whack-back').addEventListener('click', () => {
  whackActive = false;
  clearInterval(whackTimer); clearTimeout(whackSpawner); clearTimeout(whackHide);
  showScreen('screen-home');
});

/* ============================================================
   GAME 8 — DOT TO DOT
   ============================================================ */
const dotPuzzles = [
  { name: 'Star', close: true, pts: [ {x:150,y:40}, {x:235,y:130}, {x:200,y:255}, {x:100,y:255}, {x:65,y:130} ] },
  { name: 'Triangle', close: true, pts: [ {x:150,y:50}, {x:240,y:240}, {x:60,y:240} ] },
  { name: 'Square', close: true, pts: [ {x:70,y:70}, {x:230,y:70}, {x:230,y:230}, {x:70,y:230} ] },
  { name: 'House', close: true, pts: [ {x:60,y:140}, {x:150,y:50}, {x:240,y:140}, {x:240,y:250}, {x:60,y:250} ] },
  { name: 'Diamond', close: true, pts: [ {x:150,y:40}, {x:250,y:150}, {x:150,y:260}, {x:50,y:150} ] },
  { name: 'Arrow', close: true, pts: [ {x:60,y:150}, {x:180,y:150}, {x:180,y:90}, {x:260,y:180}, {x:180,y:270}, {x:180,y:210}, {x:60,y:210} ] }
];
let dotIx = 0, dotNext = 1;
function dotInit() { dotIx = 0; dotLoad(); }
function dotLoad() {
  const puzzle = dotPuzzles[dotIx];
  dotNext = 1;
  const area = $('dotdot-area');
  area.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 300 300');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  svg.id = 'dotdot-svg';
  area.appendChild(svg);
  puzzle.pts.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'dot-node focusable';
    b.dataset.n = i+1;
    b.textContent = i+1;
    b.style.left = p.x + 'px';
    b.style.top = p.y + 'px';
    b.addEventListener('click', () => dotClick(i+1, b));
    area.appendChild(b);
  });
  $('dotdot-status').textContent = `Connect 1 to ${puzzle.pts.length}!`;
  setTimeout(() => document.querySelector('.dot-node[data-n="1"]').focus(), 60);
}
function dotClick(n, btn) {
  const pz = dotPuzzles[dotIx];
  if (n !== dotNext) {
    btn.classList.add('shake');
    feedback('wrong');
    setTimeout(() => btn.classList.remove('shake'), 350);
    return;
  }
  feedback('click');
  if (n > 1) {
    const a = pz.pts[n-2], b = pz.pts[n-1];
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    line.setAttribute('stroke','#FFB300');
    line.setAttribute('stroke-width', 6);
    line.setAttribute('stroke-linecap','round');
    $('dotdot-svg').appendChild(line);
  }
  btn.classList.add('done');
  dotNext++;
  if (dotNext > pz.pts.length) {
    if (pz.close) {
      const l = pz.pts[pz.pts.length-1], f = pz.pts[0];
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', l.x); line.setAttribute('y1', l.y);
      line.setAttribute('x2', f.x); line.setAttribute('y2', f.y);
      line.setAttribute('stroke','#FFB300');
      line.setAttribute('stroke-width', 6);
      line.setAttribute('stroke-linecap','round');
      $('dotdot-svg').appendChild(line);
    }
    $('dotdot-status').textContent = `You drew a ${pz.name}!`;
    celebrate();
    setTimeout(() => { dotIx = (dotIx + 1) % dotPuzzles.length; dotLoad(); }, 1800);
  } else {
    setTimeout(() => {
      const nb = document.querySelector(`.dot-node[data-n="${dotNext}"]`);
      if (nb) nb.focus();
    }, 100);
  }
}
$('card-dotdot').addEventListener('click', () => { dotInit(); showScreen('screen-dotdot'); });
$('btn-dotdot-back').addEventListener('click', () => showScreen('screen-home'));
$('btn-dotdot-restart').addEventListener('click', dotLoad);

/* ============================================================
   GAME 9 — ODD ONE OUT
   ============================================================ */
let oddScore = parseInt(store.get('pd_odd_score', 0), 10);
let oddTarget = 0;
const oddShapes = [
  (c) => `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="${c}"/></svg>`,
  (c) => `<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="8" fill="${c}"/></svg>`,
  (c) => `<svg viewBox="0 0 64 64"><polygon points="32,6 58,56 6,56" fill="${c}"/></svg>`,
  (c) => `<svg viewBox="0 0 64 64"><polygon points="32,6 40,24 60,24 44,38 50,58 32,46 14,58 20,38 4,24 24,24" fill="${c}"/></svg>`
];
const oddColors = ['#4FC3F7','#FFB300','#81C784','#FF8A65','#9C27B0','#FF5252'];
function oddInit() {
  const g = $('odd-grid'); g.innerHTML = '';
  const fn = oddShapes[Math.floor(Math.random()*oddShapes.length)];
  const c1 = oddColors[Math.floor(Math.random()*oddColors.length)];
  let c2; do { c2 = oddColors[Math.floor(Math.random()*oddColors.length)]; } while (c2 === c1);
  oddTarget = Math.floor(Math.random()*9);
  for (let i = 0; i < 9; i++) {
    const b = document.createElement('button');
    b.className = 'odd-cell focusable';
    b.dataset.index = i;
    b.innerHTML = fn(i === oddTarget ? c2 : c1);
    b.addEventListener('click', () => oddClick(i, b));
    g.appendChild(b);
  }
  $('odd-score').textContent = oddScore;
  setTimeout(() => g.querySelector('.odd-cell[data-index="0"]').focus(), 60);
}
function oddClick(i, cell) {
  if (i === oddTarget) {
    cell.classList.add('correct-flash');
    oddScore += 10;
    store.set('pd_odd_score', oddScore);
    $('odd-score').textContent = oddScore;
    feedback('correct');
    setTimeout(oddInit, 550);
  } else {
    cell.classList.add('wrong-flash');
    feedback('wrong');
    setTimeout(() => cell.classList.remove('wrong-flash'), 500);
  }
}
$('card-odd').addEventListener('click', () => { oddInit(); showScreen('screen-odd'); });
$('btn-odd-back').addEventListener('click', () => showScreen('screen-home'));

/* ============================================================
   GAME 10 — TAP FAST (Reaction)
   ============================================================ */
let rxState = 'idle', rxTimeout = null, rxStart = 0;
let rxBest = parseInt(store.get('pd_rx_best', 0), 10) || 0;
function rxCircle(state, text) {
  const c = $('reaction-circle');
  c.classList.remove('waiting','ready','toosoon');
  if (state === 'waiting') c.classList.add('waiting');
  else if (state === 'ready') c.classList.add('ready');
  else if (state === 'toosoon') c.classList.add('toosoon');
  $('reaction-text').textContent = text;
}
function rxStartRound() {
  clearTimeout(rxTimeout);
  rxCircle('waiting', 'Wait...');
  rxState = 'waiting';
  const delay = 1500 + Math.random()*2500;
  rxTimeout = setTimeout(() => {
    if (rxState !== 'waiting') return;
    rxCircle('ready', 'TAP NOW!');
    rxState = 'ready';
    rxStart = performance.now();
  }, delay);
}
function rxPress() {
  if (rxState === 'idle') { rxStartRound(); return; }
  if (rxState === 'waiting') {
    clearTimeout(rxTimeout);
    rxState = 'idle';
    rxCircle('toosoon', 'Too soon! Tap to retry');
    feedback('wrong');
    return;
  }
  if (rxState === 'ready') {
    const t = Math.round(performance.now() - rxStart);
    rxState = 'idle';
    rxCircle('idle', t + ' ms — Tap to retry');
    if (rxBest === 0 || t < rxBest) { rxBest = t; store.set('pd_rx_best', rxBest); }
    $('reaction-best').textContent = rxBest;
    feedback('correct');
  }
}
$('reaction-circle').addEventListener('pointerdown', (e) => {
  e.preventDefault();
  rxPress();
});
$('card-reaction').addEventListener('click', () => {
  clearTimeout(rxTimeout);
  rxState = 'idle';
  rxCircle('idle', 'Tap to start');
  $('reaction-best').textContent = rxBest || '-';
  $('btn-reaction-start').classList.add('hidden');
  showScreen('screen-reaction');
});
$('btn-reaction-start').addEventListener('click', rxStartRound);
$('btn-reaction-back').addEventListener('click', () => {
  clearTimeout(rxTimeout);
  rxState = 'idle';
  showScreen('screen-home');
});

/* ============================================================
   BOOT
   ============================================================ */
window.addEventListener('load', () => {
  applyProfile();
  if (store.get('pd_onboarded', '') === '1') showScreen('screen-home');
  else showScreen('screen-welcome');
});
