<?php
require __DIR__ . '/config.php';
if (session_status() === PHP_SESSION_NONE) session_start();

$action = $_GET['action'] ?? body()['action'] ?? '';

/* ── Oturum Kontrolü ── */
if (method() === 'GET' || $action === 'check') {
    ok(['loggedIn' => !empty($_SESSION['admin'])]);
}

/* ── Giriş ── */
if (method() === 'POST' && $action === 'login') {
    $b    = body();
    $pass = trim($b['password'] ?? '');
    if (!$pass) fail('Şifre boş olamaz.');

    // DB'den hash'i al
    $stmt = $db->query("SELECT value FROM fa_settings WHERE `key`='admin_password' LIMIT 1");
    $row  = $stmt->fetch();
    $hash = $row ? $row['value'] : password_hash('force2025', PASSWORD_DEFAULT);

    if (!password_verify($pass, $hash)) fail('Hatalı şifre.', 401);

    $_SESSION['admin'] = true;
    ok(['success' => true]);
}

/* ── Çıkış ── */
if (method() === 'POST' && $action === 'logout') {
    session_destroy();
    ok(['success' => true]);
}

/* ── Şifre Değiştir ── */
if (method() === 'POST' && $action === 'change_password') {
    check_auth();
    $b    = body();
    $old  = $b['old'] ?? '';
    $new  = $b['new'] ?? '';
    $new2 = $b['new2'] ?? '';

    $stmt = $db->query("SELECT value FROM fa_settings WHERE `key`='admin_password' LIMIT 1");
    $row  = $stmt->fetch();
    $hash = $row ? $row['value'] : password_hash('force2025', PASSWORD_DEFAULT);

    if (!password_verify($old, $hash)) fail('Mevcut şifre yanlış.');
    if (!$new)         fail('Yeni şifre boş olamaz.');
    if ($new !== $new2) fail('Yeni şifreler eşleşmiyor.');

    $newHash = password_hash($new, PASSWORD_DEFAULT);
    $db->prepare("INSERT INTO fa_settings (`key`,value) VALUES ('admin_password',?) ON DUPLICATE KEY UPDATE value=?")
       ->execute([$newHash, $newHash]);
    ok(['success' => true]);
}

fail('Geçersiz istek.');
