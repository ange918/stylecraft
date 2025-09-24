import { Link } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-xl shadow-sm p-12" data-testid="empty-cart">
            <i className="fas fa-shopping-bag text-6xl text-muted-foreground mb-6"></i>
            <h1 className="text-3xl font-bold text-primary mb-4">Your cart is empty</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/shop">
              <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg btn-hover" data-testid="continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="py-8 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary" data-testid="cart-title">
            Shopping Cart ({cart.length} items)
          </h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
            data-testid="clear-cart"
          >
            <i className="fas fa-trash mr-2"></i>
            Clear Cart
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-border" data-testid="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center p-6 space-x-4" data-testid={`cart-item-${item.id}`}>
                    <Link href={`/product/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        data-testid={`cart-item-image-${item.id}`}
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-primary hover:text-secondary transition-colors cursor-pointer" data-testid={`cart-item-name-${item.id}`}>
                          {item.name}
                        </h3>
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span data-testid={`cart-item-size-${item.id}`}>Size: {item.size}</span>
                        {item.color && (
                          <span className="ml-4" data-testid={`cart-item-color-${item.id}`}>
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                      <p className="text-accent font-bold mt-2" data-testid={`cart-item-price-${item.id}`}>
                        ${item.price}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        data-testid={`decrease-quantity-${item.id}`}
                      >
                        -
                      </button>
                      <span className="px-3 py-2 border-x border-border min-w-[3rem] text-center" data-testid={`quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        data-testid={`increase-quantity-${item.id}`}
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right min-w-[5rem]">
                      <p className="font-bold text-primary" data-testid={`item-total-${item.id}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors ml-4"
                      data-testid={`remove-item-${item.id}`}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <i className="fas fa-trash text-lg"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Continue Shopping */}
            <div className="mt-6">
              <Link href="/shop">
                <Button variant="outline" className="btn-hover" data-testid="continue-shopping-link">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm p-6 sticky top-4" data-testid="cart-summary">
              <h2 className="text-xl font-semibold text-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold text-primary" data-testid="subtotal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-semibold text-primary" data-testid="shipping">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    <i className="fas fa-check-circle mr-1"></i>
                    Free shipping on orders over $50!
                  </p>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-semibold text-primary" data-testid="tax">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-primary">Total:</span>
                  <span className="font-bold text-primary" data-testid="total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-4 text-lg font-semibold btn-hover"
                  data-testid="checkout-btn"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <i className="fas fa-shield-alt mr-1"></i>
                      Secure Checkout
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-truck mr-1"></i>
                      Fast Delivery
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium text-primary mb-3">We Accept:</p>
                <div className="flex space-x-2">
                  <div className="bg-muted p-2 rounded text-xs font-mono">VISA</div>
                  <div className="bg-muted p-2 rounded text-xs font-mono">MC</div>
                  <div className="bg-muted p-2 rounded text-xs font-mono">AMEX</div>
                  <div className="bg-muted p-2 rounded text-xs font-mono">PAYPAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
