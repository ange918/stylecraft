// =============================================
//   StyleCraft - Configuration des Paiements
//   Numéros de réception pour Airtel & Orange Money
// =============================================

// Configuration des numéros de réception par pays
export const PAYMENT_CONFIG = {
    // Numéros Airtel Money pour recevoir l'argent
    airtel: {
        // Congo (République Démocratique)
        congo_rdc: {
            country: "Congo RDC",
            code: "+243",
            numbers: [
                "+243980137154", // Airtel Money - Dinango Kambala Abraham
                "+243980137154"  // Numéro principal
            ]
        },
        // Congo (République)
        congo_roc: {
            country: "Congo",
            code: "+242",
            numbers: ["+242060000000"]
        },
        // Autres pays Airtel
        niger: {
            country: "Niger",
            code: "+227",
            numbers: ["+227960000000"]
        },
        tchad: {
            country: "Tchad", 
            code: "+235",
            numbers: ["+235660000000"]
        },
        burkina_faso: {
            country: "Burkina Faso",
            code: "+226",
            numbers: ["+226700000000"]
        },
        nigeria: {
            country: "Nigeria",
            code: "+234",
            numbers: ["+234700000000"]
        },
        ghana: {
            country: "Ghana",
            code: "+233",
            numbers: ["+233240000000"]
        },
        ouganda: {
            country: "Ouganda",
            code: "+256",
            numbers: ["+256700000000"]
        },
        tanzanie: {
            country: "Tanzanie",
            code: "+255",
            numbers: ["+255600000000"]
        },
        kenya: {
            country: "Kenya",
            code: "+254",
            numbers: ["+254700000000"]
        },
        rwanda: {
            country: "Rwanda",
            code: "+250",
            numbers: ["+250780000000"]
        },
        zambie: {
            country: "Zambie",
            code: "+260",
            numbers: ["+260970000000"]
        },
        malawi: {
            country: "Malawi",
            code: "+265",
            numbers: ["+265880000000"]
        }
    },
    
    // Numéros Orange Money pour recevoir l'argent
    orange: {
        // Congo (République Démocratique)
        congo_rdc: {
            country: "Congo RDC",
            code: "+243",
            numbers: [
                "+243840574411", // Orange Money - Kalu Busalu
                "+243840574411"  // Numéro principal
            ]
        },
        // Côte d'Ivoire
        cote_ivoire: {
            country: "Côte d'Ivoire",
            code: "+225",
            numbers: ["+22507000000"]
        },
        // Sénégal
        senegal: {
            country: "Sénégal",
            code: "+221", 
            numbers: ["+22177000000"]
        },
        // Mali
        mali: {
            country: "Mali",
            code: "+223",
            numbers: ["+22370000000"]
        },
        // Cameroun
        cameroun: {
            country: "Cameroun",
            code: "+237",
            numbers: ["+23769000000"]
        },
        // Burkina Faso
        burkina_faso: {
            country: "Burkina Faso",
            code: "+226",
            numbers: ["+22670000000"]
        },
        // Niger
        niger: {
            country: "Niger",
            code: "+227",
            numbers: ["+22796000000"]
        },
        // Bénin
        benin: {
            country: "Bénin",
            code: "+229",
            numbers: ["+22996000000"]
        },
        // Togo
        togo: {
            country: "Togo",
            code: "+228",
            numbers: ["+22897000000"]
        },
        // Guinée
        guinee: {
            country: "Guinée",
            code: "+224",
            numbers: ["+22466000000"]
        },
        // Guinée-Bissau
        guinee_bissau: {
            country: "Guinée-Bissau",
            code: "+245",
            numbers: ["+24595500000"]
        },
        // Maurice
        maurice: {
            country: "Maurice",
            code: "+230",
            numbers: ["+23059000000"]
        },
        // Réunion
        reunion: {
            country: "Réunion",
            code: "+262",
            numbers: ["+26269000000"]
        },
        // France
        france: {
            country: "France",
            code: "+33",
            numbers: ["+33670000000"]
        }
    }
};

// Validation étendue pour tous les pays Airtel et Orange (formats corrigés)
export const PHONE_PATTERNS = {
    // Formats Airtel Money (tous pays)
    airtel: [
        /^\+243[89]\d{8}$/,     // Congo RDC (Airtel) - corrigé
        /^\+242[06]\d{7}$/,     // Congo ROC (Airtel)
        /^\+227[96]\d{7}$/,     // Niger (Airtel)
        /^\+235[67]\d{7}$/,     // Tchad (Airtel)
        /^\+226[67]\d{7}$/,     // Burkina Faso (Airtel)
        /^\+234[78]\d{8}$/,     // Nigeria (Airtel)
        /^\+233[23]\d{8}$/,     // Ghana (Airtel)
        /^\+256[78]\d{8}$/,     // Ouganda (Airtel)
        /^\+255[67]\d{8}$/,     // Tanzanie (Airtel)
        /^\+254[78]\d{8}$/,     // Kenya (Airtel)
        /^\+250[78]\d{8}$/,     // Rwanda (Airtel)
        /^\+260[97]\d{8}$/,     // Zambie (Airtel)
        /^\+265[88]\d{8}$/      // Malawi (Airtel) - corrigé
    ],
    
    // Formats Orange Money (tous pays)
    orange: [
        /^\+243[89]\d{8}$/,     // Congo RDC (Orange) - corrigé
        /^\+225[0157]\d{8}$/,   // Côte d'Ivoire (Orange)
        /^\+221[77]\d{7}$/,     // Sénégal (Orange)
        /^\+223[67]\d{7}$/,     // Mali (Orange)
        /^\+237[69]\d{8}$/,     // Cameroun (Orange)
        /^\+226[67]\d{7}$/,     // Burkina Faso (Orange)
        /^\+227[96]\d{7}$/,     // Niger (Orange)
        /^\+229[96]\d{7}$/,     // Bénin (Orange)
        /^\+228[97]\d{7}$/,     // Togo (Orange)
        /^\+224[66]\d{7}$/,     // Guinée (Orange)
        /^\+245[955]\d{6}$/,    // Guinée-Bissau (Orange)
        /^\+230[59]\d{7}$/,     // Maurice (Orange)
        /^\+262[692]\d{8}$/,    // Réunion (Orange)
        /^\+33[67]\d{8}$/       // France (Orange)
    ],
    
    // Formats locaux sans code pays
    local: [
        /^[089]\d{8,9}$/,       // Format local général
        /^[67]\d{7}$/,          // Format court
        /^[0-9]{8,12}$/         // Format flexible
    ]
};

// Fonction pour obtenir le numéro de réception selon le pays du client
export function getReceivingNumber(paymentMethod, customerPhone) {
    const config = PAYMENT_CONFIG[paymentMethod];
    if (!config) return null;
    
    // Nettoyer le numéro du client
    const cleanPhone = customerPhone.replace(/[^\d+]/g, '');
    
    // Détecter le pays selon le code du numéro
    for (const [countryKey, countryData] of Object.entries(config)) {
        if (cleanPhone.startsWith(countryData.code)) {
            // Retourner le premier numéro configuré pour ce pays
            return {
                country: countryData.country,
                number: countryData.numbers[0],
                backup: countryData.numbers[1] || null
            };
        }
    }
    
    // Par défaut, utiliser les numéros Congo RDC
    const defaultCountry = config.congo_rdc || Object.values(config)[0];
    return {
        country: defaultCountry.country,
        number: defaultCountry.numbers[0],
        backup: defaultCountry.numbers[1] || null
    };
}

// Instructions détaillées par méthode de paiement
export const PAYMENT_INSTRUCTIONS = {
    airtel: {
        title: "💰 Paiement Airtel Money",
        steps: [
            "Composez *150# sur votre téléphone",
            "Sélectionnez 'Envoyer de l'argent'",
            "Entrez le numéro destinataire: {receivingNumber}",
            "Entrez le montant: {amount}",
            "Confirmez avec votre code PIN",
            "Conservez le message de confirmation reçu"
        ],
        note: "Le paiement sera confirmé automatiquement une fois reçu"
    },
    
    orange: {
        title: "🍊 Paiement Orange Money", 
        steps: [
            "Composez #150# sur votre téléphone",
            "Sélectionnez 'Transfert d'argent'",
            "Entrez le numéro destinataire: {receivingNumber}",
            "Entrez le montant: {amount}",
            "Confirmez avec votre code PIN",
            "Conservez le message de confirmation reçu"
        ],
        note: "Votre commande sera traitée dans les 30 minutes"
    }
};