<?php
require __DIR__ . '/config.php';

switch (method()) {
    /* ── Listele (admin) ── */
    case 'GET':
        check_auth();
        $status = $_GET['status'] ?? 'all';
        if ($status !== 'all') {
            $stmt = $db->prepare("SELECT * FROM fa_applications WHERE status=? ORDER BY created_at DESC");
            $stmt->execute([$status]);
        } else {
            $stmt = $db->query("SELECT * FROM fa_applications ORDER BY created_at DESC");
        }
        ok($stmt->fetchAll());

    /* ── Yeni Başvuru (site formu, herkese açık) ── */
    case 'POST':
        $b = body();
        if (empty($b['name']) || empty($b['phone'])) fail('Ad ve telefon zorunlu.');
        $id = uid();
        $db->prepare("INSERT INTO fa_applications (id,name,age,phone,city,tiktok,followers,experience,category,message,status)
                      VALUES (?,?,?,?,?,?,?,?,?,?,'new')")
           ->execute([
               $id, $b['name'], $b['age']??'', $b['phone'],
               $b['city']??'', $b['tiktok']??'', $b['followers']??'',
               $b['experience']??'', $b['category']??'', $b['message']??''
           ]);
        ok(['id' => $id, 'success' => true]);

    /* ── Durum Güncelle (admin) ── */
    case 'PUT':
        check_auth();
        $b = body();
        if (empty($b['id']) || empty($b['status'])) fail('ID ve durum gerekli.');
        $db->prepare("UPDATE fa_applications SET status=? WHERE id=?")->execute([$b['status'], $b['id']]);
        ok(['success' => true]);

    /* ── Sil (admin) ── */
    case 'DELETE':
        check_auth();
        $id = $_GET['id'] ?? body()['id'] ?? '';
        if (!$id) fail('ID gerekli.');
        $db->prepare("DELETE FROM fa_applications WHERE id=?")->execute([$id]);
        ok(['success' => true]);

    default:
        fail('Geçersiz metod.', 405);
}
