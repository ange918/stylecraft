<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$smtpPort = getenv('SMTP_PORT') ?: 587;
$smtpUser = getenv('SMTP_USER');
$smtpPassword = getenv('SMTP_PASSWORD');

echo "=== Configuration SMTP ===\n";
echo "Host: " . $smtpHost . "\n";
echo "Port: " . $smtpPort . "\n";
echo "User: " . $smtpUser . "\n";
echo "Password: " . (empty($smtpPassword) ? "VIDE" : str_repeat("*", strlen($smtpPassword))) . "\n";
echo "Password length: " . strlen($smtpPassword) . " caractères\n\n";

if (!$smtpUser || !$smtpPassword) {
    echo "❌ ERREUR: SMTP_USER ou SMTP_PASSWORD manquant\n";
    exit(1);
}

$mail = new PHPMailer(true);

try {
    // Configuration SMTP
    $mail->SMTPDebug = 2;
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';

    // Test email
    $mail->setFrom($smtpUser, 'StyleCraft Test');
    $mail->addAddress($smtpUser);
    $mail->isHTML(true);
    $mail->Subject = 'Test SMTP - StyleCraft';
    $mail->Body = '<h1>Test réussi !</h1><p>L\'envoi d\'emails fonctionne correctement.</p>';
    $mail->AltBody = 'Test réussi ! L\'envoi d\'emails fonctionne correctement.';

    $mail->send();
    echo "\n✅ Email envoyé avec succès !\n";
    
} catch (Exception $e) {
    echo "\n❌ Erreur: {$mail->ErrorInfo}\n";
    echo "Exception: " . $e->getMessage() . "\n";
}
