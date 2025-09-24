import { useState } from 'react';
import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, showQuickView = false, onQuickView }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="product-card bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-t-xl">
        {product.sale && (
          <div 
            className="sale-badge absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-semibold z-10"
            data-testid={`sale-badge-${product.id}`}
          >
            Sale!
          </div>
        )}
        
        <Link href={`/product/${product.id}`}>
          <div className="relative">
            {!imageLoaded && (
              <div className="w-full h-64 bg-muted animate-pulse rounded-t-xl" />
            )}
            <img
              src={product.image}
              alt={product.name}
              className={cn(
                "w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300",
                imageLoaded ? "block" : "hidden"
              )}
              onLoad={() => setImageLoaded(true)}
              data-testid={`product-image-${product.id}`}
            />
          </div>
        </Link>

        {showQuickView && onQuickView && (
          <button
            className="quick-view-btn absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleQuickView}
            data-testid={`quick-view-${product.id}`}
          >
            Quick View
          </button>
        )}
      </div>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 
            className="font-semibold text-primary mb-2 hover:text-secondary transition-colors cursor-pointer"
            data-testid={`product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </Link>
        
        {product.sale && product.originalPrice ? (
          <div className="flex items-center space-x-2">
            <p className="text-accent font-bold" data-testid={`product-sale-price-${product.id}`}>
              ${product.price}
            </p>
            <p className="text-muted-foreground line-through" data-testid={`product-original-price-${product.id}`}>
              ${product.originalPrice}
            </p>
          </div>
        ) : (
          <p className="text-accent font-bold" data-testid={`product-price-${product.id}`}>
            ${product.price}
          </p>
        )}
      </div>
    </div>
  );
}
