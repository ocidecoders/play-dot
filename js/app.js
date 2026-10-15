// State Management
const getStoredData = (key, fallback) => localStorage.getItem(key) || fallback;
let playerName = getStoredData('playdot_name', 'Player');
let playerAvatarColor = getStoredData('playdot_avatar', '#FFB300');
let gkScore = parseInt(getStoredData('playdot_gk_score', 0));
let puzzleScore = parseInt(getStoredData('playdot_puzzle_score', 0));

// SVG Icons for Memory Game
const memoryIcons = [
  `<svg width="60" height="60" viewBox="0 0 64 64"><path d="M32 6 L40 24 L60 24 L44 38 L50 58 L32 46 L14 58 L20 38 L4 24 L24 24 Z" fill="#FFB300" stroke-linejoin="round"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><path d="M32 56 C32 56 6 38 6 20 C6 8 18 4 26 10 C30 14 32 18 32 18 C32 18 34 14 38 10 C46 4 58 8 58 20 C58 38 32 56 32 56 Z" fill="#FF8A65"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><rect x="10" y="26" width="44" height="18" rx="6" fill="#4FC3F7"/><path d="M20 26 L24 14 L40 14 L44 26 Z" fill="#4FC3F7"/><rect x="26" y="16" width="12" height="8" rx="2" fill="#FFF8E7"/><circle cx="20" cy="46" r="6" fill="#3E2723"/><circle cx="44" cy="46" r="6" fill="#3E2723"/><circle cx="20" cy="46" r="2" fill="#FFF8E7"/><circle cx="44" cy="46" r="2" fill="#FFF8E7"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><path d="M32 16 C32 16 26 8 18 10 C10 12 8 24 16 38 C24 52 32 58 32 58 C32 58 40 52 48 38 C56 24 54 12 46 10 C38 8 32 16 32 16 Z" fill="#FF5252"/><path d="M32 16 L32 6" stroke="#3E2723" stroke-width="4" stroke-linecap="round"/><path d="M32 12 C36 8 44 8 44 12 C44 16 36 16 32 12 Z" fill="#81C784"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="34" r="20" fill="#FFB300"/><polygon points="14,22 22,6 30,20" fill="#FFB300"/><polygon points="50,22 42,6 34,20" fill="#FFB300"/><circle cx="24" cy="32" r="3" fill="#3E2723"/><circle cx="40" cy="32" r="3" fill="#3E2723"/><circle cx="32" cy="40" r="2" fill="#3E2723"/><path d="M28 42 Q32 46 36 42" stroke="#3E2723" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="12" y1="38" x2="20" y2="40" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/><line x1="52" y1="38" x2="44" y2="40" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/></svg>`,
  `<svg width="60" height="60" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FFB300"/><line x1="32" y1="6" x2="32" y2="14" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="32" y1="50" x2="32" y2="58" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="6" y1="32" x2="14" y2="32" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="32" x2="58" y2="32" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="14" y1="14" x2="20" y2="20" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="14" x2="44" y2="20" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="14" y1="50" x2="20" y2="44" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="50" x2="44" y2="44" stroke="#FFB300" stroke-width="4" stroke-linecap="round"/></svg>`
];

// GK Questions Data
const gkQuestions = [
  { question: "What color is the sky?", options: ["Blue", "Red", "Green", "Yellow"], correct: 0 },
  { question: "How many legs does a dog have?", options: ["2", "3", "4", "5"], correct: 2 },
  { question: "Which animal is the King of the Jungle?", options: ["Tiger", "Lion", "Elephant", "Monkey"], correct: 1 },
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
  { question: "Which fruit is yellow and curved?", options: ["Apple", "Banana", "Grapes", "Orange"], correct: 1 },
  { question: "What do bees make?", options: ["Milk", "Honey", "Bread", "Water"], correct: 1 },
  { question: "How many days are in a week?", options: ["5", "6", "7", "8"], correct: 2 },
  { question: "Which shape has three sides?", options: ["Square", "Circle", "Triangle", "Rectangle"], correct: 2 },
  { question: "Where does a fish live?", options: ["Tree", "Water", "Ground", "Sky"], correct: 1 },
  { question: "What is the color of an apple?", options: ["Blue", "Red", "Purple", "Black"], correct: 1 }
];

// 22 Coloring Book Templates
const coloringTemplates = [
  // 1. House
  `<svg viewBox="0 0 300 300"><circle cx="50" cy="50" r="30" class="colorable focusable" tabindex="0" fill="#FFFFFF" stroke="#3E2723" stroke-width="4"/><polygon points="50,150 150,50 250,150" class="colorable focusable" tabindex="0" fill="#FFFFFF" stroke="#3E2723" stroke-width="4"/><rect x="80" y="150" width="140" height="120" class="colorable focusable" tabindex="0" fill="#FFFFFF" stroke="#3E2723" stroke-width="4"/><rect x="130" y="200" width="40" height="70" class="colorable focusable" tabindex="0" fill="#FFFFFF" stroke="#3E2723" stroke-width="4"/><rect x="100" y="170" width="30" height="30" class="colorable focusable" tabindex="0" fill="#FFFFFF" stroke="#3E2723" stroke-width="4"/><rect x="190" y="90" width="30" height="60" class="colorable focusable" tabindex="0" fill="#FFFFFF" stroke="#3E2723" stroke-width="4"/></svg>`,
  // 2. Flower
  `<svg viewBox="0 0 300 300"><line x1="150" y1="280" x2="150" y2="150" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><ellipse cx="110" cy="220" rx="30" ry="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="190" cy="240" rx="30" ry="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="150" r="30" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="90" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="210" cy="150" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="210" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="90" cy="150" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 3. Fish
  `<svg viewBox="0 0 300 300"><ellipse cx="130" cy="150" rx="80" ry="50" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="210,150 280,100 280,200" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="80" cy="130" r="10" fill="#3E2723"/><path d="M60 170 Q80 190 100 170" fill="none" stroke="#3E2723" stroke-width="4"/><circle cx="160" cy="130" r="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="180" cy="170" r="10" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 4. Butterfly
  `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="100" cy="110" rx="40" ry="50" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="200" cy="110" rx="40" ry="50" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="100" cy="190" rx="35" ry="45" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="200" cy="190" rx="35" ry="45" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="135" x2="150" y2="165" stroke="#3E2723" stroke-width="4"/></svg>`,
  // 5. Car
  `<svg viewBox="0 0 300 300"><rect x="50" y="150" width="200" height="80" rx="20" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M80 150 L100 100 L200 100 L220 150 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="110" y="110" width="30" height="30" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="160" y="110" width="30" height="30" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="100" cy="230" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="200" cy="230" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 6. Tree
  `<svg viewBox="0 0 300 300"><rect x="130" y="150" width="40" height="100" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="100" r="60" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="90" cy="140" r="40" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="210" cy="140" r="40" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 7. Sun
  `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="60" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="40" x2="150" y2="70" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="150" y1="230" x2="150" y2="260" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="40" y1="150" x2="70" y2="150" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="230" y1="150" x2="260" y2="150" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="70" y1="70" x2="90" y2="90" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="230" y1="70" x2="210" y2="90" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="70" y1="230" x2="90" y2="210" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="230" y1="230" x2="210" y2="210" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/></svg>`,
  // 8. Star
  `<svg viewBox="0 0 300 300"><polygon points="150,50 180,120 260,120 200,170 220,250 150,210 80,250 100,170 40,120 120,120" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 9. Heart
  `<svg viewBox="0 0 300 300"><path d="M150 250 C150 250 50 180 50 110 C50 60 90 40 120 60 C135 70 150 90 150 90 C150 90 165 70 180 60 C210 40 250 60 250 110 C250 180 150 250 150 250 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 10. Boat
  `<svg viewBox="0 0 300 300"><polygon points="50,180 250,180 220,250 80,250" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="50" x2="150" y2="180" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="150,50 150,150 80,150" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="150,50 150,150 220,150" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 11. Rocket
  `<svg viewBox="0 0 300 300"><path d="M150 30 C120 30 100 80 100 150 L100 230 L200 230 L200 150 C200 80 180 30 150 30 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="120" r="25" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="100,200 60,260 100,260" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="200,200 240,260 200,260" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="130,230 150,280 170,230" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 12. Cat Face
  `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="80" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="80,100 100,40 130,80" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="220,100 200,40 170,80" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="120" cy="140" r="10" fill="#3E2723"/><circle cx="180" cy="140" r="10" fill="#3E2723"/><path d="M130 180 Q150 200 170 180" fill="none" stroke="#3E2723" stroke-width="4"/><line x1="100" y1="170" x2="70" y2="160" stroke="#3E2723" stroke-width="4"/><line x1="200" y1="170" x2="230" y2="160" stroke="#3E2723" stroke-width="4"/></svg>`,
  // 13. Dog Face
  `<svg viewBox="0 0 300 300"><ellipse cx="150" cy="150" rx="70" ry="80" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="80" cy="150" rx="30" ry="60" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><ellipse cx="220" cy="150" rx="30" ry="60" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="120" cy="130" r="10" fill="#3E2723"/><circle cx="180" cy="130" r="10" fill="#3E2723"/><ellipse cx="150" cy="180" rx="20" ry="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="175" r="5" fill="#3E2723"/></svg>`,
  // 14. Ice Cream
  `<svg viewBox="0 0 300 300"><polygon points="100,200 200,200 150,280" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="140" r="50" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="90" r="40" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="60" r="10" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 15. Balloon
  `<svg viewBox="0 0 300 300"><ellipse cx="150" cy="120" rx="60" ry="80" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><polygon points="140,200 160,200 150,220" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M150 220 Q130 260 150 280" fill="none" stroke="#3E2723" stroke-width="4"/><path d="M120 120 Q150 100 180 120" fill="none" stroke="#3E2723" stroke-width="4"/></svg>`,
  // 16. Apple
  `<svg viewBox="0 0 300 300"><path d="M150 100 C150 100 120 60 80 80 C40 100 50 180 90 240 C110 270 150 280 150 280 C150 280 190 270 210 240 C250 180 260 100 220 80 C180 60 150 100 150 100 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="100" x2="150" y2="50" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><path d="M150 70 C170 50 200 50 200 70 C200 90 170 90 150 70 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 17. Cloud & Rain
  `<svg viewBox="0 0 300 300"><circle cx="100" cy="120" r="40" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="90" r="50" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="200" cy="120" r="40" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="100" y1="170" x2="90" y2="220" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="150" y1="170" x2="140" y2="220" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="200" y1="170" x2="190" y2="220" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/></svg>`,
  // 18. Robot
  `<svg viewBox="0 0 300 300"><rect x="80" y="80" width="140" height="140" rx="20" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="110" y="120" width="30" height="30" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="160" y="120" width="30" height="30" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="120" y="180" width="60" height="15" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><line x1="150" y1="80" x2="150" y2="40" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><circle cx="150" cy="30" r="10" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 19. Cupcake
  `<svg viewBox="0 0 300 300"><polygon points="100,200 200,200 180,280 120,280" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M100 200 C80 160 120 120 150 150 C180 120 220 160 200 200 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="150" cy="140" r="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 20. Train
  `<svg viewBox="0 0 300 300"><rect x="60" y="150" width="180" height="80" rx="10" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="80" y="100" width="60" height="50" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="180" y="120" width="40" height="30" rx="5" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="100" cy="240" r="20" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="200" cy="240" r="20" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="80" y="60" width="20" height="40" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 21. Mushroom
  `<svg viewBox="0 0 300 300"><path d="M50 150 C50 80 250 80 250 150 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><rect x="120" y="150" width="60" height="90" rx="10" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="100" cy="120" r="15" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="180" cy="110" r="20" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><circle cx="140" cy="140" r="10" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`,
  // 22. Umbrella
  `<svg viewBox="0 0 300 300"><path d="M40 150 C40 80 260 80 260 150 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M80 150 L60 120 L100 120 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M220 150 L240 120 L200 120 Z" fill="#FFFFFF" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/><path d="M150 150 L150 220 Q150 250 120 250" fill="none" stroke="#3E2723" stroke-width="6" class="colorable focusable" tabindex="0"/><line x1="150" y1="80" x2="150" y2="150" stroke="#3E2723" stroke-width="4" class="colorable focusable" tabindex="0"/></svg>`
];

// Screen Router
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  setTimeout(() => {
    const activeScreen = document.getElementById(screenId);
    const firstFocusable = activeScreen.querySelector('.focusable');
    if (firstFocusable) firstFocusable.focus();
  }, 50);
}

// --- Global D-pad Navigation ---
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;

  const activeScreen = document.querySelector('.screen.active');
  const focusable = Array.from(activeScreen.querySelectorAll('.focusable'));
  const currentFocus = document.activeElement;
  let index = focusable.indexOf(currentFocus);

  if (activeScreen.id === 'screen-gk' && currentFocus.classList.contains('gk-option')) {
    const currentIndex = parseInt(currentFocus.dataset.index);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' && currentIndex % 2 === 0) nextIndex = currentIndex + 1;
    else if (e.key === 'ArrowLeft' && currentIndex % 2 === 1) nextIndex = currentIndex - 1;
    else if (e.key === 'ArrowDown' && currentIndex < 2) nextIndex = currentIndex + 2;
    else if (e.key === 'ArrowUp' && currentIndex > 1) nextIndex = currentIndex - 2;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); currentFocus.click(); return; }
    if (nextIndex !== currentIndex) { e.preventDefault(); document.querySelector(`.gk-option[data-index="${nextIndex}"]`).focus(); }
    return;
  }

  if (activeScreen.id === 'screen-tictactoe' && currentFocus.classList.contains('ttt-cell')) {
    const currentIndex = parseInt(currentFocus.dataset.index);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' && currentIndex % 3 < 2) nextIndex = currentIndex + 1;
    else if (e.key === 'ArrowLeft' && currentIndex % 3 > 0) nextIndex = currentIndex - 1;
    else if (e.key === 'ArrowDown' && currentIndex < 6) nextIndex = currentIndex + 3;
    else if (e.key === 'ArrowUp' && currentIndex > 2) nextIndex = currentIndex - 3;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); currentFocus.click(); return; }
    if (nextIndex !== currentIndex) { e.preventDefault(); document.querySelector(`.ttt-cell[data-index="${nextIndex}"]`).focus(); }
    return;
  }

  if (activeScreen.id === 'screen-puzzle' && currentFocus.classList.contains('memory-card')) {
    const currentIndex = parseInt(currentFocus.dataset.index);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' && currentIndex % 4 < 3) nextIndex = currentIndex + 1;
    else if (e.key === 'ArrowLeft' && currentIndex % 4 > 0) nextIndex = currentIndex - 1;
    else if (e.key === 'ArrowDown' && currentIndex < 8) nextIndex = currentIndex + 4;
    else if (e.key === 'ArrowUp' && currentIndex > 3) nextIndex = currentIndex - 4;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); currentFocus.click(); return; }
    if (nextIndex !== currentIndex) { e.preventDefault(); document.querySelector(`.memory-card[data-index="${nextIndex}"]`).focus(); }
    return;
  }

  // General Navigation
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault(); if (index < focusable.length - 1) focusable[index + 1].focus();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault(); if (index > 0) focusable[index - 1].focus();
  } else if (e.key === 'Enter') {
    e.preventDefault(); if (currentFocus && (currentFocus.tagName === 'BUTTON' || currentFocus.classList.contains('focusable'))) currentFocus.click();
  }
});

// --- Onboarding Logic ---
document.getElementById('btn-start').addEventListener('click', () => showScreen('screen-age'));
document.querySelectorAll('.age-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const age = parseInt(e.target.textContent);
    if (age >= 5 && age <= 12) { localStorage.setItem('playdot_age', age); showScreen('screen-name'); }
  });
});
const nameInput = document.getElementById('name-input');
const randomNames = ["Star", "Sunny", "Bunny", "Panda", "Rocket", "Comet", "Pixel", "Joy", "Doodle", "Fuzz"];
document.getElementById('btn-random-name').addEventListener('click', () => { nameInput.value = randomNames[Math.floor(Math.random() * randomNames.length)]; });
document.getElementById('btn-name-next').addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) { playerName = name; localStorage.setItem('playdot_name', name); showScreen('screen-avatar'); } else { nameInput.focus(); }
});
const avatarCircle = document.getElementById('avatar-circle');
const colorBtns = document.querySelectorAll('.color-btn');
avatarCircle.style.backgroundColor = playerAvatarColor;
colorBtns.forEach(btn => { btn.style.borderColor = (btn.dataset.color === playerAvatarColor) ? 'var(--text-color)' : 'white'; });
colorBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    playerAvatarColor = e.target.dataset.color;
    avatarCircle.style.backgroundColor = playerAvatarColor;
    colorBtns.forEach(b => b.style.borderColor = 'white');
    e.target.style.borderColor = 'var(--text-color)';
  });
});
document.getElementById('btn-avatar-save').addEventListener('click', () => {
  localStorage.setItem('playdot_avatar', playerAvatarColor);
  localStorage.setItem('playdot_onboarded', 'true');
  document.getElementById('display-name').textContent = playerName;
  document.getElementById('home-avatar').style.backgroundColor = playerAvatarColor;
  showScreen('screen-home');
});

// --- Settings Logic ---
document.getElementById('btn-open-settings').addEventListener('click', () => showScreen('screen-settings'));
document.getElementById('btn-settings-back').addEventListener('click', () => showScreen('screen-home'));
document.getElementById('btn-reset-app').addEventListener('click', () => {
  localStorage.clear();
  playerName = 'Player'; playerAvatarColor = '#FFB300'; gkScore = 0; puzzleScore = 0;
  document.getElementById('display-name').textContent = playerName;
  document.getElementById('home-avatar').style.backgroundColor = playerAvatarColor;
  document.getElementById('gk-score').textContent = gkScore;
  document.getElementById('puzzle-score').textContent = puzzleScore;
  showScreen('screen-welcome');
});

// ==========================================
// COLORING BOOK LOGIC
// ==========================================
let selectedColor = '#FFB300';
let currentColoringIndex = 0;

function initColoringGame() {
  currentColoringIndex = 0;
  loadColoringTemplate();
}

function loadColoringTemplate() {
  const canvas = document.getElementById('coloring-canvas');
  canvas.innerHTML = coloringTemplates[currentColoringIndex];
  
  // Add event listeners to the SVG shapes
  canvas.querySelectorAll('.colorable').forEach(shape => {
    shape.addEventListener('click', (e) => {
      e.target.setAttribute('fill', selectedColor);
      // Add a small pop animation
      e.target.style.transformOrigin = 'center';
      e.target.style.transform = 'scale(1.05)';
      setTimeout(() => { e.target.style.transform = 'scale(1)'; }, 150);
    });
  });

  // Focus the first shape
  setTimeout(() => {
    const firstShape = canvas.querySelector('.focusable');
    if (firstShape) firstShape.focus();
  }, 50);
}

// Color Swatch Selection
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', (e) => {
    // Update selected color
    selectedColor = e.target.dataset.color;
    
    // Update UI
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
    e.target.classList.add('selected');
    
    // Focus back to the canvas
    const firstShape = document.querySelector('#coloring-canvas .focusable');
    if (firstShape) firstShape.focus();
  });
});

document.getElementById('card-coloring').addEventListener('click', () => {
  initColoringGame();
  showScreen('screen-coloring');
});

document.getElementById('btn-coloring-back').addEventListener('click', () => showScreen('screen-home'));

document.getElementById('btn-coloring-next').addEventListener('click', () => {
  currentColoringIndex = (currentColoringIndex + 1) % coloringTemplates.length;
  loadColoringTemplate();
});

// ==========================================
// GK QUIZ GAME LOGIC
// ==========================================
let currentGkIndex = 0;
let gkCanAnswer = true;

function initGkGame() {
  currentGkIndex = 0; gkCanAnswer = true;
  document.getElementById('gk-score').textContent = gkScore;
  document.getElementById('gk-feedback').textContent = '';
  document.getElementById('btn-gk-next').classList.add('hidden');
  loadGkQuestion();
}

function loadGkQuestion() {
  if (currentGkIndex >= gkQuestions.length) {
    document.getElementById('gk-question').textContent = "Quiz Complete!";
    document.getElementById('gk-options').innerHTML = '';
    document.getElementById('btn-gk-next').classList.add('hidden');
    return;
  }
  const q = gkQuestions[currentGkIndex];
  document.getElementById('gk-question').textContent = q.question;
  const optionsContainer = document.getElementById('gk-options');
  optionsContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'gk-option focusable'; btn.dataset.index = i; btn.textContent = opt; btn.tabIndex = 0;
    btn.addEventListener('click', () => handleGkAnswer(i, btn));
    optionsContainer.appendChild(btn);
  });
  setTimeout(() => { if(optionsContainer.firstChild) optionsContainer.firstChild.focus(); }, 50);
}

function handleGkAnswer(selectedIndex, btn) {
  if (!gkCanAnswer) return;
  gkCanAnswer = false;
  const q = gkQuestions[currentGkIndex];
  const feedback = document.getElementById('gk-feedback');
  const allOptions = document.querySelectorAll('.gk-option');

  if (selectedIndex === q.correct) {
    gkScore += 10; btn.classList.add('correct');
    feedback.textContent = "Correct! +10"; feedback.style.color = "var(--success)";
  } else {
    gkScore = Math.max(0, gkScore - 5); btn.classList.add('wrong');
    allOptions[q.correct].classList.add('correct');
    feedback.textContent = "Oops! -5"; feedback.style.color = "var(--error)";
  }
  localStorage.setItem('playdot_gk_score', gkScore);
  document.getElementById('gk-score').textContent = gkScore;
  const nextBtn = document.getElementById('btn-gk-next');
  nextBtn.classList.remove('hidden');
  setTimeout(() => nextBtn.focus(), 100);
}

document.getElementById('btn-gk-next').addEventListener('click', () => {
  currentGkIndex++; gkCanAnswer = true;
  document.getElementById('gk-feedback').textContent = '';
  document.getElementById('btn-gk-next').classList.add('hidden');
  loadGkQuestion();
});
document.getElementById('card-gk').addEventListener('click', () => { initGkGame(); showScreen('screen-gk'); });
document.getElementById('btn-gk-back').addEventListener('click', () => showScreen('screen-home'));

// ==========================================
// PUZZLE GAME LOGIC (Memory Match)
// ==========================================
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let isMemoryLocked = false;

function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  memoryCards = [...memoryIcons, ...memoryIcons];
  memoryCards.sort(() => Math.random() - 0.5);
  
  flippedCards = []; matchedPairs = 0; isMemoryLocked = false;
  document.getElementById('puzzle-status').textContent = "Find the pairs!";
  document.getElementById('puzzle-score').textContent = puzzleScore;

  memoryCards.forEach((icon, index) => {
    const card = document.createElement('button');
    card.className = 'memory-card focusable';
    card.dataset.index = index; card.dataset.icon = icon; card.tabIndex = 0;
    card.innerHTML = `<div class="card-inner"><div class="card-back"></div><div class="card-front">${icon}</div></div>`;
    card.addEventListener('click', () => handleMemoryClick(card));
    grid.appendChild(card);
  });
  setTimeout(() => { if(grid.firstChild) grid.firstChild.focus(); }, 50);
}

function handleMemoryClick(card) {
  if (isMemoryLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    isMemoryLocked = true;
    const [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
      card1.classList.add('matched'); card2.classList.add('matched');
      card1.insertAdjacentHTML('beforeend', '<div class="match-text">Matched!</div>');
      card2.insertAdjacentHTML('beforeend', '<div class="match-text">Matched!</div>');

      flippedCards = []; isMemoryLocked = false; matchedPairs++;
      puzzleScore += 5;
      localStorage.setItem('playdot_puzzle_score', puzzleScore);
      document.getElementById('puzzle-score').textContent = puzzleScore;

      if (matchedPairs === memoryIcons.length) {
        document.getElementById('puzzle-status').textContent = "You Win! Great Job!";
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped'); card2.classList.remove('flipped');
        flippedCards = []; isMemoryLocked = false;
      }, 800);
    }
  }
}

document.getElementById('card-puzzle').addEventListener('click', () => { initMemoryGame(); showScreen('screen-puzzle'); });
document.getElementById('btn-puzzle-back').addEventListener('click', () => showScreen('screen-home'));
document.getElementById('btn-puzzle-restart').addEventListener('click', initMemoryGame);

// ==========================================
// TIC-TAC-TOE GAME LOGIC
// ==========================================
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let isPlayerTurn = true;
let gameActive = false;
const winPatterns = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function resetTTT() {
  tttBoard = ['', '', '', '', '', '', '', '', ''];
  isPlayerTurn = true; gameActive = true;
  document.getElementById('ttt-status').textContent = "Your Turn";
  document.querySelectorAll('.ttt-cell').forEach(cell => { cell.textContent = ''; cell.classList.remove('x-move', 'o-move'); });
  document.querySelector('.ttt-cell[data-index="0"]').focus();
}

function checkWin(board, player) { return winPatterns.some(p => p.every(i => board[i] === player)); }
function checkTie(board) { return board.every(cell => cell !== ''); }

function botMove() {
  if (!gameActive) return;
  let move = -1;
  for (let i = 0; i < 9; i++) { if (tttBoard[i] === '') { tttBoard[i] = 'O'; if (checkWin(tttBoard, 'O')) { move = i; tttBoard[i] = ''; break; } tttBoard[i] = ''; } }
  if (move === -1) { for (let i = 0; i < 9; i++) { if (tttBoard[i] === '') { tttBoard[i] = 'X'; if (checkWin(tttBoard, 'X')) { move = i; tttBoard[i] = ''; break; } tttBoard[i] = ''; } } }
  if (move === -1 && tttBoard[4] === '') move = 4;
  if (move === -1) { const empty = tttBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null); move = empty[Math.floor(Math.random() * empty.length)]; }
  tttBoard[move] = 'O';
  const cell = document.querySelector(`.ttt-cell[data-index="${move}"]`);
  cell.classList.add('o-move');
  if (checkWin(tttBoard, 'O')) { document.getElementById('ttt-status').textContent = "Bot Wins! Try Again."; gameActive = false; }
  else if (checkTie(tttBoard)) { document.getElementById('ttt-status').textContent = "It's a Tie!"; gameActive = false; }
  else { isPlayerTurn = true; document.getElementById('ttt-status').textContent = "Your Turn"; }
}

document.querySelectorAll('.ttt-cell').forEach(cell => {
  cell.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (!gameActive || !isPlayerTurn || tttBoard[index] !== '') return;
    tttBoard[index] = 'X'; e.target.classList.add('x-move');
    if (checkWin(tttBoard, 'X')) { document.getElementById('ttt-status').textContent = "You Win! Great Job!"; gameActive = false; return; }
    else if (checkTie(tttBoard)) { document.getElementById('ttt-status').textContent = "It's a Tie!"; gameActive = false; return; }
    isPlayerTurn = false; document.getElementById('ttt-status').textContent = "Bot's Turn...";
    setTimeout(botMove, 600);
  });
});

document.getElementById('card-tictactoe').addEventListener('click', () => { resetTTT(); showScreen('screen-tictactoe'); });
document.getElementById('btn-ttt-back').addEventListener('click', () => { gameActive = false; showScreen('screen-home'); });
document.getElementById('btn-ttt-restart').addEventListener('click', resetTTT);

// Initialize App
window.onload = () => {
  document.getElementById('display-name').textContent = playerName;
  document.getElementById('home-avatar').style.backgroundColor = playerAvatarColor;
  document.getElementById('gk-score').textContent = gkScore;
  document.getElementById('puzzle-score').textContent = puzzleScore;
  if (localStorage.getItem('playdot_onboarded') === 'true') showScreen('screen-home');
  else showScreen('screen-welcome');
};

// ==========================================
// WHACK-A-MOLE GAME LOGIC
// ==========================================
let whackActive = false;
let whackScore = 0;
let whackTimeLeft = 60;
let whackTimer = null;
let whackMoleTimer = null;
let whackHideTimer = null;
let whackHighScore = parseInt(getStoredData('playdot_whack_score', 0));

const whackMoleSVGs = [
  // Bunny
  `<svg width="80" height="80" viewBox="0 0 80 80">
    <ellipse cx="30" cy="22" rx="6" ry="18" fill="#FFFFFF" stroke="#3E2723" stroke-width="3"/>
    <ellipse cx="50" cy="22" rx="6" ry="18" fill="#FFFFFF" stroke="#3E2723" stroke-width="3"/>
    <circle cx="40" cy="55" r="20" fill="#FFFFFF" stroke="#3E2723" stroke-width="3"/>
    <circle cx="33" cy="52" r="3" fill="#3E2723"/>
    <circle cx="47" cy="52" r="3" fill="#3E2723"/>
    <ellipse cx="40" cy="62" rx="4" ry="3" fill="#FFB6C1"/>
  </svg>`,
  // Cat
  `<svg width="80" height="80" viewBox="0 0 80 80">
    <polygon points="22,32 28,10 40,26" fill="#FFB300" stroke="#3E2723" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="58,32 52,10 40,26" fill="#FFB300" stroke="#3E2723" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="40" cy="52" r="22" fill="#FFB300" stroke="#3E2723" stroke-width="3"/>
    <circle cx="32" cy="50" r="3" fill="#3E2723"/>
    <circle cx="48" cy="50" r="3" fill="#3E2723"/>
    <path d="M34 60 Q40 65 46 60" stroke="#3E2723" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`,
  // Bear
  `<svg width="80" height="80" viewBox="0 0 80 80">
    <circle cx="22" cy="32" r="10" fill="#8B4513" stroke="#3E2723" stroke-width="3"/>
    <circle cx="58" cy="32" r="10" fill="#8B4513" stroke="#3E2723" stroke-width="3"/>
    <circle cx="40" cy="52" r="22" fill="#8B4513" stroke="#3E2723" stroke-width="3"/>
    <circle cx="32" cy="50" r="3" fill="#3E2723"/>
    <circle cx="48" cy="50" r="3" fill="#3E2723"/>
    <ellipse cx="40" cy="60" rx="6" ry="4" fill="#FFE0B2"/>
    <circle cx="40" cy="58" r="2" fill="#3E2723"/>
  </svg>`
];

function initWhackGrid() {
  const grid = document.getElementById('whack-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('button');
    hole.className = 'whack-hole focusable';
    hole.dataset.index = i;
    hole.tabIndex = 0;
    hole.innerHTML = `<div class="whack-mole"></div>`;
    hole.addEventListener('click', () => whackHit(i, hole));
    grid.appendChild(hole);
  }
}

function initWhackGame() {
  whackActive = true;
  whackScore = 0;
  whackTimeLeft = 60;
  document.getElementById('whack-score').textContent = '0';
  document.getElementById('whack-time').textContent = '60';
  document.getElementById('whack-game-over').classList.add('hidden');
  document.getElementById('btn-whack-start').classList.add('hidden');

  initWhackGrid();
  document.querySelector('.whack-hole[data-index="4"]').focus();

  // Countdown timer
  whackTimer = setInterval(() => {
    whackTimeLeft--;
    document.getElementById('whack-time').textContent = whackTimeLeft;
    if (whackTimeLeft <= 0) endWhackGame();
  }, 1000);

  // Mole spawner
  scheduleNextMole();
}

function scheduleNextMole() {
  if (!whackActive) return;
  spawnWhackMole();
  whackMoleTimer = setTimeout(scheduleNextMole, 700 + Math.random() * 500);
}

function spawnWhackMole() {
  // Hide any currently active hole first
  document.querySelectorAll('.whack-hole.active').forEach(h => h.classList.remove('active'));

  const holes = document.querySelectorAll('.whack-hole');
  const randIndex = Math.floor(Math.random() * 9);
  const hole = holes[randIndex];
  const moleInner = hole.querySelector('.whack-mole');

  // Set a random mole SVG
  moleInner.innerHTML = whackMoleSVGs[Math.floor(Math.random() * whackMoleSVGs.length)];

  hole.classList.add('active');
  hole.dataset.active = 'true';

  // Auto-hide after a bit
  if (whackHideTimer) clearTimeout(whackHideTimer);
  whackHideTimer = setTimeout(() => {
    hole.classList.remove('active');
    hole.dataset.active = 'false';
  }, 900);
}

function whackHit(index, hole) {
  if (!whackActive) return;
  if (hole.dataset.active === 'true') {
    whackScore += 5;
    hole.dataset.active = 'false';
    hole.classList.remove('active');
    hole.classList.add('hit');
    setTimeout(() => hole.classList.remove('hit'), 300);

    // Show +5 popup
    const popup = document.createElement('div');
    popup.className = 'whack-popup';
    popup.textContent = '+5';
    hole.appendChild(popup);
    setTimeout(() => popup.remove(), 700);

    document.getElementById('whack-score').textContent = whackScore;
  }
}

function endWhackGame() {
  whackActive = false;
  if (whackTimer) clearInterval(whackTimer);
  if (whackMoleTimer) clearTimeout(whackMoleTimer);
  if (whackHideTimer) clearTimeout(whackHideTimer);
  document.querySelectorAll('.whack-hole.active').forEach(h => h.classList.remove('active'));

  if (whackScore > whackHighScore) {
    whackHighScore = whackScore;
    localStorage.setItem('playdot_whack_score', whackHighScore);
  }

  document.getElementById('whack-final-score').textContent = whackScore;
  document.getElementById('whack-game-over').classList.remove('hidden');
  setTimeout(() => document.getElementById('btn-whack-restart').focus(), 100);
}

// Button/listener wiring for Whack-a-Mole
document.getElementById('card-whack').addEventListener('click', () => {
  initWhackGrid();
  document.getElementById('whack-game-over').classList.add('hidden');
  document.getElementById('btn-whack-start').classList.remove('hidden');
  document.getElementById('whack-score').textContent = whackHighScore;
  document.getElementById('whack-time').textContent = '60';
  showScreen('screen-whack');
});

document.getElementById('btn-whack-start').addEventListener('click', initWhackGame);
document.getElementById('btn-whack-restart').addEventListener('click', initWhackGame);
document.getElementById('btn-whack-back').addEventListener('click', () => {
  whackActive = false;
  if (whackTimer) clearInterval(whackTimer);
  if (whackMoleTimer) clearTimeout(whackMoleTimer);
  if (whackHideTimer) clearTimeout(whackHideTimer);
  showScreen('screen-home');
});

// Special D-pad nav for whack grid (3 columns)
document.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen.id !== 'screen-whack') return;
  const currentFocus = document.activeElement;
  if (!currentFocus.classList.contains('whack-hole')) return;
  const currentIndex = parseInt(currentFocus.dataset.index);
  let nextIndex = currentIndex;

  if (e.key === 'ArrowRight' && currentIndex % 3 < 2) nextIndex = currentIndex + 1;
  else if (e.key === 'ArrowLeft' && currentIndex % 3 > 0) nextIndex = currentIndex - 1;
  else if (e.key === 'ArrowDown' && currentIndex < 6) nextIndex = currentIndex + 3;
  else if (e.key === 'ArrowUp' && currentIndex > 2) nextIndex = currentIndex - 3;
  else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    currentFocus.click();
    return;
  } else {
    return;
  }

  e.preventDefault();
  document.querySelector(`.whack-hole[data-index="${nextIndex}"]`).focus();
}, true);

// ==========================================
// SIMON SAYS GAME LOGIC
// ==========================================
let simonSequence = [];
let simonPlayerIndex = 0;
let simonPlaying = false;   // true when showing sequence
let simonAccepting = false; // true when accepting player input
let simonLevel = 0;
let simonBest = parseInt(getStoredData('playdot_simon_best', 0));

const simonPads = () => document.querySelectorAll('.simon-pad');

function simonLightPad(index, duration = 500) {
  return new Promise(resolve => {
    const pads = simonPads();
    if (!pads[index]) return resolve();
    pads[index].classList.add('lit');
    setTimeout(() => {
      pads[index].classList.remove('lit');
      setTimeout(resolve, 180);
    }, duration);
  });
}

async function playSimonSequence() {
  simonPlaying = true;
  simonAccepting = false;
  document.getElementById('simon-status').textContent = 'Watch the pattern!';

  await new Promise(r => setTimeout(r, 500));

  for (let i = 0; i < simonSequence.length; i++) {
    await simonLightPad(simonSequence[i], Math.max(250, 600 - simonLevel * 25));
  }

  simonPlaying = false;
  simonAccepting = true;
  simonPlayerIndex = 0;
  document.getElementById('simon-status').textContent = 'Your turn!';
}

function simonAddStep() {
  const next = Math.floor(Math.random() * 4);
  simonSequence.push(next);
  simonLevel = simonSequence.length;
  document.getElementById('simon-level').textContent = simonLevel;
}

function simonStartGame() {
  simonSequence = [];
  simonLevel = 0;
  simonPlayerIndex = 0;
  simonPlaying = false;
  simonAccepting = false;
  document.getElementById('simon-level').textContent = '0';
  document.getElementById('simon-best').textContent = simonBest;
  document.getElementById('btn-simon-start').classList.add('hidden');

  simonAddStep();
  playSimonSequence();
}

function simonHandlePress(index) {
  if (!simonAccepting) return;
  const pads = simonPads();
  pads[index].classList.add('pressed');
  setTimeout(() => pads[index].classList.remove('pressed'), 180);

  if (simonSequence[simonPlayerIndex] === index) {
    simonPlayerIndex++;
    if (simonPlayerIndex === simonSequence.length) {
      // Round complete
      simonAccepting = false;
      document.getElementById('simon-status').textContent = 'Great! Next level...';
      setTimeout(() => {
        simonAddStep();
        playSimonSequence();
      }, 700);
    }
  } else {
    // Wrong
    simonAccepting = false;
    const reachedLevel = simonLevel - 1;
    if (reachedLevel > simonBest) {
      simonBest = reachedLevel;
      localStorage.setItem('playdot_simon_best', simonBest);
    }
    document.getElementById('simon-status').textContent = `Oops! You reached Level ${reachedLevel}`;
    document.getElementById('simon-best').textContent = simonBest;
    document.getElementById('btn-simon-start').classList.remove('hidden');
    document.getElementById('btn-simon-start').textContent = 'Play Again';
    setTimeout(() => document.getElementById('btn-simon-start').focus(), 100);
  }
}

// Wire pad clicks
document.querySelectorAll('.simon-pad').forEach(pad => {
  pad.addEventListener('click', () => {
    const idx = parseInt(pad.dataset.index);
    if (simonAccepting || (!simonPlaying && !simonAccepting && simonLevel === 0)) {
      simonHandlePress(idx);
    }
  });
});

// Card + buttons
document.getElementById('card-simon').addEventListener('click', () => {
  document.getElementById('simon-best').textContent = simonBest;
  document.getElementById('simon-level').textContent = '0';
  document.getElementById('simon-status').textContent = 'Press Start to play!';
  document.getElementById('btn-simon-start').classList.remove('hidden');
  document.getElementById('btn-simon-start').textContent = 'Start Game';
  showScreen('screen-simon');
});

document.getElementById('btn-simon-start').addEventListener('click', simonStartGame);
document.getElementById('btn-simon-back').addEventListener('click', () => {
  simonAccepting = false;
  simonPlaying = false;
  showScreen('screen-home');
});

// Special D-pad nav for 2x2 Simon grid
document.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen.id !== 'screen-simon') return;
  const currentFocus = document.activeElement;
  if (!currentFocus.classList.contains('simon-pad')) return;
  const currentIndex = parseInt(currentFocus.dataset.index);
  let nextIndex = currentIndex;

  if (e.key === 'ArrowRight' && currentIndex % 2 === 0) nextIndex = currentIndex + 1;
  else if (e.key === 'ArrowLeft' && currentIndex % 2 === 1) nextIndex = currentIndex - 1;
  else if (e.key === 'ArrowDown' && currentIndex < 2) nextIndex = currentIndex + 2;
  else if (e.key === 'ArrowUp' && currentIndex > 1) nextIndex = currentIndex - 2;
  else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    currentFocus.click();
    return;
  } else {
    return;
  }
  e.preventDefault();
  document.querySelector(`.simon-pad[data-index="${nextIndex}"]`).focus();
}, true);

// ==========================================
// BUBBLE POP GAME LOGIC
// ==========================================
let bubbleActive = false;
let bubbleScore = 0;
let bubbleTimeLeft = 60;
let bubbleTimer = null;
let bubbleSpawner = null;
let bubbleLoop = null;
let bubbleLane = 2; // 0..4 (5 lanes)
let bubbleHighScore = parseInt(getStoredData('playdot_bubble_score', 0));
let activeBubbles = []; // { el, x, y, speed, size, points }

const BUBBLE_LANES = 5;
const BUBBLE_AREA_W = 320;
const BUBBLE_AREA_H = 400;
const BUBBLE_COLORS = ['#4FC3F7', '#FFB300', '#81C784', '#FF8A65', '#FF5252', '#9C27B0'];
const BUBBLE_SIZES = [45, 55, 65]; // small, medium, large

function bubbleLaneToX(lane) {
  const laneW = BUBBLE_AREA_W / BUBBLE_LANES;
  return lane * laneW + laneW / 2;
}

function updateBubbleZone() {
  const zone = document.getElementById('bubble-pop-zone');
  const x = bubbleLaneToX(bubbleLane);
  zone.style.left = (x - 35) + 'px';
}

function spawnBubble() {
  if (!bubbleActive) return;
  const size = BUBBLE_SIZES[Math.floor(Math.random() * BUBBLE_SIZES.length)];
  const x = 20 + Math.random() * (BUBBLE_AREA_W - 40 - size);
  const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];

  const el = document.createElement('div');
  el.className = 'bubble';
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.left = x + 'px';
  el.style.top = BUBBLE_AREA_H + 'px';
  el.style.backgroundColor = color + 'CC';
  document.getElementById('bubble-area').appendChild(el);

  activeBubbles.push({
    el, x: x + size / 2, y: BUBBLE_AREA_H,
    speed: 1.5 + Math.random() * 0.8,
    size, points: size >= 60 ? 10 : (size >= 50 ? 5 : 3)
  });
}

function bubbleGameLoop() {
  if (!bubbleActive) return;
  for (let i = activeBubbles.length - 1; i >= 0; i--) {
    const b = activeBubbles[i];
    b.y -= b.speed;
    b.el.style.top = b.y + 'px';
    if (b.y + b.size < 0) {
      b.el.remove();
      activeBubbles.splice(i, 1);
    }
  }
  bubbleLoop = requestAnimationFrame(bubbleGameLoop);
}

function popBubblesAtZone() {
  if (!bubbleActive) return;
  const zoneX = bubbleLaneToX(bubbleLane);
  let popped = 0;
  const area = document.getElementById('bubble-area');

  for (let i = activeBubbles.length - 1; i >= 0; i--) {
    const b = activeBubbles[i];
    // Pop if bubble is near bottom AND near zone horizontally
    if (b.y > BUBBLE_AREA_H - 130 && Math.abs(b.x - zoneX) < 55) {
      // Pop effect
      const fx = document.createElement('div');
      fx.className = 'pop-effect';
      fx.style.left = (b.x - 30) + 'px';
      fx.style.top = (b.y - 30) + 'px';
      area.appendChild(fx);
      setTimeout(() => fx.remove(), 500);

      bubbleScore += b.points;
      document.getElementById('bubble-score').textContent = bubbleScore;
      b.el.remove();
      activeBubbles.splice(i, 1);
      popped++;
      if (popped >= 3) break; // max 3 pops per press
    }
  }

  // Visual feedback on zone
  const zone = document.getElementById('bubble-pop-zone');
  zone.style.transform = 'scale(1.2)';
  setTimeout(() => zone.style.transform = 'scale(1)', 120);
}

function initBubbleGame() {
  bubbleActive = true;
  bubbleScore = 0;
  bubbleTimeLeft = 60;
  bubbleLane = 2;
  activeBubbles = [];
  document.getElementById('bubble-score').textContent = '0';
  document.getElementById('bubble-time').textContent = '60';
  document.getElementById('bubble-game-over').classList.add('hidden');
  document.getElementById('btn-bubble-start').classList.add('hidden');
  document.getElementById('bubble-area').querySelectorAll('.bubble, .pop-effect').forEach(e => e.remove());
  updateBubbleZone();

  if (bubbleTimer) clearInterval(bubbleTimer);
  if (bubbleSpawner) clearInterval(bubbleSpawner);
  if (bubbleLoop) cancelAnimationFrame(bubbleLoop);

  bubbleTimer = setInterval(() => {
    bubbleTimeLeft--;
    document.getElementById('bubble-time').textContent = bubbleTimeLeft;
    if (bubbleTimeLeft <= 0) endBubbleGame();
  }, 1000);

  bubbleSpawner = setInterval(spawnBubble, 750);
  bubbleLoop = requestAnimationFrame(bubbleGameLoop);

  // Focus back button so D-pad works in this screen
  setTimeout(() => document.getElementById('btn-bubble-back').focus(), 50);
}

function moveBubbleLane(dir) {
  if (!bubbleActive) return;
  bubbleLane += dir;
  if (bubbleLane < 0) bubbleLane = 0;
  if (bubbleLane > BUBBLE_LANES - 1) bubbleLane = BUBBLE_LANES - 1;
  updateBubbleZone();
}

function endBubbleGame() {
  bubbleActive = false;
  if (bubbleTimer) clearInterval(bubbleTimer);
  if (bubbleSpawner) clearInterval(bubbleSpawner);
  if (bubbleLoop) cancelAnimationFrame(bubbleLoop);
  activeBubbles.forEach(b => b.el.remove());
  activeBubbles = [];

  if (bubbleScore > bubbleHighScore) {
    bubbleHighScore = bubbleScore;
    localStorage.setItem('playdot_bubble_score', bubbleHighScore);
  }

  document.getElementById('bubble-final-score').textContent = bubbleScore;
  document.getElementById('bubble-game-over').classList.remove('hidden');
  setTimeout(() => document.getElementById('btn-bubble-restart').focus(), 100);
}

// Wire Bubble Pop listeners
document.getElementById('card-bubble').addEventListener('click', () => {
  document.getElementById('bubble-game-over').classList.add('hidden');
  document.getElementById('btn-bubble-start').classList.remove('hidden');
  document.getElementById('bubble-score').textContent = bubbleHighScore;
  document.getElementById('bubble-time').textContent = '60';
  showScreen('screen-bubble');
});

document.getElementById('btn-bubble-start').addEventListener('click', initBubbleGame);
document.getElementById('btn-bubble-restart').addEventListener('click', initBubbleGame);
document.getElementById('btn-bubble-back').addEventListener('click', () => {
  bubbleActive = false;
  if (bubbleTimer) clearInterval(bubbleTimer);
  if (bubbleSpawner) clearInterval(bubbleSpawner);
  if (bubbleLoop) cancelAnimationFrame(bubbleLoop);
  activeBubbles.forEach(b => b.el.remove());
  activeBubbles = [];
  showScreen('screen-home');
});

// D-pad + keyboard controls for Bubble Pop
document.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen.id !== 'screen-bubble') return;
  if (!bubbleActive) return;

  if (e.key === 'ArrowLeft') { e.preventDefault(); moveBubbleLane(-1); return; }
  if (e.key === 'ArrowRight') { e.preventDefault(); moveBubbleLane(1); return; }
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); popBubblesAtZone(); return; }
}, true);

// ==========================================
// DOT TO DOT GAME LOGIC
// ==========================================
const dotdotPoints = [
  { n: 1, x: 150, y: 40 },
  { n: 2, x: 235, y: 130 },
  { n: 3, x: 200, y: 255 },
  { n: 4, x: 100, y: 255 },
  { n: 5, x: 65, y: 130 }
];
let dotdotNext = 1;
let dotdotStarted = false;

function initDotDot() {
  dotdotNext = 1;
  dotdotStarted = false;
  const area = document.getElementById('dotdot-area');
  area.innerHTML = '';
  // SVG layer for lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 300 300');
  svg.style.position = 'absolute';
  svg.style.top = 0; svg.style.left = 0;
  svg.style.width = '100%'; svg.style.height = '100%';
  svg.id = 'dotdot-svg';
  area.appendChild(svg);

  dotdotPoints.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'dot-node focusable';
    btn.dataset.n = p.n;
    btn.textContent = p.n;
    btn.style.left = p.x + 'px';
    btn.style.top = p.y + 'px';
    btn.tabIndex = 0;
    btn.addEventListener('click', () => handleDotClick(p.n, btn));
    area.appendChild(btn);
  });

  document.getElementById('dotdot-status').textContent = 'Connect 1 to 5!';
  setTimeout(() => document.querySelector('.dot-node[data-n="1"]').focus(), 50);
}

function handleDotClick(n, btn) {
  if (n !== dotdotNext) {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 350);
    return;
  }

  // Draw line from previous dot
  if (n > 1) {
    const prev = dotdotPoints[n - 2];
    const cur = dotdotPoints[n - 1];
    const svg = document.getElementById('dotdot-svg');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', prev.x); line.setAttribute('y1', prev.y);
    line.setAttribute('x2', cur.x); line.setAttribute('y2', cur.y);
    line.setAttribute('stroke', '#FFB300');
    line.setAttribute('stroke-width', 6);
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  }

  btn.classList.add('done');
  dotdotNext++;

  if (dotdotNext > dotdotPoints.length) {
    // Close the shape
    const last = dotdotPoints[dotdotPoints.length - 1];
    const first = dotdotPoints[0];
    const svg = document.getElementById('dotdot-svg');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', last.x); line.setAttribute('y1', last.y);
    line.setAttribute('x2', first.x); line.setAttribute('y2', first.y);
    line.setAttribute('stroke', '#FFB300');
    line.setAttribute('stroke-width', 6);
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
    document.getElementById('dotdot-status').textContent = 'You drew a Star!';
    setTimeout(() => document.getElementById('btn-dotdot-restart').focus(), 100);
  } else {
    // Focus next dot
    setTimeout(() => {
      const nextBtn = document.querySelector(`.dot-node[data-n="${dotdotNext}"]`);
      if (nextBtn) nextBtn.focus();
    }, 100);
  }
}

document.getElementById('card-dotdot').addEventListener('click', () => { initDotDot(); showScreen('screen-dotdot'); });
document.getElementById('btn-dotdot-back').addEventListener('click', () => showScreen('screen-home'));
document.getElementById('btn-dotdot-restart').addEventListener('click', initDotDot);

// ==========================================
// ODD ONE OUT GAME LOGIC
// ==========================================
let oddScore = parseInt(getStoredData('playdot_odd_score', 0));
let oddTargetIndex = 0;

const oddShapes = [
  // circle, square, triangle, star
  (c) => `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="${c}"/></svg>`,
  (c) => `<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="8" fill="${c}"/></svg>`,
  (c) => `<svg viewBox="0 0 64 64"><polygon points="32,6 58,56 6,56" fill="${c}"/></svg>`,
  (c) => `<svg viewBox="0 0 64 64"><polygon points="32,6 40,24 60,24 44,38 50,58 32,46 14,58 20,38 4,24 24,24" fill="${c}"/></svg>`
];

const oddColors = ['#4FC3F7', '#FFB300', '#81C784', '#FF8A65', '#9C27B0', '#FF5252'];

function initOddRound() {
  const grid = document.getElementById('odd-grid');
  grid.innerHTML = '';

  const shapeFn = oddShapes[Math.floor(Math.random() * oddShapes.length)];
  const baseColor = oddColors[Math.floor(Math.random() * oddColors.length)];
  let altColor;
  do { altColor = oddColors[Math.floor(Math.random() * oddColors.length)]; } while (altColor === baseColor);

  oddTargetIndex = Math.floor(Math.random() * 9);

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'odd-cell focusable';
    cell.dataset.index = i;
    cell.tabIndex = 0;
    cell.innerHTML = shapeFn(i === oddTargetIndex ? altColor : baseColor);
    cell.addEventListener('click', () => handleOddClick(i, cell));
    grid.appendChild(cell);
  }

  document.getElementById('odd-score').textContent = oddScore;
  setTimeout(() => grid.querySelector('.odd-cell[data-index="0"]').focus(), 50);
}

function handleOddClick(i, cell) {
  if (i === oddTargetIndex) {
    cell.classList.add('correct-flash');
    oddScore += 10;
    localStorage.setItem('playdot_odd_score', oddScore);
    document.getElementById('odd-score').textContent = oddScore;
    setTimeout(() => initOddRound(), 550);
  } else {
    cell.classList.add('wrong-flash');
    setTimeout(() => cell.classList.remove('wrong-flash'), 500);
  }
}

document.getElementById('card-odd').addEventListener('click', () => { initOddRound(); showScreen('screen-odd'); });
document.getElementById('btn-odd-back').addEventListener('click', () => showScreen('screen-home'));

// D-pad nav for odd grid (3x3)
document.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen.id !== 'screen-odd') return;
  const cur = document.activeElement;
  if (!cur.classList.contains('odd-cell')) return;
  const ci = parseInt(cur.dataset.index);
  let ni = ci;
  if (e.key === 'ArrowRight' && ci % 3 < 2) ni = ci + 1;
  else if (e.key === 'ArrowLeft' && ci % 3 > 0) ni = ci - 1;
  else if (e.key === 'ArrowDown' && ci < 6) ni = ci + 3;
  else if (e.key === 'ArrowUp' && ci > 2) ni = ci - 3;
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cur.click(); return; }
  else return;
  e.preventDefault();
  document.querySelector(`.odd-cell[data-index="${ni}"]`).focus();
}, true);

// ==========================================
// TAP FAST (REACTION) GAME LOGIC
// ==========================================
let reactionTimeout = null;
let reactionStartTime = 0;
let reactionState = 'idle'; // idle | waiting | ready
let reactionBest = parseInt(getStoredData('playdot_reaction_best', 0)) || 0;

function setReactionCircle(state, text) {
  const c = document.getElementById('reaction-circle');
  c.classList.remove('waiting', 'ready', 'toosoon');
  if (state === 'waiting') c.classList.add('waiting');
  else if (state === 'ready') c.classList.add('ready');
  else if (state === 'toosoon') c.classList.add('toosoon');
  document.getElementById('reaction-text').textContent = text;
}

function startReactionRound() {
  document.getElementById('btn-reaction-start').classList.add('hidden');
  setReactionCircle('waiting', 'Wait...');
  reactionState = 'waiting';
  document.getElementById('reaction-area').focus();

  const delay = 1500 + Math.random() * 3500; // 1.5–5 sec

  reactionTimeout = setTimeout(() => {
    setReactionCircle('ready', 'TAP NOW!');
    reactionState = 'ready';
    reactionStartTime = performance.now();
  }, delay);
}

function handleReactionPress() {
  if (reactionState === 'waiting') {
    // Too soon
    clearTimeout(reactionTimeout);
    setReactionCircle('toosoon', 'Too soon!');
    reactionState = 'idle';
    document.getElementById('btn-reaction-start').classList.remove('hidden');
  } else if (reactionState === 'ready') {
    const t = Math.round(performance.now() - reactionStartTime);
    setReactionCircle('ready', t + ' ms');
    reactionState = 'idle';
    if (reactionBest === 0 || t < reactionBest) {
      reactionBest = t;
      localStorage.setItem('playdot_reaction_best', reactionBest);
    }
    document.getElementById('reaction-best').textContent = reactionBest;
    document.getElementById('btn-reaction-start').classList.remove('hidden');
  }
}

document.getElementById('card-reaction').addEventListener('click', () => {
  reactionState = 'idle';
  setReactionCircle('idle', 'Press Start');
  document.getElementById('reaction-best').textContent = reactionBest || '-';
  document.getElementById('btn-reaction-start').classList.remove('hidden');
  showScreen('screen-reaction');
});

document.getElementById('btn-reaction-start').addEventListener('click', startReactionRound);
document.getElementById('btn-reaction-back').addEventListener('click', () => {
  clearTimeout(reactionTimeout);
  reactionState = 'idle';
  showScreen('screen-home');
});

// Keyboard/remote press for reaction
document.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen.id !== 'screen-reaction') return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (reactionState === 'idle') startReactionRound();
    else handleReactionPress();
  }
}, true);
