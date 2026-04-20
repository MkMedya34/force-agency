<?php
/* ═══════════════════════════════════════
   cPanel MySQL Bağlantı Ayarları
   Bu bilgileri cPanel → MySQL Databases
   bölümünden oluşturun ve doldurun.
═══════════════════════════════════════ */
define('DB_HOST', 'localhost');
define('DB_USER', 'forceagencycom_web');   // cpaneladiniz_dbkullanici
define('DB_PASS', '5[8Y}j(*vdB^BK#_');       // veritabanı şifreniz
define('DB_NAME', 'forceagencycom_web');         // cpaneladiniz_dbadi

/* ─── Bağlantı ─── */
try {
    $db = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER, DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
        ]
    );
} catch (PDOException $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    die(json_encode(['error' => 'Veritabanı bağlantı hatası. config.php dosyasını kontrol edin.']));
}

/* ─── Ortak Headers ─── */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

/* ─── Helper Fonksiyonlar ─── */
function ok($data = [], int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function uid(): string {
    return substr(base_convert(microtime(true) * 1000, 10, 36), -8)
         . substr(uniqid('', true), -4);
}

function check_auth(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['admin'])) fail('Yetkisiz erişim. Lütfen giriş yapın.', 401);
}

function method(): string {
    return strtoupper($_SERVER['REQUEST_METHOD']);
}
