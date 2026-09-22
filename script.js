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
  const sampleCounts = {
    belonging: 26,
    safety: 23,
    peace: 21,
    family: 18,
    comfort: 15,
    freedom: 13,
    love: 11,
    quiet: 9,
    people: 8,
    privacy: 6,
    home: 5,
    warmth: 4
  };

  const normalizeWord = value => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9’'-]/gi, '')
    .split(/\s+/)[0];

  const readLocalCounts = () => {
    try {
      return JSON.parse(localStorage.getItem('taNanoResponses') || '{}');
    } catch {
      return {};
    }
  };

  const writeLocalCounts = counts => {
    try {
      localStorage.setItem('taNanoResponses', JSON.stringify(counts));
    } catch {
      // The exhibit still works if browser storage is unavailable.
    }
  };

  const titleCase = word => word.charAt(0).toUpperCase() + word.slice(1);

  const renderRanking = counts => {
    const ranking = document.getElementById('response-ranking');
    if (!ranking) return;
    ranking.innerHTML = '';
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .forEach(([word, count], index) => {
        const row = document.createElement('li');
        row.innerHTML = `<span class="rank-number">${String(index + 1).padStart(2, '0')}</span><strong>${titleCase(word)}</strong><span class="rank-count">${count}</span>`;
        ranking.appendChild(row);
      });
  };

  const commitResponse = userWord => {
    const reveal = document.getElementById('response-reveal');
    const committed = document.getElementById('committed-word');
    const intersectionCount = document.getElementById('intersection-count');
    if (!reveal || !committed || !intersectionCount) return;

    const localCounts = readLocalCounts();
    const matchesBeforeUser = (sampleCounts[userWord] || 0) + (localCounts[userWord] || 0);
    localCounts[userWord] = (localCounts[userWord] || 0) + 1;
    writeLocalCounts(localCounts);

    const combined = { ...sampleCounts };
    Object.entries(localCounts).forEach(([word, count]) => {
      combined[word] = (combined[word] || 0) + count;
    });

    committed.textContent = titleCase(userWord);
    intersectionCount.textContent = matchesBeforeUser
      ? `${matchesBeforeUser} other response${matchesBeforeUser === 1 ? '' : 's'} matched yours.`
      : 'No exact match — yet.';

    renderRanking(combined);
    reveal.hidden = false;
  };

  nanoForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('nano-word');
    if (!input) return;
    const word = normalizeWord(input.value);
    if (!word) return;
    commitResponse(word);
    input.value = '';
  });
}
