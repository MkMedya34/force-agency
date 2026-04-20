<?php
require __DIR__ . '/config.php';

switch (method()) {
    /* ── Tüm Ayarları Getir (herkese açık) ── */
    case 'GET':
        $rows = $db->query("SELECT `key`, value FROM fa_settings WHERE `key` != 'admin_password'")->fetchAll();
        $out  = [];
        foreach ($rows as $r) $out[$r['key']] = $r['value'];
        ok($out);

    /* ── Ayarları Kaydet (admin) ── */
    case 'POST':
        check_auth();
        $b = body();
        $stmt = $db->prepare("INSERT INTO fa_settings (`key`,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?");
        foreach ($b as $key => $val) {
            if ($key === 'admin_password') continue; // şifre ayrı endpoint
            $stmt->execute([$key, $val, $val]);
        }
        ok(['success' => true]);

    default:
        fail('Geçersiz metod.', 405);
}
