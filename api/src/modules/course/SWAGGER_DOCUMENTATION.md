# Course Review System - Swagger Documentation

## 📚 **Complete API Documentation Updated**

The Swagger/OpenAPI documentation has been comprehensively updated to include the complete course review system.

### 🎯 **Documentation Structure**

#### **1. Schemas Defined** (`review.swagger.ts`)
- ✅ **Review** - Complete review object with all fields
- ✅ **CreateReviewRequest** - Request body for creating reviews
- ✅ **UpdateReviewRequest** - Request body for updating reviews
- ✅ **ReviewPagination** - Paginated review responses
- ✅ **ReviewStats** - Review statistics and analytics
- ✅ **HelpfulnessRequest** - Request for marking reviews helpful/unhelpful
- ✅ **ReportReviewRequest** - Request for reporting reviews
- ✅ **ApiResponse** - Standard API response format

#### **2. Course Review Endpoints** (in `course.controller.ts`)
- ✅ **GET** `/api/courses/{id}/reviews` - Get course reviews with pagination
- ✅ **POST** `/api/courses/{id}/reviews` - Add review to a course

#### **3. Review Management Endpoints** (in `review.route.ts`)
- ✅ **GET** `/api/reviews/{id}` - Get specific review
- ✅ **PUT** `/api/reviews/{id}` - Update review
- ✅ **DELETE** `/api/reviews/{id}` - Delete review
- ✅ **POST** `/api/reviews/{id}/helpful` - Mark review helpful/unhelpful
- ✅ **POST** `/api/reviews/{id}/report` - Report review
- ✅ **GET** `/api/reviews/user/{userId}` - Get user's reviews
- ✅ **GET** `/api/reviews/course/{courseId}/stats` - Get review statistics

### 🔧 **Documentation Features**

#### **Comprehensive Request/Response Examples**
```yaml
# Example: Get Course Reviews
GET /api/courses/{id}/reviews?page=1&limit=10&sortBy=helpfulCount&sortOrder=desc&minRating=4

Response:
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Outstanding course - highly recommended!",
        "content": "This course exceeded my expectations...",
        "rating": 5,
        "author": {
          "name": "John Doe",
          "photo": "https://example.com/avatar.jpg"
        },
        "helpfulCount": 12,
        "unhelpfulCount": 1,
        "isVerifiedPurchase": true,
        "createdAt": "2025-10-24T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "totalPages": 3,
      "totalReviews": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### **Detailed Parameter Documentation**
- ✅ Path parameters with examples
- ✅ Query parameters with defaults and validation rules
- ✅ Request body schemas with validation constraints
- ✅ Response schemas with example data

#### **Error Response Documentation**
- ✅ **400** - Validation errors with specific field messages
- ✅ **401** - Authentication required responses
- ✅ **404** - Resource not found responses
- ✅ **409** - Conflict responses (duplicate reviews)
- ✅ **500** - Internal server error responses

#### **Security Documentation**
- ✅ Bearer token authentication requirements
- ✅ Public vs protected endpoint indication
- ✅ Permission-based access documentation

### 📊 **Example API Calls**

#### **1. Create a Course Review**
```bash
POST /api/courses/507f1f77bcf86cd799439011/reviews
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Excellent course with practical examples!", // Optional
  "content": "This course provided comprehensive coverage of React development. The instructor explained complex concepts clearly and the hands-on projects were very helpful for understanding real-world applications.",
  "rating": 5,
  "isAnonymous": false
}
```

#### **Alternative: Review Without Title**
```bash
POST /api/courses/507f1f77bcf86cd799439011/reviews
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "content": "Great course with clear explanations and practical examples. Highly recommended for beginners!",
  "rating": 5,
  "isAnonymous": false
}
```

#### **2. Get Course Reviews with Filtering**
```bash
GET /api/courses/507f1f77bcf86cd799439011/reviews?page=1&limit=10&sortBy=helpfulCount&sortOrder=desc&minRating=4
```

#### **3. Mark Review as Helpful**
```bash
POST /api/reviews/507f1f77bcf86cd799439011/helpful
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "action": "helpful"
}
```

#### **4. Get Review Statistics**
```bash
GET /api/reviews/course/507f1f77bcf86cd799439011/stats
```

### 🎨 **Swagger UI Features**

#### **Interactive Documentation**
- ✅ Try-it-out functionality for all endpoints
- ✅ Request/response examples
- ✅ Parameter validation
- ✅ Authentication testing

#### **Schema Visualization**
- ✅ Complete object property documentation
- ✅ Data type specifications
- ✅ Validation rules display
- ✅ Required field indicators

#### **Response Examples**
- ✅ Success response examples
- ✅ Error response examples
- ✅ Different HTTP status code scenarios
- ✅ Realistic sample data

### 🚀 **Access Swagger Documentation**

#### **Local Development**
```bash
# Start the server
npm run dev

# Access Swagger UI
http://localhost:5000/api-docs
```

#### **API Testing**
- Use the interactive Swagger UI to test endpoints
- Bearer token authentication is supported
- All validation rules are enforced
- Real-time response testing

### 📋 **Documentation Tags**

#### **Organized by Functionality**
- 🏷️ **Course Reviews** - Course-specific review operations
- 🏷️ **Reviews** - General review management operations
- 🏷️ **Authentication** - Security-related endpoints

#### **Logical Grouping**
- Course-centric operations grouped together
- Review management operations grouped together
- Clear separation between public and protected endpoints

### ✅ **Validation Documentation**

#### **Request Validation**
- ✅ Field length requirements (title: 10-200 chars [optional], content: 50-2000 chars)
- ✅ Rating range validation (1-5 stars)
- ✅ Enum value validation (report reasons, actions)
- ✅ Required field specifications

#### **Response Validation**
- ✅ Consistent response format across all endpoints
- ✅ Error message standardization
- ✅ Success response structure

### 🔐 **Security Documentation**

#### **Authentication Requirements**
- ✅ JWT Bearer token specification
- ✅ Protected endpoint indicators
- ✅ Permission level requirements

#### **Data Privacy**
- ✅ Anonymous review option documentation
- ✅ User data handling specifications
- ✅ Moderation and reporting workflows

The Swagger documentation is now comprehensive, interactive, and provides everything needed for frontend developers and API consumers to effectively use the course review system! 🎉

## 🌐 **Access the Documentation**
Start your server and visit: `http://localhost:5000/api-docs`