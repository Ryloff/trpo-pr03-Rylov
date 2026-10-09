var rowsData = [];

function loadJSON(path, callback) {
  fetch(path)
    .then(function (response) { return response.json(); })
    .then(function (data) { callback(data); })
    .catch(function (error) { console.error('Ошибка загрузки ' + path, error); });
}

function renderCards(data) {
  var row = document.getElementById('cardsRow');
  var html = '';

  for (var i = 0; i < data.metrics.length; i++) {
    var m = data.metrics[i];
    html += '<div class="col-12 col-md-6 col-xl-3">';
    html += '  <div class="card stat-card h-100">';
    html += '    <div class="card-body">';
    html += '      <h6 class="text-muted text-uppercase small">' + m.title + '</h6>';
    html += '      <p class="display-6 mb-0">' + m.value + '</p>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  }

  row.innerHTML = html;
}

function renderTable() {
  var body = document.getElementById('actionsBody');
  var html = '';

  if (rowsData.length === 0) {
    body.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Записей нет</td></tr>';
    return;
  }

  for (var i = 0; i < rowsData.length; i++) {
    var r = rowsData[i];

    var badgeClass = 'secondary';
    if (r.status === 'Готово')   badgeClass = 'success';
    if (r.status === 'В работе') badgeClass = 'warning';

    html += '<tr>';
    html += '  <td>' + r.id + '</td>';
    html += '  <td>' + r.action + '</td>';
    html += '  <td><span class="badge bg-' + badgeClass + '">' + r.status + '</span></td>';
    html += '</tr>';
  }

  body.innerHTML = html;
}

function showToast(text) {
  var toastEl = document.getElementById('saveToast');
  document.getElementById('toastBody').textContent = text;
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

document.addEventListener('DOMContentLoaded', function () {
  loadJSON('data/dashboard.json', function (data) {
    renderCards(data);
    rowsData = data.rows;
    renderTable();
  });
});

document.getElementById('feedbackForm').addEventListener('submit', function (e) {
  e.preventDefault();

  var input = document.getElementById('emailInput');
  var value = input.value.trim();

  var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!ok) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    return;
  }

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');

  showToast('Email принят');

  setTimeout(function () {
    document.getElementById('feedbackForm').reset();
    input.classList.remove('is-valid');
  }, 1500);
});

document.getElementById('modalSaveBtn').addEventListener('click', function () {
  var actionInput = document.getElementById('actionName');
  var statusInput = document.getElementById('actionStatus');

  // Валидация
  if (actionInput.value.trim() === '') {
    actionInput.classList.remove('is-valid');
    actionInput.classList.add('is-invalid');
    return;
  }

  actionInput.classList.remove('is-invalid');
  actionInput.classList.add('is-valid');

  var newId = 1;
  if (rowsData.length > 0) {
    newId = rowsData[rowsData.length - 1].id + 1;
  }

  rowsData.push({
    id: newId,
    action: actionInput.value.trim(),
    status: statusInput.value
  });

  renderTable();

  bootstrap.Modal.getOrCreateInstance(document.getElementById('addModal')).hide();

  document.getElementById('addForm').reset();
  actionInput.classList.remove('is-valid');

  showToast('Операция добавлена');
});

document.getElementById('addModal').addEventListener('hidden.bs.modal', function () {
  var actionInput = document.getElementById('actionName');
  actionInput.classList.remove('is-valid', 'is-invalid');
});