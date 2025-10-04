<?php
header('Content-Type: text/html; charset=UTF-8');

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customerName = htmlspecialchars($_POST['customerName'] ?? '');
    $customerEmail = filter_var($_POST['customerEmail'] ?? '', FILTER_SANITIZE_EMAIL);
    $products = htmlspecialchars($_POST['products'] ?? '');
    $total = htmlspecialchars($_POST['total'] ?? '');
    
    if (empty($customerName) || empty($customerEmail) || empty($products) || empty($total)) {
        $message = "❌ Erreur : Tous les champs sont obligatoires";
        $messageType = 'error';
    } elseif (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        $message = "❌ Erreur : Email invalide";
        $messageType = 'error';
    } else {
        $to = "contact@craft-style.com";
        $subject = "Nouvelle commande de " . $customerName;
        
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
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 32px;">🛍️ Craft Style</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Nouvelle commande reçue</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 30px;">
                            <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                                <p style="margin: 0; color: #16a34a; font-weight: bold;">✅ Une nouvelle commande a été passée</p>
                            </div>
                            
                            <h2 style="color: #2563eb; margin: 0 0 20px 0; font-size: 22px;">Informations du client</h2>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                        <strong style="color: #374151;">Nom du client :</strong>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                                        <span style="color: #1f2937;">' . $customerName . '</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                        <strong style="color: #374151;">Email du client :</strong>
                                    </td>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                                        <a href="mailto:' . $customerEmail . '" style="color: #2563eb; text-decoration: none;">' . $customerEmail . '</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <h2 style="color: #2563eb; margin: 0 0 20px 0; font-size: 22px;">Détails de la commande</h2>
                            
                            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">📦 Produits commandés :</h3>
                                <div style="background: white; border-radius: 6px; padding: 15px; border: 1px solid #e5e7eb;">
                                    <p style="margin: 0; color: #1f2937; line-height: 1.6; white-space: pre-line;">' . nl2br($products) . '</p>
                                </div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; padding: 20px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: 500;">TOTAL DE LA COMMANDE</p>
                                <p style="margin: 0; color: #1e3a8a; font-size: 36px; font-weight: bold;">' . $total . '</p>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Date de la commande : <strong>' . date('d/m/Y à H:i:s') . '</strong></p>
                            <p style="margin: 0; color: #9ca3af; font-size: 13px;">Email envoyé automatiquement depuis votre boutique Craft Style</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: Boutique Craft Style <no-reply@craft-style.com>\r\n";
        $headers .= "Reply-To: " . $customerEmail . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        
        if (mail($to, $subject, $htmlBody, $headers)) {
            $message = "✅ Commande envoyée avec succès à contact@craft-style.com";
            $messageType = 'success';
        } else {
            $message = "❌ Erreur lors de l'envoi de la commande";
            $messageType = 'error';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Envoi Commande - Craft Style</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #2563eb;
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #6b7280;
            font-size: 16px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        input[type="text"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        
        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .message {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-weight: 500;
            text-align: center;
        }
        
        .message.success {
            background: #f0fdf4;
            color: #16a34a;
            border: 2px solid #86efac;
        }
        
        .message.error {
            background: #fef2f2;
            color: #dc2626;
            border: 2px solid #fca5a5;
        }
        
        .info-box {
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            border-radius: 4px;
            margin-top: 25px;
        }
        
        .info-box p {
            color: #1e40af;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .info-box strong {
            color: #1e3a8a;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛍️ Craft Style</h1>
            <p>Formulaire de test d'envoi de commande</p>
        </div>
        
        <?php if ($message): ?>
            <div class="message <?php echo $messageType; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="customerName">👤 Nom du client</label>
                <input type="text" id="customerName" name="customerName" placeholder="Ex: Jean Dupont" required>
            </div>
            
            <div class="form-group">
                <label for="customerEmail">📧 Email du client</label>
                <input type="email" id="customerEmail" name="customerEmail" placeholder="Ex: client@example.com" required>
            </div>
            
            <div class="form-group">
                <label for="products">📦 Liste des produits commandés</label>
                <textarea id="products" name="products" placeholder="Ex:&#10;- Robe noire élégante x 1&#10;- Sac à main cuir premium x 2&#10;- Chaussures Adidas x 1" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="total">💰 Total de la commande</label>
                <input type="text" id="total" name="total" placeholder="Ex: 150.00 €" required>
            </div>
            
            <button type="submit">📨 Envoyer la commande par email</button>
        </form>
        
        <div class="info-box">
            <p><strong>ℹ️ Information :</strong></p>
            <p>Ce formulaire envoie un email à <strong>contact@craft-style.com</strong> qui sera automatiquement redirigé vers <strong>stylecraft465@gmail.com</strong> grâce à votre redirection Pilahost.</p>
        </div>
    </div>
</body>
</html>
