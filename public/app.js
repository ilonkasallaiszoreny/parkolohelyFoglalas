let allSpots = [];
let allReservations = [];
let currentFilterType = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
});

async function initApp() {
  await fetchSpots();
  await fetchReservations();
  populateDefaultModalTimes();
}

function setupEventListeners() {
  // Modal toggle
  const modal = document.getElementById('bookingModal');
  const openBtn = document.getElementById('openBookingModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelModalBtn');

  openBtn.addEventListener('click', () => openBookingModal());
  closeBtn.addEventListener('click', () => closeBookingModal());
  cancelBtn.addEventListener('click', () => closeBookingModal());

  // Form submit
  document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);

  // Spot type filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilterType = btn.dataset.type;
      renderSpots();
    });
  });

  // Table filters
  const spotFilterSelect = document.getElementById('spotFilter');
  if (spotFilterSelect) {
    spotFilterSelect.addEventListener('change', () => {
      renderReservations();
    });
  }

  document.getElementById('statusFilter').addEventListener('change', () => {
    renderReservations();
  });
}

// Fetch spots from API
async function fetchSpots() {
  try {
    const res = await fetch('/api/spots');
    const json = await res.json();
    if (json.success) {
      allSpots = json.data;
      updateStats();
      renderSpots();
      populateSpotSelectOptions();
    }
  } catch (err) {
    console.error('Error fetching spots:', err);
  }
}

// Fetch reservations from API
async function fetchReservations() {
  try {
    const res = await fetch('/api/reservations');
    const json = await res.json();
    if (json.success) {
      allReservations = json.data;
      updateStats();
      renderReservations();
      renderSpots(); // refresh spot statuses
    }
  } catch (err) {
    console.error('Error fetching reservations:', err);
  }
}

// Update top statistics
function updateStats() {
  document.getElementById('totalSpotsCount').textContent = allSpots.length;
  document.getElementById('evSpotsCount').textContent = allSpots.filter(s => s.type === 'EV_CHARGING').length;
  
  const activeCount = allReservations.filter(r => r.status === 'CONFIRMED').length;
  document.getElementById('activeBookingsCount').textContent = activeCount;
}

// Render Spot Cards Grid
function renderSpots() {
  const container = document.getElementById('spotsGrid');
  container.innerHTML = '';

  const filteredSpots = currentFilterType === 'ALL'
    ? allSpots
    : allSpots.filter(s => s.type === currentFilterType);

  if (filteredSpots.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">Nincs megjeleníthető parkolóhely ebben a kategóriában.</p>`;
    return;
  }

  const now = new Date();

  filteredSpots.forEach(spot => {
    // Check if currently occupied right now
    const activeResNow = allReservations.find(r => {
      if (r.spotId !== spot.id || r.status !== 'CONFIRMED') return false;
      const st = new Date(r.startTime);
      const et = new Date(r.endTime);
      return now >= st && now <= et;
    });

    const isOccupied = !!activeResNow;
    const typeLabelMap = {
      STANDARD: 'Normál',
      EV_CHARGING: '⚡ EV Töltő',
      HANDICAPPED: '♿ Mozgáskorlátozott',
      VIP: '⭐ VIP'
    };

    const card = document.createElement('div');
    card.className = 'spot-card';
    card.innerHTML = `
      <div class="spot-top">
        <span class="spot-code">${spot.code}</span>
        <span class="badge badge-${spot.type}">${typeLabelMap[spot.type] || spot.type}</span>
      </div>
      <div class="spot-name">${spot.name}</div>
      <div class="spot-location">📍 ${spot.location}</div>
      <div class="spot-status-box">
        <div class="status-indicator">
          <span class="dot ${isOccupied ? 'dot-amber' : 'dot-green'}"></span>
          <span>${isOccupied ? 'Jelenleg Foglalt' : 'Szabad'}</span>
        </div>
        ${activeResNow ? `<small style="color: var(--text-muted);">${activeResNow.requesterName}</small>` : ''}
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.85rem;">
        <button class="btn btn-secondary" style="flex: 1; font-size: 0.82rem; padding: 0.5rem;" onclick="filterTableBySpot('${spot.id}')">
          📋 Foglalások
        </button>
        <button class="btn btn-primary" style="flex: 1.2; font-size: 0.82rem; padding: 0.5rem;" onclick="openBookingModal('${spot.id}')">
          ➕ Foglalás
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render Reservations Table
function renderReservations() {
  const tbody = document.getElementById('reservationsTableBody');
  tbody.innerHTML = '';

  const filterStatus = document.getElementById('statusFilter').value;
  const spotFilterSelect = document.getElementById('spotFilter');
  const selectedSpotId = spotFilterSelect ? spotFilterSelect.value : 'ALL';

  let filtered = allReservations;

  if (selectedSpotId !== 'ALL') {
    filtered = filtered.filter(r => r.spotId === selectedSpotId);
  }

  if (filterStatus !== 'ALL') {
    filtered = filtered.filter(r => r.status === filterStatus);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Nincs rögzített foglalás a megadott szűrés szerint.</td></tr>`;
    return;
  }

  filtered.forEach(r => {
    const tr = document.createElement('tr');
    const spotCode = r.spot ? `${r.spot.code} (${r.spot.name})` : r.spotId;

    const startStr = new Date(r.startTime).toLocaleString('hu-HU', { dateStyle: 'short', timeStyle: 'short' });
    const endStr = new Date(r.endTime).toLocaleString('hu-HU', { dateStyle: 'short', timeStyle: 'short' });

    const isConfirmed = r.status === 'CONFIRMED';
    const statusBadge = isConfirmed
      ? `<span class="badge badge-EV_CHARGING">Megerősítve</span>`
      : `<span class="badge badge-STANDARD">Lemondva</span>`;

    const actionBtn = isConfirmed
      ? `<button class="btn-danger-sm" onclick="cancelReservation('${r.id}')">Lemondás</button>`
      : `<span style="color: var(--text-muted); font-size: 0.8rem;">—</span>`;

    tr.innerHTML = `
      <td><strong>${spotCode}</strong></td>
      <td>${r.requesterName}</td>
      <td><code>${r.licensePlate || 'Nincs'}</code></td>
      <td>${startStr}</td>
      <td>${endStr}</td>
      <td>${statusBadge}</td>
      <td>${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Filter table specifically to one spot and scroll down smoothly
window.filterTableBySpot = function(spotId) {
  const spotFilterSelect = document.getElementById('spotFilter');
  if (spotFilterSelect) {
    spotFilterSelect.value = spotId;
    renderReservations();

    const tableSection = document.querySelector('.reservations-section');
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

function populateSpotSelectOptions() {
  const select = document.getElementById('modalSpotSelect');
  const filterSelect = document.getElementById('spotFilter');

  if (select) {
    select.innerHTML = '';
    allSpots.forEach(spot => {
      const opt = document.createElement('option');
      opt.value = spot.id;
      opt.textContent = `${spot.code} - ${spot.name} (${spot.location})`;
      select.appendChild(opt);
    });
  }

  if (filterSelect) {
    filterSelect.innerHTML = `<option value="ALL">Minden parkolóhely</option>`;
    allSpots.forEach(spot => {
      const opt = document.createElement('option');
      opt.value = spot.id;
      opt.textContent = `${spot.code} - ${spot.name}`;
      filterSelect.appendChild(opt);
    });
  }
}

function populateDefaultModalTimes() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);

  const end = new Date(now);
  end.setHours(end.getHours() + 4);

  document.getElementById('modalStartTime').value = formatDateForInput(now);
  document.getElementById('modalEndTime').value = formatDateForInput(end);
}

function formatDateForInput(date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, 16);
  return localISOTime;
}

// Open modal
window.openBookingModal = function(spotId = null) {
  const modal = document.getElementById('bookingModal');
  const alert = document.getElementById('formAlert');
  alert.classList.add('hidden');
  alert.textContent = '';

  if (spotId) {
    document.getElementById('modalSpotSelect').value = spotId;
  }

  modal.classList.remove('hidden');
};

// Close modal
window.closeBookingModal = function() {
  document.getElementById('bookingModal').classList.add('hidden');
};

// Handle booking submission
async function handleBookingSubmit(e) {
  e.preventDefault();
  const alert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBookingBtn');

  alert.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Feldolgozás...';

  const spotId = document.getElementById('modalSpotSelect').value;
  const requesterName = document.getElementById('modalRequester').value;
  const licensePlate = document.getElementById('modalLicensePlate').value;
  const startTime = new Date(document.getElementById('modalStartTime').value).toISOString();
  const endTime = new Date(document.getElementById('modalEndTime').value).toISOString();

  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotId, requesterName, licensePlate, startTime, endTime })
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      alert.textContent = json.error || 'A foglalás rögzítése nem sikerült.';
      alert.className = 'alert alert-danger';
      alert.classList.remove('hidden');
    } else {
      closeBookingModal();
      document.getElementById('bookingForm').reset();
      populateDefaultModalTimes();
      await fetchReservations();
    }
  } catch (err) {
    alert.textContent = 'Hálózati hiba történt a foglalás során.';
    alert.className = 'alert alert-danger';
    alert.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Foglalás Rögzítése';
  }
}

// Cancel reservation handler
window.cancelReservation = async function(id) {
  if (!confirm('Biztosan le szeretnéd mondani ezt a foglalást?')) return;

  try {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (json.success) {
      await fetchReservations();
    } else {
      alert(json.error || 'A foglalás lemondása sikertelen.');
    }
  } catch (err) {
    alert('Hálózati hiba történt a lemondáskor.');
  }
};
