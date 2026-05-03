const API = 'http://localhost:3000/api';

// ── Navigation ──
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigate(item.dataset.page));
});

// ── Toast ──
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type === 'error' ? ' error' : '');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Dashboard Stats ──
async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`);
    const d = await res.json();
    document.getElementById('stat-members').textContent = d.total_members;
    document.getElementById('stat-revenue').textContent = '₹' + Number(d.total_revenue).toLocaleString('en-IN');
    document.getElementById('stat-trainers').textContent = d.total_trainers;
    document.getElementById('stat-today').textContent = d.payments_today;
  } catch { }
}

async function loadRecentMembers() {
  try {
    const res = await fetch(`${API}/members`);
    const members = await res.json();
    const tbody = document.getElementById('recent-members-body');
    const slice = members.slice(0, 5);
    if (!slice.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><div class="empty-icon">🏋️</div><p>No members yet</p></td></tr>'; return; }
    tbody.innerHTML = slice.map(m => `
      <tr>
        <td>${m.name}</td>
        <td><span class="badge badge-${m.gender?.toLowerCase()}">${m.gender || '—'}</span></td>
        <td>${m.plan_name || '—'}</td>
        <td>${m.join_date ? new Date(m.join_date).toLocaleDateString('en-IN') : '—'}</td>
      </tr>`).join('');
  } catch { }
}

async function loadRecentPayments() {
  try {
    const res = await fetch(`${API}/payments`);
    const payments = await res.json();
    const tbody = document.getElementById('recent-payments-body');
    const slice = payments.slice(0, 5);
    if (!slice.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><p>No payments yet</p></td></tr>'; return; }
    tbody.innerHTML = slice.map(p => `
      <tr>
        <td>${p.member_name || '—'}</td>
        <td>₹${Number(p.amount).toLocaleString('en-IN')}</td>
        <td>${modeBadge(p.payment_mode)}</td>
        <td>${p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-IN') : '—'}</td>
      </tr>`).join('');
  } catch { }
}

// ── Members ──
async function loadMembers() {
  try {
    const res = await fetch(`${API}/members`);
    const members = await res.json();
    const tbody = document.getElementById('members-body');
    if (!members.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">🏋️</div><p>No members found. Add your first member!</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = members.map(m => `
      <tr>
        <td>#${m.member_id}</td>
        <td><strong>${m.name}</strong></td>
        <td>${m.age || '—'}</td>
        <td><span class="badge badge-${m.gender?.toLowerCase()}">${m.gender || '—'}</span></td>
        <td>${m.phone || '—'}</td>
        <td>${m.trainer_name || '—'}</td>
        <td>${m.plan_name || '—'}</td>
        <td>${m.join_date ? new Date(m.join_date).toLocaleDateString('en-IN') : '—'}</td>
      </tr>`).join('');
  } catch (e) {
    toast('Failed to load members', 'error');
  }
}

// ── Payments ──
function modeBadge(mode) {
  const map = { 'Cash': 'cash', 'Card': 'card', 'UPI': 'upi', 'Bank Transfer': 'bank' };
  const cls = map[mode] || 'other';
  return `<span class="badge badge-${cls}">${mode}</span>`;
}

async function loadPayments() {
  try {
    const res = await fetch(`${API}/payments`);
    const payments = await res.json();
    const tbody = document.getElementById('payments-body');
    if (!payments.length) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">💳</div><p>No payments found.</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = payments.map(p => `
      <tr>
        <td>#${p.payment_id}</td>
        <td>${p.member_name || '—'}</td>
        <td><strong>₹${Number(p.amount).toLocaleString('en-IN')}</strong></td>
        <td>${modebadge(p.payment_mode)}</td>
        <td>${p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-IN') : '—'}</td>
      </tr>`).join('');
  } catch (e) {
    toast('Failed to load payments', 'error');
  }
}

async function loadPayments() {
  try {
    const res = await fetch(`${API}/payments`);
    const payments = await res.json();
    const tbody = document.getElementById('payments-body');
    if (!payments.length) {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">💳</div><p>No payments found.</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = payments.map(p => `
      <tr>
        <td>#${p.payment_id}</td>
        <td>${p.member_name || '—'}</td>
        <td><strong>₹${Number(p.amount).toLocaleString('en-IN')}</strong></td>
        <td>${modeBadge(p.payment_mode)}</td>
        <td>${p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-IN') : '—'}</td>
      </tr>`).join('');
  } catch (e) {
    toast('Failed to load payments', 'error');
  }
}

// ── Populate Dropdowns ──
async function populateDropdowns() {
  const [trRes, plRes, memRes] = await Promise.all([
    fetch(`${API}/trainers`), fetch(`${API}/plans`), fetch(`${API}/members`)
  ]);
  const trainers = await trRes.json();
  const plans = await plRes.json();
  const members = await memRes.json();

  const trSelect = document.getElementById('trainer_id');
  trainers.forEach(t => {
    trSelect.innerHTML += `<option value="${t.trainer_id}">${t.name} — ${t.specialization}</option>`;
  });

  const plSelect = document.getElementById('plan_id');
  plans.forEach(p => {
    plSelect.innerHTML += `<option value="${p.plan_id}">${p.plan_name} (₹${p.fee})</option>`;
  });

  const memSelect = document.getElementById('pay_member_id');
  members.forEach(m => {
    memSelect.innerHTML += `<option value="${m.member_id}">${m.name}</option>`;
  });
}

// ── Forms ──
document.getElementById('add-member-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());
  if (!body.trainer_id) delete body.trainer_id;
  if (!body.plan_id) delete body.plan_id;

  try {
    const res = await fetch(`${API}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      toast('✅ Member added successfully!');
      e.target.reset();
      loadStats();
      loadRecentMembers();
      // Refresh member dropdown for payments
      const memSelect = document.getElementById('pay_member_id');
      const opt = document.createElement('option');
      opt.value = data.member_id;
      opt.textContent = body.name;
      memSelect.appendChild(opt);
    } else {
      toast(data.error || 'Failed to add member', 'error');
    }
  } catch {
    toast('Server error', 'error');
  }
});

document.getElementById('add-payment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());

  try {
    const res = await fetch(`${API}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      toast('💰 Payment recorded!');
      e.target.reset();
      loadStats();
      loadRecentPayments();
    } else {
      toast(data.error || 'Failed to record payment', 'error');
    }
  } catch {
    toast('Server error', 'error');
  }
});

// Load pages on nav
document.querySelector('[data-page="page-members"]').addEventListener('click', loadMembers);
document.querySelector('[data-page="page-payments"]').addEventListener('click', loadPayments);

// Set today's date defaults
const today = new Date().toISOString().split('T')[0];
document.getElementById('join_date').value = today;
document.getElementById('payment_date').value = today;

// Init
(async () => {
  await populateDropdowns();
  loadStats();
  loadRecentMembers();
  loadRecentPayments();
})();
