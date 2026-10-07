async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Не удалось загрузить ${path}`);
  return res.json();
}

async function renderCards() {
  try {
    const data = await loadJSON('data/dashboard.json');
    const row = document.getElementById('cardsRow');
    row.innerHTML = data.metrics.map(m => `
      <div class="col-12 col-md-6 col-xl-3">
        <div class="card stat-card h-100">
          <div class="card-body">
            <h6 class="text-muted text-uppercase small">${m.label}</h6>
            <p class="display-6 mb-0">${m.value}</p>
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

async function renderTable() {
  const data = await loadJSON('data/dashboard.json');
  const body = document.getElementById('actionsBody');
  body.innerHTML = data.actions.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${a.student}</td>
      <td>${a.work}</td>
      <td><span class="badge bg-${a.status === 'done' ? 'success' : 'warning'}">
        ${a.status === 'done' ? 'Выполнено' : 'В работе'}
      </span></td>
    </tr>
  `).join('');
}

async function showToastFromJSON() {
  const notes = await loadJSON('data/notifications.json');
  const toastEl = document.getElementById('saveToast');
  document.getElementById('toastBody').textContent = notes[0].text;
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);

  input.classList.toggle('is-invalid', !valid);
  input.classList.toggle('is-valid', valid);

  if (valid) showToastFromJSON();
});

document.getElementById('modalSaveBtn').addEventListener('click', () => {
  const name = document.getElementById('studentName');
  const work = document.getElementById('workName');
  let ok = true;

  [name, work].forEach(el => {
    const empty = el.value.trim() === '';
    el.classList.toggle('is-invalid', empty);
    el.classList.toggle('is-valid', !empty);
    if (empty) ok = false;
  });

  if (!ok) return;

  const modalEl = document.getElementById('addModal');
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();

  document.getElementById('addForm').reset();
  [name, work].forEach(el => el.classList.remove('is-valid', 'is-invalid'));

  showToastFromJSON();
});

renderCards();
renderTable();