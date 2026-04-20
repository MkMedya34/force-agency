<?php
require __DIR__ . '/config.php';

switch (method()) {
    /* ── Tümünü Listele (herkese açık) ── */
    case 'GET':
        $rows = $db->query("SELECT * FROM fa_streamers ORDER BY featured DESC, created_at ASC")->fetchAll();
        foreach ($rows as &$r) $r['featured'] = (bool)$r['featured'];
        ok($rows);

    /* ── Ekle (admin) ── */
    case 'POST':
        check_auth();
        $b = body();
        if (empty($b['name'])) fail('İsim zorunlu.');
        $id = uid();
        $db->prepare("INSERT INTO fa_streamers (id,name,handle,url,cat_emoji,cat_label,followers,viewers,level,featured,bio,photo)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
           ->execute([
               $id, $b['name'], $b['handle']??'', $b['url']??'',
               $b['catEmoji']??'🌟', $b['catLabel']??'',
               $b['followers']??'', $b['viewers']??'',
               $b['level']??'bronze', !empty($b['featured'])?1:0,
               $b['bio']??'', $b['photo']??''
           ]);
        ok(['id' => $id, 'success' => true]);

    /* ── Güncelle (admin) ── */
    case 'PUT':
        check_auth();
        $b = body();
        if (empty($b['id'])) fail('ID gerekli.');
        $db->prepare("UPDATE fa_streamers SET name=?,handle=?,url=?,cat_emoji=?,cat_label=?,followers=?,viewers=?,level=?,featured=?,bio=?,photo=? WHERE id=?")
           ->execute([
               $b['name']??'', $b['handle']??'', $b['url']??'',
               $b['catEmoji']??'🌟', $b['catLabel']??'',
               $b['followers']??'', $b['viewers']??'',
               $b['level']??'bronze', !empty($b['featured'])?1:0,
               $b['bio']??'', $b['photo']??'', $b['id']
           ]);
        ok(['success' => true]);

    /* ── Sil (admin) ── */
    case 'DELETE':
        check_auth();
        $id = $_GET['id'] ?? body()['id'] ?? '';
        if (!$id) fail('ID gerekli.');
        $db->prepare("DELETE FROM fa_streamers WHERE id=?")->execute([$id]);
        ok(['success' => true]);

    default:
        fail('Geçersiz metod.', 405);
}
