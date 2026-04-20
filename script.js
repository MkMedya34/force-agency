/* ═══════════════ SETTINGS — API'den Yükle & Uygula ═══════════════ */
async function applySettings() {
  let s = {};
  try {
    const res = await fetch('api/settings.php');
    s = await res.json();
    if (s.error) s = {};
  } catch(e) { /* API yoksa varsayılan kullan */ }

  const phone        = s.phone        || '905550000000';
  const waMsg        = encodeURIComponent(s.waMsg || 'Merhaba, Force Ajans hakkında bilgi almak istiyorum.');
  const waHref       = `https://wa.me/${phone}?text=${waMsg}`;
  const phoneDisplay = s.phoneDisplay || '+90 555 000 0000';
  const email        = s.email        || 'info@forceajans.com';

  const upd = (id, prop, val) => { const el = document.getElementById(id); if(el) el[prop] = val; };
  upd('waBtn',               'href',        waHref);
  upd('contactWaLink',       'href',        waHref);
  upd('footerWa',            'href',        waHref);
  upd('contactPhoneDisplay', 'textContent', phoneDisplay);
  upd('footerPhone',         'textContent', phoneDisplay);
  upd('footerEmail',         'textContent', email);
  upd('contactEmailDisplay', 'textContent', email);

  if (s.contactSub) upd('contactSub', 'textContent', s.contactSub);

  const socMap = { socTiktok:s.tiktokUrl, socInstagram:s.instagramUrl, socYoutube:s.youtubeUrl, socTwitter:s.twitterUrl };
  Object.entries(socMap).forEach(([id, url]) => {
    if (url) { const el = document.getElementById(id); if(el) el.href = url; }
  });
}

applySettings();

/* ═══════════════ NAVBAR ═══════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════ HAMBURGER ═══════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ═══════════════ COUNTER ANIMATION ═══════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('tr-TR');
  }, step);
}

/* ═══════════════ DASHBOARD STAT COUNTERS ═══════════════ */
function animateDashStat(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('tr-TR');
  }, step);
}

/* ═══════════════ INTERSECTION OBSERVER ═══════════════ */
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    if (el.classList.contains('counter')) {
      animateCounter(el);
    } else if (el.classList.contains('ds-num') && el.dataset.target) {
      animateDashStat(el);
    }

    counterObserver.unobserve(el);
  });
}, observerOptions);

document.querySelectorAll('.counter, .ds-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ═══════════════ SCROLL FADE IN ═══════════════ */
const fadeEls = document.querySelectorAll(
  '.adv-card, .inc-card, .rev-card, .imp-card, .feat, .step-item, .metric-card, .stats-card, .about-card'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 60 * (entry.target.dataset.delay || 0));
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
  el.dataset.delay = i % 4;
  fadeObserver.observe(el);
});

/* ═══════════════ FAQ ACCORDION ═══════════════ */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

/* ═══════════════ FORM SUBMIT — localStorage'a kaydet ═══════════════ */
document.getElementById('applyForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn    = this.querySelector('.btn-submit');
  const textEl = btn.querySelector('.btn-submit-text');
  const success = document.getElementById('formSuccess');

  textEl.textContent = 'Gönderiliyor...';
  btn.disabled = true;

  const fd = new FormData(this);
  const app = {
    name:       fd.get('name')       || '',
    age:        fd.get('age')        || '',
    phone:      fd.get('phone')      || '',
    city:       fd.get('city')       || '',
    tiktok:     (fd.get('tiktok')||'').replace('@',''),
    followers:  fd.get('followers')  || '',
    experience: fd.get('experience') || '',
    category:   fd.get('category')   || '',
    message:    fd.get('message')    || '',
  };

  fetch('api/applications.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app)
  }).then(() => {
    btn.style.display = 'none';
    success.classList.add('show');
    this.reset();
    success.scrollIntoView({ behavior:'smooth', block:'center' });
  }).catch(() => {
    textEl.textContent = 'Hata oluştu.';
    btn.disabled = false;
  });
});

/* ═══════════════ ACTIVE NAV LINK ON SCROLL ═══════════════ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));

/* ═══════════════ SMOOTH SCROLL FOR ANCHORS ═══════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════ CHART BAR ANIMATE ═══════════════ */
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar, .pb').forEach((bar, i) => {
        const finalH = bar.style.getPropertyValue('--h');
        bar.style.setProperty('--h', '0%');
        setTimeout(() => {
          bar.style.transition = 'height .6s ease';
          bar.style.setProperty('--h', finalH);
        }, i * 80);
      });
      chartObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.chart-bars, .pm-bars').forEach(el => chartObserver.observe(el));

/* ═══════════════ YAYINCILAR — API'den render ═══════════════ */
async function renderStreamers() {
  const grid = document.getElementById('streamersGrid');
  const cta  = document.getElementById('streamersCta');
  if (!grid) return;

  let list = [];
  try {
    const res = await fetch('api/streamers.php');
    list = await res.json();
    if (!Array.isArray(list)) list = [];
  } catch(e) { list = []; }

  if (!list.length) {
    // Statik placeholder kartları göster, cta gizle
    grid.querySelectorAll('.streamer-card').forEach(c => c.style.display = '');
    if (cta) cta.style.display = 'none';
    return;
  }

  // Admin'den veri geldiyse statik kartları sil ve dinamik yaz
  grid.innerHTML = list.map(s => {
    const avatarHtml = s.photo
      ? `<img src="${s.photo}" alt="${s.name}" />`
      : `<span>${s.name ? s.name.charAt(0).toUpperCase() : '?'}</span>`;

    const grad = { bronze:'linear-gradient(135deg,#cd7c2f,#e8a060)', silver:'linear-gradient(135deg,#94a3b8,#cbd5e1)', gold:'linear-gradient(135deg,#f59e0b,#fcd34d)', platin:'linear-gradient(135deg,#7c3aed,#ec4899)' };
    const levelTr = { bronze:'Bronz', silver:'Gümüş', gold:'Altın', platin:'Platin' };

    return `
      <div class="streamer-card${s.featured ? ' featured-streamer' : ''}">
        ${s.featured ? '<div class="streamer-crown">👑 En İyi Yayıncı</div>' : ''}
        <div class="streamer-top">
          <div class="streamer-avatar-wrap">
            <div class="streamer-avatar" style="background:${grad[s.level]||grad.bronze}">${avatarHtml}</div>
            <div class="streamer-live-ring${s.featured ? ' glow' : ''}"></div>
          </div>
          <div class="streamer-level ${s.level}">${levelTr[s.level]||s.level}</div>
        </div>
        <div class="streamer-info">
          <h3 class="streamer-name">${s.name}</h3>
          <a class="streamer-handle" href="${s.url||'#'}" target="_blank">@${s.handle}</a>
          <div class="streamer-category">${s.catEmoji||''} ${s.catLabel||''}</div>
        </div>
        <div class="streamer-stats">
          <div class="ss-item">
            <span class="ss-val">${s.followers||'—'}</span>
            <span class="ss-label">Takipçi</span>
          </div>
          <div class="ss-divider"></div>
          <div class="ss-item">
            <span class="ss-val">${s.viewers||'—'}</span>
            <span class="ss-label">Ort. İzleyici</span>
          </div>
        </div>
        <div class="streamer-bio">${s.bio||''}</div>
        <a href="${s.url||'#'}" target="_blank" class="streamer-btn">TikTok'ta Takip Et →</a>
      </div>`;
  }).join('');

  if (cta) cta.style.display = 'flex';
}

/* ═══════════════ YORUMLAR — API'den render ═══════════════ */
async function renderReviews() {
  const wrap = document.querySelector('.reviews-grid');
  if (!wrap) return;

  let list = [];
  try {
    const res = await fetch('api/reviews.php');
    list = await res.json();
    if (!Array.isArray(list)) list = [];
  } catch(e) { list = []; }
  if (!list.length) return;

  wrap.innerHTML = list.map(r => `
    <div class="rev-card${r.featured ? ' featured-rev' : ''}">
      <div class="rev-stars">★★★★★</div>
      <p>"${r.text}"</p>
      <div class="rev-author">
        <div class="rev-avatar" style="background:${r.color}">${r.name.charAt(0)}</div>
        <div>
          <strong>${r.name}</strong>
          <span>${r.handle}</span>
        </div>
      </div>
      ${r.badge ? `<div class="rev-badge">${r.badge}</div>` : ''}
    </div>`).join('');
}

// İlk yükleme
renderStreamers();
renderReviews();

/* ═══════════════ İLETİŞİM FORMU ═══════════════ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nameEl = this.querySelector('[name="name"]');
    const phoneEl = this.querySelector('[name="phone"]');
    const msgEl  = this.querySelector('[name="message"]');
    const btn    = this.querySelector('.cf-submit');
    const successEl = document.getElementById('cfSuccess');

    const name    = nameEl.value.trim();
    const phone   = phoneEl.value.trim();
    const message = msgEl.value.trim();

    if (!name || !phone || !message) {
      nameEl.style.borderColor   = name   ? '' : '#ef4444';
      phoneEl.style.borderColor  = phone  ? '' : '#ef4444';
      msgEl.style.borderColor    = message? '' : '#ef4444';
      return;
    }

    btn.disabled = true;
    btn.querySelector('.cf-btn-text').textContent = 'Gönderiliyor...';

    fetch('api/messages.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, message })
    }).then(() => {
      btn.style.display = 'none';
      successEl.classList.add('show');
      this.reset();
    }).catch(() => {
      btn.disabled = false;
      btn.querySelector('.cf-btn-text').textContent = 'Mesaj Gönder →';
      toast && toast('Hata oluştu, tekrar deneyin.', 'error');
    });
  });
}

/* ═══════════════ BLOG — Ana Sayfada Son 3 Yazı ═══════════════ */
async function renderHomeBlog() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  let stored = [];
  try {
    const res = await fetch('api/blog.php');
    stored = await res.json();
    if (!Array.isArray(stored)) stored = [];
  } catch(e) { return; }

  if (!stored.length) return;

  const posts = stored.filter(p => p.published || p.is_published).slice(0, 3);
  if (!posts.length) return;

  const catColors = {
    'Strateji':       'linear-gradient(135deg,#7c3aed,#4f46e5)',
    'Kazanç':         'linear-gradient(135deg,#ec4899,#f59e0b)',
    'Ekipman':        'linear-gradient(135deg,#0ea5e9,#7c3aed)',
    'Başarı Hikayesi':'linear-gradient(135deg,#f59e0b,#ec4899)',
    'İpuçları':       'linear-gradient(135deg,#10b981,#0ea5e9)',
  };

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' });
  }

  grid.innerHTML = posts.map(p => {
    const bg = p.coverColor || catColors[p.category] || 'linear-gradient(135deg,#7c3aed,#ec4899)';
    const imgHtml = p.coverImage
      ? `<img src="${p.coverImage}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover" loading="lazy" />`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.4rem;background:${bg}">${p.emoji||'📝'}</div>`;

    return `
      <div class="blog-card blog-placeholder" onclick="window.location.href='blog-post.html?slug=${p.slug}'" style="cursor:pointer">
        <div class="blog-card-img">${imgHtml}<div class="blog-cat-badge">${p.category}</div></div>
        <div class="blog-card-body">
          <div class="blog-meta"><span>${fmtDate(p.date)}</span><span>${p.readTime||'5 dk'} okuma</span></div>
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <a href="blog-post.html?slug=${p.slug}" class="blog-read" onclick="event.stopPropagation()">Devamını Oku →</a>
        </div>
      </div>`;
  }).join('');
}

renderHomeBlog();

/* ═══════════════ KAZANÇ HESAPLAYICI ═══════════════ */
(function() {
  const sliderF = document.getElementById('kcFollowers');
  const sliderH = document.getElementById('kcHours');
  if (!sliderF) return;

  const bonusMap = { bronze:[5000,12000], silver:[12000,28000], gold:[28000,55000], platin:[55000,75000] };
  let level = 'silver';

  function followers(v) {
    const steps = [1,2,5,10,20,30,50,75,100,150,200,300,400,500];
    const k = steps[Math.round(v / 100 * (steps.length-1))];
    return k >= 1000 ? k + 'K+' : k + 'K';
  }
  function followersNum(v) {
    const steps = [1000,2000,5000,10000,20000,30000,50000,75000,100000,150000,200000,300000,400000,500000];
    return steps[Math.round(v / 100 * (steps.length-1))];
  }

  function fmt(n) { return '₺' + Math.round(n).toLocaleString('tr-TR'); }

  function calc() {
    const fv   = parseInt(sliderF.value);
    const hv   = parseInt(sliderH.value);
    const fNum = followersNum(fv);
    const weeklyHours = hv;
    const monthlyHours = weeklyHours * 4.3;

    const basePerHour = 800 + (fNum / 500000) * 3200;
    const gifts = Math.round(basePerHour * monthlyHours);

    const [bMin, bMax] = bonusMap[level];
    const bonus = Math.round(bMin + (monthlyHours / 90) * (bMax - bMin));
    const clampBonus = Math.min(bonus, bMax);

    const group = Math.round(gifts * 0.08);
    const total = gifts + clampBonus + group;

    document.getElementById('kcTotal').textContent        = fmt(total);
    document.getElementById('kcGifts').textContent        = fmt(gifts);
    document.getElementById('kcBonus').textContent        = fmt(clampBonus);
    document.getElementById('kcGroup').textContent        = fmt(group);
    document.getElementById('kcTotalBreak').textContent   = fmt(total);
    document.getElementById('kcFollowersVal').textContent = followers(fv);
    document.getElementById('kcHoursVal').textContent     = hv + ' saat';
  }

  sliderF.addEventListener('input', calc);
  sliderH.addEventListener('input', calc);

  document.querySelectorAll('.kc-lvl').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.kc-lvl').forEach(b => b.classList.remove('kc-active'));
      btn.classList.add('kc-active');
      level = btn.dataset.level;
      calc();
    });
  });

  calc();
})();
