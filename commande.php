<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerName  = htmlspecialchars($_POST['customerName'] ?? '');
    $customerEmail = filter_var($_POST['customerEmail'] ?? '', FILTER_SANITIZE_EMAIL);
    $address       = htmlspecialchars($_POST['address'] ?? '');
    $city          = htmlspecialchars($_POST['city'] ?? '');
    $country       = htmlspecialchars($_POST['country'] ?? '');
    $products      = htmlspecialchars($_POST['products'] ?? '');
    $total         = htmlspecialchars($_POST['total'] ?? '');

    if (empty($customerName) || empty($customerEmail) || empty($address) || empty($city) || empty($country) || empty($products) || empty($total)) {
        $message = "❌ Erreur : Tous les champs sont obligatoires";
        $messageType = 'error';
    } elseif (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        $message = "❌ Erreur : Email invalide";
        $messageType = 'error';
    } else {
        $mail = new PHPMailer(true);
        try {
            // Paramètres SMTP
            $mail->isSMTP();
            $mail->Host       = 'mail.craft-style.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'contact@craft-style.com';
            $mail->Password   = '91rerdakonde'; // Remplace ici
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;

            // Destinataires
            $mail->setFrom('contact@craft-style.com', 'Boutique Craft Style');
            $mail->addAddress($customerEmail, $customerName); // envoi au client
            $mail->addReplyTo('contact@craft-style.com', 'Boutique Craft Style');
            $mail->addCC('contact@craft-style.com'); // copie pour toi

            // Contenu
            $mail->isHTML(true);
            $mail->Subject = 'Confirmation de votre commande Craft Style';

            $mail->Body = "
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <style>
                        body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .content { padding: 30px; }
                        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
                        .section { margin: 25px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea; }
                        .section-title { font-size: 16px; font-weight: bold; color: #667eea; margin-bottom: 10px; text-transform: uppercase; }
                        .info-row { margin: 8px 0; color: #555; line-height: 1.6; }
                        .info-label { font-weight: bold; color: #333; }
                        .products { white-space: pre-line; line-height: 1.8; }
                        .total { font-size: 24px; font-weight: bold; color: #667eea; margin: 15px 0; }
                        .payment-info { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 6px; margin: 20px 0; }
                        .payment-title { font-weight: bold; color: #856404; margin-bottom: 15px; font-size: 16px; }
                        .payment-numbers { list-style: none; padding: 0; }
                        .payment-numbers li { background-color: white; margin: 10px 0; padding: 15px; border-radius: 4px; border: 1px solid #ffeaa7; }
                        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
                        .footer strong { color: #333; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>✨ Craft Style</h1>
                            <p style='margin: 10px 0 0 0; font-size: 14px;'>Confirmation de commande</p>
                        </div>
                        <div class='content'>
                            <div class='greeting'>Bonjour <strong>{$customerName}</strong>,</div>
                            <p style='color: #555; line-height: 1.6;'>Merci pour votre confiance ! Nous avons bien reçu votre commande. Voici le récapitulatif :</p>
                            
                            <div class='section'>
                                <div class='section-title'>📦 Produits commandés</div>
                                <div class='products'>{$products}</div>
                            </div>
                            
                            <div class='section'>
                                <div class='section-title'>📍 Adresse de livraison</div>
                                <div class='info-row'><span class='info-label'>Adresse :</span> {$address}</div>
                                <div class='info-row'><span class='info-label'>Ville :</span> {$city}</div>
                                <div class='info-row'><span class='info-label'>Pays :</span> {$country}</div>
                            </div>
                            
                            <div class='section' style='text-align: center;'>
                                <div class='section-title'>💰 Total à payer</div>
                                <div class='total'>{$total} USD</div>
                            </div>
                            
                            <div class='payment-info'>
                                <div class='payment-title'>💳 Informations de paiement</div>
                                <p style='margin: 0 0 15px 0; color: #856404;'>Veuillez effectuer votre paiement sur l'un de ces numéros :</p>
                                <ul class='payment-numbers'>
                                    <li>📱 <strong>+243 980137154</strong><br>Riziki Guillaume — Airtel Congo 🇨🇩</li>
                                    <li>📱 <strong>+243 840574411</strong><br>Kalu Busalu — Orange Congo 🇨🇩</li>
                                </ul>
                                <p style='margin: 15px 0 0 0; color: #856404; font-size: 14px;'>
                                    <strong>Important :</strong> Merci de nous envoyer la capture d'écran de votre paiement pour validation.
                                </p>
                            </div>
                        </div>
                        <div class='footer'>
                            <p style='margin: 0 0 10px 0;'><strong>Merci de votre confiance !</strong></p>
                            <p style='margin: 0;'>Cordialement,<br><strong>L'équipe Craft Style</strong></p>
                        </div>
                    </div>
                </body>
                </html>
            ";

            $mail->send();
            
            // Track order for dashboard (server-side tracking)
            $dataDir = __DIR__ . '/data';
            if (!file_exists($dataDir)) {
                mkdir($dataDir, 0777, true);
            }
            $ordersFile = $dataDir . '/orders.json';
            $ordersData = [];
            if (file_exists($ordersFile)) {
                $ordersData = json_decode(file_get_contents($ordersFile), true) ?: [];
            }
            $ordersData[] = [
                'order_id' => uniqid('ORD-'),
                'customer_email' => $customerEmail,
                'customer_name' => $customerName,
                'products' => $products,
                'total' => $total,
                'status' => 'pending',
                'timestamp' => date('Y-m-d H:i:s')
            ];
            file_put_contents($ordersFile, json_encode($ordersData, JSON_PRETTY_PRINT));
            
            $message = "✅ Commande envoyée avec succès à {$customerEmail}";
            $messageType = 'success';
        } catch (Exception $e) {
            $message = "❌ Erreur lors de l'envoi : {$mail->ErrorInfo}";
            $messageType = 'error';
        }
    }
}

// Retour simple (JSON) si formulaire via AJAX
echo json_encode(['message' => $message, 'type' => $messageType]);