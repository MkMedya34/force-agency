/* ═══════════════ DEFAULT BLOG POSTS ═══════════════ */
const DEFAULT_POSTS = [
  {
    id: 'post-1',
    title: 'TikTok Live\'da İlk 1000 Takipçiye Nasıl Ulaşırsın?',
    slug: 'tiktok-live-ilk-1000-takipci',
    excerpt: 'Yayıncılık kariyerine yeni başlayanlar için adım adım büyüme rehberi. Doğru içerik stratejisi ile ilk 1000 takipçine hızlıca ulaş.',
    content: `<h2>Neden 1000 Takipçi Önemli?</h2><p>TikTok Live yayını açabilmek için en az 1000 takipçiye ihtiyacın var. Bu eşiği geçtikten sonra canlı yayın yapabilir ve gerçek zamanlı etkileşim kurabilirsin.</p><h2>İçerik Stratejisi</h2><p>Günde en az 2-3 kısa video paylaş. Trend sesleri ve hashtag'leri kullan. Nişine uygun içerikler üret ve tutarlı bir paylaşım takvimi oluştur.</p><h3>En Etkili Nişler</h3><ul><li>Eğlence ve komedi</li><li>Eğitim ve bilgi paylaşımı</li><li>Müzik ve dans</li><li>Yemek ve yaşam tarzı</li><li>Oyun ve teknoloji</li></ul><h2>Etkileşim Artırma Taktikleri</h2><p>Yorumlara mutlaka yanıt ver. Takipçilerinle duet ve stitch yap. Diğer yayıncılarla iş birlikleri kur. Canlı yayınlarda izleyicileri tanı ve onları özel hissettir.</p><blockquote>Force Ajans mentorlüğüyle ortalama 6 haftada 1000 takipçiye ulaşan yayıncılarımız var!</blockquote><h2>Sonuç</h2><p>Sabır ve tutarlılık en önemli iki unsur. Force Ajans'a katıl, uzman koçlarımızdan kişisel destek al ve hedefine çok daha hızlı ulaş.</p>`,
    category: 'Strateji',
    emoji: '🚀',
    date: '2025-03-15',
    readTime: '5 dk',
    featured: true,
    published: true,
    coverColor: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
  },
  {
    id: 'post-2',
    title: 'TikTok Live\'da Elmas Kazanmak: Tam Rehber',
    slug: 'tiktok-live-elmas-kazanmak',
    excerpt: 'Elmaslar nasıl gelire dönüşür? Para çekme süreci, vergi hesabı ve kazancını maksimize etme yöntemleri.',
    content: `<h2>Elmas Sistemi Nedir?</h2><p>TikTok izleyicileri sana sanal hediyeler gönderir. Bu hediyeler elmaslara dönüşür. Elmalar ise gerçek paraya çevrilir.</p><h2>Dönüşüm Oranı</h2><p>1 elmas = yaklaşık 0,05 USD değerindedir. 65.000 elmas biriktiğinde para çekme işlemi yapabilirsin. Bu tutar yaklaşık 3.250 USD'ye karşılık gelir.</p><h3>Popüler Hediyeler ve Değerleri</h3><ul><li>Gül: 1 elmas</li><li>TikTok Evreni: 34.999 elmas</li><li>Aslan: 29.999 elmas</li><li>Drama Kraliçesi: 5.000 elmas</li></ul><h2>Kazancını Artırmanın Yolları</h2><p>Prime Time saatlerinde yayın yap (19:00-23:00). Özel etkinlikler ve challenge'lar düzenle. İzleyicilerin isteklerini yerine getireceğin interaktif yayınlar yap.</p><blockquote>Force Ajans yayıncıları ortalama %40 daha fazla hediye alıyor — ajans avantajları sayesinde!</blockquote>`,
    category: 'Kazanç',
    emoji: '💎',
    date: '2025-03-08',
    readTime: '7 dk',
    featured: false,
    published: true,
    coverColor: 'linear-gradient(135deg,#ec4899,#f59e0b)',
  },
  {
    id: 'post-3',
    title: 'Profesyonel Yayıncı Ekipmanı: Ne Almalısın?',
    slug: 'profesyonel-yayinci-ekipman-rehberi',
    excerpt: 'Bütçene göre başlangıç, orta ve pro düzey ekipman seçenekleri. Görüntü ve ses kalitesini nasıl artırırsın?',
    content: `<h2>Başlangıç Seviyesi (0-2.000 TL)</h2><p>Akıllı telefonun zaten güçlü bir kamera. Yapman gereken sadece aydınlatmayı ve sesi iyileştirmek.</p><ul><li>Ring ışığı (200-400 TL)</li><li>Yaka mikrofonu (150-300 TL)</li><li>Telefon tutucu ve tripod (100-200 TL)</li></ul><h2>Orta Seviye (2.000-8.000 TL)</h2><p>Kaliteyi ciddi ölçüde artıracak ekipmanlar:</p><ul><li>Kondenser mikrofon (1.000-2.500 TL)</li><li>USB ses kartı (500-1.500 TL)</li><li>Softbox aydınlatma seti (800-2.000 TL)</li><li>Arka plan/greenscreen (300-700 TL)</li></ul><h2>Pro Seviye (8.000+ TL)</h2><ul><li>DSLR/Mirrorless kamera + yakalama kartı</li><li>XLR mikrofon + mixer</li><li>Stüdyo aydınlatma sistemi</li><li>Akustik panel seti</li></ul><blockquote>Force Ajans üyeleri ekipman indirimlerinden yararlanıyor. Detaylar için bize ulaş!</blockquote>`,
    category: 'Ekipman',
    emoji: '🎙️',
    date: '2025-02-28',
    readTime: '6 dk',
    featured: false,
    published: true,
    coverColor: 'linear-gradient(135deg,#0ea5e9,#7c3aed)',
  },
  {
    id: 'post-4',
    title: 'Başarı Hikayesi: Ayşe\'nin 3 Ayda 50.000 Takipçiye Ulaşması',
    slug: 'basari-hikayesi-ayse-50000-takipci',
    excerpt: 'Üniversite öğrencisi Ayşe, Force Ajans mentorluğuyla TikTok Live\'da nasıl tam zamanlı gelir elde etmeye başladı?',
    content: `<h2>Başlangıç Noktası</h2><p>Ayşe, 3 ay önce yalnızca 200 takipçisi olan sıradan bir TikTok kullanıcısıydı. Üniversite harçlığını karşılamak için ek gelir arıyordu.</p><h2>Force Ajans ile Tanışma</h2><p>Arkadaşının tavsiyesiyle Force Ajans'a başvuran Ayşe, ilk hafta kişisel strateji seansı aldı. Mentor ekibimiz ona şunları önerdi:</p><ul><li>Nişini belirle: Üniversite yaşamı + humor</li><li>Haftada 3 gün Prime Time canlı yayın</li><li>Her yayında en az 60 dakika kal</li><li>İzleyicilerle soru-cevap bölümü yap</li></ul><h2>Sonuçlar</h2><p>1. ay sonunda: 8.000 takipçi. 2. ay sonunda: 24.000 takipçi. 3. ay sonunda: 50.000+ takipçi ve aylık 8.000 TL kazanç!</p><blockquote>"Force Ajans olmasaydı bu başarıya ulaşamazdım. Sadece teknik destek değil, moral ve motivasyon da sağlıyorlar." — Ayşe K.</blockquote><h2>Sen de Başarabilirsin</h2><p>Ayşe'nin hikayesi bir istisna değil. Force Ajans'taki onlarca yayıncımız benzer başarı hikayeleri yazıyor. Sen de bu ailenin bir parçası olmak istersen hemen başvur!</p>`,
    category: 'Başarı Hikayesi',
    emoji: '🌟',
    date: '2025-02-20',
    readTime: '4 dk',
    featured: false,
    published: true,
    coverColor: 'linear-gradient(135deg,#f59e0b,#ec4899)',
  },
  {
    id: 'post-5',
    title: 'TikTok Live Algoritması: Seni Öne Çıkaran 8 Sır',
    slug: 'tiktok-live-algoritma-sirlari',
    excerpt: 'TikTok algoritması canlı yayınları nasıl sıralar? Daha fazla organik izleyici çekmek için bilmen gereken 8 ipucu.',
    content: `<h2>TikTok Live Algoritması Nasıl Çalışır?</h2><p>TikTok, canlı yayınları keşfet sayfasında göstermek için birçok faktörü değerlendirir. İşte bilmen gereken kritik metrikler:</p><h3>1. Eş Zamanlı İzleyici Sayısı</h3><p>Yayın başladığında hızlı bir şekilde izleyici çekmek kritik. İlk 5 dakika algoritma için en önemli süre.</p><h3>2. Etkileşim Oranı</h3><p>Yorumlar, kalpler ve hediyeler ne kadar fazlaysa algoritma seni o kadar yukarı taşır.</p><h3>3. Yayın Süresi</h3><p>Minimum 30 dakika yayın yap. 60-90 dakika arası ideal süre.</p><h3>4. Tutarlılık</h3><p>Her hafta aynı gün ve saatte yayın yap. İzleyicilerin seni beklemeye alışsın.</p><h3>5. Profil Kalitesi</h3><p>Biyografini doldur, profil fotoğrafı ekle ve kısa videolarına devam et.</p><h3>6. Doğru Etiketler</h3><p>Yayın başlığında ve açıklamada doğru hashtag kullan.</p><h3>7. İzleyici Bağlılığı</h3><p>İzleyicilerini ismiyle selamla, sorularına anında yanıt ver.</p><h3>8. Teknik Kalite</h3><p>İyi internet bağlantısı, iyi aydınlatma ve net ses olmazsa olmaz.</p><blockquote>Force Ajans mentorlük programında tüm bu teknikleri uygulamalı olarak öğreniyorsun!</blockquote>`,
    category: 'İpuçları',
    emoji: '💡',
    date: '2025-02-10',
    readTime: '8 dk',
    featured: false,
    published: true,
    coverColor: 'linear-gradient(135deg,#10b981,#0ea5e9)',
  },
  {
    id: 'post-6',
    title: 'Yayıncı-İzleyici İlişkisi: Sadık Topluluk Nasıl Kurulur?',
    slug: 'yayinci-izleyici-iliskisi-topluluk',
    excerpt: 'Geçici izleyicileri sadık hayranlar haline getirmenin psikolojik ve pratik yöntemleri.',
    content: `<h2>Topluluk Neden Bu Kadar Önemli?</h2><p>TikTok Live'da başarının sırrı rakamlardan değil ilişkilerden geçer. Seni düzenli izleyen 100 kişi, bir kez uğrayan 10.000 kişiden çok daha değerlidir.</p><h2>Sadık İzleyici Kazanma Teknikleri</h2><h3>İsimleri Hatırla</h3><p>Düzenli izleyicilerini ismiyle selamla. Bu küçük jest onları özel hissettirip geri gelme ihtimallerini artırır.</p><h3>İçerik Talepleri</h3><p>İzleyicilerinden fikir iste. "Sizin için ne yapayım?" sorusu hem etkileşim artırır hem de onları sürece dahil eder.</p><h3>Özel İçerikler</h3><p>Sadık izleyicilerine özel sürprizler yap. VIP bölümler, özel çekilişler veya kişisel teşekkürler işe yarar.</p><h3>Sosyal Medya Entegrasyonu</h3><p>TikTok dışında da aktif ol. Instagram, YouTube veya Discord topluluğu kur.</p><h2>Negatif Durumları Yönetme</h2><p>Trollerle sakinlikle başa çık. Moderatör atamayı düşün. Topluluğun kurallarını baştan belirle.</p><blockquote>Force Ajans, izleyici yönetimi konusunda özel eğitim ve destek sağlar.</blockquote>`,
    category: 'Strateji',
    emoji: '🤝',
    date: '2025-01-30',
    readTime: '5 dk',
    featured: false,
    published: true,
    coverColor: 'linear-gradient(135deg,#ec4899,#7c3aed)',
  },
];

/* ═══════════════ STATE ═══════════════ */
let allPosts = [];
let activeCategory = 'all';
let searchQuery = '';

/* ═══════════════ INIT ═══════════════ */
async function getPosts() {
  try {
    const res = await fetch('api/blog.php');
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      return data.filter(p => p.published || p.is_published);
    }
  } catch(e) {}
  // Fallback: varsayılan yazılar
  return DEFAULT_POSTS.filter(p => p.published);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildGradient(post) {
  if (post.coverImage) return '';
  const colors = {
    'Strateji': 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    'Kazanç':   'linear-gradient(135deg,#ec4899,#f59e0b)',
    'Ekipman':  'linear-gradient(135deg,#0ea5e9,#7c3aed)',
    'Başarı Hikayesi': 'linear-gradient(135deg,#f59e0b,#ec4899)',
    'İpuçları': 'linear-gradient(135deg,#10b981,#0ea5e9)',
  };
  return post.coverColor || colors[post.category] || 'linear-gradient(135deg,#7c3aed,#ec4899)';
}

function renderCard(post, featured = false) {
  const imgHtml = post.coverImage
    ? `<img src="${post.coverImage}" alt="${post.title}" loading="lazy" />`
    : `<div class="blog-card-img-placeholder" style="background:${buildGradient(post)}">${post.emoji || '📝'}</div>`;

  return `
    <article class="blog-card${featured ? ' featured-post' : ''}" onclick="window.location.href='blog-post.html?slug=${post.slug}'">
      <div class="blog-card-img">${imgHtml}</div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span class="blog-card-cat">${post.category}</span>
          <span class="blog-card-date">${formatDate(post.date)}</span>
          <span class="blog-card-read">${post.readTime || '5 dk'}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="blog-post.html?slug=${post.slug}" class="blog-card-link" onclick="event.stopPropagation()">
          Devamını Oku <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>`;
}

function renderPosts() {
  const grid = document.getElementById('blogPostsGrid');
  const noResult = document.getElementById('blogNoResult');
  if (!grid) return;

  let posts = allPosts;

  if (activeCategory !== 'all') {
    posts = posts.filter(p => p.category === activeCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (!posts.length) {
    grid.innerHTML = '';
    noResult.style.display = 'block';
    return;
  }

  noResult.style.display = 'none';

  const [first, ...rest] = posts;
  let html = renderCard(first, true);
  html += rest.map(p => renderCard(p, false)).join('');
  grid.innerHTML = html;
}

function updateSidebarCounts() {
  const sidebar = document.getElementById('bsSideCats');
  if (!sidebar) return;

  const cats = ['Strateji', 'Kazanç', 'Ekipman', 'Başarı Hikayesi', 'İpuçları'];
  cats.forEach(cat => {
    const count = allPosts.filter(p => p.category === cat).length;
    const el = sidebar.querySelector(`[data-cat="${cat}"] span`);
    if (el) el.textContent = count;
  });
}

/* ═══════════════ CATEGORY FILTER ═══════════════ */
function initCategories() {
  document.querySelectorAll('.bcat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bcat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderPosts();
    });
  });

  document.querySelectorAll('#bsSideCats a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const cat = a.dataset.cat;
      activeCategory = cat;

      document.querySelectorAll('.bcat').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === cat);
      });

      renderPosts();
      document.querySelector('.blog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ═══════════════ SEARCH ═══════════════ */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = input.value.trim();
      renderPosts();
    }, 280);
  });
}

/* ═══════════════ NAVBAR HAMBURGER ═══════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
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
}

/* ═══════════════ BOOT ═══════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  allPosts = await getPosts();
  renderPosts();
  updateSidebarCounts();
  initCategories();
  initSearch();
});
