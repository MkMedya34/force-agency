<?php
require __DIR__ . '/config.php';

switch (method()) {
    /* ── Listele (admin) ── */
    case 'GET':
        check_auth();
        $filter = $_GET['filter'] ?? 'all';
        if ($filter === 'unread') {
            $stmt = $db->query("SELECT * FROM fa_messages WHERE is_read=0 ORDER BY created_at DESC");
        } elseif ($filter === 'read') {
            $stmt = $db->query("SELECT * FROM fa_messages WHERE is_read=1 ORDER BY created_at DESC");
        } else {
            $stmt = $db->query("SELECT * FROM fa_messages ORDER BY created_at DESC");
        }
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) $r['read'] = (bool)$r['is_read'];
        ok($rows);

    /* ── Yeni Mesaj (site formu, herkese açık) ── */
    case 'POST':
        $b = body();
        if (empty($b['name']) || empty($b['phone']) || empty($b['message'])) {
            fail('Ad, telefon ve mesaj zorunlu.');
        }
        $id = uid();
        $db->prepare("INSERT INTO fa_messages (id,name,phone,message,is_read) VALUES (?,?,?,?,0)")
           ->execute([$id, $b['name'], $b['phone'], $b['message']]);
        ok(['id' => $id, 'success' => true]);

    /* ── Okundu İşaretle (admin) ── */
    case 'PUT':
        check_auth();
        $b = body();
        if (empty($b['id'])) fail('ID gerekli.');
        $db->prepare("UPDATE fa_messages SET is_read=1 WHERE id=?")->execute([$b['id']]);
        ok(['success' => true]);

    /* ── Sil (admin) ── */
    case 'DELETE':
        check_auth();
        $id = $_GET['id'] ?? body()['id'] ?? '';
        if (!$id) fail('ID gerekli.');
        $db->prepare("DELETE FROM fa_messages WHERE id=?")->execute([$id]);
        ok(['success' => true]);

    default:
        fail('Geçersiz metod.', 405);
}
