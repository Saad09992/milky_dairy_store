import { useState } from "react";
import { Button, Input, Textarea } from "@windmill/react-ui";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Upload, Plus } from "react-feather";
import productService from "../services/product.service";
import Spinner from "../components/Spinner";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    discount_percentage: "",
    is_on_sale: false,
    sale_start_date: "",
    sale_end_date: "",
  });

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format as YYYY-MM-DDTHH:MM (datetime-local format)
    return date.toISOString().slice(0, 16);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      if (formData.calories) formDataToSend.append("calories", formData.calories);
      if (formData.protein) formDataToSend.append("protein", formData.protein);
      if (formData.fat) formDataToSend.append("fat", formData.fat);
      if (formData.vitamin) formDataToSend.append("vitamin", formData.vitamin);

      // Add discount data
      formDataToSend.append("discount_percentage", formData.discount_percentage || "0");
      formDataToSend.append("is_on_sale", formData.is_on_sale);
      if (formData.sale_start_date) formDataToSend.append("sale_start_date", formData.sale_start_date);
      if (formData.sale_end_date) formDataToSend.append("sale_end_date", formData.sale_end_date);

      await productService.createProduct(formDataToSend);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
        <p className="text-gray-600">Add a new product to your inventory</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nutrition Information (Optional)</h3>
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

          {/* Discount Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Information (Optional)</h3>
            <div className="space-y-4">
              {/* Sale Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_on_sale"
                  checked={formData.is_on_sale}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  This product is on sale
                </label>
              </div>

              {/* Discount Fields - Only show if on sale */}
              {formData.is_on_sale && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage (%)
                    </label>
                    <Input
                      type="number"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleInputChange}
                      placeholder="0"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Start Date
                    </label>
                    <Input
                      type="datetime-local"
                      name="sale_start_date"
                      value={formatDateForInput(formData.sale_start_date)}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale End Date
                    </label>
                    <Input
                      type="datetime-local"
                      name="sale_end_date"
                      value={formatDateForInput(formData.sale_end_date)}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="no_expiry"
                      checked={!formData.sale_end_date}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, sale_end_date: "" }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      No expiry date (sale never ends)
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Leave sale dates empty to make the sale always active. 
                        Discount percentage should be between 0 and 100.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Product
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct; 