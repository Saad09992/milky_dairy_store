import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@windmill/react-ui";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Globe,
  Clock,
  Award,
  Users,
  Activity
} from "react-feather";
import { getFarmById } from "../api/farms";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const FarmDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set document title
  useEffect(() => {
    if (farm) {
      document.title = `${farm.name} | Milky Dairy`;
    } else if (loading) {
      document.title = "Farm Details | Milky Dairy";
    } else {
      document.title = "Farm Not Found | Milky Dairy";
    }
  }, [farm, loading]);

  useEffect(() => {
    fetchFarm();
  }, [id]);

  const fetchFarm = async () => {
    try {
      setLoading(true);
      const farmData = await getFarmById(id);
      setFarm(farmData);
    } catch (error) {
      toast.error(error.error || "Failed to fetch farm details");
      navigate("/farms");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
    }
    if (imageUrl.startsWith('http')) {
      // Check if it's a valid image URL, if not use placeholder
      if (imageUrl.includes('i.ibb.co/example/')) {
        return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
      }
      return imageUrl;
    }
    return `http://localhost:9000/images/${imageUrl}`;
  };

  const formatCertifications = (certifications) => {
    if (!certifications || !Array.isArray(certifications)) return [];
    return certifications;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={100} />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Farm Not Found</h2>
          <p className="text-gray-600 mb-6">The farm you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/farms")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Farms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          layout="link"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Farm Hero Section */}
      <div className="relative mb-8">
        <div className="h-96 rounded-2xl overflow-hidden">
          <img
            src={getImageUrl(farm.image_url)}
            alt={farm.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              {farm.established_year && (
                <div className="flex items-center text-white text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Est. {farm.established_year}
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{farm.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{farm.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Farm</h2>
            <p className="text-gray-700 leading-relaxed">{farm.description}</p>
          </Card>

          {/* Farming Practices */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Farming Practices</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{farm.practices}</p>
            </div>
          </Card>

          {/* Certifications */}
          {farm.certifications && farm.certifications.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-dairy-primary/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-dairy-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Certifications & Standards</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formatCertifications(farm.certifications).map((cert, index) => (
                  <div key={index} className="flex items-center p-4 bg-dairy-primary/10 rounded-lg">
                    <Award className="w-5 h-5 text-dairy-primary mr-3" />
                    <span className="font-medium text-dairy-primary/80">{cert}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div className="space-y-4">
              {farm.contact_email && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600 mr-3" />
                  <a 
                    href={`mailto:${farm.contact_email}`}
                    className="text-dairy-primary hover:text-dairy-primary/80 font-medium"
                  >
                    {farm.contact_email}
                  </a>
                </div>
              )}
              {farm.contact_phone && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600 mr-3" />
                  <a 
                    href={`tel:${farm.contact_phone}`}
                    className="text-dairy-primary hover:text-dairy-primary/80 font-medium"
                  >
                    {farm.contact_phone}
                  </a>
                </div>
              )}
              {farm.website && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600 mr-3" />
                  <a 
                    href={farm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dairy-primary hover:text-dairy-primary/80 font-medium"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Farm Stats */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Farm Information</h3>
            </div>
            <div className="space-y-4">
              {farm.established_year && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Established</span>
                  <span className="font-medium text-gray-900">{farm.established_year}</span>
                </div>
              )}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900 text-right max-w-xs">{farm.location}</span>
              </div>
              {farm.certifications && farm.certifications.length > 0 && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Certifications</span>
                  <span className="font-medium text-gray-900">{farm.certifications.length}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/farms")}
                className="w-full bg-gradient-dairy text-white hover:bg-gradient-dairy-hover"
              >
                View All Farms
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmDetails; 