// ============================
// HARAGÁN2006 — script.js
// Panel de Opiniones
// ============================

(function () {

  const STORAGE_KEY = 'haragan_opiniones';

  // --- Elementos del DOM ---
  const form       = document.getElementById('opinion-form');
  const nameInput  = document.getElementById('op-name');
  const temaSelect = document.getElementById('op-tema');
  const textArea   = document.getElementById('op-text');
  const charCount  = document.getElementById('char-count');
  const submitBtn  = document.getElementById('submit-btn');
  const list       = document.getElementById('opinions-list');
  const countEl    = document.getElementById('opinion-count');

  // --- Opiniones iniciales (precargadas en HTML) ---
  let opinions = loadOpinions();

  // --- Contador de caracteres ---
  textArea.addEventListener('input', function () {
    const remaining = 300 - this.value.length;
    charCount.textContent = remaining + ' caracteres restantes';
    charCount.style.color = remaining < 50 ? '#e85d4a' : '';
  });

  // --- Enviar opinión ---
  submitBtn.addEventListener('click', function () {
    const name = nameInput.value.trim() || 'Anónimo';
    const tema = temaSelect.value || 'otro';
    const text = textArea.value.trim();

    if (!text) {
      textArea.style.borderColor = '#c8392b';
      textArea.focus();
      setTimeout(() => textArea.style.borderColor = '', 1500);
      return;
    }

    const newOp = {
      id: Date.now(),
      name,
      tema,
      text,
      date: 'ahora mismo'
    };

    opinions.unshift(newOp);
    saveOpinions(opinions);
    renderOpinions(opinions, true);

    // Limpiar form
    nameInput.value = '';
    temaSelect.value = '';
    textArea.value = '';
    charCount.textContent = '300 caracteres restantes';
    charCount.style.color = '';

    // Scroll al inicio de la lista
    list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // --- Render ---
  function renderOpinions(ops, highlightFirst) {
    // Contar todas (incluidas las del HTML estático)
    const staticCount = 2;
    const total = ops.length + staticCount;
    countEl.textContent = total + ' opinión' + (total !== 1 ? 'es' : '');

    if (ops.length === 0) return;

    // Insertar nuevas al inicio de la lista
    const existing = list.querySelectorAll('.opinion-item[data-dynamic]');
    existing.forEach(el => el.remove());

    const fragment = document.createDocumentFragment();

    ops.forEach((op, i) => {
      const item = document.createElement('div');
      item.className = 'opinion-item' + (i === 0 && highlightFirst ? ' new-opinion' : '');
      item.setAttribute('data-dynamic', '1');
      item.style.animationDelay = (i * 0.05) + 's';

      const tagClass = 'tag-' + op.tema;
      const tagLabel = {
        videojuegos: 'Videojuegos',
        tecnologia: 'Tecnología',
        editorial: 'Editorial',
        otro: 'Otro'
      }[op.tema] || 'Otro';

      item.innerHTML = `
        <div class="opinion-meta">
          <span class="opinion-author">${escapeHTML(op.name)}</span>
          <span class="opinion-tag ${tagClass}">${tagLabel}</span>
          <span class="opinion-date">${escapeHTML(op.date)}</span>
        </div>
        <p class="opinion-text">${escapeHTML(op.text)}</p>
      `;
      fragment.appendChild(item);
    });

    // Insertar antes de las opiniones estáticas
    list.insertBefore(fragment, list.firstChild);
  }

  // --- LocalStorage ---
  function loadOpinions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveOpinions(ops) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ops.slice(0, 50)));
    } catch (e) {}
  }

  // --- Seguridad: escapar HTML ---
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Init ---
  renderOpinions(opinions, false);

})();
