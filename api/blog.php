<?php
require __DIR__ . '/config.php';

switch (method()) {
    /* ── Listele ── */
    case 'GET':
        $slug = $_GET['slug'] ?? '';

        // Tek yazı (slug ile)
        if ($slug) {
            $stmt = $db->prepare("SELECT * FROM fa_blog WHERE slug=? LIMIT 1");
            $stmt->execute([$slug]);
            $post = $stmt->fetch();
            if (!$post) fail('Yazı bulunamadı.', 404);
            // Admin değilse yayınlanmamış görüntülenemez
            if (session_status() === PHP_SESSION_NONE) session_start();
            if (!$post['is_published'] && empty($_SESSION['admin'])) fail('Yazı bulunamadı.', 404);
            $post['featured']   = (bool)$post['featured'];
            $post['published']  = (bool)$post['is_published'];
            ok($post);
        }

        // Tüm yazılar
        if (session_status() === PHP_SESSION_NONE) session_start();
        $isAdmin = !empty($_SESSION['admin']);
        if ($isAdmin) {
            $rows = $db->query("SELECT * FROM fa_blog ORDER BY created_at DESC")->fetchAll();
        } else {
            $rows = $db->query("SELECT * FROM fa_blog WHERE is_published=1 ORDER BY featured DESC, published_date DESC")->fetchAll();
        }
        foreach ($rows as &$r) {
            $r['featured']  = (bool)$r['featured'];
            $r['published'] = (bool)$r['is_published'];
        }
        ok($rows);

    /* ── Ekle (admin) ── */
    case 'POST':
        check_auth();
        $b = body();
        if (empty($b['title']) || empty($b['slug'])) fail('Başlık ve slug zorunlu.');
        $id = uid();
        $db->prepare("INSERT INTO fa_blog (id,title,slug,excerpt,content,category,emoji,read_time,published_date,featured,is_published,cover_color,cover_image)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
           ->execute([
               $id, $b['title'], $b['slug'], $b['excerpt']??'', $b['content']??'',
               $b['category']??'Strateji', $b['emoji']??'📝', $b['readTime']??'5 dk',
               $b['date']??date('Y-m-d'), !empty($b['featured'])?1:0,
               !empty($b['published'])?1:1,
               $b['coverColor']??'', $b['coverImage']??''
           ]);
        ok(['id' => $id, 'success' => true]);

    /* ── Güncelle (admin) ── */
    case 'PUT':
        check_auth();
        $b = body();
        if (empty($b['id'])) fail('ID gerekli.');
        $db->prepare("UPDATE fa_blog SET title=?,slug=?,excerpt=?,content=?,category=?,emoji=?,read_time=?,published_date=?,featured=?,is_published=?,cover_color=?,cover_image=? WHERE id=?")
           ->execute([
               $b['title']??'', $b['slug']??'', $b['excerpt']??'', $b['content']??'',
               $b['category']??'Strateji', $b['emoji']??'📝', $b['readTime']??'5 dk',
               $b['date']??date('Y-m-d'), !empty($b['featured'])?1:0,
               !empty($b['published'])?1:0,
               $b['coverColor']??'', $b['coverImage']??'', $b['id']
           ]);
        ok(['success' => true]);

    /* ── Sil (admin) ── */
    case 'DELETE':
        check_auth();
        $id = $_GET['id'] ?? body()['id'] ?? '';
        if (!$id) fail('ID gerekli.');
        $db->prepare("DELETE FROM fa_blog WHERE id=?")->execute([$id]);
        ok(['success' => true]);

    default:
        fail('Geçersiz metod.', 405);
}
