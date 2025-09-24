import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { getProductById } from '@/lib/products';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductPage() {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : null;
  const product = productId ? getProductById(productId) : null;
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

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
  };

  // Mock additional images for gallery
  const productImages = [
    product.image,
    product.image, // In a real app, these would be different angles
    product.image,
    product.image
  ];

  const reviews = [
    {
      name: "John Doe",
      rating: 5,
      comment: "Great quality and perfect fit!",
      date: "2024-01-15"
    },
    {
      name: "Jane Smith",
      rating: 4,
      comment: "Love the style, runs a bit small.",
      date: "2024-01-10"
    }
  ];

  return (
    <div className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" data-testid="breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <span className="text-muted-foreground">/</span>
            <li>
              <Link href="/shop" className="text-muted-foreground hover:text-primary">
                Shop
              </Link>
            </li>
            <span className="text-muted-foreground">/</span>
            <li className="text-primary font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                data-testid="main-product-image"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2" data-testid="image-gallery">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImageIndex === index ? 'border-primary' : 'border-border'
                  }`}
                  data-testid={`thumbnail-${index}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.sale && (
                <Badge className="sale-badge text-white mb-2" data-testid="sale-badge">
                  Sale!
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-primary mb-2" data-testid="product-title">
                {product.name}
              </h1>
              
              {product.sale && product.originalPrice ? (
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-accent" data-testid="sale-price">
                    ${product.price}
                  </span>
                  <span className="text-2xl text-muted-foreground line-through" data-testid="original-price">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </div>
              ) : (
                <div className="text-3xl font-bold text-accent mb-6" data-testid="product-price">
                  ${product.price}
                </div>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mb-6" data-testid="product-description">
                {product.description}
              </p>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary mb-3">
                Size <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2" data-testid="size-selection">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                    data-testid={`size-option-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-3">Color</label>
                <div className="flex flex-wrap gap-2" data-testid="color-selection">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`border px-4 py-2 rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary hover:text-primary'
                      }`}
                      data-testid={`color-option-${color}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-primary mb-3">Quantity</label>
              <div className="flex items-center border border-border rounded-lg w-32" data-testid="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-muted-foreground hover:text-primary"
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-4 text-lg font-semibold btn-hover"
                data-testid="add-to-cart"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  data-testid="add-to-wishlist"
                >
                  <i className="fas fa-heart mr-2"></i>
                  Add to Wishlist
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  data-testid="share-product"
                >
                  <i className="fas fa-share mr-2"></i>
                  Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <i className="fas fa-truck text-secondary mr-3"></i>
                  <span className="text-sm text-muted-foreground">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-undo text-secondary mr-3"></i>
                  <span className="text-sm text-muted-foreground">30-day return policy</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-secondary mr-3"></i>
                  <span className="text-sm text-muted-foreground">1-year warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
              <TabsTrigger value="sizing" data-testid="tab-sizing">Size Guide</TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-primary mb-4">Product Description</h3>
                <p className="text-muted-foreground">
                  {product.description || 'This is a high-quality product crafted with attention to detail. Made from premium materials, it offers both style and comfort for everyday wear.'}
                </p>
                <h4 className="text-md font-semibold text-primary mt-6 mb-2">Features:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Premium quality materials</li>
                  <li>• Comfortable fit</li>
                  <li>• Durable construction</li>
                  <li>• Easy care instructions</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="sizing" className="mt-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Size Guide</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-4 py-2 text-left">Size</th>
                        <th className="border border-border px-4 py-2 text-left">Chest (inches)</th>
                        <th className="border border-border px-4 py-2 text-left">Waist (inches)</th>
                        <th className="border border-border px-4 py-2 text-left">Length (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-2">XS</td>
                        <td className="border border-border px-4 py-2">32-34</td>
                        <td className="border border-border px-4 py-2">28-30</td>
                        <td className="border border-border px-4 py-2">26</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-2">S</td>
                        <td className="border border-border px-4 py-2">34-36</td>
                        <td className="border border-border px-4 py-2">30-32</td>
                        <td className="border border-border px-4 py-2">27</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-2">M</td>
                        <td className="border border-border px-4 py-2">36-38</td>
                        <td className="border border-border px-4 py-2">32-34</td>
                        <td className="border border-border px-4 py-2">28</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-2">L</td>
                        <td className="border border-border px-4 py-2">38-40</td>
                        <td className="border border-border px-4 py-2">34-36</td>
                        <td className="border border-border px-4 py-2">29</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-2">XL</td>
                        <td className="border border-border px-4 py-2">40-42</td>
                        <td className="border border-border px-4 py-2">36-38</td>
                        <td className="border border-border px-4 py-2">30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="border-b border-border pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-primary">{review.name}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-gray-300'}`}></i>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button variant="outline" data-testid="write-review">
                    Write a Review
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
