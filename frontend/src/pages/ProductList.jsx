import { Button, Select } from "@windmill/react-ui";
import Product from "../components/Product";
import Spinner from "../components/Spinner";
import useProduct from "../hooks/useProduct";
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tag } from "react-feather";
import productService from "../services/product.service";

const ProductList = () => {
  const { products, loading, page, setPage } = useProduct();
  const [sortBy, setSortBy] = useState("default");
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(12);
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSaleOnly, setShowSaleOnly] = useState(searchParams.get("sale") === "true");

  // Update total pages when products change
  useEffect(() => {
    if (Array.isArray(products)) {
      // If we get a full page, there might be more pages
      if (products.length === productsPerPage) {
        setTotalPages(page + 1);
      } else {
        setTotalPages(page);
      }
    }
  }, [products, page, productsPerPage]);

  const handleChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleSaleFilter = () => {
    setShowSaleOnly(!showSaleOnly);
    setPage(1);
    if (!showSaleOnly) {
      setSearchParams({ sale: "true" });
    } else {
      setSearchParams({});
    }
  };

  // Client-side filtering and sorting
  let filteredProducts = [];
  if (Array.isArray(products)) {
    // First filter by sale status if needed
    let productsToFilter = products;
    if (showSaleOnly) {
      productsToFilter = products.filter(product => 
        product.is_on_sale && product.discount_percentage > 0 && product.discounted_price
      );
    }

    // Then filter by search query from navbar
    filteredProducts = productsToFilter.filter((prod) =>
      prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then sort
    if (sortBy === "price_asc") {
      filteredProducts.sort((a, b) => {
        const priceA = a.discounted_price || a.price;
        const priceB = b.discounted_price || b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price_desc") {
      filteredProducts.sort((a, b) => {
        const priceA = a.discounted_price || a.price;
        const priceB = b.discounted_price || b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "rating") {
      filteredProducts.sort(
        (a, b) =>
          (b.avg_rating || b.rating || 0) - (a.avg_rating || a.rating || 0)
      );
    }
  }

  if (loading) {
    return <Spinner size={100} loading />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {showSaleOnly ? "Products on Sale" : "All Products"}
        </h1>
        <p className="text-gray-600">
          {showSaleOnly 
            ? "Discover amazing deals and discounts" 
            : "Browse our complete product catalog"
          }
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredProducts.length} products found
        </div>
        
        <div className="flex gap-4 items-center">
          <Button
            onClick={handleSaleFilter}
            className={`flex items-center gap-2 ${
              showSaleOnly 
                ? "bg-red-600 hover:bg-red-700 !text-white" 
                : "bg-gray-600 hover:bg-gray-700 !text-white border border-gray-300"
            }`}
          >
            <Tag className="w-4 h-4" />
            {showSaleOnly ? "Show All" : "Sale Only"}
          </Button>
          
          <div className="w-48">
            <Select value={sortBy} onChange={handleSort}>
              <option value="default">Sort by: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div key={prod.product_id} className="flex">
            <Product product={prod} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {showSaleOnly ? "No products on sale" : "No products found"}
          </h3>
          <p className="text-gray-500">
            {showSaleOnly 
              ? "Check back later for amazing deals!" 
              : "Try adjusting your search or filter criteria"
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button
              layout="outline"
              onClick={() => handleChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    size="small"
                    layout={page === pageNum ? "solid" : "outline"}
                    onClick={() => handleChange(pageNum)}
                    className={page === pageNum ? "bg-blue-600 text-white" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              layout="outline"
              onClick={() => handleChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
