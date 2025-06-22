# Farm Showcase API Documentation

This module provides endpoints for managing farm information, practices, and certifications. Only admins can create, update, or delete farms, while anyone can view farm information.

## Database Schema

### Farms Table
```sql
CREATE TABLE public.farms (
    farm_id SERIAL NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    location character varying(200) NOT NULL,
    practices text NOT NULL,
    certifications text[],
    image_url character varying(255),
    contact_email character varying(100),
    contact_phone character varying(20),
    website character varying(255),
    established_year integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (farm_id)
);
```

## API Endpoints

### 1. Get All Farms
**GET** `/api/farms`

Get a paginated list of all active farms.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
{
  "farms": [
    {
      "farm_id": 1,
      "name": "Green Valley Dairy Farm",
      "description": "A family-owned dairy farm...",
      "location": "Rural Route 2, Green Valley, CA 90210",
      "practices": "Organic farming, rotational grazing...",
      "certifications": ["USDA Organic", "Animal Welfare Approved"],
      "image_url": "farm-image.jpg",
      "contact_email": "info@greenvalleydairy.com",
      "contact_phone": "+1-555-0123",
      "website": "https://greenvalleydairy.com",
      "established_year": 1985,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalFarms": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get Farm by ID
**GET** `/api/farms/:id`

Get a specific farm by its ID.

**Response:**
```json
{
  "farm_id": 1,
  "name": "Green Valley Dairy Farm",
  "description": "A family-owned dairy farm...",
  "location": "Rural Route 2, Green Valley, CA 90210",
  "practices": "Organic farming, rotational grazing...",
  "certifications": ["USDA Organic", "Animal Welfare Approved"],
  "image_url": "farm-image.jpg",
  "contact_email": "info@greenvalleydairy.com",
  "contact_phone": "+1-555-0123",
  "website": "https://greenvalleydairy.com",
  "established_year": 1985,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 3. Get Farms by Location
**GET** `/api/farms/location/:location`

Get farms filtered by location (case-insensitive search).

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
[
  {
    "farm_id": 1,
    "name": "Green Valley Dairy Farm",
    "location": "Rural Route 2, Green Valley, CA 90210",
    // ... other farm fields
  }
]
```

### 4. Get Farms by Certification
**GET** `/api/farms/certification/:certification`

Get farms that have a specific certification.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
[
  {
    "farm_id": 1,
    "name": "Green Valley Dairy Farm",
    "certifications": ["USDA Organic", "Animal Welfare Approved"],
    // ... other farm fields
  }
]
```

### 5. Create Farm (Admin Only)
**POST** `/api/farms`

Create a new farm. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <token>`

**Body (multipart/form-data):**
```json
{
  "name": "New Farm Name",
  "description": "Farm description",
  "location": "Farm location",
  "practices": "Farming practices description",
  "certifications": "Cert1,Cert2,Cert3", // Comma-separated string
  "contact_email": "contact@farm.com",
  "contact_phone": "+1-555-0123",
  "website": "https://farm.com",
  "established_year": 1990,
  "image": "file" // Optional image file
}
```

**Required Fields:**
- `name`
- `description`
- `location`
- `practices`

**Response:**
```json
{
  "farm_id": 4,
  "name": "New Farm Name",
  "description": "Farm description",
  // ... all farm fields
}
```

### 6. Update Farm (Admin Only)
**PUT** `/api/farms/:id`

Update an existing farm. Requires admin authentication.

**Headers:**
- `Authorization: Bearer <token>`

**Body (multipart/form-data):**
```json
{
  "name": "Updated Farm Name",
  "description": "Updated description",
  "practices": "Updated practices",
  "certifications": "NewCert1,NewCert2",
  "image": "file" // Optional new image file
}
```

**Response:**
```json
{
  "farm_id": 1,
  "name": "Updated Farm Name",
  // ... updated farm fields
}
```

### 7. Delete Farm (Admin Only)
**DELETE** `/api/farms/:id`

Soft delete a farm (sets is_active to false). Requires admin authentication.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Farm deleted successfully",
  "farm": {
    "farm_id": 1,
    "name": "Deleted Farm",
    "is_active": false,
    // ... other farm fields
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "require admin role"
}
```

### 404 Not Found
```json
{
  "error": "Farm not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Validation Rules

1. **Required Fields:** name, description, location, practices
2. **Email Format:** Must be valid email format if provided
3. **Established Year:** Must be between 1800 and current year if provided
4. **Certifications:** Can be provided as comma-separated string or array
5. **Image:** Optional, supports common image formats

## Authentication

- **Public Endpoints:** GET requests don't require authentication
- **Admin Endpoints:** POST, PUT, DELETE requests require:
  - Valid JWT token
  - Admin role in user permissions

## File Upload

- Images are uploaded using multipart/form-data
- Files are saved to the public/images directory
- Only image files are accepted
- File size limits apply based on server configuration 