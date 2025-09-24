import { useState } from 'react';
import { Product } from '@shared/schema';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor || product.colors[0],
      image: product.image
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`
    });

    onClose();
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full" data-testid="quick-view-modal">
        <DialogHeader>
          <DialogTitle>Quick View</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg"
              data-testid="modal-product-image"
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4" data-testid="modal-product-name">
              {product.name}
            </h3>
            
            {product.sale && product.originalPrice ? (
              <div className="flex items-center space-x-2 mb-6">
                <p className="text-2xl text-accent font-bold" data-testid="modal-product-sale-price">
                  ${product.price}
                </p>
                <p className="text-xl text-muted-foreground line-through" data-testid="modal-product-original-price">
                  ${product.originalPrice}
                </p>
              </div>
            ) : (
              <p className="text-2xl text-accent font-bold mb-6" data-testid="modal-product-price">
                ${product.price}
              </p>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                    data-testid={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`border px-4 py-2 rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary hover:text-primary'
                      }`}
                      data-testid={`color-${color}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary mb-2">Quantity</label>
              <div className="flex items-center border border-border rounded-lg w-32">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-muted-foreground hover:text-primary"
                  data-testid="decrease-quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center py-2 bg-transparent border-none focus:outline-none"
                  min="1"
                  data-testid="quantity-input"
                />
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-muted-foreground hover:text-primary"
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 btn-hover"
                data-testid="add-to-cart-btn"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
                data-testid="view-details-btn"
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
