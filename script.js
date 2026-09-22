const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

const poemToggle = document.getElementById('poem-toggle');
const jackReveal = document.getElementById('jack-reveal');
if (poemToggle && jackReveal) {
  poemToggle.addEventListener('click', () => {
    const open = poemToggle.getAttribute('aria-expanded') === 'true';
    poemToggle.setAttribute('aria-expanded', String(!open));
    jackReveal.hidden = open;
    poemToggle.innerHTML = open ? 'Continue reading <span>↓</span>' : 'Close poem <span>↑</span>';
  });
}

const nanoForm = document.getElementById('nano-form');
if (nanoForm) {
  const sampleResponses = [
    'belonging','safety','peace','family','quiet','freedom','comfort','people',
    'privacy','love','safety','peace','family','belonging','comfort','quiet',
    'belonging','peace','family','safety','love','freedom','belonging','comfort'
  ];

  const normalizeWord = value => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9’'-]/gi, '')
    .split(/\s+/)[0];

  const renderResponseField = userWord => {
    const field = document.getElementById('response-field');
    const reveal = document.getElementById('response-reveal');
    const committed = document.getElementById('committed-word');
    const intersectionCount = document.getElementById('intersection-count');
    if (!field || !reveal || !committed || !intersectionCount) return;

    const allResponses = [...sampleResponses, userWord];
    const counts = allResponses.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    field.innerHTML = '';
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .forEach(([word, count]) => {
        const span = document.createElement('span');
        span.className = 'response-word' + (word === userWord ? ' is-user' : '');
        span.textContent = word;
        span.style.fontSize = `${Math.min(52, 18 + count * 7)}px`;
        span.title = `${count} response${count === 1 ? '' : 's'}`;
        field.appendChild(span);
      });

    const matchesBeforeUser = sampleResponses.filter(word => word === userWord).length;
    committed.textContent = userWord;
    intersectionCount.textContent = matchesBeforeUser
      ? `${matchesBeforeUser} prior match${matchesBeforeUser === 1 ? '' : 'es'}`
      : 'No exact match — yet';
    reveal.hidden = false;
  };

  nanoForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('nano-word');
    if (!input) return;
    const word = normalizeWord(input.value);
    if (!word) return;
    renderResponseField(word);
    input.value = '';
  });
}
