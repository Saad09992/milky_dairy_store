import { Button, Input, Select } from "@windmill/react-ui";
import Product from "../components/Product";
import Spinner from "../components/Spinner";
import useProduct from "../hooks/useProduct";
import { Search } from "react-feather";
import { useState } from "react";

const ProductList = () => {
  const { products, loading, page, setPage } = useProduct();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const handleChange = (page) => {
    setPage(page);
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

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
      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-96 relative">
          <Input
            className="pl-10"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
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
      {filteredProducts.length > 12 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button
              layout="outline"
              onClick={() => handleChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">
              Page {page} of {Math.ceil(filteredProducts.length / 12)}
            </span>
            <Button
              layout="outline"
              onClick={() => handleChange(page + 1)}
              disabled={page >= Math.ceil(filteredProducts.length / 12)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
