import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { products } from '@/lib/products';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ShopPage() {
  const [location] = useLocation();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: '',
    sale: false
  });

  const productsPerPage = 6;

  // Parse URL params for initial filters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const category = urlParams.get('category');
    const sale = urlParams.get('sale');
    
    if (category) {
      setFilters(prev => ({ ...prev, categories: [category] }));
    }
    if (sale === 'true') {
      setFilters(prev => ({ ...prev, sale: true }));
    }
  }, [location]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Sale filter
    if (filters.sale) {
      filtered = filtered.filter(product => product.sale);
    }

    // Price filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        switch (filters.priceRange) {
          case '0-50':
            return product.price <= 50;
          case '50-100':
            return product.price > 50 && product.price <= 100;
          case '100-200':
            return product.price > 100 && product.price <= 200;
          case '200+':
            return product.price > 200;
          default:
            return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // For demo, reverse the order to simulate newest first
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const categories = [
    { id: 'mens', label: 'Mens Wear' },
    { id: 'womens', label: 'Womens Wear' },
    { id: 'kids', label: 'Kids Wear' },
    { id: 'accessories', label: 'Accessories' }
  ];

  const priceRanges = [
    { id: '0-50', label: '$0 - $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: '200+', label: '$200+' }
  ];

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-card rounded-xl p-6 shadow-sm" data-testid="filters-sidebar">
              <h3 className="text-lg font-semibold text-primary mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-primary mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.id, checked as boolean)
                        }
                        data-testid={`filter-category-${category.id}`}
                      />
                      <Label htmlFor={category.id} className="text-muted-foreground cursor-pointer">
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-primary mb-3">Price Range</h4>
                <RadioGroup 
                  value={filters.priceRange} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                >
                  {priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={range.id} 
                        id={range.id}
                        data-testid={`filter-price-${range.id}`}
                      />
                      <Label htmlFor={range.id} className="text-muted-foreground cursor-pointer">
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Sale Filter */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sale-filter"
                    checked={filters.sale}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, sale: checked as boolean }))
                    }
                    data-testid="filter-sale"
                  />
                  <Label htmlFor="sale-filter" className="text-muted-foreground cursor-pointer">
                    On Sale Only
                  </Label>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => setFilters({ categories: [], priceRange: '', sale: false })}
                className="w-full"
                data-testid="clear-filters"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary" data-testid="shop-title">
                  All Products
                </h1>
                <p className="text-muted-foreground" data-testid="product-count">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="sort-select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="products-grid">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showQuickView
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center" data-testid="pagination">
                    <nav className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        data-testid="pagination-prev"
                      >
                        Previous
                      </Button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          onClick={() => setCurrentPage(i + 1)}
                          data-testid={`pagination-${i + 1}`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        data-testid="pagination-next"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12" data-testid="no-products">
                <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-xl font-semibold text-primary mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
                <Button
                  onClick={() => setFilters({ categories: [], priceRange: '', sale: false })}
                  data-testid="reset-filters"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </section>
  );
}
