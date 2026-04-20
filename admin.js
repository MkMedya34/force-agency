/* ═══════════════════════════════════════
   FORCE AJANS — ADMIN PANEL (MySQL API)
═══════════════════════════════════════ */

/* ─── API Helper ─── */
async function api(endpoint, method = 'GET', data = null) {
  const opts = { method, credentials: 'same-origin' };
  if (data !== null) {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body    = JSON.stringify(data);
  }
  try {
    const res = await fetch(`api/${endpoint}`, opts);
    return await res.json();
  } catch (e) {
    return { error: 'Bağlantı hatası: ' + e.message };
  }
}

/* ─── Toast ─── */
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast ${type} show`;
  setTimeout(() => el.classList.remove('show'), 2800);
}

function confirm2(msg) { return window.confirm(msg); }

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', { day:'2-digit', month:'short', year:'numeric' });
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,5); }

/* ═══════════════════════════════════════
   AUTH
═══════════════════════════════════════ */
async function checkSession() {
  const r = await api('auth.php');
  if (r.loggedIn) {
    showAdmin();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
  }
}

function showAdmin() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminLayout').style.display = 'flex';
  initAdmin();
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pass = document.getElementById('loginPass').value;
  const err  = document.getElementById('loginError');
  const res  = await api('auth.php', 'POST', { action: 'login', password: pass });
  if (res.success) {
    showAdmin();
  } else {
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 2500);
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await api('auth.php', 'POST', { action: 'logout' });
  document.getElementById('adminLayout').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginPass').value = '';
});

async function changePassword() {
  const old  = document.getElementById('s-oldPass').value;
  const n1   = document.getElementById('s-newPass').value;
  const n2   = document.getElementById('s-newPass2').value;
  if (!old || !n1) { toast('Şifre alanlarını doldurun.', 'error'); return; }
  if (n1 !== n2)   { toast('Yeni şifreler eşleşmiyor.', 'error'); return; }
  const res = await api('auth.php', 'POST', { action:'change_password', old, new:n1, new2:n2 });
  if (res.error) { toast(res.error, 'error'); return; }
  document.getElementById('s-oldPass').value = '';
  document.getElementById('s-newPass').value = '';
  document.getElementById('s-newPass2').value = '';
  toast('Şifre güncellendi ✓');
}
window.changePassword = changePassword;

/* ═══════════════════════════════════════
   NAVİGASYON
═══════════════════════════════════════ */
const pages  = ['dashboard','streamers','applications','messages','reviews','blog','settings'];
const titles = {
  dashboard:'Dashboard', streamers:'Yayıncılar', applications:'Başvurular',
  messages:'Mesajlar', reviews:'Yorumlar', blog:'Blog Yazıları', settings:'Ayarlar'
};

function goPage(name) {
  pages.forEach(p => {
    document.getElementById(`page-${p}`)?.classList.toggle('active', p === name);
    document.querySelector(`[data-page="${p}"]`)?.classList.toggle('active', p === name);
  });
  document.getElementById('topbarTitle').textContent = titles[name] || name;
  if (name === 'dashboard')    renderDashboard();
  if (name === 'streamers')    renderStreamers();
  if (name === 'applications') renderApplications('all');
  if (name === 'messages')     renderMessages('all');
  if (name === 'reviews')      renderReviews();
  if (name === 'blog')         renderPosts();
  if (name === 'settings')     loadSettings();
}
window.goPage = goPage;

document.querySelectorAll('.snav-item').forEach(btn => {
  btn.addEventListener('click', () => goPage(btn.dataset.page));
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
async function initAdmin() {
  await renderDashboard();
  updateAppBadge();
  updateMsgBadge();
}

/* ═══════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════ */
async function renderDashboard() {
  const [streamers, apps, reviews, messages, blog] = await Promise.all([
    api('streamers.php'),
    api('applications.php'),
    api('reviews.php'),
    api('messages.php'),
    api('blog.php'),
  ]);

  const newApps    = Array.isArray(apps)     ? apps.filter(a => a.status === 'new')  : [];
  const unreadMsgs = Array.isArray(messages) ? messages.filter(m => !m.read).length  : 0;

  document.getElementById('kpi-streamers').textContent = Array.isArray(streamers) ? streamers.length : 0;
  document.getElementById('kpi-apps').textContent      = Array.isArray(apps)      ? apps.length      : 0;
  document.getElementById('kpi-new').textContent       = newApps.length;
  document.getElementById('kpi-reviews').textContent   = Array.isArray(reviews)   ? reviews.length   : 0;
  const kpiMsg = document.getElementById('kpi-messages');
  if (kpiMsg) kpiMsg.textContent = unreadMsgs || (Array.isArray(messages) ? messages.length : 0);

  // Son başvurular
  const appWrap = document.getElementById('recentApps');
  if (appWrap) {
    const last5 = Array.isArray(apps) ? apps.slice(0, 5) : [];
    appWrap.innerHTML = last5.length
      ? last5.map(a => `
          <div class="widget-row">
            <div>
              <div class="widget-row-name">${esc(a.name)}</div>
              <div class="widget-row-sub">@${esc(a.tiktok||'—')} • ${esc(a.city||'—')}</div>
            </div>
            <span class="status-badge ${a.status}">${statusLabel(a.status)}</span>
          </div>`).join('')
      : '<div class="empty-state">Henüz başvuru yok.</div>';
  }

  // Yayıncılar
  const strWrap = document.getElementById('recentStreamers');
  if (strWrap) {
    const list = Array.isArray(streamers) ? streamers.slice(0, 5) : [];
    strWrap.innerHTML = list.length
      ? list.map(s => `
          <div class="widget-row">
            <div class="str-row-avatar" style="background:${levelGrad(s.level)}">${avatarContent(s)}</div>
            <div>
              <div class="widget-row-name">${esc(s.name)}</div>
              <div class="widget-row-sub">@${esc(s.handle)} • ${s.followers||'—'}</div>
            </div>
            <span class="level-badge ${s.level}">${levelTr(s.level)}</span>
          </div>`).join('')
      : '<div class="empty-state">Henüz yayıncı eklenmedi.</div>';
  }
}

/* ═══════════════════════════════════════
   YAYINCILAR
═══════════════════════════════════════ */
let editingStreamerId = null;
let currentAvatarB64  = '';

async function renderStreamers() {
  const list = await api('streamers.php');
  const wrap = document.getElementById('streamersTable');
  document.getElementById('streamerCount').textContent = `${Array.isArray(list) ? list.length : 0} yayıncı`;

  if (!Array.isArray(list) || !list.length) {
    wrap.innerHTML = '<div class="empty-state">Henüz yayıncı eklenmedi.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Yayıncı</th><th>Kategori</th><th>Takipçi</th><th>Seviye</th><th>İşlem</th></tr></thead>
        <tbody>
          ${list.map(s => `
            <tr>
              <td>
                <div class="str-row-info">
                  <div class="str-row-avatar" style="background:${levelGrad(s.level)}">${avatarContent(s)}</div>
                  <div>
                    <div class="str-row-name">${esc(s.name)}</div>
                    <div class="str-row-handle">@${esc(s.handle)}</div>
                  </div>
                </div>
              </td>
              <td>${esc(s.cat_emoji||'')} ${esc(s.cat_label||'—')}</td>
              <td>${esc(s.followers||'—')}</td>
              <td><span class="level-badge ${s.level}">${levelTr(s.level)}</span></td>
              <td>
                <div class="row-actions">
                  <button class="btn-row edit" onclick="editStreamer('${s.id}')">Düzenle</button>
                  <button class="btn-row del"  onclick="deleteStreamer('${s.id}')">Sil</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

document.getElementById('addStreamerBtn').addEventListener('click', () => openStreamerModal());
window.editStreamer = (id) => openStreamerModal(id);

async function openStreamerModal(id = null) {
  editingStreamerId = id;
  currentAvatarB64  = '';
  document.getElementById('modalTitle').textContent = id ? 'Yayıncıyı Düzenle' : 'Yeni Yayıncı Ekle';

  if (id) {
    const list = await api('streamers.php');
    const s = Array.isArray(list) ? list.find(x => x.id === id) : null;
    if (!s) return;
    document.getElementById('m-name').value     = s.name    || '';
    document.getElementById('m-handle').value   = s.handle  || '';
    document.getElementById('m-url').value      = s.url     || '';
    document.getElementById('m-catEmoji').value = s.cat_emoji || '🌟';
    document.getElementById('m-catLabel').value = s.cat_label || '';
    document.getElementById('m-followers').value= s.followers || '';
    document.getElementById('m-viewers').value  = s.viewers  || '';
    document.getElementById('m-level').value    = s.level    || 'bronze';
    document.getElementById('m-featured').checked = !!s.featured;
    document.getElementById('m-bio').value      = s.bio      || '';
    if (s.photo) {
      currentAvatarB64 = s.photo;
      document.getElementById('avatarImg').src = s.photo;
      document.getElementById('avatarImg').style.display = 'block';
      document.getElementById('avatarLetter').style.display = 'none';
    } else {
      resetAvatar(s.name);
    }
  } else {
    ['m-name','m-handle','m-url','m-catLabel','m-followers','m-viewers','m-bio'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('m-catEmoji').value = '🌟';
    document.getElementById('m-level').value    = 'bronze';
    document.getElementById('m-featured').checked = false;
    resetAvatar('');
  }
  document.getElementById('streamerModal').classList.add('open');
}

function resetAvatar(name) {
  currentAvatarB64 = '';
  const img = document.getElementById('avatarImg');
  const ltr = document.getElementById('avatarLetter');
  img.style.display = 'none';
  img.src = '';
  ltr.style.display = '';
  ltr.textContent = name ? name.charAt(0).toUpperCase() : '?';
}

document.getElementById('avatarUpload').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentAvatarB64 = e.target.result;
    document.getElementById('avatarImg').src = currentAvatarB64;
    document.getElementById('avatarImg').style.display = 'block';
    document.getElementById('avatarLetter').style.display = 'none';
  };
  reader.readAsDataURL(file);
});

document.getElementById('clearAvatar').addEventListener('click', () => {
  currentAvatarB64 = '';
  resetAvatar(document.getElementById('m-name').value);
});

document.getElementById('m-name').addEventListener('input', function() {
  if (!currentAvatarB64) {
    document.getElementById('avatarLetter').textContent = this.value ? this.value.charAt(0).toUpperCase() : '?';
  }
});

function closeStreamerModal() { document.getElementById('streamerModal').classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeStreamerModal);
document.getElementById('modalCancel').addEventListener('click', closeStreamerModal);

document.getElementById('modalSave').addEventListener('click', async () => {
  const name = document.getElementById('m-name').value.trim();
  if (!name) { toast('İsim zorunlu.', 'error'); return; }

  const payload = {
    id:        editingStreamerId,
    name,
    handle:    document.getElementById('m-handle').value.trim(),
    url:       document.getElementById('m-url').value.trim(),
    catEmoji:  document.getElementById('m-catEmoji').value,
    catLabel:  document.getElementById('m-catLabel').value.trim(),
    followers: document.getElementById('m-followers').value.trim(),
    viewers:   document.getElementById('m-viewers').value.trim(),
    level:     document.getElementById('m-level').value,
    featured:  document.getElementById('m-featured').checked,
    bio:       document.getElementById('m-bio').value.trim(),
    photo:     currentAvatarB64,
  };

  const method = editingStreamerId ? 'PUT' : 'POST';
  const res    = await api('streamers.php', method, payload);
  if (res.error) { toast(res.error, 'error'); return; }

  toast(editingStreamerId ? 'Yayıncı güncellendi ✓' : 'Yayıncı eklendi ✓');
  closeStreamerModal();
  renderStreamers();
  renderDashboard();
});

async function deleteStreamer(id) {
  if (!confirm2('Bu yayıncıyı silmek istiyor musunuz?')) return;
  const res = await api(`streamers.php?id=${id}`, 'DELETE');
  if (res.error) { toast(res.error, 'error'); return; }
  toast('Yayıncı silindi.');
  renderStreamers();
}
window.deleteStreamer = deleteStreamer;

/* ═══════════════════════════════════════
   BAŞVURULAR
═══════════════════════════════════════ */
let viewingAppId   = null;
let currentFilter  = 'all';

async function renderApplications(filter = 'all') {
  currentFilter = filter;
  document.querySelectorAll('.ftab').forEach(t => t.classList.toggle('active', t.dataset.filter === filter));

  const url  = filter === 'all' ? 'applications.php' : `applications.php?status=${filter}`;
  const list = await api(url);
  const wrap = document.getElementById('applicationsTable');

  if (!Array.isArray(list) || !list.length) {
    wrap.innerHTML = '<div class="empty-state">Başvuru bulunamadı.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Ad Soyad</th><th>TikTok</th><th>Şehir</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>
        <tbody>
          ${list.map(a => `
            <tr>
              <td><strong>${esc(a.name)}</strong></td>
              <td style="color:#c084fc">@${esc(a.tiktok||'—')}</td>
              <td>${esc(a.city||'—')}</td>
              <td style="font-size:12px;color:#94a3b8">${formatDate(a.created_at)}</td>
              <td><span class="status-badge ${a.status}">${statusLabel(a.status)}</span></td>
              <td>
                <div class="row-actions">
                  <button class="btn-row view" onclick="viewApp('${a.id}')">Detay</button>
                  <button class="btn-row del"  onclick="deleteApp('${a.id}')">Sil</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

async function viewApp(id) {
  const list = await api('applications.php');
  const a = Array.isArray(list) ? list.find(x => x.id === id) : null;
  if (!a) return;
  viewingAppId = id;

  document.getElementById('appModalBody').innerHTML = `
    <div class="app-detail-grid">
      <div class="app-detail-item"><label>Ad Soyad</label><span>${esc(a.name)}</span></div>
      <div class="app-detail-item"><label>Yaş</label><span>${esc(a.age||'—')}</span></div>
      <div class="app-detail-item"><label>Telefon</label><span>${esc(a.phone)}</span></div>
      <div class="app-detail-item"><label>Şehir</label><span>${esc(a.city||'—')}</span></div>
      <div class="app-detail-item"><label>TikTok</label><span style="color:#c084fc">@${esc(a.tiktok||'—')}</span></div>
      <div class="app-detail-item"><label>Takipçi</label><span>${esc(a.followers||'—')}</span></div>
      <div class="app-detail-item"><label>Deneyim</label><span>${esc(a.experience||'—')}</span></div>
      <div class="app-detail-item"><label>Kategori</label><span>${esc(a.category||'—')}</span></div>
      <div class="app-detail-item"><label>Başvuru Tarihi</label><span>${formatDate(a.created_at)}</span></div>
      <div class="app-detail-item"><label>Durum</label><span class="status-badge ${a.status}">${statusLabel(a.status)}</span></div>
    </div>
    ${a.message ? `<div class="app-detail-item"><label>Mesaj</label></div><div class="app-detail-message">${esc(a.message)}</div>` : ''}`;

  document.getElementById('appModal').classList.add('open');
  if (a.status === 'new') setAppStatus('reviewed', false);
}
window.viewApp = viewApp;

async function setAppStatus(status, showToast = true) {
  if (!viewingAppId) return;
  const res = await api('applications.php', 'PUT', { id: viewingAppId, status });
  if (res.error) { toast(res.error, 'error'); return; }
  renderApplications(currentFilter);
  updateAppBadge();
  if (showToast) {
    const labels = { accepted:'Kabul edildi ✓', rejected:'Reddedildi.', reviewed:'İncelendi.' };
    toast(labels[status] || 'Güncellendi.');
  }
}
window.setAppStatus = setAppStatus;

async function deleteApp(id) {
  if (!confirm2('Bu başvuruyu silmek istiyor musunuz?')) return;
  await api(`applications.php?id=${id}`, 'DELETE');
  renderApplications(currentFilter);
  updateAppBadge();
  toast('Başvuru silindi.');
}
window.deleteApp = deleteApp;

document.getElementById('appModalClose').addEventListener('click', () => {
  document.getElementById('appModal').classList.remove('open');
  viewingAppId = null;
});
document.getElementById('appModalCancel').addEventListener('click', () => {
  document.getElementById('appModal').classList.remove('open');
  viewingAppId = null;
});

document.getElementById('clearAppsBtn').addEventListener('click', async () => {
  if (!confirm2('Tüm başvurular silinecek. Emin misiniz?')) return;
  const list = await api('applications.php');
  if (Array.isArray(list)) {
    await Promise.all(list.map(a => api(`applications.php?id=${a.id}`, 'DELETE')));
  }
  renderApplications('all');
  updateAppBadge();
  toast('Başvurular temizlendi.');
});

document.querySelectorAll('.ftab').forEach(t => {
  t.addEventListener('click', () => renderApplications(t.dataset.filter));
});

async function updateAppBadge() {
  const apps = await api('applications.php');
  const n = Array.isArray(apps) ? apps.filter(a => a.status === 'new').length : 0;
  const badge = document.getElementById('appBadge');
  badge.textContent  = n || '';
  badge.style.display = n ? 'flex' : 'none';
  const kpi = document.getElementById('kpi-new');
  if (kpi) kpi.textContent = n;
}

/* ═══════════════════════════════════════
   MESAJLAR
═══════════════════════════════════════ */
let currentMsgFilter = 'all';

async function renderMessages(filter = 'all') {
  currentMsgFilter = filter;
  document.querySelectorAll('[data-mfilter]').forEach(t => {
    t.classList.toggle('active', t.dataset.mfilter === filter);
  });

  const filterParam = filter !== 'all' ? `?filter=${filter}` : '';
  const list = await api(`messages.php${filterParam}`);
  const all  = await api('messages.php');
  const wrap = document.getElementById('messagesTable');

  document.getElementById('msgCount').textContent = `${Array.isArray(all) ? all.length : 0} mesaj`;

  if (!Array.isArray(list) || !list.length) {
    wrap.innerHTML = `<div class="empty-state">${filter === 'unread' ? 'Okunmamış mesaj yok.' : 'Henüz mesaj yok.'}</div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="msg-list">
      ${list.map(m => `
        <div class="msg-card ${m.read ? '' : 'msg-unread'}" onclick="readMessage('${m.id}')">
          <div class="msg-card-head">
            <div class="msg-avatar">${(m.name||'?').charAt(0).toUpperCase()}</div>
            <div class="msg-card-info">
              <strong>${esc(m.name)}</strong>
              <span>${esc(m.phone||'—')}</span>
            </div>
            <div class="msg-card-meta">
              <span class="msg-time">${formatDate(m.created_at)}</span>
              ${!m.read ? '<span class="msg-dot"></span>' : ''}
            </div>
            <div class="row-actions" style="margin-left:12px" onclick="event.stopPropagation()">
              ${m.phone ? `<a href="https://wa.me/${m.phone.replace(/\D/g,'')}" target="_blank" class="btn-row view">WhatsApp</a>` : ''}
              <button class="btn-row del" onclick="deleteMessage('${m.id}')">Sil</button>
            </div>
          </div>
          <div class="msg-body">${esc(m.message)}</div>
        </div>`).join('')}
    </div>`;
}

async function readMessage(id) {
  await api('messages.php', 'PUT', { id });
  updateMsgBadge();
  renderMessages(currentMsgFilter);
}
window.readMessage = readMessage;

async function deleteMessage(id) {
  if (!confirm2('Bu mesajı silmek istiyor musunuz?')) return;
  await api(`messages.php?id=${id}`, 'DELETE');
  updateMsgBadge();
  renderMessages(currentMsgFilter);
  toast('Mesaj silindi.');
}
window.deleteMessage = deleteMessage;

async function updateMsgBadge() {
  const msgs = await api('messages.php');
  const n = Array.isArray(msgs) ? msgs.filter(m => !m.read).length : 0;
  const badge = document.getElementById('msgBadge');
  if (badge) { badge.textContent = n||''; badge.style.display = n ? 'flex' : 'none'; }
  const kpi = document.getElementById('kpi-messages');
  if (kpi) kpi.textContent = n || (Array.isArray(msgs) ? msgs.length : 0);
}

document.getElementById('clearMsgsBtn').addEventListener('click', async () => {
  if (!confirm2('Tüm mesajlar silinecek. Emin misiniz?')) return;
  const list = await api('messages.php');
  if (Array.isArray(list)) {
    await Promise.all(list.map(m => api(`messages.php?id=${m.id}`, 'DELETE')));
  }
  renderMessages('all');
  updateMsgBadge();
  toast('Mesajlar temizlendi.');
});

document.querySelectorAll('[data-mfilter]').forEach(t => {
  t.addEventListener('click', () => renderMessages(t.dataset.mfilter));
});

/* ═══════════════════════════════════════
   YORUMLAR
═══════════════════════════════════════ */
let editingReviewId = null;

async function renderReviews() {
  const list = await api('reviews.php');
  const wrap = document.getElementById('reviewsTable');
  if (!Array.isArray(list) || !list.length) {
    wrap.innerHTML = '<div class="empty-state">Yorum bulunamadı.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>İsim</th><th>Hesap</th><th>Rozet</th><th>Öne Çıkan</th><th>İşlem</th></tr></thead>
        <tbody>
          ${list.map(r => `
            <tr>
              <td><strong>${esc(r.name)}</strong></td>
              <td style="color:#c084fc;font-size:12px">${esc(r.handle)}</td>
              <td><span class="status-badge new">${esc(r.badge)}</span></td>
              <td>${r.featured ? '⭐ Evet' : '—'}</td>
              <td>
                <div class="row-actions">
                  <button class="btn-row edit" onclick="editReview('${r.id}')">Düzenle</button>
                  <button class="btn-row del"  onclick="deleteReview('${r.id}')">Sil</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

document.getElementById('addReviewBtn').addEventListener('click', () => openReviewModal());
window.editReview = (id) => openReviewModal(id);

async function openReviewModal(id = null) {
  editingReviewId = id;
  document.getElementById('reviewModalTitle').textContent = id ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle';

  if (id) {
    const list = await api('reviews.php');
    const r = Array.isArray(list) ? list.find(x => x.id === id) : null;
    if (!r) return;
    document.getElementById('rv-name').value    = r.name    || '';
    document.getElementById('rv-handle').value  = r.handle  || '';
    document.getElementById('rv-badge').value   = r.badge   || '';
    document.getElementById('rv-color').value   = r.color   || 'linear-gradient(135deg,#7c3aed,#ec4899)';
    document.getElementById('rv-featured').checked = !!r.featured;
    document.getElementById('rv-text').value    = r.text    || '';
  } else {
    ['rv-name','rv-handle','rv-badge','rv-text'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('rv-featured').checked = false;
  }
  document.getElementById('reviewModal').classList.add('open');
}

function closeReviewModal() { document.getElementById('reviewModal').classList.remove('open'); }
document.getElementById('reviewModalClose').addEventListener('click', closeReviewModal);
document.getElementById('reviewModalCancel').addEventListener('click', closeReviewModal);

document.getElementById('reviewModalSave').addEventListener('click', async () => {
  const name = document.getElementById('rv-name').value.trim();
  const text = document.getElementById('rv-text').value.trim();
  if (!name || !text) { toast('İsim ve yorum zorunlu.', 'error'); return; }

  const payload = {
    id:       editingReviewId,
    name,
    handle:   document.getElementById('rv-handle').value.trim(),
    badge:    document.getElementById('rv-badge').value.trim(),
    color:    document.getElementById('rv-color').value,
    featured: document.getElementById('rv-featured').checked,
    text,
  };

  const method = editingReviewId ? 'PUT' : 'POST';
  const res = await api('reviews.php', method, payload);
  if (res.error) { toast(res.error, 'error'); return; }
  toast(editingReviewId ? 'Yorum güncellendi ✓' : 'Yorum eklendi ✓');
  closeReviewModal();
  renderReviews();
});

async function deleteReview(id) {
  if (!confirm2('Bu yorumu silmek istiyor musunuz?')) return;
  await api(`reviews.php?id=${id}`, 'DELETE');
  renderReviews();
  toast('Yorum silindi.');
}
window.deleteReview = deleteReview;

/* ═══════════════════════════════════════
   BLOG
═══════════════════════════════════════ */
let editingPostId = null;

async function renderPosts() {
  const list = await api('blog.php');
  const wrap = document.getElementById('postsTable');
  document.getElementById('postCount').textContent = `${Array.isArray(list) ? list.length : 0} yazı`;

  if (!Array.isArray(list) || !list.length) {
    wrap.innerHTML = '<div class="empty-state">Henüz yazı eklenmedi.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Başlık</th><th>Kategori</th><th>Tarih</th><th>Öne Çıkan</th><th>Yayında</th><th>İşlem</th></tr></thead>
        <tbody>
          ${list.map(p => `
            <tr>
              <td><strong>${esc(p.emoji||'')} ${esc(p.title)}</strong></td>
              <td><span class="status-badge new">${esc(p.category)}</span></td>
              <td style="font-size:12px;color:#94a3b8">${p.published_date||p.date||'—'}</td>
              <td>${p.featured ? '⭐ Evet' : '—'}</td>
              <td>${p.published ? '<span style="color:#4ade80">● Yayında</span>' : '<span style="color:#64748b">● Taslak</span>'}</td>
              <td>
                <div class="row-actions">
                  <button class="btn-row edit" onclick="editPost('${p.id}')">Düzenle</button>
                  <button class="btn-row del"  onclick="deletePost('${p.id}')">Sil</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

document.getElementById('addPostBtn').addEventListener('click', () => openPostModal());
window.editPost = (id) => openPostModal(id);

function slugify(text) {
  return text.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();
}

async function openPostModal(id = null) {
  editingPostId = id;
  document.getElementById('postModalTitle').textContent = id ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle';

  if (id) {
    const list = await api('blog.php');
    const p = Array.isArray(list) ? list.find(x => x.id === id) : null;
    if (!p) return;
    document.getElementById('bp-title').value     = p.title    || '';
    document.getElementById('bp-slug').value      = p.slug     || '';
    document.getElementById('bp-category').value  = p.category || 'Strateji';
    document.getElementById('bp-emoji').value     = p.emoji    || '';
    document.getElementById('bp-readtime').value  = p.read_time|| '5 dk';
    document.getElementById('bp-date').value      = p.published_date || p.date || '';
    document.getElementById('bp-featured').checked  = !!p.featured;
    document.getElementById('bp-published').checked = p.published !== false;
    document.getElementById('bp-excerpt').value   = p.excerpt  || '';
    document.getElementById('bp-content').value   = p.content  || '';
  } else {
    ['bp-title','bp-slug','bp-emoji','bp-excerpt','bp-content'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('bp-category').value  = 'Strateji';
    document.getElementById('bp-readtime').value  = '5 dk';
    document.getElementById('bp-date').value      = new Date().toISOString().split('T')[0];
    document.getElementById('bp-featured').checked  = false;
    document.getElementById('bp-published').checked = true;
  }
  document.getElementById('postModal').classList.add('open');
}

document.getElementById('bp-title').addEventListener('input', function() {
  if (!editingPostId) document.getElementById('bp-slug').value = slugify(this.value);
});

function closePostModal() { document.getElementById('postModal').classList.remove('open'); }
document.getElementById('postModalClose').addEventListener('click', closePostModal);
document.getElementById('postModalCancel').addEventListener('click', closePostModal);

document.getElementById('postModalSave').addEventListener('click', async () => {
  const title   = document.getElementById('bp-title').value.trim();
  const slug    = document.getElementById('bp-slug').value.trim();
  const excerpt = document.getElementById('bp-excerpt').value.trim();
  if (!title || !slug || !excerpt) { toast('Başlık, slug ve özet zorunlu.', 'error'); return; }

  const payload = {
    id:       editingPostId,
    title, slug, excerpt,
    content:  document.getElementById('bp-content').value.trim(),
    category: document.getElementById('bp-category').value,
    emoji:    document.getElementById('bp-emoji').value.trim(),
    readTime: document.getElementById('bp-readtime').value.trim() || '5 dk',
    date:     document.getElementById('bp-date').value || new Date().toISOString().split('T')[0],
    featured: document.getElementById('bp-featured').checked,
    published:document.getElementById('bp-published').checked,
  };

  const method = editingPostId ? 'PUT' : 'POST';
  const res = await api('blog.php', method, payload);
  if (res.error) { toast(res.error, 'error'); return; }
  toast(editingPostId ? 'Yazı güncellendi ✓' : 'Yazı eklendi ✓');
  closePostModal();
  renderPosts();
});

async function deletePost(id) {
  if (!confirm2('Bu yazıyı silmek istiyor musunuz?')) return;
  await api(`blog.php?id=${id}`, 'DELETE');
  renderPosts();
  toast('Yazı silindi.');
}
window.deletePost = deletePost;

/* ═══════════════════════════════════════
   AYARLAR
═══════════════════════════════════════ */
async function loadSettings() {
  const s = await api('settings.php');
  if (!s || s.error) return;
  const f = (id, fallback='') => { const el = document.getElementById(id); if(el) el.value = s[id.replace('s-','')] || fallback; };

  document.getElementById('s-heroTitle') && (document.getElementById('s-heroTitle').value  = s.heroTitle  || '');
  document.getElementById('s-heroSub')   && (document.getElementById('s-heroSub').value    = s.heroSub    || '');
  document.getElementById('s-heroCta')   && (document.getElementById('s-heroCta').value    = s.heroCta    || '');
  document.getElementById('s-streamers') && (document.getElementById('s-streamers').value  = s.metricStreamers    || '2.800');
  document.getElementById('s-satisfaction') && (document.getElementById('s-satisfaction').value = s.metricSatisfaction || '99');
  document.getElementById('s-avgIncome') && (document.getElementById('s-avgIncome').value  = s.avgIncome  || '₺42K');
  document.getElementById('s-years')     && (document.getElementById('s-years').value      = s.years      || '4');
  document.getElementById('s-formTitle') && (document.getElementById('s-formTitle').value  = s.formTitle  || '');
  document.getElementById('s-formSub')   && (document.getElementById('s-formSub').value    = s.formSub    || '');
  document.getElementById('s-formThanks')&& (document.getElementById('s-formThanks').value = s.formThanks || '');
  document.getElementById('s-phone')     && (document.getElementById('s-phone').value      = s.phone      || '905550000000');
  document.getElementById('s-waMsg')     && (document.getElementById('s-waMsg').value      = s.waMsg      || '');
  document.getElementById('s-phoneDisplay') && (document.getElementById('s-phoneDisplay').value = s.phoneDisplay || '');
  document.getElementById('s-email')     && (document.getElementById('s-email').value      = s.email      || '');
  document.getElementById('s-contactTitle') && (document.getElementById('s-contactTitle').value = s.contactTitle || '');
  document.getElementById('s-contactSub')   && (document.getElementById('s-contactSub').value   = s.contactSub   || '');
  document.getElementById('s-tiktok')    && (document.getElementById('s-tiktok').value    = s.tiktokUrl    || '');
  document.getElementById('s-instagram') && (document.getElementById('s-instagram').value = s.instagramUrl || '');
  document.getElementById('s-youtube')   && (document.getElementById('s-youtube').value   = s.youtubeUrl   || '');
  document.getElementById('s-twitter')   && (document.getElementById('s-twitter').value   = s.twitterUrl   || '');
}

document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
  const val = id => document.getElementById(id)?.value.trim() || '';
  const payload = {
    heroTitle:           val('s-heroTitle'),
    heroSub:             val('s-heroSub'),
    heroCta:             val('s-heroCta'),
    metricStreamers:     val('s-streamers'),
    metricSatisfaction:  val('s-satisfaction'),
    avgIncome:           val('s-avgIncome'),
    years:               val('s-years'),
    formTitle:           val('s-formTitle'),
    formSub:             val('s-formSub'),
    formThanks:          val('s-formThanks'),
    phone:               val('s-phone'),
    waMsg:               val('s-waMsg'),
    phoneDisplay:        val('s-phoneDisplay'),
    email:               val('s-email'),
    contactTitle:        val('s-contactTitle'),
    contactSub:          val('s-contactSub'),
    tiktokUrl:           val('s-tiktok'),
    instagramUrl:        val('s-instagram'),
    youtubeUrl:          val('s-youtube'),
    twitterUrl:          val('s-twitter'),
  };

  const res = await api('settings.php', 'POST', payload);
  if (res.error) { toast(res.error, 'error'); return; }

  const msg = document.getElementById('saveMsg');
  msg.textContent = '✓ Kaydedildi & Siteye uygulandı';
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 3000);
  toast('Ayarlar kaydedildi ✓');
});

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function levelTr(level) {
  return { bronze:'Bronz', silver:'Gümüş', gold:'Altın', platin:'Platin' }[level] || level;
}

function levelGrad(level) {
  return { bronze:'linear-gradient(135deg,#cd7c2f,#e8a060)', silver:'linear-gradient(135deg,#94a3b8,#cbd5e1)', gold:'linear-gradient(135deg,#f59e0b,#fcd34d)', platin:'linear-gradient(135deg,#7c3aed,#ec4899)' }[level] || 'linear-gradient(135deg,#7c3aed,#ec4899)';
}

function avatarContent(s) {
  if (s.photo) return `<img src="${s.photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  return s.name ? s.name.charAt(0).toUpperCase() : '?';
}

function statusLabel(status) {
  return { new:'Yeni', reviewed:'İncelendi', accepted:'Kabul Edildi', rejected:'Reddedildi' }[status] || status;
}

/* ═══════════════════════════════════════
   BOOT — Oturum Kontrolü
═══════════════════════════════════════ */
checkSession();
