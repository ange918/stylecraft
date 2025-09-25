// =============================================
//   StyleCraft - E-commerce JavaScript
// =============================================

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

// Sample Products Data
const sampleProducts = [
    // Perruques
    {
        id: 101,
        name: "Perruque Cheveux Naturels Longs",
        price: 299.99,
        originalPrice: 399.99,
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
        price: 89.99,
        originalPrice: 129.99,
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
        price: 149.99,
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
        price: 179.99,
        originalPrice: 229.99,
        category: "vetements-femme",
        image: "src/assets/robe-elegante-soiree-1.jpg",
        images: [
            "src/assets/robe-elegante-soiree-1.jpg",
            "src/assets/robe-elegante-soiree-2.jpg"
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
        price: 49.99,
        originalPrice: null,
        category: "vetements-femme",
        image: "src/assets/top-decontracte-femme-1.jpg",
        images: [
            "src/assets/top-decontracte-femme-1.jpg"
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
        price: 39.99,
        originalPrice: 59.99,
        category: "vetements-enfant",
        image: "src/assets/robe-princesse-enfant-1.jpg",
        images: [
            "src/assets/robe-princesse-enfant-1.jpg"
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
        price: 19.99,
        originalPrice: null,
        category: "vetements-enfant",
        image: "src/assets/tshirt-enfant-graphique-1.jpg",
        images: [
            "src/assets/tshirt-enfant-graphique-1.jpg"
        ],
        description: "T-shirt amusant avec motif graphique, coton 100%.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Bleu", "Rouge", "Vert"],
        featured: false,
        bestseller: false,
        sale: false
    },
    // Sacs
    {
        id: 401,
        name: "Sac à Main Cuir Premium",
        price: 249.99,
        originalPrice: 329.99,
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
        price: 89.99,
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
        price: 79.99,
        originalPrice: 99.99,
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
    // Produits existants (gardés pour compatibilité)
    {
        id: 1,
        name: "Classic White Button-Down Shirt",
        price: 89.99,
        originalPrice: 119.99,
        category: "mens",
        image: "src/assets/chemise-blanche-homme-1.jpg",
        images: [
            "src/assets/chemise-blanche-homme-1.jpg",
            "src/assets/chemise-blanche-homme-2.jpg"
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
        price: 149.99,
        originalPrice: null,
        category: "womens",
        image: "src/assets/robe-noire-elegante-1.jpg",
        images: [
            "src/assets/robe-noire-elegante-1.jpg",
            "src/assets/robe-noire-elegante-2.jpg"
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
        price: 119.99,
        originalPrice: 159.99,
        category: "mens",
        image: "src/assets/jean-premium-homme-1.jpg",
        images: [
            "src/assets/jean-premium-homme-1.jpg",
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
        price: 79.99,
        originalPrice: null,
        category: "womens",
        image: "src/assets/pull-tricot-femme-1.jpg",
        images: [
            "src/assets/pull-tricot-femme-1.jpg",
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
        price: 24.99,
        originalPrice: 34.99,
        category: "kids",
        image: "src/assets/tshirt-aventure-enfant-1.jpg",
        images: [
            "src/assets/tshirt-aventure-enfant-1.jpg"
        ],
        description: "Fun and colorful t-shirt designed for active kids. Comfortable cotton fabric.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Blue", "Green", "Red"],
        featured: false,
        bestseller: false,
        sale: true
    },
    {
        id: 6,
        name: "Leather Crossbody Bag",
        price: 199.99,
        originalPrice: null,
        category: "accessories",
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
        price: 59.99,
        originalPrice: 79.99,
        category: "mens",
        image: "src/assets/polo-coton-homme-1.jpg",
        images: [
            "src/assets/polo-coton-homme-1.jpg"
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
        price: 89.99,
        originalPrice: null,
        category: "womens",
        image: "src/assets/robe-ete-fluide-1.jpg",
        images: [
            "src/assets/robe-ete-fluide-1.jpg"
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
        name: "Kids Denim Jacket",
        price: 44.99,
        originalPrice: 64.99,
        category: "kids",
        image: "src/assets/veste-jean-enfant-1.jpg",
        images: [
            "src/assets/veste-jean-enfant-1.jpg"
        ],
        description: "Stylish denim jacket for kids. Durable and perfect for layering.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: ["Light Blue", "Dark Blue"],
        featured: false,
        bestseller: false,
        sale: true
    },
    {
        id: 10,
        name: "Classic Watch",
        price: 299.99,
        originalPrice: null,
        category: "accessories",
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
    } else if (currentPath.includes('vetements-femme-enfant.html')) {
        loadCategoryPage('vetements-femme', 'vetements-enfant');
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
        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : '';
    const saleBadge = product.sale ? '<div class="sale-badge">Sale!</div>' : '';
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${saleBadge}
                <button class="quick-view-btn" onclick="openQuickView(${product.id})">Quick View</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    ${salePrice}
                </div>
            </div>
        </div>
    `;
}

function setupProductCardEvents(container) {
    const productCards = container.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (event) => {
            // Don't navigate if clicking quick view button
            if (event.target.classList.contains('quick-view-btn')) return;
            
            const productId = card.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
    });
}

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
    
    if (method === 'airtel' || method === 'orange') {
        closePaymentModal();
        openMobilePaymentModal(method);
    } else if (method === 'card') {
        closePaymentModal();
        showToast('Intégration carte de crédit à venir', 'success');
    } else if (method === 'paypal') {
        closePaymentModal();
        showToast('Intégration PayPal à venir', 'success');
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
    
    amountEl.value = `${total.total.toFixed(2)} FCFA`;
    
    // Set payment instructions
    instructionsEl.innerHTML = generatePaymentInstructions(method);
    
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

// Generate payment instructions
function generatePaymentInstructions(method) {
    if (method === 'airtel') {
        return `
            <h4><i class="fas fa-info-circle"></i> Instructions de paiement Airtel Money</h4>
            <ol>
                <li>Composez <strong>#123#</strong> sur votre téléphone Airtel</li>
                <li>Sélectionnez <strong>Paiement Marchand</strong></li>
                <li>Entrez le code marchand : <strong>StyleCraft001</strong></li>
                <li>Entrez le montant affiché ci-dessus</li>
                <li>Confirmez avec votre code PIN Airtel Money</li>
                <li>Cliquez sur "Confirmer le paiement" après avoir reçu le SMS de confirmation</li>
            </ol>
        `;
    } else if (method === 'orange') {
        return `
            <h4><i class="fas fa-info-circle"></i> Instructions de paiement Orange Money</h4>
            <ol>
                <li>Composez <strong>#144#</strong> sur votre téléphone Orange</li>
                <li>Sélectionnez <strong>Paiement Marchand</strong></li>
                <li>Entrez le code marchand : <strong>StyleCraft002</strong></li>
                <li>Entrez le montant affiché ci-dessus</li>
                <li>Confirmez avec votre code PIN Orange Money</li>
                <li>Cliquez sur "Confirmer le paiement" après avoir reçu le SMS de confirmation</li>
            </ol>
        `;
    }
    return '';
}

// Setup mobile payment form
function setupMobilePaymentForm(method) {
    const form = document.getElementById('mobilePaymentForm');
    if (!form) return;
    
    // Remove existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new event listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processMobilePayment(method);
    });
}

// Process mobile payment
function processMobilePayment(method) {
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    if (!phoneNumber) {
        showToast('Veuillez entrer votre numéro de téléphone', 'error');
        return;
    }
    
    // Validate phone number format (basic validation)
    if (!isValidPhoneNumber(phoneNumber)) {
        showToast('Format de numéro de téléphone invalide', 'error');
        return;
    }
    
    // Show processing state
    const submitBtn = document.querySelector('#mobilePaymentForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Traitement en cours...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success
        showPaymentSuccess(method, phoneNumber);
        
        // Clear cart after successful payment
        clearCart();
        
    }, 3000);
}

// Show payment success
function showPaymentSuccess(method, phoneNumber) {
    const modal = document.getElementById('mobilePaymentModal');
    const modalBody = modal.querySelector('.modal-body');
    
    const paymentMethod = method === 'airtel' ? 'Airtel Money' : 'Orange Money';
    const total = calculateCartTotal();
    
    modalBody.innerHTML = `
        <div class="payment-success">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Paiement Réussi!</h3>
            <p>Votre paiement de <strong>${total.total.toFixed(2)} FCFA</strong> via ${paymentMethod} a été traité avec succès.</p>
            <p>Numéro de téléphone: <strong>${phoneNumber}</strong></p>
            <p>Un SMS de confirmation vous sera envoyé prochainement.</p>
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

// Validate phone number (basic validation for African numbers)
function isValidPhoneNumber(phone) {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Check for various African phone number formats
    const patterns = [
        /^\+225\d{8,10}$/,  // Côte d'Ivoire
        /^\+221\d{7,9}$/,   // Sénégal
        /^\+226\d{8}$/,     // Burkina Faso
        /^\+223\d{8}$/,     // Mali
        /^\+227\d{8}$/,     // Niger
        /^(05|06|07|08|09)\d{8}$/,  // Local format
        /^\d{8,10}$/        // Simple 8-10 digit format
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
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

// Initialize payment modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Setup checkout button
    const checkoutBtn = document.querySelector('[data-testid="checkout-btn"]');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
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