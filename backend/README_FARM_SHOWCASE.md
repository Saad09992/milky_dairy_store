# Farm Showcase Module

A comprehensive module for managing farm information, practices, and certifications in the Milky Dairy e-commerce platform.

## Features

- ✅ **Farm Information Management**: Store and manage detailed farm information
- ✅ **Farming Practices**: Document sustainable and traditional farming methods
- ✅ **Certifications**: Track various certifications and quality standards
- ✅ **Admin-Only Management**: Only admins can create, update, or delete farms
- ✅ **Public Viewing**: Anyone can view farm information
- ✅ **Image Support**: Upload and manage farm images
- ✅ **Search & Filter**: Filter farms by location and certifications
- ✅ **Pagination**: Efficient data loading with pagination
- ✅ **Soft Delete**: Farms are soft deleted (marked inactive) rather than permanently removed

## Database Setup

1. **Run the SQL script** to create the farms table:
   ```bash
   psql -d your_database -f config/farm_showcase.sql
   ```

2. **Or manually execute** the SQL commands in your database:
   ```sql
   -- Copy the contents of config/farm_showcase.sql
   ```

## API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/farms` | Get all farms with pagination |
| GET | `/api/farms/:id` | Get specific farm by ID |
| GET | `/api/farms/location/:location` | Get farms by location |
| GET | `/api/farms/certification/:certification` | Get farms by certification |

### Admin Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/farms` | Create new farm |
| PUT | `/api/farms/:id` | Update existing farm |
| DELETE | `/api/farms/:id` | Soft delete farm |

## File Structure

```
backend/
├── config/
│   └── farm_showcase.sql          # Database schema and sample data
├── db/
│   └── farm.db.js                 # Database operations
├── services/
│   └── farm.service.js            # Business logic
├── controllers/
│   └── farm.controller.js         # Request/response handling
├── routes/
│   └── farm.js                    # Route definitions
├── middleware/
│   ├── verifyToken.js             # JWT authentication
│   ├── verifyAdmin.js             # Admin role verification
│   └── saveFile.js                # File upload handling
├── FARM_API.md                    # Detailed API documentation
├── test_farm_api.js               # API testing script
└── README_FARM_SHOWCASE.md        # This file
```

## Usage Examples

### Creating a New Farm (Admin Only)

```javascript
// Using fetch
const formData = new FormData();
formData.append('name', 'Organic Valley Farm');
formData.append('description', 'A sustainable organic dairy farm');
formData.append('location', '123 Farm Road, Organic City, OC 12345');
formData.append('practices', 'Organic farming, rotational grazing, renewable energy');
formData.append('certifications', 'USDA Organic, Animal Welfare Approved');
formData.append('contact_email', 'info@organicvalley.com');
formData.append('image', imageFile); // Optional

const response = await fetch('/api/farms', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});
```

### Getting All Farms

```javascript
// Using fetch
const response = await fetch('/api/farms?page=1');
const data = await response.json();

console.log('Farms:', data.farms);
console.log('Pagination:', data.pagination);
```

### Filtering Farms by Location

```javascript
// Using fetch
const response = await fetch('/api/farms/location/California');
const farms = await response.json();

console.log('Farms in California:', farms);
```

## Data Model

### Farm Object Structure

```javascript
{
  farm_id: 1,
  name: "Farm Name",
  description: "Detailed farm description",
  location: "Farm address and location",
  practices: "Farming practices and methods",
  certifications: ["Cert1", "Cert2", "Cert3"],
  image_url: "farm-image.jpg",
  contact_email: "contact@farm.com",
  contact_phone: "+1-555-0123",
  website: "https://farm.com",
  established_year: 1990,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z"
}
```

## Validation Rules

- **Required Fields**: name, description, location, practices
- **Email Format**: Must be valid email format if provided
- **Established Year**: Must be between 1800 and current year
- **Certifications**: Can be provided as comma-separated string or array
- **Image**: Optional, supports common image formats

## Testing

Run the test script to verify the API functionality:

```bash
cd backend
node test_farm_api.js
```

## Security

- **Authentication**: Admin endpoints require valid JWT token
- **Authorization**: Only users with admin role can modify farms
- **Input Validation**: All inputs are validated before processing
- **File Upload**: Only image files are accepted
- **SQL Injection**: Protected using parameterized queries

## Error Handling

The module includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Farm not found
- **500 Internal Server Error**: Server-side errors

## Future Enhancements

Potential improvements for the farm showcase module:

- [ ] **Farm Reviews**: Allow customers to review farms
- [ ] **Farm Products**: Link farms to specific products
- [ ] **Farm Tours**: Virtual tour functionality
- [ ] **Sustainability Metrics**: Track environmental impact
- [ ] **Farm Events**: Schedule farm visits and events
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced Search**: Full-text search capabilities
- [ ] **Farm Analytics**: Dashboard for farm performance

## Contributing

When contributing to the farm showcase module:

1. Follow the existing code structure and patterns
2. Add appropriate error handling
3. Include input validation
4. Update documentation
5. Add tests for new functionality
6. Ensure admin-only endpoints are properly protected 