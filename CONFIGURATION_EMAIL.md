# Configuration de l'envoi d'emails SMTP

## 📧 Configuration sécurisée des secrets SMTP

Pour que votre système d'envoi d'emails fonctionne, vous devez configurer vos identifiants SMTP de manière sécurisée dans Replit.

### Étape 1 : Ouvrir l'onglet Secrets dans Replit

1. Dans votre projet Replit, cliquez sur l'icône **"Tools"** (🔧) dans la barre latérale gauche
2. Sélectionnez **"Secrets"**

### Étape 2 : Ajouter vos secrets SMTP

Ajoutez les secrets suivants un par un :

#### 1. **SMTP_USER** (obligatoire)
- **Clé** : `SMTP_USER`
- **Valeur** : Votre adresse email Gmail complète (ex: votreemail@gmail.com)

#### 2. **SMTP_PASSWORD** (obligatoire)
- **Clé** : `SMTP_PASSWORD`
- **Valeur** : Votre mot de passe d'application Gmail (PAS votre mot de passe Gmail normal)

#### 3. **SMTP_HOST** (optionnel - par défaut: smtp.gmail.com)
- **Clé** : `SMTP_HOST`
- **Valeur** : `smtp.gmail.com` (ou votre serveur SMTP)

#### 4. **SMTP_PORT** (optionnel - par défaut: 587)
- **Clé** : `SMTP_PORT`
- **Valeur** : `587` (pour TLS) ou `465` (pour SSL)

---

## 🔐 Comment obtenir un mot de passe d'application Gmail

### Important : N'utilisez JAMAIS votre mot de passe Gmail normal !

1. **Activer la validation en 2 étapes sur votre compte Gmail** :
   - Allez sur https://myaccount.google.com/security
   - Activez "Validation en 2 étapes"

2. **Créer un mot de passe d'application** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Connectez-vous si nécessaire
   - Sélectionnez "Autre (nom personnalisé)"
   - Nommez-le "StyleCraft Replit" ou similaire
   - Cliquez sur "Générer"
   - **Copiez le mot de passe à 16 caractères** (sans espaces)
   - Utilisez ce mot de passe comme valeur pour `SMTP_PASSWORD`

---

## ✅ Vérification de la configuration

Après avoir ajouté les secrets :

1. Redémarrez le serveur (le serveur redémarre automatiquement après l'ajout de secrets)
2. Testez l'envoi d'email en passant une commande sur votre site
3. Vérifiez votre boîte mail pour confirmer la réception

---

## 🔍 Dépannage

### Erreur "Configuration SMTP manquante"
- Vérifiez que vous avez bien ajouté `SMTP_USER` et `SMTP_PASSWORD`
- Les noms des secrets sont sensibles à la casse (majuscules)

### Erreur "Authentication failed"
- Vérifiez que vous utilisez un **mot de passe d'application** et non votre mot de passe Gmail
- Assurez-vous que la validation en 2 étapes est activée sur votre compte Gmail

### Les emails ne sont pas reçus
- Vérifiez vos dossiers spam/courrier indésirable
- Assurez-vous que l'adresse email du client est correcte
- Consultez les logs du serveur pour voir les erreurs détaillées

---

## 📝 Format de l'email envoyé

Quand un client passe commande, il reçoit automatiquement un email contenant :

✅ **Numéro de commande**
✅ **Liste détaillée des articles** (nom, taille, couleur, quantité, prix)
✅ **Résumé financier** (sous-total, livraison, taxes, total)
✅ **Informations de livraison**
✅ **Design professionnel** avec le logo StyleCraft

---

## 🛡️ Sécurité

- ✅ Vos secrets sont stockés de manière sécurisée dans Replit
- ✅ Les secrets ne sont jamais exposés dans le code
- ✅ Utilisez toujours des mots de passe d'application, jamais vos mots de passe principaux
- ✅ Vous pouvez révoquer un mot de passe d'application à tout moment depuis votre compte Google
