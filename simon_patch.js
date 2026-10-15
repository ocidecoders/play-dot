const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Insert Simon card after Coloring card
const coloringCardEnd = `          <span>Coloring</span>
        </div>
`;
const simonCard = `          <span>Coloring</span>
        </div>
        <div class="game-card focusable" id="card-simon" tabindex="0">
          <svg width="60" height="60" viewBox="0 0 64 64" class="game-icon">
            <circle cx="32" cy="32" r="24" fill="#3E2723"/>
            <path d="M32 32 L32 8 A24 24 0 0 1 56 32 Z" fill="#4FC3F7"/>
            <path d="M32 32 L56 32 A24 24 0 0 1 32 56 Z" fill="#FFB300"/>
            <path d="M32 32 L32 56 A24 24 0 0 1 8 32 Z" fill="#81C784"/>
            <path d="M32 32 L8 32 A24 24 0 0 1 32 8 Z" fill="#FF5252"/>
            <circle cx="32" cy="32" r="6" fill="#FFF8E7"/>
          </svg>
          <span>Simon Says</span>
        </div>
`;
html = html.replace(coloringCardEnd, simonCard);

// Insert Simon screen before Whack screen
const whackScreenStart = `    <!-- Whack-a-Mole Screen -->`;
const simonScreen = `    <!-- Simon Says Screen -->
    <section id="screen-simon" class="screen">
      <div class="game-header">
        <button class="btn-secondary focusable" id="btn-simon-back" tabindex="0">Back</button>
        <div class="score-display">Level: <span id="simon-level">0</span> &nbsp; Best: <span id="simon-best">0</span></div>
      </div>
      <h2 id="simon-status" class="puzzle-status-text">Watch the pattern!</h2>
      <div class="simon-grid" id="simon-grid">
        <button class="simon-pad focusable" data-index="0" tabindex="0"></button>
        <button class="simon-pad focusable" data-index="1" tabindex="0"></button>
        <button class="simon-pad focusable" data-index="2" tabindex="0"></button>
        <button class="simon-pad focusable" data-index="3" tabindex="0"></button>
      </div>
      <button class="btn-primary focusable" id="btn-simon-start" tabindex="0" style="margin-top: 25px;">Start Game</button>
    </section>

    <!-- Whack-a-Mole Screen -->`;
html = html.replace(whackScreenStart, simonScreen);

fs.writeFileSync('index.html', html);
console.log('index.html patched successfully');
