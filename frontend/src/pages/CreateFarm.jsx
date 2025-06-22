import { useState } from "react";
import { Card, Button, Input, Label, Textarea } from "@windmill/react-ui";
import { ArrowLeft, Upload, X } from "react-feather";
import { createFarm } from "../api/farms";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const CreateFarm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    practices: "",
    certifications: [],
    contact_email: "",
    contact_phone: "",
    website: "",
    established_year: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [certificationInput, setCertificationInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput("");
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Farm name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!formData.practices.trim()) {
      toast.error("Farming practices are required");
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        image: imageFile
      };

      await createFarm(submitData);
      toast.success("Farm created successfully!");
      navigate("/admin/farms");
    } catch (error) {
      toast.error(error.error || "Failed to create farm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          layout="link"
          onClick={() => navigate("/admin/farms")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Farms
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Farm</h1>
        <p className="text-gray-600 mt-2">
          Add a new farm to showcase their practices and certifications
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Farm Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter farm name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the farm, its history, and mission"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter farm location/address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="established_year">Established Year</Label>
                  <Input
                    id="established_year"
                    name="established_year"
                    type="number"
                    value={formData.established_year}
                    onChange={handleInputChange}
                    placeholder="e.g., 1985"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </Card>

            {/* Farming Practices */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Farming Practices</h3>
              
              <div>
                <Label htmlFor="practices">Practices *</Label>
                <Textarea
                  id="practices"
                  name="practices"
                  value={formData.practices}
                  onChange={handleInputChange}
                  placeholder="Describe the farming practices, methods, and sustainability initiatives"
                  rows={4}
                  required
                />
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Image</h3>
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload farm image</p>
                    <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Add certification"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button
                    type="button"
                    onClick={addCertification}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add
                  </Button>
                </div>

                {formData.certifications.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Certifications:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {cert}
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="farm@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder="+1-555-0123"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://farm-website.com"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => navigate("/admin/farms")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner size={16} />
                Creating...
              </div>
            ) : (
              "Create Farm"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFarm; 