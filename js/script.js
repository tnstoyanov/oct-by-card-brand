const AVAILABLE_BRANDS = [
  { name: 'American Express', initials: 'AMEX', color: '#2557a4' },
  { name: 'AstroPay Card', initials: 'AP', color: '#6a2e8a' },
  { name: 'Carte Bancaire', initials: 'CB', color: '#003d7c' },
  { name: 'Carte Bleue', initials: 'CB', color: '#1f5ea8' },
  { name: 'Dankort', initials: 'DK', color: '#ff7f00' },
  { name: 'Delta', initials: 'DEL', color: '#1d4ed8' },
  { name: 'Diners', initials: 'DIN', color: '#0079be' },
  { name: 'JCB', initials: 'JCB', color: '#0b7b3e' },
  { name: 'Maestro', initials: 'MAE', color: '#0099df' },
  { name: 'Papara', initials: 'PP', color: '#d97706' },
  { name: 'Visa Electron', initials: 'VE', color: '#1a1f71' }
];

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = '✓ ' + msg;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function toggleSection(button) {
  const section = button.closest('.section');
  section.classList.toggle('is-collapsed');
  const toggle = button.querySelector('.section-toggle');
  toggle.textContent = section.classList.contains('is-collapsed') ? '▸' : '▾';
}

Array.from(document.querySelectorAll('.section-header')).forEach(button => {
  button.addEventListener('click', () => toggleSection(button));
});

function getAddedBrandNames() {
  return Array.from(document.querySelectorAll('#brandRows tr'))
    .map(row => row.dataset.name)
    .filter(Boolean);
}

function renderBrandPicker(query) {
  const list = document.getElementById('brandPickerList');
  const search = (query || '').trim().toLowerCase();
  const existing = getAddedBrandNames();
  let remaining = AVAILABLE_BRANDS.filter(brand => !existing.includes(brand.name));

  if (search) {
    remaining = remaining.filter(brand => brand.name.toLowerCase().includes(search));
  }

  remaining.sort((a, b) => a.name.localeCompare(b.name));

  if (!remaining.length) {
    list.innerHTML = '<div class="brand-picker-empty">No matching card brands found.</div>';
    return;
  }

  list.innerHTML = remaining.map(brand => `
    <button class="brand-picker-item" type="button" data-name="${brand.name}" data-initials="${brand.initials}" data-color="${brand.color}">
      <span class="brand-badge" style="background:${brand.color};">${brand.initials}</span>
      <span>${brand.name}</span>
    </button>
  `).join('');
}

function toggleBrandPicker(event) {
  event.stopPropagation();
  const picker = document.getElementById('brandPicker');
  const willOpen = !picker.classList.contains('open');
  picker.classList.toggle('open', willOpen);
  if (willOpen) {
    const search = document.getElementById('brandSearch');
    search.value = '';
    renderBrandPicker('');
    search.focus();
  }
}

function setManualOnlyChecks(checkboxes) {
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = [1, 3].includes(index);
  });
}

function resetBrandRowChecks(row) {
  const rowChecks = Array.from(row.querySelectorAll('.cb-check'));
  setManualOnlyChecks(rowChecks);
}

function addBrandRow(name, color, initials) {
  const row = document.createElement('tr');
  row.dataset.brand = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  row.dataset.name = name;
  row.className = 'brand-row-new';
  row.innerHTML = `
    <td>
      <div class="brand-row-inner">
        <div class="brand-cell">
          <span class="brand-badge" style="background:${color};">${initials}</span>
          <div>
            <div class="brand-name">${name}</div>
            <div class="brand-subtext">custom</div>
          </div>
        </div>
        <button class="remove-brand" type="button" title="Remove ${name}">✕</button>
      </div>
    </td>
    <td><input type="checkbox" class="cb-check"></td>
    <td><input type="checkbox" class="cb-check"></td>
    <td><input type="checkbox" class="cb-check"></td>
    <td><input type="checkbox" class="cb-check"></td>
  `;

  resetBrandRowChecks(row);

  row.querySelector('.remove-brand').addEventListener('click', () => {
    row.remove();
    renderBrandPicker(document.getElementById('brandSearch').value);
    showToast(name + ' removed');
  });

  document.getElementById('brandRows').appendChild(row);
  document.getElementById('brandPicker').classList.remove('open');
  showToast(name + ' added');
}

const refundToggleRow = document.getElementById('refundToggleRow');
const brandConfigWrapper = document.getElementById('brandConfigWrapper');
const configureByCardBtn = document.getElementById('configureByCardBtn');

function toggleBrandConfig(showBrandConfig) {
  refundToggleRow.style.display = showBrandConfig ? 'none' : 'flex';
  brandConfigWrapper.classList.toggle('hidden', !showBrandConfig);
  configureByCardBtn.setAttribute('aria-pressed', String(showBrandConfig));
  configureByCardBtn.classList.toggle('active', showBrandConfig);

  if (!showBrandConfig) {
    document.getElementById('brandPicker').classList.remove('open');
    const defaultChecks = Array.from(refundToggleRow.querySelectorAll('input[type="checkbox"]'));
    setManualOnlyChecks(defaultChecks);

    Array.from(document.querySelectorAll('#brandRows tr')).forEach(row => {
      resetBrandRowChecks(row);
    });
  }
}

configureByCardBtn.addEventListener('click', () => {
  const isActive = configureByCardBtn.getAttribute('aria-pressed') === 'true';
  toggleBrandConfig(!isActive);
});

const addBrandButton = document.getElementById('addBrandBtn');
if (addBrandButton) {
  addBrandButton.addEventListener('click', toggleBrandPicker);
}
document.getElementById('brandSearch').addEventListener('input', event => renderBrandPicker(event.target.value));
document.addEventListener('click', event => {
  const picker = document.getElementById('brandPicker');
  const button = document.getElementById('addBrandBtn');
  if (picker && !picker.contains(event.target) && event.target !== button) {
    picker.classList.remove('open');
  }
});
document.addEventListener('click', event => {
  const target = event.target.closest('.brand-picker-item');
  if (target) {
    addBrandRow(target.dataset.name, target.dataset.color, target.dataset.initials);
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.getElementById('brandPicker').classList.remove('open');
  }
});

toggleBrandConfig(false);
renderBrandPicker('');
