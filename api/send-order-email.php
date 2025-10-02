<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['customerEmail']) || !isset($data['orderDetails'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données manquantes']);
    exit();
}

$customerEmail = filter_var($data['customerEmail'], FILTER_SANITIZE_EMAIL);
$orderDetails = $data['orderDetails'];
$customerName = $data['customerName'] ?? 'Client';

if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email invalide']);
    exit();
}

$smtpUser = getenv('SMTP_USER');
$smtpPassword = getenv('SMTP_PASSWORD');
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$smtpPort = getenv('SMTP_PORT') ?: 587;

if (!$smtpUser || !$smtpPassword) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Configuration SMTP manquante',
        'message' => 'Veuillez configurer SMTP_USER et SMTP_PASSWORD dans les Secrets de Replit'
    ]);
    exit();
}

try {
    $subject = 'StyleCraft - Confirmation de commande #' . $orderDetails['orderNumber'];

    $itemsList = '';
    $itemsTotal = 0;
    foreach ($orderDetails['items'] as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $itemsTotal += $itemTotal;
        $itemsList .= '
            <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                    <div style="font-weight: 500; color: #333;">' . htmlspecialchars($item['name']) . '</div>
                    <div style="color: #666; font-size: 14px; margin-top: 5px;">
                        Taille: ' . htmlspecialchars($item['size']) . ' | 
                        Couleur: ' . htmlspecialchars($item['color']) . '
                    </div>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: center; color: #666;">
                    ' . $item['quantity'] . '
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right; color: #2563eb; font-weight: 500;">
                    ' . number_format($item['price'], 2) . ' €
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right; color: #2563eb; font-weight: 500;">
                    ' . number_format($itemTotal, 2) . ' €
                </td>
            </tr>';
    }

    $htmlBody = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 32px;">StyleCraft</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Confirmation de commande</p>
                        </td>
                    </tr>
                    
                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <div style="background: #f0fdf4; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 40px; color: #16a34a;">✓</span>
                            </div>
                            <h2 style="color: #16a34a; margin: 0 0 10px 0;">Commande confirmée !</h2>
                            <p style="color: #666; margin: 0;">Bonjour ' . htmlspecialchars($customerName) . ',</p>
                            <p style="color: #666; margin: 10px 0 0 0;">Nous avons bien reçu votre commande.</p>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                <h3 style="color: #2563eb; margin: 0 0 15px 0;">Détails de la commande</h3>
                                <p style="margin: 5px 0; color: #333;"><strong>N° de commande :</strong> ' . htmlspecialchars($orderDetails['orderNumber']) . '</p>
                                <p style="margin: 5px 0; color: #333;"><strong>Date :</strong> ' . date('d/m/Y à H:i') . '</p>
                            </div>
                            
                            <!-- Items Table -->
                            <h3 style="color: #333; margin: 0 0 15px 0;">Articles commandés</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                                <thead>
                                    <tr style="background: #f8f9fa;">
                                        <th style="padding: 12px 15px; text-align: left; color: #666; font-weight: 500;">Article</th>
                                        <th style="padding: 12px 15px; text-align: center; color: #666; font-weight: 500;">Qté</th>
                                        <th style="padding: 12px 15px; text-align: right; color: #666; font-weight: 500;">Prix unit.</th>
                                        <th style="padding: 12px 15px; text-align: right; color: #666; font-weight: 500;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ' . $itemsList . '
                                </tbody>
                            </table>
                            
                            <!-- Summary -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Sous-total :</td>
                                    <td style="padding: 8px 0; text-align: right; color: #333;">' . number_format($orderDetails['subtotal'], 2) . ' €</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Livraison :</td>
                                    <td style="padding: 8px 0; text-align: right; color: #333;">' . number_format($orderDetails['shipping'], 2) . ' €</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Taxes :</td>
                                    <td style="padding: 8px 0; text-align: right; color: #333;">' . number_format($orderDetails['tax'], 2) . ' €</td>
                                </tr>
                                <tr style="border-top: 2px solid #2563eb;">
                                    <td style="padding: 15px 0 0 0; color: #2563eb; font-size: 18px; font-weight: bold;">TOTAL :</td>
                                    <td style="padding: 15px 0 0 0; text-align: right; color: #2563eb; font-size: 18px; font-weight: bold;">' . number_format($orderDetails['total'], 2) . ' €</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Delivery Info -->
                    <tr>
                        <td style="padding: 0 30px 20px;">
                            <div style="background: #e8f4f8; border-radius: 8px; padding: 20px;">
                                <h3 style="color: #2563eb; margin: 0 0 10px 0;">📦 Livraison</h3>
                                <p style="margin: 0; color: #666;">Votre commande sera traitée sous 24h et vous recevrez un email de suivi d\'expédition.</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Payment Info -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px;">
                                <h3 style="color: #856404; margin: 0 0 15px 0;">💳 Informations de paiement</h3>
                                <p style="margin: 0 0 15px 0; color: #856404; font-weight: bold;">Utilisez le numéro de commande comme référence : ' . htmlspecialchars($orderDetails['orderNumber']) . '</p>
                                
                                <div style="background: white; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #e74c3c;">📱 Airtel Money (Congo Kinshasa 🇨🇩)</p>
                                    <p style="margin: 5px 0; color: #333;">Numéro : <strong>+243 980137154</strong></p>
                                    <p style="margin: 5px 0; color: #666; font-size: 14px;">Nom : Dinango Kambala Abraham</p>
                                </div>
                                
                                <div style="background: white; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #ff6600;">📱 Orange Money (Congo Kinshasa 🇨🇩)</p>
                                    <p style="margin: 5px 0; color: #333;">Numéro : <strong>+243 840574411</strong></p>
                                    <p style="margin: 5px 0; color: #666; font-size: 14px;">Nom : Kalu Busalu</p>
                                </div>
                                
                                <div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 12px; margin-top: 15px;">
                                    <p style="margin: 0; color: #0c5460; font-size: 14px;"><strong>⚠️ Important :</strong></p>
                                    <p style="margin: 5px 0 0 0; color: #0c5460; font-size: 13px;">Après le paiement, envoyez votre preuve (capture d\'écran) ou votre ID de transaction avec le numéro de commande à : <strong>contact@stylecraft.com</strong></p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px 0; color: #666;">Merci pour votre confiance !</p>
                            <p style="margin: 0 0 15px 0; color: #2563eb; font-weight: 500; font-size: 16px;">L\'équipe StyleCraft</p>
                            <div style="margin-top: 20px;">
                                <p style="margin: 5px 0; color: #666;">📧 contact@stylecraft.com</p>
                                <p style="margin: 5px 0; color: #666;">📱 Airtel Money: +243 980137154</p>
                                <p style="margin: 5px 0; color: #666;">📱 Orange Money: +243 840574411</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

    $textBody = "StyleCraft - Confirmation de commande\n\n";
    $textBody .= "Bonjour " . $customerName . ",\n\n";
    $textBody .= "Nous avons bien reçu votre commande !\n\n";
    $textBody .= "N° de commande : " . $orderDetails['orderNumber'] . "\n";
    $textBody .= "Date : " . date('d/m/Y à H:i') . "\n\n";
    $textBody .= "ARTICLES COMMANDÉS :\n";
    $textBody .= str_repeat("-", 50) . "\n";
    
    foreach ($orderDetails['items'] as $item) {
        $itemTotal = $item['price'] * $item['quantity'];
        $textBody .= "• " . $item['name'] . "\n";
        $textBody .= "  Taille: " . $item['size'] . " | Couleur: " . $item['color'] . "\n";
        $textBody .= "  Quantité: " . $item['quantity'] . " x " . number_format($item['price'], 2) . " € = " . number_format($itemTotal, 2) . " €\n\n";
    }
    
    $textBody .= str_repeat("-", 50) . "\n";
    $textBody .= "Sous-total : " . number_format($orderDetails['subtotal'], 2) . " €\n";
    $textBody .= "Livraison : " . number_format($orderDetails['shipping'], 2) . " €\n";
    $textBody .= "Taxes : " . number_format($orderDetails['tax'], 2) . " €\n";
    $textBody .= "TOTAL : " . number_format($orderDetails['total'], 2) . " €\n\n";
    $textBody .= str_repeat("=", 50) . "\n";
    $textBody .= "💳 INFORMATIONS DE PAIEMENT\n";
    $textBody .= str_repeat("=", 50) . "\n\n";
    $textBody .= "Utilisez ce numéro de commande comme référence :\n";
    $textBody .= "➡️  " . $orderDetails['orderNumber'] . "\n\n";
    $textBody .= "📱 AIRTEL MONEY (Congo Kinshasa 🇨🇩)\n";
    $textBody .= "   Numéro : +243 980137154\n";
    $textBody .= "   Nom : Dinango Kambala Abraham\n\n";
    $textBody .= "📱 ORANGE MONEY (Congo Kinshasa 🇨🇩)\n";
    $textBody .= "   Numéro : +243 840574411\n";
    $textBody .= "   Nom : Kalu Busalu\n\n";
    $textBody .= "⚠️ IMPORTANT :\n";
    $textBody .= "Après le paiement, envoyez votre preuve (capture d'écran)\n";
    $textBody .= "ou votre ID de transaction avec le numéro de commande à :\n";
    $textBody .= "contact@stylecraft.com\n\n";
    $textBody .= str_repeat("=", 50) . "\n\n";
    $textBody .= "📦 Votre commande sera traitée sous 24h.\n\n";
    $textBody .= "Merci pour votre confiance !\n";
    $textBody .= "L'équipe StyleCraft\n\n";
    $textBody .= "📧 Email : contact@stylecraft.com\n";
    $textBody .= "📱 Airtel Money : +243 980137154\n";
    $textBody .= "📱 Orange Money : +243 840574411";

    $mail = new PHPMailer(true);
    
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';
    
    $mail->setFrom($smtpUser, 'StyleCraft');
    $mail->addAddress($customerEmail, $customerName);
    
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlBody;
    $mail->AltBody = $textBody;
    
    $mail->send();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email envoyé avec succès via SMTP'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur lors de l\'envoi de l\'email',
        'details' => $e->getMessage()
    ]);
}
