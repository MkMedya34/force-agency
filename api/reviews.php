<?php
require __DIR__ . '/config.php';

switch (method()) {
    case 'GET':
        $rows = $db->query("SELECT * FROM fa_reviews ORDER BY featured DESC, sort_order ASC, created_at ASC")->fetchAll();
        foreach ($rows as &$r) $r['featured'] = (bool)$r['featured'];
        ok($rows);

    case 'POST':
        check_auth();
        $b = body();
        if (empty($b['name']) || empty($b['text'])) fail('İsim ve yorum zorunlu.');
        $id = uid();
        $db->prepare("INSERT INTO fa_reviews (id,name,handle,badge,color,featured,text) VALUES (?,?,?,?,?,?,?)")
           ->execute([
               $id, $b['name'], $b['handle']??'', $b['badge']??'',
               $b['color']??'linear-gradient(135deg,#7c3aed,#ec4899)',
               !empty($b['featured'])?1:0, $b['text']
           ]);
        ok(['id' => $id, 'success' => true]);

    case 'PUT':
        check_auth();
        $b = body();
        if (empty($b['id'])) fail('ID gerekli.');
        $db->prepare("UPDATE fa_reviews SET name=?,handle=?,badge=?,color=?,featured=?,text=? WHERE id=?")
           ->execute([
               $b['name']??'', $b['handle']??'', $b['badge']??'',
               $b['color']??'', !empty($b['featured'])?1:0,
               $b['text']??'', $b['id']
           ]);
        ok(['success' => true]);

    case 'DELETE':
        check_auth();
        $id = $_GET['id'] ?? body()['id'] ?? '';
        if (!$id) fail('ID gerekli.');
        $db->prepare("DELETE FROM fa_reviews WHERE id=?")->execute([$id]);
        ok(['success' => true]);

    default:
        fail('Geçersiz metod.', 405);
}
