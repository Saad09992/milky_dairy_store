import { useState, useEffect } from "react";
import { Card, Button, Badge } from "@windmill/react-ui";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Globe,
  Search,
  Filter,
  X
} from "react-feather";
import { getAllFarms, deleteFarm } from "../api/farms";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const AdminFarms = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [allFarms, setAllFarms] = useState([]); // Store all farms for filtering
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFarms, setTotalFarms] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);

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
      const startIndex = (currentPage - 1) * 10; // Assuming 10 items per page
      const endIndex = startIndex + 10;
      setFarms(allFarms.slice(startIndex, endIndex));
      setTotalFarms(allFarms.length);
      setTotalPages(Math.ceil(allFarms.length / 10));
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

  const handleDeleteClick = (farm) => {
    setFarmToDelete(farm);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFarm(farmToDelete.farm_id);
      toast.success("Farm deleted successfully");
      setDeleteModalOpen(false);
      setFarmToDelete(null);
      fetchFarms(); // Refresh the farms list
    } catch (error) {
      toast.error(error.error || "Failed to delete farm");
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Farms
          </h1>
          <p className="text-gray-600">
            Add, edit, and manage farm information and certifications
          </p>
        </div>
        <Link to="/admin/farms/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Farm
          </Button>
        </Link>
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

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalFarms}</div>
            <div className="text-sm text-blue-600">
              {searchQuery ? 'Matching Farms' : 'Total Farms'}
            </div>
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
      </div>

      {/* Farms Table */}
      {farms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <MapPin className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No matching farms found' : 'No farms found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or clear the search.'
              : 'Get started by adding your first farm.'
            }
          </p>
          {!searchQuery && (
            <Link to="/admin/farms/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                Add First Farm
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Farm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {farms.map((farm) => (
                    <tr key={farm.farm_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={getImageUrl(farm.image_url)}
                              alt={farm.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {farm.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Est. {farm.established_year || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{farm.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {formatCertifications(farm.certifications).slice(0, 2).map((cert, index) => (
                            <Badge key={index} type="primary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                          {farm.certifications && farm.certifications.length > 2 && (
                            <Badge type="secondary" className="text-xs">
                              +{farm.certifications.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewFarm(farm)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Farm Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link to={`/admin/farms/edit/${farm.farm_id}`}>
                            <button
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Farm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(farm)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Farm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
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

      {/* Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${deleteModalOpen ? '' : 'hidden'}`}
        onClick={() => setDeleteModalOpen(false)}
      >
        <div
          className="bg-white p-8 rounded-lg shadow-lg max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delete Farm
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{farmToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFarms; 