import { useState, useEffect } from "react";
import { Button, Badge } from "@windmill/react-ui";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Bell,
  Tag,
} from "react-feather";
import productService from "../services/product.service";
import Spinner from "../components/Spinner";
import SaleNotification from "../components/SaleNotification";
import { formatCurrency } from "../helpers/formatCurrency";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(12);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts(currentPage);
      const productsData = response.data || [];
      setProducts(productsData);

      // Estimate total pages based on current page and products received
      // If we get a full page, there might be more pages
      if (productsData.length === productsPerPage) {
        setTotalPages(currentPage + 1);
      } else {
        setTotalPages(currentPage);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeleting(productId);
      try {
        await productService.deleteProduct(productId);
        toast.success("Product deleted successfully!");
        fetchProducts(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete product");
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleSendDiscountNotifications = async () => {
    setShowNotificationModal(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setLoading(true);
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  const getNutritionSummary = (nutrition) => {
    if (!nutrition) return "No nutrition data";
    const parts = [];
    if (nutrition.calories) parts.push(`${nutrition.calories} cal`);
    if (nutrition.protein) parts.push(`${nutrition.protein}g protein`);
    if (nutrition.fat) parts.push(`${nutrition.fat}g fat`);
    return parts.length > 0 ? parts.join(", ") : "No nutrition data";
  };

  const getSaleStatus = (product) => {
    if (!product.is_on_sale || !product.discount_percentage) {
      return { status: "none", text: "No Sale", color: "gray" };
    }

    const now = new Date();
    const startDate = product.sale_start_date ? new Date(product.sale_start_date) : null;
    const endDate = product.sale_end_date ? new Date(product.sale_end_date) : null;

    // Check if sale is active
    const isActive = (!startDate || startDate <= now) && (!endDate || endDate >= now);
    
    if (isActive) {
      return { status: "active", text: "Active Sale", color: "green" };
    } else if (endDate && endDate < now) {
      return { status: "expired", text: "Sale Expired", color: "red" };
    } else if (startDate && startDate > now) {
      return { status: "pending", text: "Sale Pending", color: "yellow" };
    } else {
      return { status: "active", text: "Active Sale", color: "green" };
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Spinner size={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Product Management
            </h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSendDiscountNotifications}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify Users
            </Button>
            <Button
              onClick={() => navigate("/admin/products/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      {/* Sale Status Summary */}
      {(() => {
        const saleStats = products.reduce((stats, product) => {
          const status = getSaleStatus(product);
          stats[status.status] = (stats[status.status] || 0) + 1;
          return stats;
        }, {});

        const hasSales = saleStats.active || saleStats.expired || saleStats.pending;

        if (!hasSales) return null;

        return (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Sale Status Summary</h3>
            <div className="flex flex-wrap gap-4">
              {saleStats.active && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {saleStats.active} Active Sale{saleStats.active !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {saleStats.expired && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {saleStats.expired} Expired Sale{saleStats.expired !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {saleStats.pending && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {saleStats.pending} Pending Sale{saleStats.pending !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nutrition
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.product_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={`http://localhost:9000/images/${product?.image_url}`}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.is_on_sale && product.discount_percentage > 0 ? (
                      <div className="flex items-center gap-2">
                        <Badge type="success" className="bg-red-100 text-red-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {product.discount_percentage}% OFF
                        </Badge>
                        {product.discounted_price && (
                          <span className="text-sm text-gray-600">
                            {formatCurrency(product.discounted_price)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No discount</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const saleStatus = getSaleStatus(product);
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'active':
                            return 'bg-green-100 text-green-800 border-green-200';
                          case 'expired':
                            return 'bg-red-100 text-red-800 border-red-200';
                          case 'pending':
                            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                          default:
                            return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };
                      
                      return (
                        <div className="space-y-1">
                          <Badge className={`${getStatusColor(saleStatus.status)} border`}>
                            {saleStatus.text}
                          </Badge>
                          {product.sale_start_date && product.sale_end_date && (
                            <div className="text-xs text-gray-500">
                              {new Date(product.sale_start_date).toLocaleDateString()} - {new Date(product.sale_end_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getNutritionSummary(product.nutrition)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        {product.avg_rating
                          ? parseFloat(product.avg_rating).toFixed(1)
                          : "N/A"}
                      </span>
                      {product.avg_rating && (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.avg_rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="small"
                        layout="outline"
                        onClick={() => navigate(`/products/${product.slug}`)}
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="small"
                        layout="outline"
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.product_id}`)
                        }
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="small"
                        layout="outline"
                        onClick={() => handleDelete(product.product_id)}
                        disabled={deleting === product.product_id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        title="Delete Product"
                      >
                        {deleting === product.product_id ? (
                          <Spinner size={16} />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first product.
            </p>
            <Button
              onClick={() => navigate("/admin/products/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="small"
                  layout="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        size="small"
                        layout={currentPage === pageNum ? "solid" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : ""
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="small"
                  layout="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sale Notification Modal */}
      {showNotificationModal && (
        <SaleNotification onClose={() => setShowNotificationModal(false)} />
      )}
    </div>
  );
};

export default AdminProducts;
