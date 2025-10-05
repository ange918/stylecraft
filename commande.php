<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerName  = htmlspecialchars($_POST['customerName'] ?? '');
    $customerEmail = filter_var($_POST['customerEmail'] ?? '', FILTER_SANITIZE_EMAIL);
    $products      = htmlspecialchars($_POST['products'] ?? '');
    $total         = htmlspecialchars($_POST['total'] ?? '');

    if (empty($customerName) || empty($customerEmail) || empty($products) || empty($total)) {
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
                <h2>Bonjour {$customerName},</h2>
                <p>Merci pour votre commande. Voici le récapitulatif :</p>
                <div>
                    <h3>Produits commandés :</h3>
                    <p>{$products}</p>
                    <h3>Total :</h3>
                    <p>{$total}</p>
                </div>
                <p>Veuillez effectuer votre paiement sur ces numéros :</p>
                <ul>
                    <li>+243 980137154 — Dinango Kambala Abraham — Airtel Congo 🇨🇩</li>
                    <li>+243 840574411 — Kalu Busalu — Orange Congo 🇨🇩</li>
                </ul>
                <p>Merci de nous envoyer la capture de votre paiement.</p>
                <p>Cordialement,<br>Boutique Craft Style</p>
            ";

            $mail->send();
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