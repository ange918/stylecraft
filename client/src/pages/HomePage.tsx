import { useState } from 'react';
import { Link } from 'wouter';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { getNewArrivals, getBestsellers } from '@/lib/products';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const newArrivals = getNewArrivals();
  const bestsellers = getBestsellers();

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const categories = [
    {
      name: 'Mens Wear',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      href: '/shop?category=mens'
    },
    {
      name: 'Womens Wear',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      href: '/shop?category=womens'
    },
    {
      name: 'Kids Wear',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      href: '/shop?category=kids'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      href: '/shop?category=accessories'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Absolutely love the quality and fit of everything I\'ve ordered. The materials are premium and the designs are timeless.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
    },
    {
      name: 'Michael Chen',
      text: 'Fast shipping and excellent customer service. The clothes fit perfectly and look exactly like the photos.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
    },
    {
      name: 'Emily Rodriguez',
      text: 'StyleCraft has become my go-to for professional and casual wear. The quality is consistently excellent.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b814?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
    }
  ];

  const processSteps = [
    {
      icon: 'fas fa-search',
      title: 'Pick Styles',
      description: 'Browse our curated collection and discover pieces that match your personal style and preferences.'
    },
    {
      icon: 'fas fa-ruler',
      title: 'Pick Your Fit',
      description: 'Use our detailed size guide to find the perfect fit. We offer various sizes and fits for every body type.'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'Checkout Fast',
      description: 'Complete your purchase quickly with our streamlined checkout process and multiple payment options.'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary leading-tight mb-6" data-testid="hero-title">
                Timeless Fashion for the Modern Wardrobe
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg" data-testid="hero-description">
                Discover our curated collection of premium clothing that combines classic elegance with contemporary style.
              </p>
              <Link href="/shop">
                <Button className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg btn-hover shadow-lg" data-testid="hero-cta">
                  Explore the Collection
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
                alt="Fashion model showcasing modern wardrobe"
                className="rounded-2xl shadow-2xl w-full h-auto max-w-md mx-auto"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="new-arrivals-title">
              New Arrivals
            </h2>
            <p className="text-muted-foreground text-lg">Fresh styles just dropped</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="new-arrivals-grid">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showQuickView
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="categories-title">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="categories-grid">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <div className="group cursor-pointer" data-testid={`category-${category.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={category.image}
                      alt={`${category.name} collection`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="promo-title">
            Get up to 50% off
          </h2>
          <p className="text-xl mb-8 opacity-90">Limited time offer on selected items</p>
          <Link href="/shop?sale=true">
            <Button className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg btn-hover shadow-lg" data-testid="promo-cta">
              Shop Sale Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="bestsellers-title">
              Bestsellers
            </h2>
            <p className="text-muted-foreground text-lg">Customer favorites that keep selling out</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="bestsellers-grid">
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showQuickView
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="testimonials-title">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg">Real reviews from real customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm" data-testid={`testimonial-${index}`}>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} customer photo`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="how-it-works-title">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">Simple steps to get your perfect style</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="how-it-works-grid">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center" data-testid={`process-step-${index}`}>
                <div className="bg-secondary text-secondary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  <i className={step.icon}></i>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </main>
  );
}
