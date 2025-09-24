import { Product } from "@shared/schema";

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic White Shirt',
    price: 89,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800',
    category: 'mens',
    sale: false,
    description: 'A timeless white button-up shirt crafted from premium cotton.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    inStock: true
  },
  {
    id: 2,
    name: 'Premium Denim Jeans',
    price: 79,
    originalPrice: 120,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800',
    category: 'mens',
    sale: true,
    description: 'High-quality denim jeans with a perfect fit and comfort.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Dark Blue', 'Black'],
    inStock: true
  },
  {
    id: 3,
    name: 'Cozy Knit Sweater',
    price: 95,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800',
    category: 'womens',
    sale: false,
    description: 'Soft and warm knit sweater perfect for any season.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Navy', 'Cream'],
    inStock: true
  },
  {
    id: 4,
    name: 'Tailored Blazer',
    price: 185,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800',
    category: 'mens',
    sale: false,
    description: 'Professional blazer with modern tailoring and premium materials.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Charcoal', 'Black'],
    inStock: true
  },
  {
    id: 5,
    name: 'Summer Floral Dress',
    price: 125,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800',
    category: 'womens',
    sale: false,
    description: 'Elegant floral dress perfect for summer occasions.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print', 'Solid Navy'],
    inStock: true
  },
  {
    id: 6,
    name: 'Leather Oxford Shoes',
    price: 165,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800',
    category: 'accessories',
    sale: false,
    description: 'Classic oxford shoes made from genuine leather.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Brown', 'Black'],
    inStock: true
  },
  {
    id: 7,
    name: 'Essential T-Shirt',
    price: 35,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600',
    category: 'mens',
    sale: false,
    description: 'Essential t-shirt made from soft, breathable cotton.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Grey'],
    inStock: true
  },
  {
    id: 8,
    name: 'Classic Sneakers',
    price: 120,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600',
    category: 'accessories',
    sale: false,
    description: 'Comfortable and stylish sneakers for everyday wear.',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black'],
    inStock: true
  },
  {
    id: 9,
    name: 'Denim Jacket',
    price: 95,
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600',
    category: 'mens',
    sale: false,
    description: 'Classic denim jacket with modern styling.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black'],
    inStock: true
  },
  {
    id: 10,
    name: 'Leather Handbag',
    price: 185,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600',
    category: 'accessories',
    sale: false,
    description: 'Elegant leather handbag perfect for any occasion.',
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Tan'],
    inStock: true
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getNewArrivals = (): Product[] => {
  return products.slice(0, 6);
};

export const getBestsellers = (): Product[] => {
  return products.slice(6, 10);
};
