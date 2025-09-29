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
const sampleProducts = [
    // Nouveaux produits avec vraies images en premier
    {
        id: 703,
        name: "Sac Tendance Moderne",
        price: 89.99,
        originalPrice: 119.99,
        category: "sacs",
        image: "sacs complement/4c06f44a4faa4648b6fd82845af64147.jpg",
        images: [
            "sacs complement/4c06f44a4faa4648b6fd82845af64147.jpg"
        ],
        description: "Sac moderne au design contemporain, parfait pour un look tendance.",
        sizes: ["One Size"],
        colors: ["Marron", "Noir", "Beige"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 801,
        name: "Accessoire Style Unique",
        price: 45.99,
        originalPrice: 65.99,
        category: "perruques",
        image: "accesoires/2e786e3df02c4f55b539145ff0e292c5.jpg",
        images: [
            "accesoires/2e786e3df02c4f55b539145ff0e292c5.jpg"
        ],
        description: "Accessoire capillaire au style unique et moderne.",
        sizes: ["One Size"],
        colors: ["Naturel", "Brun", "Noir"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 806,
        name: "Vêtement Style Contemporain",
        price: 79.99,
        originalPrice: 99.99,
        category: "vetements",
        image: "vetement complement/1cd07605183b491a8540c9fcd7e328e4.jpg",
        images: [
            "vetement complement/1cd07605183b491a8540c9fcd7e328e4.jpg"
        ],
        description: "Vêtement au style contemporain et moderne.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Blanc", "Gris"],
        featured: true,
        bestseller: false,
        sale: true
    },
    // Perruques originales
    {
        id: 101,
        name: "Perruque Cheveux Naturels Longs",
        price: 189.99,
        originalPrice: 249.99,
        category: "perruques",
        image: "src/assets/perruque-cheveux-naturels-1.jpg",
        images: [
            "src/assets/perruque-cheveux-naturels-1.jpg",
            "src/assets/perruque-cheveux-naturels-2.jpg"
        ],
        description: "Perruque en cheveux naturels 100% humains, longueur 50cm. Qualité premium pour un rendu naturel exceptionnel.",
        sizes: ["One Size"],
        colors: ["Brun", "Blond", "Roux", "Noir"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 102,
        name: "Perruque Synthétique Ondulée",
        price: 55.99,
        originalPrice: 79.99,
        category: "perruques",
        image: "src/assets/perruque-synthetique-1.jpg",
        images: [
            "src/assets/perruque-synthetique-1.jpg"
        ],
        description: "Perruque synthétique avec ondulations naturelles. Facile à coiffer et à entretenir.",
        sizes: ["One Size"],
        colors: ["Blond", "Brun", "Roux"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 103,
        name: "Perruque Court Moderne",
        price: 95.99,
        originalPrice: null,
        category: "perruques",
        image: "src/assets/perruque-court-1.jpg",
        images: [
            "src/assets/perruque-court-1.jpg"
        ],
        description: "Coupe moderne et tendance, parfaite pour un look contemporain.",
        sizes: ["One Size"],
        colors: ["Noir", "Brun", "Blond"],
        featured: false,
        bestseller: true,
        sale: false
    },
    // Vêtements Femme
    {
        id: 201,
        name: "Robe Élégante Soirée",
        price: 125.99,
        originalPrice: 159.99,
        category: "vetements",
        image: "attached_assets/vetement/robe-longue-grande-taille-femme.jpg",
        images: [
            "attached_assets/vetement/robe-longue-grande-taille-femme.jpg"
        ],
        description: "Robe de soirée sophistiquée en soie, coupe ajustée et élégante.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Rouge", "Bleu"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 202,
        name: "Top Décontracté Femme",
        price: 35.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/OUTFITTERY_10Y_Day1_1288_9335-683x1024.jpg",
        images: [
            "attached_assets/vetement/OUTFITTERY_10Y_Day1_1288_9335-683x1024.jpg"
        ],
        description: "Top confortable en coton bio, parfait pour le quotidien.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blanc", "Gris", "Rose"],
        featured: true,
        bestseller: false,
        sale: false
    },
    // Vêtements Enfant
    {
        id: 301,
        name: "Robe Princesse Enfant",
        price: 28.99,
        originalPrice: 39.99,
        category: "vetements",
        image: "attached_assets/vetement/enfant.jpg",
        images: [
            "attached_assets/vetement/enfant.jpg"
        ],
        description: "Robe de princesse pour enfant, tissu doux et confortable.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Rose", "Bleu", "Violet"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 302,
        name: "T-shirt Enfant Graphique",
        price: 18.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/enffant.jpg",
        images: [
            "attached_assets/vetement/enffant.jpg"
        ],
        description: "T-shirt amusant avec motif graphique, coton 100%.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Bleu", "Rouge", "Vert"],
        featured: false,
        bestseller: false,
        sale: false
    },
    // Nouveaux vêtements femme
    {
        id: 203,
        name: "Jupe Plissée Moderne",
        price: 49.99,
        originalPrice: 65.99,
        category: "vetements",
        image: "attached_assets/vetement/jupe-plissee-moderne.jpg",
        images: [
            "attached_assets/vetement/jupe-plissee-moderne.jpg"
        ],
        description: "Jupe plissée élégante, parfaite pour le bureau ou les sorties.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Beige", "Marine"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 204,
        name: "Blazer Professionnel Femme",
        price: 89.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/blazer-professionnel-femme.jpg",
        images: [
            "attached_assets/vetement/blazer-professionnel-femme.jpg"
        ],
        description: "Blazer moderne et professionnel, coupe ajustée et élégante.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Gris", "Marine"],
        featured: false,
        bestseller: true,
        sale: false
    },
    {
        id: 205,
        name: "Pantalon Décontracté Femme",
        price: 42.99,
        originalPrice: 59.99,
        category: "vetements",
        image: "attached_assets/vetement/pantalon-decontracte-femme.jpg",
        images: [
            "attached_assets/vetement/pantalon-decontracte-femme.jpg"
        ],
        description: "Pantalon confortable en coton stretch, idéal pour tous les jours.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Blanc", "Kaki"],
        featured: true,
        bestseller: true,
        sale: true
    },
    // Nouveaux vêtements enfant
    {
        id: 303,
        name: "Ensemble Sport Enfant",
        price: 32.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/ensemble-sport-enfant.jpg",
        images: [
            "attached_assets/vetement/ensemble-sport-enfant.jpg"
        ],
        description: "Ensemble de sport confortable pour enfant, jogging et sweat-shirt.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Bleu", "Rose", "Gris"],
        featured: false,
        bestseller: false,
        sale: false
    },
    {
        id: 304,
        name: "Robe Estivale Enfant",
        price: 24.99,
        originalPrice: 34.99,
        category: "vetements",
        image: "attached_assets/vetement/robe-estivale-enfant.jpg",
        images: [
            "attached_assets/vetement/robe-estivale-enfant.jpg"
        ],
        description: "Robe légère et colorée parfaite pour l'été.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Jaune", "Vert", "Orange"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 305,
        name: "Pantalon École Enfant",
        price: 29.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/pantalon-ecole-enfant.jpg",
        images: [
            "attached_assets/vetement/pantalon-ecole-enfant.jpg"
        ],
        description: "Pantalon résistant et confortable pour l'école.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Marine", "Gris", "Noir"],
        featured: false,
        bestseller: true,
        sale: false
    },
    // Sacs
    {
        id: 401,
        name: "Sac à Main Cuir Premium",
        price: 179.99,
        originalPrice: 229.99,
        category: "sacs",
        image: "src/assets/sac-main-cuir-premium-1.jpg",
        images: [
            "src/assets/sac-main-cuir-premium-1.jpg",
            "src/assets/sac-main-cuir-premium-2.jpg"
        ],
        description: "Sac à main en cuir véritable, fabrication artisanale de qualité supérieure.",
        sizes: ["One Size"],
        colors: ["Noir", "Marron", "Rouge"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 402,
        name: "Sac à Dos Tendance",
        price: 65.99,
        originalPrice: null,
        category: "sacs",
        image: "src/assets/sac-dos-tendance-1.jpg",
        images: [
            "src/assets/sac-dos-tendance-1.jpg"
        ],
        description: "Sac à dos moderne et fonctionnel, parfait pour le quotidien.",
        sizes: ["One Size"],
        colors: ["Noir", "Gris", "Bleu"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 403,
        name: "Sac de Soirée Élégant",
        price: 55.99,
        originalPrice: 69.99,
        category: "sacs",
        image: "src/assets/sac-soiree-elegant-1.jpg",
        images: [
            "src/assets/sac-soiree-elegant-1.jpg"
        ],
        description: "Petit sac de soirée raffiné, idéal pour les occasions spéciales.",
        sizes: ["One Size"],
        colors: ["Noir", "Or", "Argent"],
        featured: false,
        bestseller: true,
        sale: true
    },
    // Nouveaux sacs ajoutés
    {
        id: 406,
        name: "Sac Cabas Moderne",
        price: 89.99,
        originalPrice: 119.99,
        category: "sacs",
        image: "src/assets/sac-cabas-moderne-1.jpg",
        images: [
            "src/assets/sac-cabas-moderne-1.jpg"
        ],
        description: "Sac cabas spacieux et moderne, parfait pour le quotidien et le travail.",
        sizes: ["One Size"],
        colors: ["Noir", "Beige", "Marine"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 407,
        name: "Sac Sport Élégant",
        price: 75.99,
        originalPrice: null,
        category: "sacs",
        image: "src/assets/sac-sport-elegant-1.jpg",
        images: [
            "src/assets/sac-sport-elegant-1.jpg"
        ],
        description: "Sac de sport élégant alliant fonctionnalité et style urbain.",
        sizes: ["One Size"],
        colors: ["Noir", "Gris", "Bleu"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 408,
        name: "Sac Luxe Premium",
        price: 299.99,
        originalPrice: 399.99,
        category: "sacs",
        image: "src/assets/sac-luxe-premium-1.jpg",
        images: [
            "src/assets/sac-luxe-premium-1.jpg"
        ],
        description: "Sac de luxe en cuir véritable, design intemporel et finitions exceptionnelles.",
        sizes: ["One Size"],
        colors: ["Camel", "Noir", "Cognac"],
        featured: true,
        bestseller: true,
        sale: true
    },
    // Nouvelles perruques ajoutées
    {
        id: 404,
        name: "Perruque Lisse Élégante",
        price: 129.99,
        originalPrice: 169.99,
        category: "perruques",
        image: "src/assets/perruque-lisse-1.jpg",
        images: [
            "src/assets/perruque-lisse-1.jpg"
        ],
        description: "Perruque lisse d'une élégance exceptionnelle, parfaite pour un look sophistiqué.",
        sizes: ["One Size"],
        colors: ["Noir", "Brun", "Blond"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 405,
        name: "Perruque Bouclée Volume",
        price: 139.99,
        originalPrice: null,
        category: "perruques",
        image: "src/assets/perruque-bouclees-1.jpg",
        images: [
            "src/assets/perruque-bouclees-1.jpg"
        ],
        description: "Perruque bouclée avec un volume naturel parfait pour un style glamour.",
        sizes: ["One Size"],
        colors: ["Brun", "Noir", "Blond Vénitien"],
        featured: true,
        bestseller: true,
        sale: false
    },
    // Produits existants (gardés pour compatibilité)
    {
        id: 1,
        name: "Classic White Button-Down Shirt",
        price: 65.99,
        originalPrice: 85.99,
        category: "vetements",
        image: "attached_assets/vetement/51WxBImyzpL._AC_SX522_.jpg",
        images: [
            "attached_assets/vetement/51WxBImyzpL._AC_SX522_.jpg"
        ],
        description: "A timeless classic that belongs in every wardrobe. Made from premium cotton with a perfect fit.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Light Blue"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 2,
        name: "Elegant Black Dress",
        price: 109.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/613+tot5pML._AC_SL1200_.jpg",
        images: [
            "attached_assets/vetement/613+tot5pML._AC_SL1200_.jpg"
        ],
        description: "Sophisticated and versatile dress perfect for any occasion. Crafted with attention to detail.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Navy"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 3,
        name: "Premium Denim Jeans",
        price: 85.99,
        originalPrice: 115.99,
        category: "vetements",
        image: "attached_assets/vetement/61KkAWEFzuL._AC_SL1500_.jpg",
        images: [
            "attached_assets/vetement/61KkAWEFzuL._AC_SL1500_.jpg",
            "src/assets/jean-premium-homme-2.jpg"
        ],
        description: "High-quality denim with a modern fit. Durable construction and timeless style.",
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Dark Blue", "Light Blue"],
        featured: false,
        bestseller: true,
        sale: true
    },
    {
        id: 4,
        name: "Cozy Knit Sweater",
        price: 58.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/613uQE 56VL._AC_UY350_.jpg",
        images: [
            "attached_assets/vetement/613uQE 56VL._AC_UY350_.jpg",
            "src/assets/pull-tricot-femme-2.jpg"
        ],
        description: "Soft and comfortable sweater perfect for cooler days. Made from premium wool blend.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Cream", "Gray", "Navy"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 5,
        name: "Kids Adventure T-Shirt",
        price: 22.99,
        originalPrice: 29.99,
        category: "vetements",
        image: "attached_assets/vetement/enfanttt.jfif",
        images: [
            "attached_assets/vetement/enfanttt.jfif"
        ],
        description: "Fun and colorful t-shirt designed for active children. Comfortable cotton fabric.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Blue", "Green", "Red"],
        featured: false,
        bestseller: false,
        sale: true
    },
    {
        id: 6,
        name: "Leather Crossbody Bag",
        price: 145.99,
        originalPrice: null,
        category: "perruques",
        image: "src/assets/sac-bandouliere-cuir-1.jpg",
        images: [
            "src/assets/sac-bandouliere-cuir-1.jpg",
            "src/assets/sac-bandouliere-cuir-2.jpg"
        ],
        description: "Handcrafted leather bag with multiple compartments. Perfect for everyday use.",
        sizes: ["One Size"],
        colors: ["Brown", "Black", "Tan"],
        featured: false,
        bestseller: true,
        sale: false
    },
    {
        id: 7,
        name: "Cotton Polo Shirt",
        price: 42.99,
        originalPrice: 55.99,
        category: "vetements",
        image: "attached_assets/vetement/61Zw7NrauNL._AC_SL1500_.jpg",
        images: [
            "attached_assets/vetement/61Zw7NrauNL._AC_SL1500_.jpg"
        ],
        description: "Classic polo shirt made from 100% cotton. Perfect for casual or business casual wear.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy", "White", "Gray"],
        featured: false,
        bestseller: false,
        sale: true
    },
    {
        id: 8,
        name: "Flowy Summer Dress",
        price: 64.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/images.jfif",
        images: [
            "attached_assets/vetement/images.jfif"
        ],
        description: "Light and airy dress perfect for warm weather. Features a flattering silhouette.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral", "Solid Blue"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 9,
        name: "Veste Jean Enfant",
        price: 32.99,
        originalPrice: 45.99,
        category: "vetements",
        image: "attached_assets/vetement/enfantt.webp",
        images: [
            "attached_assets/vetement/enfantt.webp"
        ],
        description: "Stylish denim jacket for children. Durable and perfect for layering.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Light Blue", "Dark Blue"],
        featured: false,
        bestseller: false,
        sale: true
    },
    {
        id: 10,
        name: "Classic Watch",
        price: 199.99,
        originalPrice: null,
        category: "perruques",
        image: "src/assets/montre-classique-1.jpg",
        images: [
            "src/assets/montre-classique-1.jpg"
        ],
        description: "Elegant timepiece with classic design. Features premium materials and precise movement.",
        sizes: ["One Size"],
        colors: ["Silver", "Gold", "Black"],
        featured: false,
        bestseller: true,
        sale: false
    },
    // Nouvelles perruques pour avoir au moins 18 articles
    {
        id: 501,
        name: "Perruque Mi-Longue Naturelle",
        price: 149.99,
        originalPrice: 189.99,
        category: "perruques",
        image: "attached_assets/sacs/cas.jpg",
        images: [
            "attached_assets/sacs/cas.jpg"
        ],
        description: "Perruque mi-longue aux reflets naturels, parfaite pour un look sophistiqué.",
        sizes: ["One Size"],
        colors: ["Châtain", "Brun", "Blond"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 502,
        name: "Perruque Courte Moderne",
        price: 89.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/sacs/eram.webp",
        images: [
            "attached_assets/sacs/eram.webp"
        ],
        description: "Coupe courte tendance pour un style moderne et dynamique.",
        sizes: ["One Size"],
        colors: ["Noir", "Brun", "Blond Platine"],
        featured: false,
        bestseller: true,
        sale: false
    },
    {
        id: 503,
        name: "Perruque Longue Ondulée",
        price: 199.99,
        originalPrice: 249.99,
        category: "perruques",
        image: "attached_assets/sacs/fave.jfif",
        images: [
            "attached_assets/sacs/fave.jfif"
        ],
        description: "Perruque longue aux ondulations parfaites pour un effet glamour.",
        sizes: ["One Size"],
        colors: ["Roux", "Brun Doré", "Noir"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 504,
        name: "Perruque Bob Élégante",
        price: 119.99,
        originalPrice: 149.99,
        category: "perruques",
        image: "attached_assets/sacs/jane.jpg",
        images: [
            "attached_assets/sacs/jane.jpg"
        ],
        description: "Coupe bob classique et élégante pour un look intemporel.",
        sizes: ["One Size"],
        colors: ["Noir", "Brun", "Blond Cendré"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 505,
        name: "Perruque Pixie Moderne",
        price: 79.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/sacs/sac.webp",
        images: [
            "attached_assets/sacs/sac.webp"
        ],
        description: "Coupe pixie audacieuse pour un style moderne et affirmé.",
        sizes: ["One Size"],
        colors: ["Blond", "Brun", "Noir"],
        featured: false,
        bestseller: false,
        sale: false
    },
    {
        id: 506,
        name: "Perruque Frisée Voluptueuse",
        price: 169.99,
        originalPrice: 199.99,
        category: "perruques",
        image: "attached_assets/sacs/sacs.webp",
        images: [
            "attached_assets/sacs/sacs.webp"
        ],
        description: "Perruque aux boucles voluptueuses pour un style afro-caribéen.",
        sizes: ["One Size"],
        colors: ["Noir", "Brun Foncé", "Auburn"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 507,
        name: "Perruque Dégradée Tendance",
        price: 139.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/sacs/sak.jfif",
        images: [
            "attached_assets/sacs/sak.jfif"
        ],
        description: "Perruque avec dégradé moderne pour un look branché.",
        sizes: ["One Size"],
        colors: ["Brun à Blond", "Noir à Gris", "Roux à Cuivré"],
        featured: false,
        bestseller: true,
        sale: false
    },
    {
        id: 508,
        name: "Perruque Vintage Rétro",
        price: 159.99,
        originalPrice: 189.99,
        category: "perruques",
        image: "attached_assets/sacs/ssaak.png",
        images: [
            "attached_assets/sacs/ssaak.png"
        ],
        description: "Style vintage des années 50 pour un look rétro chic.",
        sizes: ["One Size"],
        colors: ["Blond Platine", "Roux", "Noir"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 509,
        name: "Perruque Asymétrique Creative",
        price: 129.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/sacs/tods.webp",
        images: [
            "attached_assets/sacs/tods.webp"
        ],
        description: "Coupe asymétrique créative pour un style unique et original.",
        sizes: ["One Size"],
        colors: ["Noir", "Blond", "Brun"],
        featured: false,
        bestseller: false,
        sale: false
    },
    {
        id: 510,
        name: "Perruque Lace Front Premium",
        price: 299.99,
        originalPrice: 399.99,
        category: "perruques",
        image: "attached_assets/1.jpg",
        images: [
            "attached_assets/1.jpg"
        ],
        description: "Perruque lace front haut de gamme pour un rendu ultra-naturel.",
        sizes: ["One Size"],
        colors: ["Brun Naturel", "Noir", "Blond Miel"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 511,
        name: "Perruque Wavy Bohème",
        price: 179.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/2.jpg",
        images: [
            "attached_assets/2.jpg"
        ],
        description: "Ondulations bohèmes pour un style décontracté et naturel.",
        sizes: ["One Size"],
        colors: ["Brun Chocolat", "Blond Sable", "Auburn"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 512,
        name: "Perruque Straight Sophistiquée",
        price: 189.99,
        originalPrice: 229.99,
        category: "perruques",
        image: "attached_assets/3.jpg",
        images: [
            "attached_assets/3.jpg"
        ],
        description: "Perruque lisse sophistiquée pour un look professionnel.",
        sizes: ["One Size"],
        colors: ["Noir Intense", "Brun Espresso", "Blond Foncé"],
        featured: false,
        bestseller: true,
        sale: true
    },
    {
        id: 513,
        name: "Perruque Curly Glamour",
        price: 219.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/4.jpg",
        images: [
            "attached_assets/4.jpg"
        ],
        description: "Boucles glamour pour un effet red carpet saisissant.",
        sizes: ["One Size"],
        colors: ["Brun Hollywood", "Blond Star", "Noir Velours"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 514,
        name: "Perruque Beach Waves",
        price: 149.99,
        originalPrice: 179.99,
        category: "perruques",
        image: "attached_assets/5.jpg",
        images: [
            "attached_assets/5.jpg"
        ],
        description: "Effet beach waves naturel pour un look décontracté.",
        sizes: ["One Size"],
        colors: ["Blond Plage", "Brun Ensoleillé", "Châtain Doré"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 515,
        name: "Perruque Layered Dynamique",
        price: 169.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/6.jpg",
        images: [
            "attached_assets/6.jpg"
        ],
        description: "Coupe en dégradé dynamique pour un mouvement naturel.",
        sizes: ["One Size"],
        colors: ["Brun Caramel", "Noir Profond", "Blond Cuivré"],
        featured: false,
        bestseller: false,
        sale: false
    },
    {
        id: 516,
        name: "Perruque Shag Moderne",
        price: 139.99,
        originalPrice: 169.99,
        category: "perruques",
        image: "attached_assets/7.jpg",
        images: [
            "attached_assets/7.jpg"
        ],
        description: "Coupe shag moderne pour un style rock et tendance.",
        sizes: ["One Size"],
        colors: ["Brun Rock", "Blond Rebelle", "Noir Intense"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 517,
        name: "Perruque Textured Chic",
        price: 159.99,
        originalPrice: null,
        category: "perruques",
        image: "attached_assets/8.jpg",
        images: [
            "attached_assets/8.jpg"
        ],
        description: "Texture sophistiquée pour un look chic et moderne.",
        sizes: ["One Size"],
        colors: ["Brun Texture", "Blond Naturel", "Noir Soyeux"],
        featured: false,
        bestseller: true,
        sale: false
    },
    {
        id: 518,
        name: "Perruque Volume Luxe",
        price: 249.99,
        originalPrice: 299.99,
        category: "perruques",
        image: "attached_assets/9.jpg",
        images: [
            "attached_assets/9.jpg"
        ],
        description: "Volume luxueux pour un effet spectaculaire et glamour.",
        sizes: ["One Size"],
        colors: ["Brun Luxe", "Blond Prestige", "Noir Royal"],
        featured: true,
        bestseller: true,
        sale: true
    },
    // Nouveaux sacs pour avoir au moins 18 articles
    {
        id: 601,
        name: "Sac Voyage Premium",
        price: 199.99,
        originalPrice: 249.99,
        category: "sacs",
        image: "attached_assets/10.jpg",
        images: [
            "attached_assets/10.jpg"
        ],
        description: "Sac de voyage spacieux et élégant pour vos déplacements.",
        sizes: ["One Size"],
        colors: ["Noir", "Marron", "Marine"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 602,
        name: "Pochette Soirée Brillante",
        price: 79.99,
        originalPrice: null,
        category: "sacs",
        image: "attached_assets/hero.jpg",
        images: [
            "attached_assets/hero.jpg"
        ],
        description: "Pochette élégante avec finitions brillantes pour vos soirées.",
        sizes: ["One Size"],
        colors: ["Or", "Argent", "Rose Gold"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 603,
        name: "Sac Business Professionnel",
        price: 149.99,
        originalPrice: 189.99,
        category: "sacs",
        image: "attached_assets/image.jpeg",
        images: [
            "attached_assets/image.jpeg"
        ],
        description: "Sac professionnel parfait pour le bureau et les rendez-vous.",
        sizes: ["One Size"],
        colors: ["Noir", "Gris", "Bordeaux"],
        featured: false,
        bestseller: true,
        sale: true
    },
    {
        id: 604,
        name: "Sac Week-end Décontracté",
        price: 119.99,
        originalPrice: null,
        category: "sacs",
        image: "attached_assets/images.jpeg",
        images: [
            "attached_assets/images.jpeg"
        ],
        description: "Sac parfait pour les escapades de week-end.",
        sizes: ["One Size"],
        colors: ["Beige", "Kaki", "Marine"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 605,
        name: "Sac Bandoulière Moderne",
        price: 89.99,
        originalPrice: 109.99,
        category: "sacs",
        image: "attached_assets/stock_images/fashion_boutique_int_390ef7ed.jpg",
        images: [
            "attached_assets/stock_images/fashion_boutique_int_390ef7ed.jpg"
        ],
        description: "Sac bandoulière au design moderne et fonctionnel.",
        sizes: ["One Size"],
        colors: ["Camel", "Noir", "Bordeaux"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 606,
        name: "Sac Hobo Bohème",
        price: 99.99,
        originalPrice: null,
        category: "sacs",
        image: "attached_assets/stock_images/modern_fashion_works_9e59220d.jpg",
        images: [
            "attached_assets/stock_images/modern_fashion_works_9e59220d.jpg"
        ],
        description: "Sac hobo au style bohème pour un look décontracté.",
        sizes: ["One Size"],
        colors: ["Cognac", "Taupe", "Olive"],
        featured: false,
        bestseller: false,
        sale: false
    },
    {
        id: 607,
        name: "Sac Mini Tendance",
        price: 69.99,
        originalPrice: 89.99,
        category: "sacs",
        image: "attached_assets/vetement/enfan.jfif",
        images: [
            "attached_assets/vetement/enfan.jfif"
        ],
        description: "Mini sac tendance pour un look moderne et chic.",
        sizes: ["One Size"],
        colors: ["Rose", "Noir", "Blanc"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 608,
        name: "Sac Besace Vintage",
        price: 129.99,
        originalPrice: null,
        category: "sacs",
        image: "attached_assets/vetement/enfant.jpg",
        images: [
            "attached_assets/vetement/enfant.jpg"
        ],
        description: "Sac besace au charme vintage pour un style rétro.",
        sizes: ["One Size"],
        colors: ["Marron Vintage", "Noir Classique", "Bordeaux"],
        featured: false,
        bestseller: true,
        sale: false
    },
    {
        id: 609,
        name: "Sac Bucket Moderne",
        price: 109.99,
        originalPrice: 139.99,
        category: "sacs",
        image: "attached_assets/vetement/enfantt.webp",
        images: [
            "attached_assets/vetement/enfantt.webp"
        ],
        description: "Sac bucket moderne avec fermeture cordon élégante.",
        sizes: ["One Size"],
        colors: ["Camel", "Noir", "Marine"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 610,
        name: "Sac Clutch Élégant",
        price: 59.99,
        originalPrice: null,
        category: "sacs",
        image: "attached_assets/vetement/enfanttt.jfif",
        images: [
            "attached_assets/vetement/enfanttt.jfif"
        ],
        description: "Clutch élégant pour vos événements spéciaux.",
        sizes: ["One Size"],
        colors: ["Noir", "Nude", "Rouge"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 611,
        name: "Sac Shopping Large",
        price: 79.99,
        originalPrice: 99.99,
        category: "sacs",
        image: "attached_assets/vetement/enffant.jpg",
        images: [
            "attached_assets/vetement/enffant.jpg"
        ],
        description: "Grand sac shopping pour vos courses et sorties.",
        sizes: ["One Size"],
        colors: ["Beige", "Noir", "Kaki"],
        featured: false,
        bestseller: false,
        sale: true
    },
    {
        id: 612,
        name: "Sac Convertible 2-en-1",
        price: 159.99,
        originalPrice: null,
        category: "sacs",
        image: "attached_assets/vetement/images (1).jfif",
        images: [
            "attached_assets/vetement/images (1).jfif"
        ],
        description: "Sac convertible qui se transforme selon vos besoins.",
        sizes: ["One Size"],
        colors: ["Noir", "Taupe", "Bordeaux"],
        featured: true,
        bestseller: true,
        sale: false
    },
    // Nouveaux vêtements supplémentaires
    {
        id: 701,
        name: "Chemisier Soie Luxe",
        price: 129.99,
        originalPrice: 159.99,
        category: "vetements",
        image: "attached_assets/vetement/images.jfif",
        images: [
            "attached_assets/vetement/images.jfif"
        ],
        description: "Chemisier en soie pure pour un look sophistiqué.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blanc", "Beige", "Marine"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 702,
        name: "Manteau Hiver Élégant",
        price: 199.99,
        originalPrice: null,
        category: "vetements",
        image: "attached_assets/vetement/OUTFITTERY_10Y_Day1_1288_9335-683x1024.jpg",
        images: [
            "attached_assets/vetement/OUTFITTERY_10Y_Day1_1288_9335-683x1024.jpg"
        ],
        description: "Manteau d'hiver élégant et chaud pour la saison froide.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Camel", "Gris"],
        featured: true,
        bestseller: false,
        sale: false
    },
    // Nouveaux sacs avec images du dossier "sacs complement"
    {
        id: 703,
        name: "Sac Tendance Moderne",
        price: 89.99,
        originalPrice: 119.99,
        category: "sacs",
        image: "sacs complement/4c06f44a4faa4648b6fd82845af64147.jpg",
        images: [
            "sacs complement/4c06f44a4faa4648b6fd82845af64147.jpg"
        ],
        description: "Sac moderne au design contemporain, parfait pour un look tendance.",
        sizes: ["One Size"],
        colors: ["Marron", "Noir", "Beige"],
        featured: true,
        bestseller: true,
        sale: true
    },
    {
        id: 704,
        name: "Sac Élégant Premium",
        price: 125.99,
        originalPrice: null,
        category: "sacs",
        image: "sacs complement/574797bbd0e243b2b5e36fd3f407588e.jpg",
        images: [
            "sacs complement/574797bbd0e243b2b5e36fd3f407588e.jpg"
        ],
        description: "Sac premium avec finitions de qualité supérieure.",
        sizes: ["One Size"],
        colors: ["Noir", "Cognac", "Marine"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 705,
        name: "Sac Chic Collection",
        price: 95.99,
        originalPrice: 129.99,
        category: "sacs",
        image: "sacs complement/764b7ee3954a46999a877c6a78cedb61.jpg",
        images: [
            "sacs complement/764b7ee3954a46999a877c6a78cedb61.jpg"
        ],
        description: "Sac de la collection chic pour toutes les occasions spéciales.",
        sizes: ["One Size"],
        colors: ["Rouge", "Noir", "Taupe"],
        featured: false,
        bestseller: true,
        sale: true
    },
    {
        id: 706,
        name: "Sac Luxe Sophistiqué",
        price: 149.99,
        originalPrice: null,
        category: "sacs",
        image: "sacs complement/8effcdfb7a0d47de97a3901f43f27a87.jpg",
        images: [
            "sacs complement/8effcdfb7a0d47de97a3901f43f27a87.jpg"
        ],
        description: "Sac luxueux au design sophistiqué et raffiné.",
        sizes: ["One Size"],
        colors: ["Bordeaux", "Noir", "Camel"],
        featured: true,
        bestseller: true,
        sale: false
    },
    // Nouveaux accessoires avec images du dossier "accesoires"
    {
        id: 801,
        name: "Accessoire Style Unique",
        price: 45.99,
        originalPrice: 65.99,
        category: "perruques",
        image: "accesoires/2e786e3df02c4f55b539145ff0e292c5.jpg",
        images: [
            "accesoires/2e786e3df02c4f55b539145ff0e292c5.jpg"
        ],
        description: "Accessoire capillaire au style unique et moderne.",
        sizes: ["One Size"],
        colors: ["Naturel", "Brun", "Noir"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 802,
        name: "Perruque Exclusive Design",
        price: 199.99,
        originalPrice: null,
        category: "perruques",
        image: "accesoires/52ea9b884c4c4dde9b30d17b4c9cc649.jpg",
        images: [
            "accesoires/52ea9b884c4c4dde9b30d17b4c9cc649.jpg"
        ],
        description: "Perruque au design exclusif pour un look exceptionnel.",
        sizes: ["One Size"],
        colors: ["Châtain", "Blond", "Roux"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 803,
        name: "Accessoire Premium Quality",
        price: 85.99,
        originalPrice: 110.99,
        category: "perruques",
        image: "accesoires/643ffa375e9d42bea6871070b57488bc.jpg",
        images: [
            "accesoires/643ffa375e9d42bea6871070b57488bc.jpg"
        ],
        description: "Accessoire de qualité premium pour un rendu parfait.",
        sizes: ["One Size"],
        colors: ["Noir", "Brun", "Miel"],
        featured: false,
        bestseller: true,
        sale: true
    },
    {
        id: 804,
        name: "Style Capillaire Moderne",
        price: 129.99,
        originalPrice: null,
        category: "perruques",
        image: "accesoires/78e19addb8eb48c09d928574e7c14e9c.jpg",
        images: [
            "accesoires/78e19addb8eb48c09d928574e7c14e9c.jpg"
        ],
        description: "Style capillaire moderne et tendance.",
        sizes: ["One Size"],
        colors: ["Blond Platine", "Noir", "Auburn"],
        featured: true,
        bestseller: false,
        sale: false
    },
    {
        id: 805,
        name: "Perruque Collection Elite",
        price: 175.99,
        originalPrice: 229.99,
        category: "perruques",
        image: "accesoires/81f29e4a500e466a92f9515b3b1e7fcd.jpg",
        images: [
            "accesoires/81f29e4a500e466a92f9515b3b1e7fcd.jpg"
        ],
        description: "Perruque de la collection élite avec finition impeccable.",
        sizes: ["One Size"],
        colors: ["Brun Doré", "Noir Jais", "Blond Cendré"],
        featured: true,
        bestseller: true,
        sale: true
    },
    // Nouveaux vêtements avec images du dossier "vetement complement"
    {
        id: 806,
        name: "Vêtement Style Contemporain",
        price: 79.99,
        originalPrice: 99.99,
        category: "vetements",
        image: "vetement complement/1cd07605183b491a8540c9fcd7e328e4.jpg",
        images: [
            "vetement complement/1cd07605183b491a8540c9fcd7e328e4.jpg"
        ],
        description: "Vêtement au style contemporain et moderne.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Blanc", "Gris"],
        featured: true,
        bestseller: false,
        sale: true
    },
    {
        id: 807,
        name: "Tenue Élégante Moderne",
        price: 119.99,
        originalPrice: null,
        category: "vetements",
        image: "vetement complement/3a3baee4a2d5434f8eecfff1126640dc.jpg",
        images: [
            "vetement complement/3a3baee4a2d5434f8eecfff1126640dc.jpg"
        ],
        description: "Tenue élégante au design moderne et raffiné.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Marine", "Noir", "Bordeaux"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 808,
        name: "Mode Avant-garde",
        price: 95.99,
        originalPrice: 129.99,
        category: "vetements",
        image: "vetement complement/4e29e6eeaae547ef89a4a579c6562f55.jpg",
        images: [
            "vetement complement/4e29e6eeaae547ef89a4a579c6562f55.jpg"
        ],
        description: "Vêtement avant-garde pour un look unique.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Kaki", "Noir", "Beige"],
        featured: false,
        bestseller: true,
        sale: true
    },
    {
        id: 809,
        name: "Collection Premium Style",
        price: 149.99,
        originalPrice: null,
        category: "vetements",
        image: "vetement complement/5a607210b5b04572acd7e8fc4a787eca.jpg",
        images: [
            "vetement complement/5a607210b5b04572acd7e8fc4a787eca.jpg"
        ],
        description: "Pièce de la collection premium au style sophistiqué.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Noir", "Blanc Cassé", "Taupe"],
        featured: true,
        bestseller: true,
        sale: false
    },
    {
        id: 810,
        name: "Vêtement Sophistiqué",
        price: 89.99,
        originalPrice: 115.99,
        category: "vetements",
        image: "vetement complement/8c848ede7f1346edbe4a504f52bbef04.jpg",
        images: [
            "vetement complement/8c848ede7f1346edbe4a504f52bbef04.jpg"
        ],
        description: "Vêtement sophistiqué pour toutes les occasions.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Bleu Nuit", "Noir", "Gris Anthracite"],
        featured: true,
        bestseller: false,
        sale: true
    }
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
    if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)}`;
    if (descriptionEl) descriptionEl.textContent = product.description;
    
    if (product.originalPrice && originalPriceEl && savingsEl) {
        originalPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
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
    // TEST: Ajouter des produits de test si le panier est vide
    addTestItemsToCart();
    renderCartItems();
    updateCartSummary();
    setupCartEvents();
}

function setupCartEvents() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    const checkoutBtn = document.querySelector('[data-testid="checkout-btn"]');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
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
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-quantity-controls">
                    <button onclick="updateCartItemQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
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
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
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
        `<span class="original-price">${product.originalPrice.toFixed(2)}€</span>` : '';
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
                    <span class="price">${product.price.toFixed(2)}€</span>
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
    if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
    
    if (modalOriginalPrice) {
        if (product.originalPrice) {
            modalOriginalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
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
    
    amountEl.value = `$${total.total.toFixed(2)}`;    
    
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
                        <p><strong>Montant à payer :</strong> $${total.total.toFixed(2)} USD</p>
                        <p><strong>Méthode :</strong> ${methodName}</p>
                        <p><strong>Votre numéro :</strong> ${phoneNumber}</p>
                        <p><strong>Envoyer vers :</strong> ${receivingData.number}</p>
                        <p><strong>Pays :</strong> ${receivingData.country}</p>
                    </div>
                    
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="margin: 0 0 10px 0; color: #2c5530;">Instructions :</h4>
                        <p style="margin: 0;">Effectuez le transfert de <strong>$${total.total.toFixed(2)} USD</strong> vers <strong>${receivingData.number}</strong> via ${methodName}</p>
                    </div>
                    
                    <p>Votre commande sera traitée dès réception du paiement.</p>
                    <p>Merci pour votre confiance !</p>
                    <p><strong>L'équipe StyleCraft</strong></p>
                </div>
            `,
            text: `Confirmation de commande StyleCraft\n\nMontant: $${total.total.toFixed(2)} USD\nMéthode: ${methodName}\nVotre numéro: ${phoneNumber}\nEnvoyer vers: ${receivingData.number}\nPays: ${receivingData.country}\n\nEffectuez le transfert via ${methodName} et votre commande sera traitée dès réception du paiement.\n\nMerci pour votre confiance !\nL'équipe StyleCraft`
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
                    <span>${currentPaymentData.orderDetails.total}€</span>
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
            <p>Votre paiement de <strong>${currentPaymentData.orderDetails.total}€</strong> via ${paymentMethod} a été traité avec succès.</p>
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

// Flutterwave Payment Function
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
    
    // Configuration de paiement
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
        meta: {
            cart_id: Date.now().toString(),
            order_id: 'SC' + Date.now().toString().slice(-8),
            items_count: cart.length
        },
        callback: function (data) {
            console.log("Paiement réussi:", data);
            
            if (data.status === "successful") {
                // Afficher l'alerte de succès avec la référence
                alert(`Paiement réussi ! \nRéférence de transaction: ${data.tx_ref}\nMontant: $${data.amount}`);
                
                // Vider le panier et rediriger
                setTimeout(() => {
                    cart = [];
                    localStorage.setItem('stylecraft-cart', JSON.stringify(cart));
                    updateCartCount();
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

// TEST: Ajouter des produits au panier pour tester Flutterwave (à supprimer en prod)
function addTestItemsToCart() {
    // Ajouter quelques produits de test
    const testItems = [
        {
            id: 101,
            name: "Perruque Cheveux Naturels Longs",
            price: 189.99,
            originalPrice: 249.99,
            category: "perruques",
            image: "src/assets/perruque-cheveux-naturels-1.jpg",
            size: "One Size",
            color: "Brun",
            quantity: 1
        },
        {
            id: 703,
            name: "Sac Tendance Moderne",
            price: 89.99,
            originalPrice: 119.99,
            category: "sacs",
            image: "sacs complement/4c06f44a4faa4648b6fd82845af64147.jpg",
            size: "One Size",
            color: "Marron",
            quantity: 2
        }
    ];
    
    // Ajouter les articles au panier seulement s'il est vide (pour les tests)
    if (cart.length === 0) {
        cart = testItems;
        localStorage.setItem('stylecraft-cart', JSON.stringify(cart));
        updateCartCount();
        console.log('Produits de test ajoutés au panier:', cart);
    }
}

// Initialize payment modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Setup checkout button
    const checkoutBtn = document.querySelector('[data-testid="checkout-btn"]');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Setup Flutterwave payment button
    const flutterwaveBtn = document.getElementById('flutterwavePayBtn');
    if (flutterwaveBtn) {
        flutterwaveBtn.addEventListener('click', payWithFlutterwave);
    }
    
    // TEST: Ajouter des produits de test et charger la page panier si nécessaire
    if (window.location.pathname.includes('cart.html')) {
        addTestItemsToCart();
        loadCartPage();
    }
    
    // Setup modal close on overlay click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                if (modal.id === 'paymentModal') {
                    closePaymentModal();
                } else if (modal.id === 'mobilePaymentModal') {
                    closeMobilePaymentModal();
                }
            }
        }
    });
    
    // Setup ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const paymentModal = document.getElementById('paymentModal');
            const mobileModal = document.getElementById('mobilePaymentModal');
            
            if (paymentModal && paymentModal.classList.contains('active')) {
                closePaymentModal();
            } else if (mobileModal && mobileModal.classList.contains('active')) {
                closeMobilePaymentModal();
            }
        }
    });
});