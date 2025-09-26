# 📱 Guide du Système de Paiement Mobile StyleCraft

## Vue d'ensemble

Votre boutique StyleCraft accepte maintenant les paiements **Airtel Money** et **Orange Money** de tous les pays africains qui utilisent ces services. Le système détecte automatiquement le pays du client et affiche le bon numéro de réception.

## 🌍 Pays Supportés

### Airtel Money
- **Congo RDC** (+243)
- **Congo** (+242) 
- **Niger** (+227)
- **Tchad** (+235)
- **Burkina Faso** (+226)
- **Nigeria** (+234)
- **Ghana** (+233)
- **Ouganda** (+256)
- **Tanzanie** (+255)
- **Kenya** (+254)
- **Rwanda** (+250)
- **Zambie** (+260)
- **Malawi** (+265)

### Orange Money
- **Congo RDC** (+243)
- **Côte d'Ivoire** (+225)
- **Sénégal** (+221)
- **Mali** (+223)
- **Cameroun** (+237)
- **Burkina Faso** (+226)
- **Niger** (+227)
- **Bénin** (+229)
- **Togo** (+228)
- **Guinée** (+224)
- **Guinée-Bissau** (+245)
- **Maurice** (+230)
- **Réunion** (+262)
- **France** (+33)

## ⚙️ Configuration des Numéros de Réception

### Étape 1: Modifier le fichier de configuration

Ouvrez le fichier `js/payment-config.js` et modifiez les numéros :

```javascript
// Configuration des numéros de réception par pays
export const PAYMENT_CONFIG = {
    airtel: {
        congo_rdc: {
            country: "Congo RDC",
            code: "+243",
            numbers: [
                "+243800123456", // ← Remplacez par VOTRE numéro Airtel
                "+243900123456"  // ← Numéro de backup (optionnel)
            ]
        },
        // Ajoutez d'autres pays selon vos besoins...
    },
    
    orange: {
        congo_rdc: {
            country: "Congo RDC", 
            code: "+243",
            numbers: [
                "+243840123456", // ← Remplacez par VOTRE numéro Orange
                "+243890123456"  // ← Numéro de backup (optionnel)
            ]
        },
        // Ajoutez d'autres pays selon vos besoins...
    }
};
```

### Étape 2: Ajouter de nouveaux pays

Pour ajouter un nouveau pays, copiez ce modèle :

```javascript
nouveau_pays: {
    country: "Nom du Pays",
    code: "+XXX",
    numbers: [
        "+XXXxxxxxxxxx", // Votre numéro principal
        "+XXXxxxxxxxxx"  // Votre numéro de backup (optionnel)
    ]
}
```

## 💰 Comment le Paiement Fonctionne

### 1. **Sélection du Produit**
- Le client ajoute des produits au panier
- Il clique sur "Procéder au paiement"

### 2. **Choix de la Méthode**
- Le client choisit Airtel Money ou Orange Money
- Le système affiche un formulaire pour ses informations

### 3. **Détection Automatique**
- Le système détecte le pays selon le numéro du client
- Il affiche automatiquement VOS numéros de réception pour ce pays

### 4. **Instructions Personnalisées**
- Le client voit des instructions détaillées
- Il voit clairement sur quel numéro envoyer l'argent
- Il voit le montant exact à envoyer

### 5. **Vérification par Email**
- Un code de vérification est envoyé à l'email du client
- Le client confirme avec ce code
- Vous recevez un email de confirmation avec tous les détails

## 📋 Exemple d'Affichage pour le Client

Quand un client du Congo paie 50$ avec Airtel Money, il voit :

```
💰 Paiement Airtel Money

👤 Compte de réception :
   +243800123456
   Pays détecté: Congo RDC
   Numéro alternatif: +243900123456

📋 Étapes à suivre :
   1. Composez *150# sur votre téléphone
   2. Sélectionnez 'Envoyer de l'argent'
   3. Entrez le numéro destinataire: +243800123456
   4. Entrez le montant: 50 USD
   5. Confirmez avec votre code PIN
   6. Conservez le message de confirmation reçu

ℹ️ Le paiement sera confirmé automatiquement une fois reçu
```

## 🔧 Personnalisation Avancée

### Modifier les Instructions
Dans `js/payment-config.js`, section `PAYMENT_INSTRUCTIONS` :

```javascript
export const PAYMENT_INSTRUCTIONS = {
    airtel: {
        title: "💰 Paiement Airtel Money",
        steps: [
            "Composez *150# sur votre téléphone",
            "Sélectionnez 'Envoyer de l'argent'",
            // Modifiez ces étapes selon vos préférences...
        ],
        note: "Votre message personnalisé ici"
    }
};
```

### Ajouter des Frais
Pour ajouter des frais de transaction, modifiez la fonction `calculateCartTotal()` dans `js/script.js`.

## 📧 Emails de Confirmation

Vous recevrez automatiquement des emails avec :
- Détails de la commande
- Méthode de paiement utilisée  
- Numéro du client
- Montant à recevoir
- Code de vérification utilisé

## 🛠️ Support Technique

### Problèmes Courants

1. **"Numéro non valide"**
   - Vérifiez que vous avez ajouté le code pays (+243, +225, etc.)
   - Vérifiez le format dans `PHONE_PATTERNS`

2. **"Pays non supporté"**
   - Ajoutez le pays dans `PAYMENT_CONFIG`
   - Ajoutez le format de numéro dans `PHONE_PATTERNS`

3. **"Numéro de réception incorrect"**
   - Vérifiez vos numéros dans `PAYMENT_CONFIG`
   - Assurez-vous qu'ils incluent le code pays

### Logs et Débogage
- Les erreurs apparaissent dans la console du navigateur
- Les emails de test sont visibles dans les logs de l'application

---

**✅ Votre système de paiement est maintenant configuré pour accepter les paiements de toute l'Afrique !**

N'oubliez pas de **tester avec vos vrais numéros** avant de lancer en production.