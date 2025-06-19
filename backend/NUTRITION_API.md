# Product Nutrition API Documentation

This document describes the new nutrition endpoints and updated product endpoints for handling product nutrition data.

## Nutrition Endpoints

### Base URL: `/api/nutrition`

#### 1. Get Product Nutrition
- **GET** `/api/nutrition/:productId`
- **Description**: Retrieve nutrition data for a specific product
- **Authentication**: Not required
- **Response**:
```json
{
  "product_id": 1,
  "calories": 150,
  "protein": 8.5,
  "fat": 5.2,
  "vitamin": "A, D, B12",
  "carbohydrates": 12.3,
  "fiber": 2.1,
  "sugar": 8.7,
  "sodium": 120,
  "cholesterol": 25
}
```

#### 2. Create Product Nutrition
- **POST** `/api/nutrition/:productId`
- **Description**: Create nutrition data for a product
- **Authentication**: Required (Admin only)
- **Request Body**:
```json
{
  "calories": 150,
  "protein": 8.5,
  "fat": 5.2,
  "vitamin": "A, D, B12",
  "carbohydrates": 12.3,
  "fiber": 2.1,
  "sugar": 8.7,
  "sodium": 120,
  "cholesterol": 25
}
```

#### 3. Update Product Nutrition
- **PUT** `/api/nutrition/:productId`
- **Description**: Update nutrition data for a product
- **Authentication**: Required (Admin only)
- **Request Body**: Same as create endpoint

#### 4. Delete Product Nutrition
- **DELETE** `/api/nutrition/:productId`
- **Description**: Delete nutrition data for a product
- **Authentication**: Required (Admin only)

## Updated Product Endpoints

### Base URL: `/api/products`

#### 1. Create Product (Updated)
- **POST** `/api/products`
- **Description**: Create a new product with optional nutrition data
- **Authentication**: Required (Admin only)
- **Request Body**:
```json
{
  "name": "Organic Milk",
  "price": 4.99,
  "description": "Fresh organic whole milk",
  "calories": 150,
  "protein": 8.5,
  "fat": 5.2,
  "vitamin": "A, D, B12",
  "carbohydrates": 12.3,
  "fiber": 2.1,
  "sugar": 8.7,
  "sodium": 120,
  "cholesterol": 25
}
```
- **Response**: Product with nutrition data included

#### 2. Update Product (Updated)
- **PUT** `/api/products/:id`
- **Description**: Update a product with optional nutrition data
- **Authentication**: Required (Admin only)
- **Request Body**: Same as create endpoint
- **Response**: Updated product with nutrition data included

#### 3. Get Product (Updated)
- **GET** `/api/products/:id` or `/api/products/slug/:slug`
- **Description**: Retrieve a product with nutrition data
- **Response**: Product with nutrition data included

## Database Schema

The `product_nutrition` table should have the following structure:

```sql
CREATE TABLE product_nutrition (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
  calories DECIMAL(6,2),
  protein DECIMAL(6,2),
  fat DECIMAL(6,2),
  vitamin TEXT,
  carbohydrates DECIMAL(6,2),
  fiber DECIMAL(6,2),
  sugar DECIMAL(6,2),
  sodium DECIMAL(6,2),
  cholesterol DECIMAL(6,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### Creating a product with nutrition data:
```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    name: 'Organic Milk',
    price: 4.99,
    description: 'Fresh organic whole milk',
    calories: 150,
    protein: 8.5,
    fat: 5.2,
    vitamin: 'A, D, B12',
    carbohydrates: 12.3,
    fiber: 2.1,
    sugar: 8.7,
    sodium: 120,
    cholesterol: 25
  })
});
```

### Getting nutrition data for a product:
```javascript
const response = await fetch('/api/nutrition/1');
const nutrition = await response.json();
```

### Updating nutrition data:
```javascript
const response = await fetch('/api/nutrition/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    calories: 160,
    protein: 9.0,
    fat: 5.5
  })
});
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden (admin access required)
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message:
```json
{
  "error": "Product not found"
}
``` 