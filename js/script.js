// =============================================
//   StyleCraft - E-commerce JavaScript
// =============================================

// Import email utility for payment confirmations
import { sendEmail, sendPaymentConfirmationEmail, sendPaymentVerificationCode } from './utils/email.js';

// Import payment configuration
import { PAYMENT_CONFIG, PHONE_PATTERNS, getReceivingNumber, PAYMENT_INSTRUCTIONS } from './payment-config.js';


// Global Variables
let cart = JSON.parse(localStorage.getItem('stylecraft-cart')) || [];
let products = [];
let currentPage = 1;
const itemsPerPage = 6;
let currentFilters = {
    category: [],
    price: '',
    sale: false
};

// Payment verification variables
let currentPaymentData = {
    customerEmail: '',
    phoneNumber: '',
    paymentMethod: '',
    verificationCode: '',
    orderNumber: '',
    orderDetails: null
};

// Sample Products Data
// Sample Products Data
const sampleProducts = [
    // === CHAUSSURES (14 produits) ===
    { id: 1001, name: "Basket Adidas Moderne", price: 45.99, originalPrice: 58.99, category: "chaussures",
        image: "attached_assets/chaussures/Chaussures-basket-ADIDAS-homme-2.png",
        images: ["attached_assets/chaussures/Chaussures-basket-ADIDAS-homme-2.png"],
        description: "Basket Adidas confortable pour un style sportif moderne.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Blanc", "Noir", "Bleu"],
        featured: true, bestseller: true, sale: true },
    { id: 1002, name: "Chaussures Sport Bleues", price: 39.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/maite-steenhoudt-adidas-originals-adimatic-mid-victory-blue-ig8174-top.jpg",
        images: ["attached_assets/chaussures/maite-steenhoudt-adidas-originals-adimatic-mid-victory-blue-ig8174-top.jpg"],
        description: "Chaussures de sport bleu victoire, design contemporain.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Bleu"], featured: true, bestseller: false, sale: false },
    { id: 1003, name: "Sneakers Urbaines", price: 49.99, originalPrice: 58.99, category: "chaussures",
        image: "attached_assets/chaussures/a201045f2a8c478c863e5aa19f1437d6.jpg",
        images: ["attached_assets/chaussures/a201045f2a8c478c863e5aa19f1437d6.jpg"],
        description: "Sneakers urbaines au style unique.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Noir", "Gris"], featured: false, bestseller: true, sale: true },
    { id: 1004, name: "Chaussures Casual", price: 29.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/03737ebb03e146aeb0f943bdc0a526c3.jpg",
        images: ["attached_assets/chaussures/03737ebb03e146aeb0f943bdc0a526c3.jpg"],
        description: "Chaussures casual pour le quotidien.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Beige", "Marron"], featured: true, bestseller: false, sale: false },
    { id: 1005, name: "Basket Tendance", price: 42.99, originalPrice: 49.99, category: "chaussures",
        image: "attached_assets/chaussures/78e19addb8eb48c09d928574e7c14e9c.jpg",
        images: ["attached_assets/chaussures/78e19addb8eb48c09d928574e7c14e9c.jpg"],
        description: "Basket moderne et tendance.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Blanc", "Noir"], featured: false, bestseller: false, sale: true },
    { id: 1006, name: "Chaussures Confort", price: 35.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/81f29e4a500e466a92f9515b3b1e7fcd.jpg",
        images: ["attached_assets/chaussures/81f29e4a500e466a92f9515b3b1e7fcd.jpg"],
        description: "Chaussures confortables pour toute la journée.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Gris", "Noir"], featured: true, bestseller: true, sale: false },
    { id: 1007, name: "Sneakers Premium", price: 54.99, originalPrice: 58.99, category: "chaussures",
        image: "attached_assets/chaussures/954f051d87df4422ae0da222d5ace7dc.jpg",
        images: ["attached_assets/chaussures/954f051d87df4422ae0da222d5ace7dc.jpg"],
        description: "Sneakers premium de haute qualité.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Noir"], featured: true, bestseller: false, sale: true },
    { id: 1008, name: "Chaussures Élégantes", price: 48.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/a07036207fb94742bb1a43c65a6b566d.jpg",
        images: ["attached_assets/chaussures/a07036207fb94742bb1a43c65a6b566d.jpg"],
        description: "Chaussures élégantes pour occasions spéciales.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Noir", "Marron"], featured: false, bestseller: true, sale: false },
    { id: 1009, name: "Basket Sport Performance", price: 44.99, originalPrice: 54.99, category: "chaussures",
        image: "attached_assets/chaussures/a6852d96238541f58e4bc315db73a88f.jpg",
        images: ["attached_assets/chaussures/a6852d96238541f58e4bc315db73a88f.jpg"],
        description: "Basket haute performance pour le sport.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Blanc", "Rouge"], featured: true, bestseller: true, sale: true },
    { id: 1010, name: "Chaussures Décontractées", price: 25.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/a8d0f8278d0f461188759a486b71b81f.jpg",
        images: ["attached_assets/chaussures/a8d0f8278d0f461188759a486b71b81f.jpg"],
        description: "Chaussures décontractées pour tous les jours.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Beige", "Gris"], featured: false, bestseller: false, sale: false },
    { id: 1011, name: "Sneakers Style Unique", price: 57.99, originalPrice: 59, category: "chaussures",
        image: "attached_assets/chaussures/m98593917987_1.jpg",
        images: ["attached_assets/chaussures/m98593917987_1.jpg"],
        description: "Sneakers au style unique et moderne.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Multicolore"], featured: true, bestseller: false, sale: true },
    { id: 1012, name: "Chaussures Mode Urbaine", price: 46.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/images (2).jpeg",
        images: ["attached_assets/chaussures/images (2).jpeg"],
        description: "Chaussures mode urbaine pour un look moderne.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Noir", "Blanc"], featured: true, bestseller: true, sale: false },
    { id: 1013, name: "Basket Design Moderne", price: 43.99, originalPrice: 57.99, category: "chaussures",
        image: "attached_assets/chaussures/images (3).jpeg",
        images: ["attached_assets/chaussures/images (3).jpeg"],
        description: "Basket au design moderne et élégant.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Gris", "Blanc"], featured: false, bestseller: false, sale: true },
    { id: 1014, name: "Chaussures Adimatic Mid", price: 52.99, originalPrice: null, category: "chaussures",
        image: "attached_assets/chaussures/new-pick-up-adidas-adimatic-mid-x-maité-v0-eqkjt66za25c1.jpg",
        images: ["attached_assets/chaussures/new-pick-up-adidas-adimatic-mid-x-maité-v0-eqkjt66za25c1.jpg"],
        description: "Adidas Adimatic Mid pour un style sportif raffiné.", sizes: ["38", "39", "40", "41", "42", "43"], colors: ["Bleu", "Blanc"], featured: true, bestseller: true, sale: false },

    // === MONTRES (6 produits) ===
    { id: 2001, name: "Montre Élégante Classique", price: 99.99, originalPrice: 119.99, category: "montres",
        image: "attached_assets/montres/2e786e3df02c4f55b539145ff0e292c5.jpg",
        images: ["attached_assets/montres/2e786e3df02c4f55b539145ff0e292c5.jpg"],
        description: "Montre classique élégante pour toutes occasions.", sizes: ["One Size"], colors: ["Or", "Argent", "Or Rose"], featured: true, bestseller: true, sale: true },
    { id: 2002, name: "Montre Sport Moderne", price: 75.99, originalPrice: null, category: "montres",
        image: "attached_assets/montres/52ea9b884c4c4dde9b30d17b4c9cc649.jpg",
        images: ["attached_assets/montres/52ea9b884c4c4dde9b30d17b4c9cc649.jpg"],
        description: "Montre sportive moderne avec fonctions avancées.", sizes: ["One Size"], colors: ["Noir", "Bleu"], featured: true, bestseller: false, sale: false },
    { id: 2003, name: "Montre Luxury Premium", price: 119.99, originalPrice: 122, category: "montres",
        image: "attached_assets/montres/643ffa375e9d42bea6871070b57488bc.jpg",
        images: ["attached_assets/montres/643ffa375e9d42bea6871070b57488bc.jpg"],
        description: "Montre de luxe premium avec mouvement suisse.", sizes: ["One Size"], colors: ["Or", "Platine"], featured: true, bestseller: true, sale: true },
    { id: 2004, name: "Montre Casual Quotidien", price: 64.99, originalPrice: null, category: "montres",
        image: "attached_assets/montres/aeaf55190d214a40ae5293f06e5dfbdf.jpg",
        images: ["attached_assets/montres/aeaf55190d214a40ae5293f06e5dfbdf.jpg"],
        description: "Montre casual parfaite pour le quotidien.", sizes: ["One Size"], colors: ["Marron", "Noir"], featured: false, bestseller: true, sale: false },
    { id: 2005, name: "Montre Digitale Tendance", price: 89.99, originalPrice: 109.99, category: "montres",
        image: "attached_assets/montres/ba183f83e5f749cbb762ff7eee61ed40.jpg",
        images: ["attached_assets/montres/ba183f83e5f749cbb762ff7eee61ed40.jpg"],
        description: "Montre digitale tendance avec écran tactile.", sizes: ["One Size"], colors: ["Noir", "Argent"], featured: true, bestseller: false, sale: true },
    { id: 2006, name: "Montre Chronographe Sport", price: 112.99, originalPrice: null, category: "montres",
        image: "attached_assets/montres/ccdc5ecd61c0484798bc871b26eb7758.jpg",
        images: ["attached_assets/montres/ccdc5ecd61c0484798bc871b26eb7758.jpg"],
        description: "Montre chronographe pour les sportifs exigeants.", sizes: ["One Size"], colors: ["Bleu", "Noir"], featured: true, bestseller: true, sale: false },

    // === PERRUQUES (12 produits) ===
    { id: 3001, name: "Perruque Naturelle Longue", price: 189.99, originalPrice: 249.99, category: "perruques",
        image: "attached_assets/perruques/1.jpg",
        images: ["attached_assets/perruques/1.jpg"],
        description: "Perruque cheveux naturels longs pour un look élégant.", sizes: ["One Size"], colors: ["Brun", "Noir", "Blond"], featured: true, bestseller: true, sale: true },
    { id: 3002, name: "Perruque Courte Moderne", price: 109.99, originalPrice: null, category: "perruques",
        image: "attached_assets/perruques/2.jpg",
        images: ["attached_assets/perruques/2.jpg"],
        description: "Perruque courte au style moderne et dynamique.", sizes: ["One Size"], colors: ["Noir", "Brun"], featured: true, bestseller: false, sale: false },
    { id: 3003, name: "Perruque Ondulée Glamour", price: 159.99, originalPrice: 199.99, category: "perruques",
        image: "attached_assets/perruques/3.jpg",
        images: ["attached_assets/perruques/3.jpg"],
        description: "Perruque ondulée pour un look glamour.", sizes: ["One Size"], colors: ["Brun", "Blond"], featured: true, bestseller: true, sale: true },
    { id: 3004, name: "Perruque Bouclée Volume", price: 129.99, originalPrice: null, category: "perruques",
        image: "attached_assets/perruques/4.jpg",
        images: ["attached_assets/perruques/4.jpg"],
        description: "Perruque bouclée avec volume naturel.", sizes: ["One Size"], colors: ["Noir", "Brun"], featured: false, bestseller: true, sale: false },
    { id: 3005, name: "Perruque Lisse Élégante", price: 169.99, originalPrice: 219.99, category: "perruques",
        image: "attached_assets/perruques/5.jpg",
        images: ["attached_assets/perruques/5.jpg"],
        description: "Perruque lisse d'une élégance exceptionnelle.", sizes: ["One Size"], colors: ["Noir", "Brun", "Blond"], featured: true, bestseller: false, sale: true },
    { id: 3006, name: "Perruque Mi-Longue Naturelle", price: 119.99, originalPrice: null, category: "perruques",
        image: "attached_assets/perruques/6.jpg",
        images: ["attached_assets/perruques/6.jpg"],
        description: "Perruque mi-longue aux reflets naturels.", sizes: ["One Size"], colors: ["Châtain", "Brun"], featured: true, bestseller: true, sale: false },
    { id: 3007, name: "Perruque Style Afro", price: 179.99, originalPrice: 229.99, category: "perruques",
        image: "attached_assets/perruques/7.jpg",
        images: ["attached_assets/perruques/7.jpg"],
        description: "Perruque style afro volumineuse.", sizes: ["One Size"], colors: ["Noir", "Brun Foncé"], featured: true, bestseller: true, sale: true },
    { id: 3008, name: "Perruque Tendance Colorée", price: 199.99, originalPrice: null, category: "perruques",
        image: "attached_assets/perruques/8.jpg",
        images: ["attached_assets/perruques/8.jpg"],
        description: "Perruque tendance avec reflets colorés.", sizes: ["One Size"], colors: ["Multicolore"], featured: false, bestseller: false, sale: false },
    { id: 3009, name: "Perruque Bob Chic", price: 99.99, originalPrice: 119.99, category: "perruques",
        image: "attached_assets/perruques/9.jpg",
        images: ["attached_assets/perruques/9.jpg"],
        description: "Coupe bob chic et intemporelle.", sizes: ["One Size"], colors: ["Noir", "Brun"], featured: true, bestseller: false, sale: true },
    { id: 3010, name: "Perruque Luxe Premium", price: 269.99, originalPrice: 289, category: "perruques",
        image: "attached_assets/perruques/10.jpg",
        images: ["attached_assets/perruques/10.jpg"],
        description: "Perruque de luxe haut de gamme.", sizes: ["One Size"], colors: ["Brun Naturel", "Noir"], featured: true, bestseller: true, sale: true },
    { id: 3011, name: "Perruque Dégradée Moderne", price: 144.99, originalPrice: null, category: "perruques",
        image: "attached_assets/perruques/image.jpeg",
        images: ["attached_assets/perruques/image.jpeg"],
        description: "Perruque avec dégradé moderne.", sizes: ["One Size"], colors: ["Brun à Blond"], featured: false, bestseller: true, sale: false },
    { id: 3012, name: "Perruque Style Unique", price: 164.99, originalPrice: 189.99, category: "perruques",
        image: "attached_assets/perruques/images.jpeg",
        images: ["attached_assets/perruques/images.jpeg"],
        description: "Perruque au style unique et original.", sizes: ["One Size"], colors: ["Brun", "Noir"], featured: true, bestseller: false, sale: true },

    // === SACS (17 produits) ===
    { id: 4001, name: "Sac à Main Cuir Premium", price: 169.99, originalPrice: 188, category: "sacs",
        image: "attached_assets/sacs/1000x895.jpg",
        images: ["attached_assets/sacs/1000x895.jpg"],
        description: "Sac à main en cuir véritable de qualité premium.", sizes: ["One Size"], colors: ["Noir", "Marron", "Rouge"], featured: true, bestseller: true, sale: true },
    { id: 4002, name: "Sac Tendance Moderne", price: 44.99, originalPrice: 59.99, category: "sacs",
        image: "attached_assets/sacs/4c06f44a4faa4648b6fd82845af64147.jpg",
        images: ["attached_assets/sacs/4c06f44a4faa4648b6fd82845af64147.jpg"],
        description: "Sac moderne au design contemporain.", sizes: ["One Size"], colors: ["Marron", "Noir"], featured: true, bestseller: false, sale: true },
    { id: 4003, name: "Sac Élégant Soirée", price: 119.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/574797bbd0e243b2b5e36fd3f407588e.jpg",
        images: ["attached_assets/sacs/574797bbd0e243b2b5e36fd3f407588e.jpg"],
        description: "Sac élégant pour les soirées et occasions spéciales.", sizes: ["One Size"], colors: ["Noir", "Or"], featured: true, bestseller: true, sale: false },
    { id: 4004, name: "Sac Bandoulière Chic", price: 49.99, originalPrice: 64.99, category: "sacs",
        image: "attached_assets/sacs/764b7ee3954a46999a877c6a78cedb61.jpg",
        images: ["attached_assets/sacs/764b7ee3954a46999a877c6a78cedb61.jpg"],
        description: "Sac bandoulière chic et pratique.", sizes: ["One Size"], colors: ["Beige", "Marron"], featured: false, bestseller: true, sale: true },
    { id: 4005, name: "Sac Gucci GG Black", price: 179.99, originalPrice: 188, category: "sacs",
        image: "attached_assets/sacs/792456_FADJA_1042_001_087_0000_Light-sac-a-epaule-gg-black-petit-format.jpg",
        images: ["attached_assets/sacs/792456_FADJA_1042_001_087_0000_Light-sac-a-epaule-gg-black-petit-format.jpg"],
        description: "Sac à épaule GG black petit format de luxe.", sizes: ["One Size"], colors: ["Noir"], featured: true, bestseller: true, sale: true },
    { id: 4006, name: "Sac Mode Urbain", price: 39.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/8effcdfb7a0d47de97a3901f43f27a87.jpg",
        images: ["attached_assets/sacs/8effcdfb7a0d47de97a3901f43f27a87.jpg"],
        description: "Sac mode urbain pour un style moderne.", sizes: ["One Size"], colors: ["Noir", "Gris"], featured: true, bestseller: false, sale: false },
    { id: 4007, name: "Sac Cabas Spacieux", price: 47.99, originalPrice: 62.99, category: "sacs",
        image: "attached_assets/sacs/9221_1144776046.jpg",
        images: ["attached_assets/sacs/9221_1144776046.jpg"],
        description: "Sac cabas spacieux pour le quotidien.", sizes: ["One Size"], colors: ["Beige", "Noir"], featured: false, bestseller: false, sale: true },
    { id: 4008, name: "Sac Designer Unique", price: 164.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/9276422cf5f2904dbb9b4339aadee61eacec87c6.jpg",
        images: ["attached_assets/sacs/9276422cf5f2904dbb9b4339aadee61eacec87c6.jpg"],
        description: "Sac designer au style unique.", sizes: ["One Size"], colors: ["Multicolore"], featured: true, bestseller: true, sale: false },
    { id: 4009, name: "Sac Casual Pratique", price: 32.99, originalPrice: 42.99, category: "sacs",
        image: "attached_assets/sacs/cas.jpg",
        images: ["attached_assets/sacs/cas.jpg"],
        description: "Sac casual pratique pour tous les jours.", sizes: ["One Size"], colors: ["Marron", "Beige"], featured: true, bestseller: false, sale: true },
    { id: 4010, name: "Sac Eram Collection", price: 89.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/eram.webp",
        images: ["attached_assets/sacs/eram.webp"],
        description: "Sac de la collection Eram, élégant et raffiné.", sizes: ["One Size"], colors: ["Noir"], featured: false, bestseller: true, sale: false },
    { id: 4011, name: "Sac Moderne Tendance", price: 44.99, originalPrice: 54.99, category: "sacs",
        image: "attached_assets/sacs/images (4).jpeg",
        images: ["attached_assets/sacs/images (4).jpeg"],
        description: "Sac moderne au design tendance.", sizes: ["One Size"], colors: ["Blanc", "Noir"], featured: true, bestseller: true, sale: true },
    { id: 4012, name: "Sac Jane Élégant", price: 104.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/jane.jpg",
        images: ["attached_assets/sacs/jane.jpg"],
        description: "Sac Jane élégant pour toutes occasions.", sizes: ["One Size"], colors: ["Beige", "Marron"], featured: true, bestseller: false, sale: false },
    { id: 4013, name: "Sac Quotidien Chic", price: 37.99, originalPrice: 47.99, category: "sacs",
        image: "attached_assets/sacs/sac.webp",
        images: ["attached_assets/sacs/sac.webp"],
        description: "Sac quotidien chic et pratique.", sizes: ["One Size"], colors: ["Noir", "Gris"], featured: false, bestseller: false, sale: true },
    { id: 4014, name: "Sac Collection Premium", price: 149.99, originalPrice: 179.99, category: "sacs",
        image: "attached_assets/sacs/sacs.webp",
        images: ["attached_assets/sacs/sacs.webp"],
        description: "Sac de la collection premium.", sizes: ["One Size"], colors: ["Marron", "Noir"], featured: true, bestseller: true, sale: true },
    { id: 4015, name: "Sac Luxe Designer", price: 174.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/s-l1200.jpg",
        images: ["attached_assets/sacs/s-l1200.jpg"],
        description: "Sac de luxe designer de haute qualité.", sizes: ["One Size"], colors: ["Or", "Argent"], featured: true, bestseller: true, sale: false },
    { id: 4016, name: "Sac Style Unique", price: 52.99, originalPrice: 69.99, category: "sacs",
        image: "attached_assets/sacs/ssaak.png",
        images: ["attached_assets/sacs/ssaak.png"],
        description: "Sac au style unique et remarquable.", sizes: ["One Size"], colors: ["Multicolore"], featured: false, bestseller: true, sale: true },
    { id: 4017, name: "Sac Tod's Premium", price: 249.99, originalPrice: null, category: "sacs",
        image: "attached_assets/sacs/tods.webp",
        images: ["attached_assets/sacs/tods.webp"],
        description: "Sac Tod's premium de qualité exceptionnelle.", sizes: ["One Size"], colors: ["Marron"], featured: true, bestseller: true, sale: false },

    // === VÊTEMENTS (26 produits) ===
    { id: 5001, name: "Robe Élégante Moderne", price: 125.99, originalPrice: 159.99, category: "vetements",
        image: "attached_assets/vetement/03e65cfb06bb401bb1ea3571712476fa.jpg",
        images: ["attached_assets/vetement/03e65cfb06bb401bb1ea3571712476fa.jpg"],
        description: "Robe élégante au design moderne.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Bleu"], featured: true, bestseller: true, sale: true },
    { id: 5002, name: "Ensemble Casual Chic", price: 89.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/1a69276acc68480f8a91b85151c4b300.jpg",
        images: ["attached_assets/vetement/1a69276acc68480f8a91b85151c4b300.jpg"],
        description: "Ensemble casual chic pour le quotidien.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Blanc", "Beige"], featured: true, bestseller: false, sale: false },
    { id: 5003, name: "Tenue Mode Urbaine", price: 95.99, originalPrice: 125.99, category: "vetements",
        image: "attached_assets/vetement/1cd07605183b491a8540c9fcd7e328e4.jpg",
        images: ["attached_assets/vetement/1cd07605183b491a8540c9fcd7e328e4.jpg"],
        description: "Tenue mode urbaine tendance.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Gris"], featured: false, bestseller: true, sale: true },
    { id: 5004, name: "Robe Soirée Glamour", price: 149.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/3a3baee4a2d5434f8eecfff1126640dc.jpg",
        images: ["attached_assets/vetement/3a3baee4a2d5434f8eecfff1126640dc.jpg"],
        description: "Robe de soirée glamour et sophistiquée.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Rouge", "Noir"], featured: true, bestseller: true, sale: false },
    { id: 5005, name: "Tenue Décontractée Femme", price: 79.99, originalPrice: 99.99, category: "vetements",
        image: "attached_assets/vetement/3f5330b83d244b89813f126c93bc6c86.jpg",
        images: ["attached_assets/vetement/3f5330b83d244b89813f126c93bc6c86.jpg"],
        description: "Tenue décontractée confortable.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Bleu", "Blanc"], featured: true, bestseller: false, sale: true },
    { id: 5006, name: "Ensemble Moderne Tendance", price: 109.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/4e29e6eeaae547ef89a4a579c6562f55.jpg",
        images: ["attached_assets/vetement/4e29e6eeaae547ef89a4a579c6562f55.jpg"],
        description: "Ensemble moderne et tendance.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Beige"], featured: false, bestseller: true, sale: false },
    { id: 5007, name: "Robe Casual Élégante", price: 85.99, originalPrice: 115.99, category: "vetements",
        image: "attached_assets/vetement/5a607210b5b04572acd7e8fc4a787eca.jpg",
        images: ["attached_assets/vetement/5a607210b5b04572acd7e8fc4a787eca.jpg"],
        description: "Robe casual élégante pour toutes occasions.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Beige", "Blanc"], featured: true, bestseller: true, sale: true },
    { id: 5008, name: "Chemise Classic Homme", price: 65.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/613+tot5pML._AC_SL1200_.jpg",
        images: ["attached_assets/vetement/613+tot5pML._AC_SL1200_.jpg"],
        description: "Chemise classique pour homme.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Blanc", "Bleu"], featured: true, bestseller: false, sale: false },
    { id: 5009, name: "Tenue Sport Femme", price: 75.99, originalPrice: 95.99, category: "vetements",
        image: "attached_assets/vetement/613uQE 56VL._AC_UY350_.jpg",
        images: ["attached_assets/vetement/613uQE 56VL._AC_UY350_.jpg"],
        description: "Tenue sport confortable pour femme.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Rose", "Noir"], featured: false, bestseller: false, sale: true },
    { id: 5010, name: "Pantalon Élégant Homme", price: 89.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/61KkAWEFzuL._AC_SL1500_.jpg",
        images: ["attached_assets/vetement/61KkAWEFzuL._AC_SL1500_.jpg"],
        description: "Pantalon élégant pour homme.", sizes: ["28", "30", "32", "34", "36", "38"], colors: ["Noir", "Gris"], featured: true, bestseller: true, sale: false },
    { id: 5011, name: "Polo Classic Homme", price: 55.99, originalPrice: 69.99, category: "vetements",
        image: "attached_assets/vetement/61Zw7NrauNL._AC_SL1500_.jpg",
        images: ["attached_assets/vetement/61Zw7NrauNL._AC_SL1500_.jpg"],
        description: "Polo classique confortable.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Bleu", "Blanc"], featured: true, bestseller: false, sale: true },
    { id: 5012, name: "Robe Tendance Moderne", price: 99.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/8c848ede7f1346edbe4a504f52bbef04.jpg",
        images: ["attached_assets/vetement/8c848ede7f1346edbe4a504f52bbef04.jpg"],
        description: "Robe tendance au design moderne.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Blanc"], featured: false, bestseller: true, sale: false },
    { id: 5013, name: "Ensemble Femme Élégant", price: 119.99, originalPrice: 149.99, category: "vetements",
        image: "attached_assets/vetement/91886239ebab479899e424689987d560.jpg",
        images: ["attached_assets/vetement/91886239ebab479899e424689987d560.jpg"],
        description: "Ensemble femme élégant et raffiné.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Beige", "Noir"], featured: true, bestseller: true, sale: true },
    { id: 5014, name: "Tenue Moderne Casual", price: 79.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/c246717f079a4985b1d13ea706ce00d9.jpg",
        images: ["attached_assets/vetement/c246717f079a4985b1d13ea706ce00d9.jpg"],
        description: "Tenue moderne casual pour tous les jours.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Blanc", "Gris"], featured: true, bestseller: false, sale: false },
    { id: 5015, name: "Robe Chic Femme", price: 105.99, originalPrice: 135.99, category: "vetements",
        image: "attached_assets/vetement/d7343869fa6a4144832e09cbc2a6b257.jpg",
        images: ["attached_assets/vetement/d7343869fa6a4144832e09cbc2a6b257.jpg"],
        description: "Robe chic pour femme élégante.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Rouge"], featured: false, bestseller: true, sale: true },
    { id: 5016, name: "Ensemble Sport Moderne", price: 95.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/dbf28fdf94eb4b49b29853f1a9cf4c60.jpg",
        images: ["attached_assets/vetement/dbf28fdf94eb4b49b29853f1a9cf4c60.jpg"],
        description: "Ensemble sport moderne et confortable.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Bleu"], featured: true, bestseller: true, sale: false },
    { id: 5017, name: "Tenue Élégante Soirée", price: 139.99, originalPrice: 179.99, category: "vetements",
        image: "attached_assets/vetement/dda0c53e981946efb02608b1cf4e9aff.jpg",
        images: ["attached_assets/vetement/dda0c53e981946efb02608b1cf4e9aff.jpg"],
        description: "Tenue élégante pour soirée.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Or"], featured: true, bestseller: false, sale: true },
    { id: 5018, name: "Robe Moderne Femme", price: 89.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/df9a2b2f984c47eb8f58bd328b2320b4.jpg",
        images: ["attached_assets/vetement/df9a2b2f984c47eb8f58bd328b2320b4.jpg"],
        description: "Robe moderne pour femme active.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Bleu", "Blanc"], featured: false, bestseller: false, sale: false },
    { id: 5019, name: "Robe Enfant Princesse", price: 45.99, originalPrice: 59.99, category: "vetements",
        image: "attached_assets/vetement/enfant.jpg",
        images: ["attached_assets/vetement/enfant.jpg"],
        description: "Robe princesse pour enfant.", sizes: ["2T", "3T", "4T", "5T", "6T"], colors: ["Rose", "Bleu"], featured: true, bestseller: true, sale: true },
    { id: 5020, name: "Veste Enfant Moderne", price: 55.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/enfantt.webp",
        images: ["attached_assets/vetement/enfantt.webp"],
        description: "Veste moderne pour enfant.", sizes: ["2T", "3T", "4T", "5T", "6T"], colors: ["Bleu", "Noir"], featured: true, bestseller: false, sale: false },
    { id: 5021, name: "Ensemble Enfant Casual", price: 39.99, originalPrice: 49.99, category: "vetements",
        image: "attached_assets/vetement/enffant.jpg",
        images: ["attached_assets/vetement/enffant.jpg"],
        description: "Ensemble casual pour enfant.", sizes: ["2T", "3T", "4T", "5T", "6T"], colors: ["Blanc", "Gris"], featured: false, bestseller: true, sale: true },
    { id: 5022, name: "Tenue Style Professionnel", price: 129.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/f906f1f7c3f547289139f0bd12f4d4b6.jpg",
        images: ["attached_assets/vetement/f906f1f7c3f547289139f0bd12f4d4b6.jpg"],
        description: "Tenue style professionnel élégant.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Noir", "Marine"], featured: true, bestseller: true, sale: false },
    { id: 5023, name: "Robe Casual Quotidien", price: 69.99, originalPrice: 89.99, category: "vetements",
        image: "attached_assets/vetement/fd8633ce850b4eccac8eb2f73eaabff2.jpg",
        images: ["attached_assets/vetement/fd8633ce850b4eccac8eb2f73eaabff2.jpg"],
        description: "Robe casual pour le quotidien.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Beige", "Blanc"], featured: true, bestseller: false, sale: true },
    { id: 5024, name: "Ensemble Homme Tendance", price: 115.99, originalPrice: 145.99, category: "vetements",
        image: "attached_assets/vetement/OUTFITTERY_10Y_Day1_1288_9335-683x1024.jpg",
        images: ["attached_assets/vetement/OUTFITTERY_10Y_Day1_1288_9335-683x1024.jpg"],
        description: "Ensemble homme tendance et moderne.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Bleu", "Gris"], featured: false, bestseller: true, sale: true },
    { id: 5025, name: "Tenue Femme Chic", price: 105.99, originalPrice: null, category: "vetements",
        image: "attached_assets/vetement/51WxBImyzpL._AC_SX522_.jpg",
        images: ["attached_assets/vetement/51WxBImyzpL._AC_SX522_.jpg"],
        description: "Tenue femme chic et élégante.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Blanc", "Noir"], featured: true, bestseller: true, sale: false },
    { id: 5026, name: "Robe Longue Grande Taille", price: 135.99, originalPrice: 169.99, category: "vetements",
        image: "attached_assets/vetement/robe-longue-grande-taille-femme.jpg",
        images: ["attached_assets/vetement/robe-longue-grande-taille-femme.jpg"],
        description: "Robe longue grande taille élégante.", sizes: ["L", "XL", "XXL", "XXXL"], colors: ["Noir", "Bleu"], featured: true, bestseller: true, sale: true },

    // === ÉLECTROMÉNAGER (6 produits - pour les cards surplus) ===
    { id: 6001, name: "Appareil Cuisine Premium", price: 38.99, originalPrice: 40, category: "electromenager",
        image: "attached_assets/électroménager/2982505-1_1.jpg",
        images: ["attached_assets/électroménager/2982505-1_1.jpg"],
        description: "Appareil de cuisine premium haute performance.", sizes: ["One Size"], colors: ["Inox", "Noir"], featured: true, bestseller: true, sale: true },
    { id: 6002, name: "Électroménager Moderne", price: 32.99, originalPrice: null, category: "electromenager",
        image: "attached_assets/électroménager/ASSET_MMS_104162091.webp",
        images: ["attached_assets/électroménager/ASSET_MMS_104162091.webp"],
        description: "Électroménager moderne pour cuisine équipée.", sizes: ["One Size"], colors: ["Blanc", "Inox"], featured: true, bestseller: false, sale: false },
    { id: 6003, name: "Appareil Digital Premium", price: 29.99, originalPrice: 37.99, category: "electromenager",
        image: "attached_assets/électroménager/Digital-MLX_LM4305_7211003233_H1.png",
        images: ["attached_assets/électroménager/Digital-MLX_LM4305_7211003233_H1.png"],
        description: "Appareil digital avec fonctions avancées.", sizes: ["One Size"], colors: ["Inox"], featured: true, bestseller: true, sale: true },
    { id: 6004, name: "Électroménager Économique", price: 25.99, originalPrice: null, category: "electromenager",
        image: "attached_assets/électroménager/electromenager-energivore.jpg",
        images: ["attached_assets/électroménager/electromenager-energivore.jpg"],
        description: "Électroménager économique et performant.", sizes: ["One Size"], colors: ["Blanc"], featured: false, bestseller: true, sale: false },
    { id: 6005, name: "Appareil Entretien Pro", price: 31.99, originalPrice: 39.99, category: "electromenager",
        image: "attached_assets/électroménager/entretien_appareils.jpg",
        images: ["attached_assets/électroménager/entretien_appareils.jpg"],
        description: "Appareil d'entretien professionnel.", sizes: ["One Size"], colors: ["Gris", "Noir"], featured: true, bestseller: false, sale: true },
    { id: 6006, name: "Électroménager Multifonction", price: 35.99, originalPrice: null, category: "electromenager",
        image: "attached_assets/électroménager/images (1).jpeg",
        images: ["attached_assets/électroménager/images (1).jpeg"],
        description: "Électroménager multifonction pour cuisine moderne.", sizes: ["One Size"], colors: ["Inox", "Blanc"], featured: true, bestseller: true, sale: false },

    // === VESTES (16 produits) ===
    { id: 7001, name: "Veste Élégante Premium", price: 129.99, originalPrice: 159.99, category: "vestes",
        image: "attached_assets/veste/3cd4cb095f5013b4bdb7445e176df52d.jpg",
        images: ["attached_assets/veste/3cd4cb095f5013b4bdb7445e176df52d.jpg"],
        description: "Veste élégante premium de haute qualité.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Bleu Marine"], featured: true, bestseller: true, sale: true },
    { id: 7002, name: "Veste Moderne Casual", price: 89.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.46.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.46.jpeg"],
        description: "Veste moderne pour un style casual chic.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Beige", "Marron"], featured: true, bestseller: false, sale: false },
    { id: 7003, name: "Veste Sport Tendance", price: 95.99, originalPrice: 119.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.47 (1).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.47 (1).jpeg"],
        description: "Veste sport tendance et confortable.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Gris"], featured: false, bestseller: true, sale: true },
    { id: 7004, name: "Veste Classique Homme", price: 109.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.47.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.47.jpeg"],
        description: "Veste classique pour homme élégant.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Bleu", "Noir"], featured: true, bestseller: true, sale: false },
    { id: 7005, name: "Veste Décontractée Style", price: 79.99, originalPrice: 99.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.48 (1).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.48 (1).jpeg"],
        description: "Veste décontractée au style moderne.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Vert", "Kaki"], featured: true, bestseller: false, sale: true },
    { id: 7006, name: "Veste Urban Chic", price: 99.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.48 (2).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.48 (2).jpeg"],
        description: "Veste urban chic pour la ville.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Gris Foncé"], featured: false, bestseller: true, sale: false },
    { id: 7007, name: "Veste Printemps Légère", price: 74.99, originalPrice: 94.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.48.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.48.jpeg"],
        description: "Veste légère parfaite pour le printemps.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Blanc", "Beige"], featured: true, bestseller: true, sale: true },
    { id: 7008, name: "Veste Hiver Chaude", price: 139.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.49 (1).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.49 (1).jpeg"],
        description: "Veste chaude pour l'hiver.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Marine"], featured: true, bestseller: false, sale: false },
    { id: 7009, name: "Veste Cuir Premium", price: 189.99, originalPrice: 229.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.49 (2).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.49 (2).jpeg"],
        description: "Veste en cuir premium de luxe.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Marron"], featured: true, bestseller: true, sale: true },
    { id: 7010, name: "Veste Bomber Moderne", price: 84.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.49.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.54.49.jpeg"],
        description: "Veste bomber au style moderne.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Vert Olive", "Noir"], featured: false, bestseller: true, sale: false },
    { id: 7011, name: "Veste Blazer Élégant", price: 119.99, originalPrice: 149.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.40.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.40.jpeg"],
        description: "Blazer élégant pour occasions formelles.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Bleu Marine", "Gris"], featured: true, bestseller: true, sale: true },
    { id: 7012, name: "Veste Denim Tendance", price: 69.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.41 (1).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.41 (1).jpeg"],
        description: "Veste en denim tendance.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Bleu Jean", "Noir"], featured: true, bestseller: false, sale: false },
    { id: 7013, name: "Veste Parka Style", price: 149.99, originalPrice: 189.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.41 (2).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.41 (2).jpeg"],
        description: "Parka style urbain avec capuche.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Kaki", "Noir"], featured: false, bestseller: true, sale: true },
    { id: 7014, name: "Veste Technique Sport", price: 94.99, originalPrice: null, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.41.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.41.jpeg"],
        description: "Veste technique pour le sport.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Bleu"], featured: true, bestseller: true, sale: false },
    { id: 7015, name: "Veste Capuche Moderne", price: 79.99, originalPrice: 99.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.42 (1).jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.42 (1).jpeg"],
        description: "Veste à capuche moderne et confortable.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Gris", "Noir"], featured: true, bestseller: false, sale: true },
    { id: 7016, name: "Veste Designer Luxe", price: 199.99, originalPrice: 249.99, category: "vestes",
        image: "attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.42.jpeg",
        images: ["attached_assets/veste/WhatsApp Image 2025-10-06 at 10.59.42.jpeg"],
        description: "Veste designer de luxe exclusive.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Noir", "Bleu Marine"], featured: true, bestseller: true, sale: true }
];

// Initialize products
products = sampleProducts;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupEventListeners();
    updateCartUI();
    
    // Load content based on current page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('index.html') || currentPath === '/') {
        loadHomePage();
    } else if (currentPath.includes('shop.html')) {
        loadShopPage();
    } else if (currentPath.includes('product.html')) {
        loadProductPage();
    } else if (currentPath.includes('cart.html')) {
        loadCartPage();
    } else if (currentPath.includes('contact.html')) {
        loadContactPage();
    } else if (currentPath.includes('perruques.html')) {
        loadCategoryPage('perruques');
    } else if (currentPath.includes('sacs.html')) {
        loadCategoryPage('sacs');
    } else if (currentPath.includes('vestes.html')) {
        loadCategoryPage('vestes');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuBtn && mobileMenu) {
        // Fonction pour fermer le menu
        const closeMobileMenu = () => {
            mobileMenu.classList.remove('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
            }
        };

        // Ouvrir le menu
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.add('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('active');
            }
        });
        
        // Fermer le menu
        [mobileMenuClose, mobileMenuOverlay].forEach(element => {
            if (element) {
                element.addEventListener('click', closeMobileMenu);
            }
        });

        // Fermer le menu quand on clique sur un lien de navigation
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Marquer la page active dans le menu mobile
        const setActiveMobileNavItem = () => {
            const currentPath = window.location.pathname;
            const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav a');
            
            mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                
                if (href === 'index.html' && (currentPath === '/' || currentPath.includes('index.html'))) {
                    link.classList.add('active');
                } else if (href && currentPath.includes(href)) {
                    link.classList.add('active');
                }
            });
        };

        // Appeler la fonction au chargement et quand le menu s'ouvre
        setActiveMobileNavItem();
        mobileMenuBtn.addEventListener('click', setActiveMobileNavItem);
    }
    
    // Quick view modal
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalClose = modal.querySelector('.modal-close');
        
        [modalOverlay, modalClose].forEach(element => {
            if (element) {
                element.addEventListener('click', closeQuickView);
            }
        });
        
        // Quantity controls in modal
        const decreaseBtn = modal.querySelector('[data-testid="modal-decrease-quantity"]');
        const increaseBtn = modal.querySelector('[data-testid="modal-increase-quantity"]');
        const quantityInput = modal.querySelector('[data-testid="modal-quantity-input"]');
        
        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => updateModalQuantity(-1));
            increaseBtn.addEventListener('click', () => updateModalQuantity(1));
            quantityInput.addEventListener('change', updateModalQuantityInput);
        }
        
        // Add to cart from modal
        const addToCartBtn = modal.querySelector('#modalAddToCart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', addToCartFromModal);
        }
    }
}

// Home Page Functions
function loadHomePage() {
    loadNewArrivals();
    loadBestsellers();
}

function loadNewArrivals() {
    const container = document.getElementById('new-arrivals-grid');
    if (!container) return;
    
    const newArrivals = products.filter(product => product.featured).slice(0, 3);
    container.innerHTML = newArrivals.map(product => createProductCard(product)).join('');
    setupProductCardEvents(container);
}

function loadBestsellers() {
    const container = document.getElementById('bestsellers-grid');
    if (!container) return;
    
    const bestsellers = products.filter(product => product.bestseller).slice(0, 3);
    container.innerHTML = bestsellers.map(product => createProductCard(product)).join('');
    setupProductCardEvents(container);
}

// Shop Page Functions
function loadShopPage() {
    setupFilters();
    setupSorting();
    setupPagination();
    applyURLParams();
    renderProducts();
}

function setupFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('[data-testid^="filter-category"]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', handleCategoryFilter);
    });
    
    // Price filters
    const priceFilters = document.querySelectorAll('[name="price"]');
    priceFilters.forEach(filter => {
        filter.addEventListener('change', handlePriceFilter);
    });
    
    // Sale filter
    const saleFilter = document.querySelector('[data-testid="filter-sale"]');
    if (saleFilter) {
        saleFilter.addEventListener('change', handleSaleFilter);
    }
    
    // Clear filters
    const clearFilters = document.querySelector('[data-testid="clear-filters"]');
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
}

function setupSorting() {
    const sortSelect = document.querySelector('[data-testid="sort-select"]');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

function setupPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.addEventListener('click', () => changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePage(1));
}

function applyURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Apply category filter from URL
    const category = urlParams.get('category');
    if (category) {
        currentFilters.category = [category];
        const checkbox = document.querySelector(`[data-testid="filter-category-${category}"]`);
        if (checkbox) checkbox.checked = true;
    }
    
    // Apply sale filter from URL
    const sale = urlParams.get('sale');
    if (sale === 'true') {
        currentFilters.sale = true;
        const checkbox = document.querySelector('[data-testid="filter-sale"]');
        if (checkbox) checkbox.checked = true;
    }
}

function handleCategoryFilter(event) {
    const category = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        if (!currentFilters.category.includes(category)) {
            currentFilters.category.push(category);
        }
    } else {
        currentFilters.category = currentFilters.category.filter(c => c !== category);
    }
    
    currentPage = 1;
    renderProducts();
}

function handlePriceFilter(event) {
    currentFilters.price = event.target.value;
    currentPage = 1;
    renderProducts();
}

function handleSaleFilter(event) {
    currentFilters.sale = event.target.checked;
    currentPage = 1;
    renderProducts();
}

function handleSortChange(event) {
    const sortValue = event.target.value;
    sortProducts(sortValue);
    renderProducts();
}

function clearAllFilters() {
    // Reset filters
    currentFilters = {
        category: [],
        price: '',
        sale: false
    };
    
    // Reset UI
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
    
    currentPage = 1;
    renderProducts();
}

function sortProducts(sortType) {
    switch (sortType) {
        case 'price-low-high':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            products.sort((a, b) => b.id - a.id);
            break;
        default:
            // Reset to original order
            products = [...sampleProducts];
    }
}

function getFilteredProducts() {
    let filtered = [...products];
    
    // Category filter
    if (currentFilters.category.length > 0) {
        filtered = filtered.filter(product => 
            currentFilters.category.includes(product.category)
        );
    }
    
    // Price filter
    if (currentFilters.price) {
        const [min, max] = currentFilters.price.split('-').map(p => 
            p.replace('+', '').trim() === '' ? Infinity : parseInt(p.replace('+', ''))
        );
        filtered = filtered.filter(product => {
            if (max === undefined || max === Infinity) {
                return product.price >= min;
            }
            return product.price >= min && product.price <= max;
        });
    }
    
    // Sale filter
    if (currentFilters.sale) {
        filtered = filtered.filter(product => product.sale);
    }
    
    return filtered;
}

function renderProducts() {
    const container = document.getElementById('shop-products-grid');
    const noProductsDiv = document.getElementById('no-products');
    const productCountSpan = document.querySelector('[data-testid="product-count"]');
    
    if (!container) return;
    
    const filteredProducts = getFilteredProducts();
    const totalProducts = filteredProducts.length;
    
    if (totalProducts === 0) {
        container.style.display = 'none';
        if (noProductsDiv) noProductsDiv.style.display = 'block';
        updatePaginationUI(0, 0);
        return;
    }
    
    container.style.display = 'grid';
    if (noProductsDiv) noProductsDiv.style.display = 'none';
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Render products
    container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
    setupProductCardEvents(container);
    
    // Update UI
    if (productCountSpan) {
        const start = totalProducts > 0 ? startIndex + 1 : 0;
        const end = Math.min(endIndex, totalProducts);
        productCountSpan.textContent = `Showing ${start}-${end} of ${totalProducts} products`;
    }
    
    updatePaginationUI(totalProducts, paginatedProducts.length);
}

function updatePaginationUI(totalProducts, currentPageItems) {
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const numbersContainer = document.getElementById('pagination-numbers');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    if (numbersContainer) {
        numbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
            });
            numbersContainer.appendChild(btn);
        }
    }
}

function changePage(direction) {
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProducts();
    }
}

// Product Page Functions
function loadProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        // Redirect to shop if no product ID
        window.location.href = 'shop.html';
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        // Redirect to shop if product not found
        window.location.href = 'shop.html';
        return;
    }
    
    renderProductDetails(product);
    setupProductPageEvents(product);
}

function renderProductDetails(product) {
    // Update breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
    
    // Update main image
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }
    
    // Update image gallery
    const gallery = document.getElementById('imageGallery');
    if (gallery && product.images) {
        gallery.innerHTML = product.images.map((img, index) => `
            <button onclick="changeMainImage('${img}')" class="${index === 0 ? 'active' : ''}">
                <img src="${img}" alt="${product.name}">
            </button>
        `).join('');
    }
    
    // Update product info
    const nameEl = document.getElementById('productName');
    const priceEl = document.getElementById('productPrice');
    const originalPriceEl = document.getElementById('productOriginalPrice');
    const savingsEl = document.getElementById('productSavings');
    const descriptionEl = document.getElementById('productDescription');
    
    if (nameEl) nameEl.textContent = product.name;
    if (priceEl) priceEl.textContent = `${product.price.toFixed(2)}`;
    if (descriptionEl) descriptionEl.textContent = product.description;
    
    if (product.originalPrice && originalPriceEl && savingsEl) {
        originalPriceEl.textContent = `${product.originalPrice.toFixed(2)}`;
        originalPriceEl.style.display = 'inline';
        
        const savings = product.originalPrice - product.price;
        const savingsPercent = Math.round((savings / product.originalPrice) * 100);
        savingsEl.textContent = `Save ${savingsPercent}%`;
        savingsEl.style.display = 'inline';
    }
    
    // Show sale badge
    const saleBadge = document.getElementById('productSaleBadge');
    if (saleBadge && product.sale) {
        saleBadge.style.display = 'block';
    }
    
    // Update sizes
    const sizesContainer = document.getElementById('sizeOptions');
    if (sizesContainer && product.sizes) {
        sizesContainer.innerHTML = product.sizes.map(size => `
            <button class="size-option" data-size="${size}">${size}</button>
        `).join('');
        
        // Add size selection events
        sizesContainer.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', () => selectSize(btn));
        });
    }
    
    // Update colors
    const colorsContainer = document.getElementById('colorOptions');
    const colorOption = document.getElementById('colorOption');
    if (colorsContainer && product.colors && product.colors.length > 1) {
        colorOption.style.display = 'block';
        colorsContainer.innerHTML = product.colors.map(color => `
            <button class="color-option" data-color="${color}">${color}</button>
        `).join('');
        
        // Add color selection events
        colorsContainer.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => selectColor(btn));
        });
    }
    
    // Update total price
    updateProductTotalPrice(product.price);
}

function setupProductPageEvents(product) {
    // Quantity controls
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');
    const quantityInput = document.getElementById('quantityInput');
    
    if (decreaseBtn) decreaseBtn.addEventListener('click', () => updateQuantity(-1));
    if (increaseBtn) increaseBtn.addEventListener('click', () => updateQuantity(1));
    if (quantityInput) quantityInput.addEventListener('change', updateQuantityInput);
    
    // Add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => addToCartFromProduct(product));
    }
    
    // Product tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    const gallery = document.getElementById('imageGallery');
    if (gallery) {
        gallery.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        gallery.querySelector(`button img[src="${imageSrc}"]`)?.parentElement.classList.add('active');
    }
}

function selectSize(button) {
    // Remove active class from all size buttons
    document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('selected'));
    // Add active class to clicked button
    button.classList.add('selected');
}

function selectColor(button) {
    // Remove active class from all color buttons
    document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('selected'));
    // Add active class to clicked button
    button.classList.add('selected');
}

function updateQuantity(change) {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        const currentQuantity = parseInt(quantityInput.value) || 1;
        const newQuantity = Math.max(1, currentQuantity + change);
        quantityInput.value = newQuantity;
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);
        if (product) {
            updateProductTotalPrice(product.price * newQuantity);
        }
    }
}

function updateQuantityInput() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        const quantity = Math.max(1, parseInt(quantityInput.value) || 1);
        quantityInput.value = quantity;
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);
        if (product) {
            updateProductTotalPrice(product.price * quantity);
        }
    }
}

function updateProductTotalPrice(total) {
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = total.toFixed(2);
    }
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function addToCartFromProduct(product) {
    const quantityInput = document.getElementById('quantityInput');
    const selectedSize = document.querySelector('.size-option.selected');
    
    // Validate required fields
    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }
    
    const quantity = parseInt(quantityInput?.value) || 1;
    const selectedColor = document.querySelector('.color-option.selected');
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize.dataset.size,
        color: selectedColor?.dataset.color || product.colors[0],
        quantity: quantity
    };
    
    addToCart(cartItem);
    showToast('Product added to cart!', 'success');
}

// Cart Functions
function loadCartPage() {
    renderCartItems();
    updateCartSummary();
    setupCartEvents();
}

function setupCartEvents() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
}

function renderCartItems() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartItemCount = document.getElementById('cartItemCount');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'flex';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
    if (cartItemCount) cartItemCount.textContent = cart.length;
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" onclick="goToProduct(${item.id})">
                <div class="cart-item-details">
                    <h3 class="cart-item-name" onclick="goToProduct(${item.id})">${item.name}</h3>
                    <div class="cart-item-meta">Size: ${item.size} ${item.color ? `• Color: ${item.color}` : ''}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-quantity-controls">
                    <button onclick="updateCartItemQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="cart-remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');
    const freeShippingNotice = document.getElementById('freeShippingNotice');
    
    if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)}`;
    
    if (freeShippingNotice) {
        freeShippingNotice.style.display = shipping === 0 ? 'flex' : 'none';
    }
}

function updateCartItemQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
        saveCart();
        renderCartItems();
        updateCartSummary();
        updateCartUI();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    updateCartSummary();
    updateCartUI();
    showToast('Item removed from cart', 'success');
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        renderCartItems();
        updateCartSummary();
        updateCartUI();
        showToast('Cart cleared', 'success');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Votre panier est vide', 'error');
        return;
    }
    
    // Generate order number
    currentPaymentData.orderNumber = 'SC' + Date.now().toString().slice(-8);
    
    // Prepare order details
    const total = calculateCartTotal();
    currentPaymentData.orderDetails = {
        orderNumber: currentPaymentData.orderNumber,
        items: cart.map(item => ({
            name: item.name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: (item.price * item.quantity).toFixed(2)
        })),
        subtotal: total.subtotal.toFixed(2),
        shipping: total.shipping.toFixed(2),
        tax: total.tax.toFixed(2),
        total: total.total.toFixed(2)
    };
    
    // Open payment method selection modal
    openPaymentModal();
}

function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Category Page Functions
function loadCategoryPage(...categories) {
    setupFilters();
    setupSorting();
    setupPagination();
    renderCategoryProducts(categories);
}

function renderCategoryProducts(categories) {
    const container = document.getElementById('perruques-grid') || 
                     document.getElementById('vetements-grid') || 
                     document.getElementById('sacs-grid');
    const noProductsDiv = document.getElementById('no-products');
    const productCountSpan = document.querySelector('[data-testid="product-count"]');
    
    if (!container) return;
    
    // Filter products by categories
    const filteredProducts = products.filter(product => 
        categories.includes(product.category)
    );
    
    const totalProducts = filteredProducts.length;
    
    if (totalProducts === 0) {
        container.style.display = 'none';
        if (noProductsDiv) noProductsDiv.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    if (noProductsDiv) noProductsDiv.style.display = 'none';
    
    // Render products
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    setupProductCardEvents(container);
    
    // Update product count
    if (productCountSpan) {
        productCountSpan.textContent = `Affichage de 1-${totalProducts} sur ${totalProducts} produits`;
    }
}

// Contact Page Functions
function loadContactPage() {
    setupContactForm();
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Reset previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    let hasErrors = false;
    
    // Validate name
    if (!name) {
        showFieldError('nameError', 'Name is required');
        hasErrors = true;
    }
    
    // Validate email
    if (!email) {
        showFieldError('emailError', 'Email is required');
        hasErrors = true;
    } else if (!isValidEmail(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        hasErrors = true;
    }
    
    // Validate message
    if (!message) {
        showFieldError('messageError', 'Message is required');
        hasErrors = true;
    } else if (message.length < 10) {
        showFieldError('messageError', 'Message must be at least 10 characters long');
        hasErrors = true;
    }
    
    if (hasErrors) return;
    
    // Submit form
    submitContactForm(name, email, message);
}

function showFieldError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(name, email, message) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        // Show success message
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    }, 2000);
}

// Utility Functions
function createProductCard(product) {
    const salePrice = product.originalPrice ? 
        `<span class="original-price">${product.originalPrice.toFixed(2)}$</span>` : '';
    const saleBadge = product.sale ? '<div class="sale-badge">Promo!</div>' : '';
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${saleBadge}
                <button class="quick-view-btn" onclick="openQuickView(${product.id})">Aperçu rapide</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="price">${product.price.toFixed(2)}$</span>
                    ${salePrice}
                </div>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCartFromCard(${product.id})" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Ajouter au panier
                </button>
            </div>
        </div>
    `;
}

function setupProductCardEvents(container) {
    const productCards = container.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (event) => {
            // Don't navigate if clicking quick view button or add to cart button
            if (event.target.classList.contains('quick-view-btn') || 
                event.target.classList.contains('add-to-cart-btn') ||
                event.target.closest('.add-to-cart-btn')) return;
            
            const productId = card.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

// Function to add product to cart from product card
function addToCartFromCard(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Simplified cart item - no size/color selection, just add directly
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: 'Standard', // Default size for all products
        color: 'Standard', // Default color for all products
        quantity: 1
    };
    
    addToCart(cartItem);
    showToast(`${product.name} ajouté au panier !`, 'success');
}

// Make the function globally accessible for onclick handlers
window.addToCartFromCard = addToCartFromCard;
window.openQuickView = openQuickView;
window.closePaymentModal = closePaymentModal;
window.selectPaymentMethod = selectPaymentMethod;
window.closeMobilePaymentModal = closeMobilePaymentModal;

// Quick View Modal Functions
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    // Populate modal with product data
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalOriginalPrice = document.getElementById('modalProductOriginalPrice');
    const modalSizeOptions = document.getElementById('modalSizeOptions');
    const modalColorOptions = document.getElementById('modalColorOptions');
    
    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = product.name;
    }
    if (modalName) modalName.textContent = product.name;
    if (modalPrice) modalPrice.textContent = `${product.price.toFixed(2)}`;
    
    if (modalOriginalPrice) {
        if (product.originalPrice) {
            modalOriginalPrice.textContent = `${product.originalPrice.toFixed(2)}`;
            modalOriginalPrice.style.display = 'inline';
        } else {
            modalOriginalPrice.style.display = 'none';
        }
    }
    
    // Populate sizes
    if (modalSizeOptions) {
        modalSizeOptions.innerHTML = product.sizes.map(size => `
            <button class="size-option" data-size="${size}">${size}</button>
        `).join('');
        
        modalSizeOptions.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', () => selectModalSize(btn));
        });
    }
    
    // Populate colors
    if (modalColorOptions && product.colors.length > 1) {
        modalColorOptions.parentElement.style.display = 'block';
        modalColorOptions.innerHTML = product.colors.map(color => `
            <button class="color-option" data-color="${color}">${color}</button>
        `).join('');
        
        modalColorOptions.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => selectModalColor(btn));
        });
    } else if (modalColorOptions) {
        modalColorOptions.parentElement.style.display = 'none';
    }
    
    // Store product ID for add to cart
    modal.dataset.productId = productId;
    
    // Reset quantity
    const quantityInput = modal.querySelector('[data-testid="modal-quantity-input"]');
    if (quantityInput) quantityInput.value = 1;
    
    // Show modal
    modal.classList.add('active');
    
    // Setup view details button
    const viewDetailsBtn = document.getElementById('modalViewDetails');
    if (viewDetailsBtn) {
        viewDetailsBtn.onclick = () => {
            closeQuickView();
            window.location.href = `product.html?id=${productId}`;
        };
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset selections
        modal.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    }
}

function selectModalSize(button) {
    document.querySelectorAll('#modalSizeOptions .size-option').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function selectModalColor(button) {
    document.querySelectorAll('#modalColorOptions .color-option').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function updateModalQuantity(change) {
    const quantityInput = document.querySelector('[data-testid="modal-quantity-input"]');
    if (quantityInput) {
        const currentQuantity = parseInt(quantityInput.value) || 1;
        const newQuantity = Math.max(1, currentQuantity + change);
        quantityInput.value = newQuantity;
    }
}

function updateModalQuantityInput() {
    const quantityInput = document.querySelector('[data-testid="modal-quantity-input"]');
    if (quantityInput) {
        const quantity = Math.max(1, parseInt(quantityInput.value) || 1);
        quantityInput.value = quantity;
    }
}

function addToCartFromModal() {
    const modal = document.getElementById('quickViewModal');
    const productId = parseInt(modal.dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const selectedSize = modal.querySelector('.size-option.selected');
    const selectedColor = modal.querySelector('.color-option.selected');
    const quantity = parseInt(modal.querySelector('[data-testid="modal-quantity-input"]').value) || 1;
    
    // Validate required fields
    if (!selectedSize) {
        showToast('Please select a size', 'error');
        return;
    }
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize.dataset.size,
        color: selectedColor?.dataset.color || product.colors[0],
        quantity: quantity
    };
    
    addToCart(cartItem);
    closeQuickView();
    showToast('Product added to cart!', 'success');
}

// Tracking function for dashboard
async function trackEvent(type, data) {
    try {
        await fetch('api/track.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                ...data
            })
        });
    } catch (error) {
        console.error('Tracking error:', error);
    }
}

// Cart Management
function addToCart(item) {
    // Check if item already exists in cart with same size and color
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    );
    
    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item
        cart.push(item);
    }
    
    // Track cart addition for dashboard
    trackEvent('cart_add', {
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
    });
    
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('stylecraft-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCounts = document.querySelectorAll('[data-testid="cart-count"]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
        count.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    
    // Set content
    messageEl.textContent = message;
    
    // Set icon based on type
    if (type === 'success') {
        icon.className = 'toast-icon fas fa-check-circle';
        toast.className = 'toast success';
    } else if (type === 'error') {
        icon.className = 'toast-icon fas fa-exclamation-circle';
        toast.className = 'toast error';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Search functionality (placeholder)
function handleSearch() {
    // This would implement search functionality
    showToast('Search functionality coming soon!', 'success');
}

// Initialize search
document.addEventListener('DOMContentLoaded', function() {
    const searchButtons = document.querySelectorAll('[data-testid="search-btn"]');
    searchButtons.forEach(btn => {
        btn.addEventListener('click', handleSearch);
    });
});

// =============================================
//   Payment Modal Functions
// =============================================

let selectedPaymentMethod = null;

// Open payment method selection modal
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close payment method selection modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Select payment method
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    currentPaymentData.paymentMethod = method;
    
    if (method === 'airtel' || method === 'orange') {
        closePaymentModal();
        openMobilePaymentModal(method);
    }
}

// Open mobile payment form modal
function openMobilePaymentModal(method) {
    const modal = document.getElementById('mobilePaymentModal');
    const titleEl = document.getElementById('mobilePaymentTitle');
    const amountEl = document.getElementById('paymentAmount');
    const instructionsEl = document.getElementById('paymentInstructions');
    
    if (!modal) return;
    
    // Calculate total amount
    const total = calculateCartTotal();
    
    // Set title and amount
    if (method === 'airtel') {
        titleEl.textContent = 'Paiement Airtel Money';
    } else if (method === 'orange') {
        titleEl.textContent = 'Paiement Orange Money';
    }
    
    amountEl.value = `${total.total.toFixed(2)}`;    
    
    // Set payment instructions with amount info
    instructionsEl.innerHTML = generatePaymentInstructions(method, '', total.total);
    
    // Setup form submission
    setupMobilePaymentForm(method);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close mobile payment modal
function closeMobilePaymentModal() {
    const modal = document.getElementById('mobilePaymentModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('mobilePaymentForm');
        if (form) form.reset();
    }
}

// Generate simple payment instructions
function generatePaymentInstructions(method, customerPhone = '', amount = 0) {
    // Obtenir le numéro de réception selon le pays du client
    const receivingData = getReceivingNumber(method, customerPhone || '+243800000000');
    
    const methodTitle = method === 'airtel' ? 'Airtel Money' : 'Orange Money';
    const methodCode = method === 'airtel' ? '*150#' : '#150#';
    
    return `
        <div class="payment-info-simple">
            <h4><i class="fas fa-mobile-alt"></i> Instructions de paiement</h4>
            <div class="payment-details">
                <p><strong>Envoyer ${amount} USD vers :</strong></p>
                <div class="receiving-number">${receivingData.number}</div>
                <small>via ${methodTitle} (${receivingData.country})</small>
            </div>
            <div class="payment-simple-note">
                <p><i class="fas fa-info-circle"></i> Composez <strong>${methodCode}</strong> sur votre téléphone et effectuez le transfert</p>
                <p><small>Vous recevrez une confirmation une fois le paiement traité</small></p>
            </div>
        </div>
    `;
}

// Setup mobile payment form
function setupMobilePaymentForm(method) {
    const form = document.getElementById('mobilePaymentForm');
    if (!form) return;
    
    // Remove existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new event listener for form submission
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processMobilePayment(method);
    });
    
    // Add real-time phone number detection
    const phoneInput = newForm.querySelector('#phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            updatePaymentInstructions(method, this.value);
        });
        
        phoneInput.addEventListener('blur', function() {
            updatePaymentInstructions(method, this.value);
        });
    }
}

// Update payment instructions when phone number changes
function updatePaymentInstructions(method, phoneNumber) {
    const instructionsEl = document.getElementById('paymentInstructions');
    if (!instructionsEl) return;
    
    const total = calculateCartTotal();
    
    // Update instructions with current phone number
    instructionsEl.innerHTML = generatePaymentInstructions(method, phoneNumber, total.total);
}

// Process mobile payment - Step 1: Generate and send verification code
async function processMobilePayment(method) {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const customerEmail = document.getElementById('customerEmail').value;
    
    if (!customerEmail || !validateEmail(customerEmail)) {
        showToast('Veuillez entrer une adresse email valide', 'error');
        return;
    }
    
    if (!phoneNumber) {
        showToast('Veuillez entrer votre numéro de téléphone', 'error');
        return;
    }
    
    // Validate phone number format (basic validation)
    if (!isValidPhoneNumber(phoneNumber)) {
        showToast('Format de numéro de téléphone invalide', 'error');
        return;
    }
    
    // Store payment data
    currentPaymentData.customerEmail = customerEmail;
    currentPaymentData.phoneNumber = phoneNumber;
    
    // Show processing state
    const submitBtn = document.querySelector('#mobilePaymentForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Traitement...';
    submitBtn.disabled = true;
    
    try {
        // Simplified process - directly process the payment
        const total = calculateCartTotal();
        const methodName = method === 'airtel' ? 'Airtel Money' : 'Orange Money';
        
        // Send payment confirmation email immediately
        await sendOrderConfirmation(customerEmail, phoneNumber, total, methodName);
        
        showToast(`Confirmation envoyée à ${customerEmail}. Effectuez le paiement sur votre téléphone`, 'success');
        
        // Close modal and clear cart after success
        setTimeout(() => {
            closeMobilePaymentModal();
            clearCart();
        }, 2000);
        
    } catch (error) {
        console.error('Error sending confirmation:', error);
        showToast('Erreur lors de l\'envoi de la confirmation. Veuillez réessayer.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Send order confirmation directly using existing email function
async function sendOrderConfirmation(customerEmail, phoneNumber, total, methodName) {
    try {
        const receivingData = getReceivingNumber(selectedPaymentMethod.toLowerCase(), phoneNumber);
        
        const emailData = {
            to: customerEmail,
            subject: 'Confirmation de commande - StyleCraft',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Confirmation de commande</h2>
                    <p>Bonjour,</p>
                    <p>Votre commande a été confirmée. Voici les détails :</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0 0 15px 0;">Informations de paiement</h3>
                        <p><strong>Montant à payer :</strong> ${total.total.toFixed(2)} USD</p>
                        <p><strong>Méthode :</strong> ${methodName}</p>
                        <p><strong>Votre numéro :</strong> ${phoneNumber}</p>
                        <p><strong>Envoyer vers :</strong> ${receivingData.number}</p>
                        <p><strong>Pays :</strong> ${receivingData.country}</p>
                    </div>
                    
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="margin: 0 0 10px 0; color: #2c5530;">Instructions :</h4>
                        <p style="margin: 0;">Effectuez le transfert de <strong>${total.total.toFixed(2)} USD</strong> vers <strong>${receivingData.number}</strong> via ${methodName}</p>
                    </div>
                    
                    <p>Votre commande sera traitée dès réception du paiement.</p>
                    <p>Merci pour votre confiance !</p>
                    <p><strong>L'équipe StyleCraft</strong></p>
                </div>
            `,
            text: `Confirmation de commande StyleCraft\n\nMontant: ${total.total.toFixed(2)} USD\nMéthode: ${methodName}\nVotre numéro: ${phoneNumber}\nEnvoyer vers: ${receivingData.number}\nPays: ${receivingData.country}\n\nEffectuez le transfert via ${methodName} et votre commande sera traitée dès réception du paiement.\n\nMerci pour votre confiance !\nL'équipe StyleCraft`
        };
        
        await sendEmail(emailData);
        
    } catch (error) {
        console.error('Error sending order confirmation:', error);
        throw error;
    }
}

// Generate random 6-digit verification code (legacy - not used in simplified process)
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate email address
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show verification code input form
function showVerificationCodeForm() {
    const modalBody = document.querySelector('#mobilePaymentModal .modal-body');
    if (!modalBody) return;
    
    modalBody.innerHTML = `
        <form id="verificationForm">
            <div class="verification-step">
                <div class="step-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <h3>Code de vérification envoyé</h3>
                <p>Un code de vérification a été envoyé à <strong>${currentPaymentData.customerEmail}</strong></p>
                <p>Entrez le code reçu pour confirmer votre paiement :</p>
            </div>
            
            <div class="form-group">
                <label for="verificationCode">Code de vérification *</label>
                <input type="text" id="verificationCode" name="verificationCode" required 
                       placeholder="123456" maxlength="6" class="verification-input">
                <small>Le code est valide pendant 10 minutes</small>
            </div>
            
            <div class="payment-summary">
                <h4>Résumé du paiement</h4>
                <div class="summary-row">
                    <span>Méthode :</span>
                    <span>${currentPaymentData.paymentMethod === 'airtel' ? 'Airtel Money' : 'Orange Money'}</span>
                </div>
                <div class="summary-row">
                    <span>Numéro :</span>
                    <span>${currentPaymentData.phoneNumber}</span>
                </div>
                <div class="summary-row">
                    <span>Montant :</span>
                    <span>${currentPaymentData.orderDetails.total}$</span>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="goBackToPaymentForm()">
                    Retour
                </button>
                <button type="submit" class="btn btn-primary">
                    Confirmer
                </button>
            </div>
        </form>
    `;
    
    // Setup verification form
    const verificationForm = document.getElementById('verificationForm');
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            verifyPaymentCode();
        });
    }
}

// Verify payment code
async function verifyPaymentCode() {
    const enteredCode = document.getElementById('verificationCode').value;
    
    if (!enteredCode || enteredCode.length !== 6) {
        showToast('Veuillez entrer un code à 6 chiffres', 'error');
        return;
    }
    
    if (enteredCode !== currentPaymentData.verificationCode) {
        showToast('Code de vérification incorrect', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('#verificationForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Finalisation...';
    submitBtn.disabled = true;
    
    try {
        // Send payment confirmation email
        const methodName = currentPaymentData.paymentMethod === 'airtel' ? 'Airtel Money' : 'Orange Money';
        await sendPaymentConfirmationEmail(
            currentPaymentData.customerEmail,
            currentPaymentData.orderDetails,
            methodName
        );
        
        // Show success and finish payment
        showPaymentSuccess();
        
        // Clear cart and redirect
        setTimeout(() => {
            finishPayment();
        }, 3000);
        
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        showToast('Paiement confirmé ! Un email de confirmation suivra.', 'success');
        
        setTimeout(() => {
            finishPayment();
        }, 3000);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Go back to payment form
function goBackToPaymentForm() {
    const method = currentPaymentData.paymentMethod;
    openMobilePaymentModal(method);
}

// Show payment success
function showPaymentSuccess() {
    const modal = document.getElementById('mobilePaymentModal');
    const modalBody = modal.querySelector('.modal-body');
    
    const paymentMethod = currentPaymentData.paymentMethod === 'airtel' ? 'Airtel Money' : 'Orange Money';
    
    modalBody.innerHTML = `
        <div class="payment-success">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Paiement Confirmé !</h3>
            <p>Votre paiement de <strong>${currentPaymentData.orderDetails.total}$</strong> via ${paymentMethod} a été traité avec succès.</p>
            <p>Commande N° : <strong>${currentPaymentData.orderNumber}</strong></p>
            <p>Email : <strong>${currentPaymentData.customerEmail}</strong></p>
            <p>Un email de confirmation détaillé a été envoyé à votre adresse.</p>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="finishPayment()">
                    Continuer
                </button>
            </div>
        </div>
    `;
}

// Finish payment process
function finishPayment() {
    closeMobilePaymentModal();
    showToast('Commande confirmée! Merci pour votre achat.', 'success');
    
    // Redirect to home page after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Validate phone number (étendu pour tous les pays Airtel et Orange)
function isValidPhoneNumber(phone) {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Vérifier tous les formats Airtel et Orange
    const allPatterns = [
        ...PHONE_PATTERNS.airtel,
        ...PHONE_PATTERNS.orange,
        ...PHONE_PATTERNS.local
    ];
    
    return allPatterns.some(pattern => pattern.test(cleaned));
}

// Détecter le type de réseau (Airtel ou Orange) selon le numéro
function detectNetworkType(phone) {
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    const isAirtel = PHONE_PATTERNS.airtel.some(pattern => pattern.test(cleaned));
    const isOrange = PHONE_PATTERNS.orange.some(pattern => pattern.test(cleaned));
    
    if (isAirtel) return 'airtel';
    if (isOrange) return 'orange';
    return 'unknown';
}

// Calculate cart total (enhanced version)
function calculateCartTotal() {
    const subtotal = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    const shipping = subtotal >= 50 ? 0 : 5; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

// ============================================= 
//   FLUTTERWAVE PAYMENT INTEGRATION
// =============================================

// Flutterwave Configuration
const FLUTTERWAVE_CONFIG = {
    public_key: "FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxx", // Clé publique de test
    tx_ref: "", // Will be generated dynamically
    amount: 0, // Will be calculated from cart
    currency: "USD",
    payment_options: "mobilemoney",
    customer: {
        email: "",
        phone_number: "",
        name: ""
    },
    customizations: {
        title: "StyleCraft - Paiement Mobile Money",
        description: "Achat de vêtements premium",
        logo: "https://via.placeholder.com/100",
    },
    meta: {
        cart_id: "",
        order_id: ""
    }
};

// Flutterwave Payment Function - Airtel et Orange uniquement
function payWithFlutterwave() {
    // Vérifier que le panier n'est pas vide
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }

    // Calculer le montant total
    const cartTotal = calculateCartTotal();
    const totalAmount = cartTotal.total;

    // Générer une référence de transaction unique
    const txRef = 'stylecraft_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    
    // Configuration de paiement - Airtel et Orange pour tous les pays
    const paymentConfig = {
        ...FLUTTERWAVE_CONFIG,
        tx_ref: txRef,
        amount: totalAmount,
        customer: {
            email: "customer@stylecraft.com",
            phone_number: "+225 07 00 00 00 00",
            name: "Client StyleCraft"
        },
        payment_options: "mobilemoney",
        payment_plan: null,
        payment_methods: ["airtel", "orange"], // Seulement Airtel et Orange
        meta: {
            cart_id: Date.now().toString(),
            order_id: 'SC' + Date.now().toString().slice(-8),
            items_count: cart.length,
            payment_methods: "airtel_orange_only"
        },
        callback: function (data) {
            console.log("Paiement réussi:", data);
            
            if (data.status === "successful") {
                // Afficher l'alerte de succès avec la référence
                alert(`Paiement réussi ! \nRéférence de transaction: ${data.tx_ref}\nMontant: ${data.amount}`);
                
                // Vider le panier et rediriger
                setTimeout(() => {
                    cart = [];
                    localStorage.setItem('stylecraft-cart', JSON.stringify(cart));
                    updateCartUI();
                    window.location.href = 'index.html';
                }, 2000);
            }
        },
        onclose: function () {
            // L'utilisateur a fermé la fenêtre sans payer
            alert("Fenêtre de paiement fermée.");
        }
    };

    // Ouvrir le checkout Flutterwave
    FlutterwaveCheckout(paymentConfig);
}

// Expose functions to global scope for onclick handlers
window.selectPaymentMethod = selectPaymentMethod;
window.closePaymentModal = closePaymentModal;
window.closeMobilePaymentModal = closeMobilePaymentModal;
window.payWithFlutterwave = payWithFlutterwave;
window.openPaymentMethodModal = openPaymentMethodModal;
window.closePaymentMethodModal = closePaymentMethodModal;
window.selectPaymentAndProceed = selectPaymentAndProceed;


// Fonction pour ouvrir la modal de sélection de paiement
function openPaymentMethodModal() {
    // Vérifier que le panier n'est pas vide
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    const modal = document.getElementById('paymentMethodModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fonction pour fermer la modal de sélection de paiement
function closePaymentMethodModal() {
    const modal = document.getElementById('paymentMethodModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fonction pour sélectionner le paiement et procéder
function selectPaymentAndProceed(paymentMethod) {
    closePaymentMethodModal();
    
    // Calculer le montant total
    const cartTotal = calculateCartTotal();
    const totalAmount = cartTotal.total;

    // Générer une référence de transaction unique
    const txRef = 'stylecraft_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    
    // Configuration de paiement selon le choix
    const paymentConfig = {
        ...FLUTTERWAVE_CONFIG,
        tx_ref: txRef,
        amount: totalAmount,
        customer: {
            email: "customer@stylecraft.com",
            phone_number: "+225 07 00 00 00 00",
            name: "Client StyleCraft"
        },
        payment_options: "mobilemoney",
        payment_plan: null,
        payment_methods: [paymentMethod], // Seulement le moyen choisi
        meta: {
            cart_id: Date.now().toString(),
            order_id: 'SC' + Date.now().toString().slice(-8),
            items_count: cart.length,
            selected_payment_method: paymentMethod
        },
        callback: function (data) {
            console.log("Paiement réussi:", data);
            
            if (data.status === "successful") {
                // Afficher l'alerte de succès avec la référence
                alert(`Paiement réussi ! \nRéférence de transaction: ${data.tx_ref}\nMontant: ${data.amount}`);
                
                // Vider le panier et rediriger
                setTimeout(() => {
                    cart = [];
                    localStorage.setItem('stylecraft-cart', JSON.stringify(cart));
                    updateCartUI();
                    window.location.href = 'index.html';
                }, 2000);
            }
        },
        onclose: function () {
            // L'utilisateur a fermé la fenêtre sans payer
            alert("Fenêtre de paiement fermée.");
        }
    };

    // Ouvrir le checkout Flutterwave
    FlutterwaveCheckout(paymentConfig);
}

// Nouveau système de commande
const ADMIN_EMAIL = 'cardinalpower006@gmail.com';

// Ouvrir le formulaire de commande
function openOrderFormModal() {
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    // Auto-remplir les produits et le total depuis le panier
    const totals = calculateCartTotal();
    
    // Créer la liste des produits
    const productsList = cart.map(item => 
        `${item.name} (Taille: ${item.size}${item.color ? ', Couleur: ' + item.color : ''}) x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    // Remplir les champs du formulaire
    const productsField = document.getElementById('products');
    const totalField = document.getElementById('total');
    
    if (productsField) {
        productsField.value = productsList;
    }
    
    if (totalField) {
        totalField.value = `${totals.total.toFixed(2)}`;
    }
    
    const modal = document.getElementById('orderFormModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Fermer le formulaire de commande
function closeOrderFormModal() {
    const modal = document.getElementById('orderFormModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

async function sendOrderEmail(orderData) {
    const orderNumber = 'SC' + Date.now();
    const totals = calculateCartTotal();
    
    const orderDetails = {
        orderNumber: orderNumber,
        items: cart.map(item => ({
            name: item.name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total
    };
    
    try {
        const response = await fetch('/api/send-order-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerEmail: orderData.email,
                customerName: `${orderData.firstName} ${orderData.lastName}`,
                orderDetails: orderDetails
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            return { success: true, orderNumber, totals };
        } else {
            console.error('Erreur serveur:', result);
            return { success: false, error: result.error || 'Erreur inconnue' };
        }
    } catch (error) {
        console.error('Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
}

// Afficher la confirmation de commande
function showOrderConfirmation(orderNumber, orderData, totals) {
    closeOrderFormModal();
    
    const confirmationModal = document.getElementById('confirmationModal');
    const summaryDisplay = document.getElementById('orderSummaryDisplay');
    
    if (summaryDisplay) {
        summaryDisplay.innerHTML = `
            <div class="order-details" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>N° de commande:</strong> ${orderNumber}</p>
                <p><strong>Nom:</strong> ${orderData.firstName} ${orderData.lastName}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Adresse:</strong> ${orderData.address}, ${orderData.city}, ${orderData.country}</p>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <p><strong>Articles:</strong> ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p><strong>Total:</strong> ${totals.total}</p>
                </div>
            </div>
        `;
    }
    
    if (confirmationModal) {
        confirmationModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Vider le panier
    cart = [];
    localStorage.setItem('stylecraft-cart', JSON.stringify(cart));
    updateCartCount();
}

// Initialize order form event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Setup checkout button - ouvre le formulaire de commande
    const checkoutBtn = document.querySelector('[data-testid="checkout-btn"]');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openOrderFormModal);
    }
    
    // Setup order form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(orderForm);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const customerEmail = formData.get('customerEmail');
            const address = formData.get('address');
            const city = formData.get('city');
            const country = formData.get('country');
            const products = formData.get('products');
            const total = formData.get('total');
            
            // Créer customerName à partir de firstName et lastName
            const customerName = `${firstName} ${lastName}`;
            
            // Désactiver le bouton pendant l'envoi
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Envoyer les données à commande.php
                const response = await fetch('commande.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        customerName: customerName,
                        customerEmail: customerEmail,
                        address: address,
                        city: city,
                        country: country,
                        products: products,
                        total: total
                    })
                });
                
                const result = await response.json();
                
                if (result.type === 'success') {
                    // Commande envoyée avec succès (tracking done server-side in commande.php)
                    const orderNumber = 'SC' + Date.now();
                    const totals = calculateCartTotal();
                    const orderData = {
                        firstName: firstName,
                        lastName: lastName,
                        email: customerEmail,
                        address: address,
                        city: city,
                        country: country
                    };
                    showOrderConfirmation(orderNumber, orderData, totals);
                    orderForm.reset();
                } else {
                    // Erreur lors de l'envoi - utiliser toast au lieu de alert
                    showToast(result.message || 'Erreur lors de l\'envoi de la commande', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Erreur:', error);
                showToast('Erreur lors de l\'envoi de la commande. Veuillez réessayer.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Setup modal close on overlay click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                if (modal.id === 'orderFormModal') {
                    closeOrderFormModal();
                }
            }
        }
    });
    
    // Setup ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const orderModal = document.getElementById('orderFormModal');
            
            if (orderModal && orderModal.style.display === 'block') {
                closeOrderFormModal();
            }
        }
    });
});

// Expose functions to global scope
window.openOrderFormModal = openOrderFormModal;
window.closeOrderFormModal = closeOrderFormModal;