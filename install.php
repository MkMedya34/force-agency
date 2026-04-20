<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Force Ajans — Kurulum</title>
  <style>
    body { font-family: monospace; background: #07070f; color: #e2e8f0; padding: 40px; max-width: 720px; margin: 0 auto; }
    h1   { color: #a78bfa; margin-bottom: 8px; }
    .ok  { color: #4ade80; }
    .err { color: #f87171; }
    .warn{ color: #fbbf24; }
    .box { background: #12122a; border: 1px solid #1e1e3f; border-radius: 12px; padding: 24px; margin-top: 24px; }
    pre  { white-space: pre-wrap; line-height: 1.8; font-size: 14px; }
    .done{ margin-top: 24px; padding: 20px; background: rgba(74,222,128,.1); border: 1px solid rgba(74,222,128,.3); border-radius: 10px; }
  </style>
</head>
<body>
<h1>🔥 Force Ajans — Veritabanı Kurulumu</h1>
<p style="color:#8888bb">Bu sayfayı yalnızca bir kez çalıştırın. Bittikten sonra silin!</p>

<div class="box"><pre>
<?php
require __DIR__ . '/api/config.php';
$log = [];

function step($msg, $ok = true) {
    global $log;
    $log[] = ($ok ? '✓ ' : '✗ ') . $msg;
    echo ($ok ? '<span class="ok">✓</span> ' : '<span class="err">✗</span> ') . htmlspecialchars($msg) . "\n";
}

try {

/* ─── TABLOLAR ─── */

$db->exec("CREATE TABLE IF NOT EXISTS `fa_settings` (
  `key`  VARCHAR(100) NOT NULL,
  `value` LONGTEXT,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
step('fa_settings tablosu oluşturuldu');

$db->exec("CREATE TABLE IF NOT EXISTS `fa_streamers` (
  `id`        VARCHAR(30) NOT NULL,
  `name`      VARCHAR(200),
  `handle`    VARCHAR(100),
  `url`       VARCHAR(500),
  `cat_emoji` VARCHAR(10),
  `cat_label` VARCHAR(100),
  `followers` VARCHAR(50),
  `viewers`   VARCHAR(50),
  `level`     ENUM('bronze','silver','gold','platin') DEFAULT 'bronze',
  `featured`  TINYINT(1) DEFAULT 0,
  `bio`       TEXT,
  `photo`     LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
step('fa_streamers tablosu oluşturuldu');

$db->exec("CREATE TABLE IF NOT EXISTS `fa_applications` (
  `id`         VARCHAR(30) NOT NULL,
  `name`       VARCHAR(200),
  `age`        VARCHAR(10),
  `phone`      VARCHAR(30),
  `city`       VARCHAR(100),
  `tiktok`     VARCHAR(100),
  `followers`  VARCHAR(50),
  `experience` VARCHAR(100),
  `category`   VARCHAR(100),
  `message`    TEXT,
  `status`     ENUM('new','reviewed','accepted','rejected') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
step('fa_applications tablosu oluşturuldu');

$db->exec("CREATE TABLE IF NOT EXISTS `fa_reviews` (
  `id`         VARCHAR(30) NOT NULL,
  `name`       VARCHAR(200),
  `handle`     VARCHAR(200),
  `badge`      VARCHAR(100),
  `color`      VARCHAR(200),
  `featured`   TINYINT(1) DEFAULT 0,
  `text`       TEXT,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
step('fa_reviews tablosu oluşturuldu');

$db->exec("CREATE TABLE IF NOT EXISTS `fa_messages` (
  `id`         VARCHAR(30) NOT NULL,
  `name`       VARCHAR(200),
  `phone`      VARCHAR(50),
  `message`    TEXT,
  `is_read`    TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
step('fa_messages tablosu oluşturuldu');

$db->exec("CREATE TABLE IF NOT EXISTS `fa_blog` (
  `id`            VARCHAR(30) NOT NULL,
  `title`         VARCHAR(500),
  `slug`          VARCHAR(300) UNIQUE,
  `excerpt`       TEXT,
  `content`       LONGTEXT,
  `category`      VARCHAR(100),
  `emoji`         VARCHAR(10),
  `read_time`     VARCHAR(20),
  `published_date` DATE,
  `featured`      TINYINT(1) DEFAULT 0,
  `is_published`  TINYINT(1) DEFAULT 1,
  `cover_color`   VARCHAR(200),
  `cover_image`   LONGTEXT,
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
step('fa_blog tablosu oluşturuldu');

/* ─── ADMIN ŞİFRESİ ─── */
$hash = password_hash('force2025', PASSWORD_DEFAULT);
$db->prepare("INSERT INTO fa_settings (`key`,value) VALUES ('admin_password',?) ON DUPLICATE KEY UPDATE value=value")
   ->execute([$hash]);
step('Admin şifresi ayarlandı (varsayılan: force2025)');

/* ─── VARSAYILAN AYARLAR ─── */
$defaults = [
    'phone'        => '905467269962',
    'phoneDisplay' => '+90 546 726 99 62',
    'email'        => 'info@forceajans.com',
    'waMsg'        => 'Merhaba, Force Ajans hakkında bilgi almak istiyorum.',
    'metricStreamers'      => '2.800',
    'metricSatisfaction'   => '99',
    'avgIncome'    => '₺42K',
    'years'        => '4',
];
$s = $db->prepare("INSERT INTO fa_settings (`key`,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=value");
foreach ($defaults as $k => $v) $s->execute([$k, $v]);
step('Varsayılan ayarlar yüklendi');

/* ─── VARSAYILAN YORUMLAR ─── */
$chk = $db->query("SELECT COUNT(*) FROM fa_reviews")->fetchColumn();
if (!$chk) {
    $ins = $db->prepare("INSERT INTO fa_reviews (id,name,handle,badge,color,featured,text,sort_order) VALUES (?,?,?,?,?,?,?,?)");
    $reviews = [
        ['r1','Merve K.','@mervecanlii • 312K Takipçi • Gümüş Üye','₺47.000/Nisan','linear-gradient(135deg,#7c3aed,#ec4899)',0,'Force Ajans\'a katılmadan önce ayda 4-5 bin TL kazanıyordum. Şimdi sadece Nisan ayında ajans bonuslarından 18.750 TL aldım, hediye gelirleriyle beraber 47.000 TL oldu.',1],
        ['r2','Ahmet D.','@ahmetlive34 • 780K Takipçi • Platin Üye','₺112.000/ay','linear-gradient(135deg,#fe2c55,#ff6b35)',1,'Platin seviyeye ulaştığımda hayatım değişti. Geçen ay toplam 1.4 milyon elmas topladım. Force Panel üzerinden her şeyi canlı izliyorum — şeffaflık konusunda rakipsizler.',2],
        ['r3','Zeynep A.','@zeynepstream • 280K Takipçi • Altın Üye','Sıfırdan 280K','linear-gradient(135deg,#06b6d4,#3b82f6)',0,'Hiç yayın deneyimim yokken başladım. 3 ayda 280K takipçiye ulaştım ve ilk ayımdan itibaren para kazanmaya başladım.',3],
        ['r4','Baran T.','@barantv • 495K Takipçi • Platin Üye','240K Elmas PK','linear-gradient(135deg,#22c55e,#16a34a)',0,'Sabah 02:30\'da PK\'ya girdim. Force destek hattına yazdım — 4 dakika içinde yanıt, 6 dakikada destek aktif. O PK\'yı kazandık.',4],
        ['r5','Selin Y.','@selinlive_tr • 224K Takipçi • Altın Üye','₺0 Kesinti','linear-gradient(135deg,#f59e0b,#ef4444)',0,'2 farklı ajansla çalıştım, ikisi de komisyon kesiyordu. Force\'ta 0 kesinti var. Altın seviyede ekstra ekipman desteği de sağladılar.',5],
        ['r6','Kerem Ö.','@kremstream • 560K Takipçi • Platin Üye','+85K Tek Gecede','linear-gradient(135deg,#8b5cf6,#06b6d4)',0,'Force\'un crossover etkinliğinde 8 yayıncıyla aynı anda canlıya girdik — tek gecede 85.000 yeni takipçi kazandım.',6],
    ];
    foreach ($reviews as $r) $ins->execute($r);
    step('Varsayılan yorumlar eklendi (6 adet)');
}

/* ─── VARSAYILAN BLOG YAZILARI ─── */
$chk = $db->query("SELECT COUNT(*) FROM fa_blog")->fetchColumn();
if (!$chk) {
    $ins = $db->prepare("INSERT INTO fa_blog (id,title,slug,excerpt,content,category,emoji,read_time,published_date,featured,is_published,cover_color) VALUES (?,?,?,?,?,?,?,?,?,?,1,?)");
    $posts = [
        ['b1',"TikTok Live'da İlk 1000 Takipçiye Nasıl Ulaşırsın?",'tiktok-live-ilk-1000-takipci','Yayıncılık kariyerine yeni başlayanlar için adım adım büyüme rehberi.','<h2>Neden 1000 Takipçi Önemli?</h2><p>TikTok Live yayını açabilmek için en az 1000 takipçiye ihtiyacın var.</p><h2>İçerik Stratejisi</h2><p>Günde en az 2-3 kısa video paylaş. Trend sesleri ve hashtag\'leri kullan.</p><h2>Etkileşim Artırma</h2><ul><li>Yorumlara mutlaka yanıt ver</li><li>Takipçilerinle duet yap</li><li>Diğer yayıncılarla iş birlikleri kur</li></ul><blockquote>Force Ajans mentorlüğüyle ortalama 6 haftada 1000 takipçiye ulaşan yayıncılarımız var!</blockquote>','Strateji','🚀','5 dk','2025-03-15',1,'linear-gradient(135deg,#7c3aed,#4f46e5)'],
        ['b2',"TikTok Live'da Elmas Kazanmak: Tam Rehber",'tiktok-live-elmas-kazanmak','Elmaslar nasıl gelire dönüşür? Para çekme süreci ve kazancını maksimize etme.','<h2>Elmas Sistemi Nedir?</h2><p>TikTok izleyicileri sana sanal hediyeler gönderir. Elmalar gerçek paraya dönüşür.</p><h2>Dönüşüm Oranı</h2><p>1 elmas ≈ 0,05 USD. 65.000 elmas = yaklaşık 3.250 USD.</p><blockquote>Force Ajans yayıncıları ortalama %40 daha fazla hediye alıyor!</blockquote>','Kazanç','💎','7 dk','2025-03-08',0,'linear-gradient(135deg,#ec4899,#f59e0b)'],
        ['b3','Profesyonel Yayıncı Ekipmanı: Ne Almalısın?','profesyonel-yayinci-ekipman-rehberi','Bütçene göre başlangıç, orta ve pro düzey ekipman seçenekleri.','<h2>Başlangıç Seviyesi (0-2.000 TL)</h2><ul><li>Ring ışığı</li><li>Yaka mikrofonu</li><li>Tripod</li></ul><h2>Orta Seviye</h2><ul><li>Kondenser mikrofon</li><li>USB ses kartı</li></ul><blockquote>Force Ajans üyeleri ekipman indirimlerinden yararlanıyor!</blockquote>','Ekipman','🎙️','6 dk','2025-02-28',0,'linear-gradient(135deg,#0ea5e9,#7c3aed)'],
        ['b4',"Başarı Hikayesi: Ayşe'nin 3 Ayda 50.000 Takipçiye Ulaşması",'basari-hikayesi-ayse-50000-takipci','Force Ajans mentorluğuyla nasıl tam zamanlı gelir elde etti?','<h2>Başlangıç Noktası</h2><p>200 takipçiyle başlayan Ayşe 3 ayda 50K takipçiye ulaştı.</p><h2>Sonuçlar</h2><p>3. ayda aylık 8.000 TL kazanç!</p><blockquote>"Force Ajans olmasaydı bu başarıya ulaşamazdım." — Ayşe K.</blockquote>','Başarı Hikayesi','🌟','4 dk','2025-02-20',0,'linear-gradient(135deg,#f59e0b,#ec4899)'],
        ['b5','TikTok Live Algoritması: Seni Öne Çıkaran 8 Sır','tiktok-live-algoritma-sirlari','Daha fazla organik izleyici çekmek için bilmen gereken 8 ipucu.','<h2>Algoritma Faktörleri</h2><ol><li>Eş zamanlı izleyici sayısı</li><li>Etkileşim oranı</li><li>Yayın süresi (min 60 dk)</li><li>Tutarlılık</li><li>Profil kalitesi</li></ol><blockquote>Force Ajans mentorlük programında tüm bu teknikleri öğreniyorsun!</blockquote>','İpuçları','💡','8 dk','2025-02-10',0,'linear-gradient(135deg,#10b981,#0ea5e9)'],
        ['b6','Yayıncı-İzleyici İlişkisi: Sadık Topluluk Nasıl Kurulur?','yayinci-izleyici-iliskisi-topluluk','Geçici izleyicileri sadık hayranlar haline getirmenin yöntemleri.','<h2>Topluluk Neden Önemli?</h2><p>100 sadık izleyici 10.000 anlık izleyiciden değerlidir.</p><h3>İsimleri Hatırla</h3><p>Düzenli izleyicilerini ismiyle selamla.</p><blockquote>Force Ajans, izleyici yönetimi konusunda özel eğitim sağlar.</blockquote>','Strateji','🤝','5 dk','2025-01-30',0,'linear-gradient(135deg,#ec4899,#7c3aed)'],
    ];
    foreach ($posts as $p) $ins->execute($p);
    step('Varsayılan blog yazıları eklendi (6 adet)');
}

echo "\n<span class=\"ok\">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>\n";
echo "<span class=\"ok\">✅ Kurulum tamamlandı!</span>\n";

} catch (PDOException $e) {
    echo "<span class=\"err\">✗ HATA: " . htmlspecialchars($e->getMessage()) . "</span>\n";
}
?>
</pre></div>

<div class="done">
  <strong>✅ Kurulum tamamlandı!</strong><br><br>
  <strong>⚠️ ÖNEMLİ:</strong> Güvenlik için bu dosyayı (install.php) sunucudan silin!<br><br>
  🔑 <strong>Varsayılan Admin Şifresi:</strong> <code>force2025</code><br>
  📁 <strong>Admin Panel:</strong> <a href="admin.html" style="color:#a78bfa">admin.html</a><br>
  🌐 <strong>Ana Sayfa:</strong> <a href="index.html" style="color:#a78bfa">index.html</a>
</div>
</body>
</html>
