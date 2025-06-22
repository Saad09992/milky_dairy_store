import { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@windmill/react-ui";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Upload, Save, Trash2 } from "react-feather";
import productService from "../services/product.service";
import Spinner from "../components/Spinner";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    calories: "",
    protein: "",
    fat: "",
    vitamin: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // First get the product list to find the product by ID and get its slug
      const productsResponse = await productService.getProducts(1);
      const products = productsResponse.data || [];
      const product = products.find((p) => p.product_id === parseInt(id));

      if (!product) {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }

      // Now fetch the full product data using the slug
      const response = await productService.getProductByName(product.slug);
      const productData = response.data;

      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || "",
        image: null,
        calories: productData.nutrition?.calories || "",
        protein: productData.nutrition?.protein || "",
        fat: productData.nutrition?.fat || "",
        vitamin: productData.nutrition?.vitamin
          ? productData.nutrition.vitamin.join(", ")
          : "",
      });

      if (productData?.image_url) {
        setImagePreview(`http://localhost:9000/images/${product?.image_url}`);
      }
    } catch (error) {
      toast.error("Failed to fetch product details");
      navigate("/admin/products");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Add nutrition data if provided
      if (formData.calories)
        formDataToSend.append("calories", formData.calories);
      if (formData.protein) formDataToSend.append("protein", formData.protein);
      if (formData.fat) formDataToSend.append("fat", formData.fat);
      if (formData.vitamin) formDataToSend.append("vitamin", formData.vitamin);

      await productService.updateProduct(id, formDataToSend);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        await productService.deleteProduct(id);
        toast.success("Product deleted successfully!");
        navigate("/admin/products");
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete product");
      } finally {
        setLoading(false);
      }
    }
  };

  if (fetching) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Spinner size={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Update Product
            </h1>
            <p className="text-gray-600">
              Edit product information and details
            </p>
          </div>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Product
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description..."
              rows={4}
              required
              className="w-full"
            />
          </div>

          {/* Nutrition Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nutrition Information (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories (per 100g)
                </label>
                <Input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein (g)
                </label>
                <Input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fat (g)
                </label>
                <Input
                  type="number"
                  name="fat"
                  value={formData.fat}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitamins (comma-separated)
                </label>
                <Input
                  type="text"
                  name="vitamin"
                  value={formData.vitamin}
                  onChange={handleInputChange}
                  placeholder="Vitamin A, Vitamin D, etc."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              layout="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size={16} />
                  Updating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Update Product
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
