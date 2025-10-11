# Menu API Documentation - Enhanced for Swagger

## Overview
The Menu API has been significantly enhanced with comprehensive Swagger documentation, proper validation, error handling, and advanced features for managing navigation menus in the IT training institute application.

## Key Enhancements Made

### 1. Comprehensive Swagger Documentation
- **Detailed Request/Response Schemas**: Complete OpenAPI specifications with examples
- **Error Response Documentation**: Standardized error responses across all endpoints
- **Input Validation Documentation**: Clear field requirements and constraints
- **Hierarchical Menu Support**: Tree structure documentation for nested menus

### 2. Request Validation
- **Joi Validation Schemas**: Added `menu.validation.ts` with comprehensive validation rules
- **Middleware Integration**: Integrated validation middleware for all endpoints
- **Field Validation**: Title, path, roles, parentId, and order validation with proper error messages

### 3. Enhanced Controller Features
- **Standardized Response Format**: Using `sendResponse` and `sendError` utilities
- **Comprehensive Error Handling**: Try-catch blocks with meaningful error messages
- **Additional Endpoints**: Child menus and root menus retrieval
- **Role-based Filtering**: Support for filtering menus by user roles

### 4. Advanced Service Layer
- **Hierarchical Menu Management**: Support for parent-child relationships
- **Tree Structure Generation**: Auto-build hierarchical menu trees
- **Role-based Access**: Filter menus by user roles
- **Validation Logic**: Parent menu validation and circular reference prevention
- **Cascade Delete**: Delete children when parent is deleted

## API Endpoints

### Core CRUD Operations
```
POST   /menu/menus           - Create a new menu item
GET    /menu/menus           - Get all menus (with optional role filter and tree structure)
GET    /menu/menus/:id       - Get specific menu by ID
PUT    /menu/menus/:id       - Update menu item
DELETE /menu/menus/:id       - Delete menu item (cascades to children)
```

### Additional Utility Endpoints
```
GET    /menu/menus/:id/children  - Get direct children of a menu
GET    /menu/menus/root/list     - Get all root-level menus
```

## Request/Response Examples

### Create Menu Request
```json
{
  "title": "Dashboard",
  "path": "/dashboard",
  "icon": "dashboard-icon",
  "roles": ["admin", "user"],
  "parentId": null,
  "order": 1
}
```

### Menu Response
```json
{
  "success": true,
  "message": "Menu created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Dashboard",
    "path": "/dashboard",
    "icon": "dashboard-icon",
    "roles": ["admin", "user"],
    "parentId": null,
    "order": 1,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Tree Structure Response
```json
{
  "success": true,
  "message": "Menus retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Dashboard",
      "path": "/dashboard",
      "children": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "title": "Analytics",
          "path": "/dashboard/analytics",
          "children": []
        }
      ]
    }
  ]
}
```

## Validation Rules

### Required Fields
- `title`: 1-100 characters
- `path`: Must start with "/" and be 1-200 characters
- `roles`: Array with at least one role

### Optional Fields
- `icon`: Max 50 characters
- `parentId`: Valid MongoDB ObjectId
- `order`: Integer ≥ 0 (defaults to 0)

## Query Parameters

### GET /menu/menus
- `role`: Filter menus by user role
- `tree`: Return hierarchical structure (boolean)

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Common Error Codes
- `400`: Validation errors, invalid data
- `404`: Menu not found
- `500`: Internal server error

## Advanced Features

### 1. Role-Based Access Control
- Filter menus by user roles
- Support for multiple roles per menu item
- Role-based menu tree generation

### 2. Hierarchical Menu Structure
- Parent-child relationships
- Unlimited nesting levels
- Automatic tree structure generation
- Cascade delete for parent menus

### 3. Menu Ordering
- Numeric ordering system
- Automatic sorting by order and creation date
- Flexible reordering capabilities

### 4. Validation & Security
- MongoDB ObjectId validation
- Circular reference prevention
- Parent menu existence validation
- Input sanitization and validation

## Integration
- ✅ Fully integrated with existing Express.js application
- ✅ Uses established validation middleware patterns
- ✅ Follows existing response format standards
- ✅ Comprehensive Swagger documentation
- ✅ Compatible with role-based authentication system

## Swagger UI Access
Once the server is running, access the enhanced menu API documentation at:
`http://localhost:3000/api-docs`

The menu endpoints are now properly exposed in Swagger with:
- Complete request/response schemas
- Interactive API testing
- Detailed field descriptions
- Error response examples
- Query parameter documentation

## Benefits for IT Training Institute
1. **Dynamic Navigation**: Create role-specific menu structures
2. **Hierarchical Organization**: Organize courses and content in nested menus
3. **User Experience**: Role-based menu display for different user types
4. **Administration**: Easy menu management through comprehensive API
5. **Documentation**: Complete API documentation for frontend developers