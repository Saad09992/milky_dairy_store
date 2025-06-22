import { Button, Select } from "@windmill/react-ui";
import Product from "../components/Product";
import Spinner from "../components/Spinner";
import useProduct from "../hooks/useProduct";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-feather";

const ProductList = () => {
  const { products, loading, page, setPage } = useProduct();
  const [sortBy, setSortBy] = useState("default");
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(12);
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";

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

  // Client-side filtering and sorting
  let filteredProducts = [];
  if (Array.isArray(products)) {
    filteredProducts = products.filter((prod) =>
      prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "price_asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
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
      {/* Filter Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>
        <div className="w-full sm:w-48">
          <Select value={sortBy} onChange={handleSort}>
            <option value="default">Sort by: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </Select>
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
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
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
