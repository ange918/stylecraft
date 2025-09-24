import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
        <p>
          <i className="fas fa-gift mr-2"></i>
          Get 15% off on your first order - Use code: WELCOME15
        </p>
      </div>

      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer" data-testid="logo">
                  StyleCraft
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "transition-colors duration-200",
                      location === item.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-secondary"
                    )}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button 
                className="text-muted-foreground hover:text-secondary transition-colors duration-200"
                data-testid="search-btn"
              >
                <i className="fas fa-search text-lg"></i>
              </button>
              <button 
                className="text-muted-foreground hover:text-secondary transition-colors duration-200"
                data-testid="user-btn"
              >
                <i className="fas fa-user text-lg"></i>
              </button>
              <Link href="/cart">
                <button 
                  className="text-muted-foreground hover:text-secondary transition-colors duration-200 relative"
                  data-testid="cart-btn"
                >
                  <i className="fas fa-shopping-bag text-lg"></i>
                  <span 
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    data-testid="cart-count"
                  >
                    {getTotalItems()}
                  </span>
                </button>
              </Link>

              {/* Mobile menu button */}
              <button 
                className="md:hidden text-muted-foreground hover:text-secondary"
                onClick={() => setIsMobileMenuOpen(true)}
                data-testid="mobile-menu-btn"
              >
                <i className="fas fa-bars text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "mobile-menu fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl md:hidden",
            isMobileMenuOpen ? "active" : ""
          )}
          data-testid="mobile-menu"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-primary">StyleCraft</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-muted-foreground"
              data-testid="mobile-menu-close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="p-4 space-y-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "block",
                    location === item.href
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          data-testid="mobile-menu-overlay"
        />
      )}
    </>
  );
}
