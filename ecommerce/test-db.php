<?php
$host = 'localhost'; // Vagy localhost, attól függően, mit használsz
$port = '3306';
$database = 'u292594811_shopzone';
$username = 'u292594811_shopzone_user';
$password = 'Hitman4717?';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection successful!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>