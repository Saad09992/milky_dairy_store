import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@windmill/react-ui";
import { MapPin, Calendar, Mail, Phone, Globe, Search, Filter, Eye } from "react-feather";
import { getAllFarms, getFarmsByLocation, getFarmsByCertification } from "../api/farms";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const Farms = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [allFarms, setAllFarms] = useState([]); // Store all farms for filtering
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarms, setTotalFarms] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, location, certification
  const [filterValue, setFilterValue] = useState("");

  // Set document title
  useEffect(() => {
    document.title = "Farms | Milky Dairy";
  }, []);

  useEffect(() => {
    fetchFarms();
  }, [currentPage]);

  useEffect(() => {
    // Filter farms based on search query
    if (searchQuery.trim()) {
      const filtered = allFarms.filter(farm => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          farm.name?.toLowerCase().includes(searchTerm) ||
          farm.description?.toLowerCase().includes(searchTerm) ||
          farm.location?.toLowerCase().includes(searchTerm) ||
          farm.practices?.toLowerCase().includes(searchTerm) ||
          farm.contact_email?.toLowerCase().includes(searchTerm) ||
          farm.contact_phone?.toLowerCase().includes(searchTerm) ||
          farm.website?.toLowerCase().includes(searchTerm) ||
          farm.established_year?.toString().includes(searchTerm) ||
          farm.certifications?.some(cert => cert.toLowerCase().includes(searchTerm))
        );
      });
      setFarms(filtered);
      setTotalFarms(filtered.length);
      setTotalPages(1); // Reset pagination for filtered results
    } else {
      // Show all farms with pagination
      const startIndex = (currentPage - 1) * 9; // Assuming 9 items per page (3x3 grid)
      const endIndex = startIndex + 9;
      setFarms(allFarms.slice(startIndex, endIndex));
      setTotalFarms(allFarms.length);
      setTotalPages(Math.ceil(allFarms.length / 9));
    }
  }, [searchQuery, allFarms, currentPage]);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await getAllFarms(1); // Get all farms without pagination
      setAllFarms(response.farms);
      setFarms(response.farms);
      setTotalPages(1);
      setTotalFarms(response.farms.length);
    } catch (error) {
      toast.error(error.error || "Failed to fetch farms");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Search is now handled by useEffect
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterValue("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewFarm = (farm) => {
    navigate(`/farms/${farm.farm_id}`);
  };

  const formatCertifications = (certifications) => {
    if (!certifications || !Array.isArray(certifications)) return [];
    return certifications;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={100} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Our Partner Farms
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the sustainable and ethical farming practices behind our premium dairy products. 
          Each farm is carefully selected for their commitment to quality, animal welfare, and environmental stewardship.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search farms by name, description, location, practices, contact info..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                onClick={handleClearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {searchQuery && (
          <div className="mt-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Searching for: "{searchQuery}"
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalFarms}</div>
            <div className="text-sm text-blue-600">
              {searchQuery ? 'Matching Farms' : 'Total Farms'}
            </div>
          </div>
        </div>
      </div>

      {/* Farms Grid */}
      {farms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MapPin className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No matching farms found' : 'No farms found'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try adjusting your search terms or clear the search.'
              : 'No farms are currently available.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {farms.map((farm) => (
              <Card key={farm.farm_id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                {/* Farm Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={getImageUrl(farm.image_url)}
                    alt={farm.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                </div>

                {/* Farm Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {farm.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {farm.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{farm.location}</span>
                  </div>

                  {/* Established Year */}
                  {farm.established_year && (
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Est. {farm.established_year}</span>
                    </div>
                  )}

                  {/* Certifications */}
                  {farm.certifications && farm.certifications.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {formatCertifications(farm.certifications).map((cert, index) => (
                          <Badge key={index} type="primary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-2 mb-4">
                    {farm.contact_email && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Mail className="w-4 h-4 mr-2" />
                        <a 
                          href={`mailto:${farm.contact_email}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {farm.contact_email}
                        </a>
                      </div>
                    )}
                    {farm.contact_phone && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Phone className="w-4 h-4 mr-2" />
                        <a 
                          href={`tel:${farm.contact_phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {farm.contact_phone}
                        </a>
                      </div>
                    )}
                    {farm.website && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Globe className="w-4 h-4 mr-2" />
                        <a 
                          href={farm.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Practices Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Farming Practices:</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {farm.practices}
                    </p>
                  </div>

                  {/* View Details Button - Always at bottom */}
                  <div className="mt-auto pt-4">
                    <Button
                      onClick={() => handleViewFarm(farm)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {!searchQuery && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                Previous
              </Button>
              
              <span className="text-gray-600">
                Page {currentPage} of {totalPages} ({totalFarms} farms)
              </span>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Farms; 