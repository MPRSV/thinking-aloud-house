document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
  });
});

const poemToggle = document.getElementById('poem-toggle');
const jackReveal = document.getElementById('jack-reveal');
poemToggle.addEventListener('click', () => {
  const open = poemToggle.getAttribute('aria-expanded') === 'true';
  poemToggle.setAttribute('aria-expanded', String(!open));
  jackReveal.hidden = open;
  poemToggle.innerHTML = open ? 'Continue reading <span>↓</span>' : 'Close poem <span>↑</span>';
});

const nanoForm = document.getElementById('nano-form');
nanoForm.addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('nano-word');
  const word = input.value.trim().split(/\s+/)[0];
  if (!word) return;
  document.getElementById('your-word').textContent = word.toLowerCase();
  document.getElementById('word-field').hidden = false;
});
