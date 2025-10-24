# Course Review System

A comprehensive course review system that allows users to write, read, and manage reviews for courses.

## Features

### ✅ **Core Functionality**
- ✨ Write course reviews with title, content, and rating (1-5 stars)
- 📖 Read paginated reviews with sorting and filtering
- ✏️ Edit reviews with edit history tracking
- 🗑️ Delete reviews (soft delete)
- 👤 Anonymous review option

### ✅ **User Engagement**
- 👍 Mark reviews as helpful/unhelpful
- 📊 View helpfulness statistics
- 🚩 Report inappropriate reviews
- ⭐ Rating distribution analytics

### ✅ **Moderation & Quality**
- ✅ Review approval system
- 🔍 Content moderation
- 📝 Edit history tracking
- 🚫 One review per user per course
- ✔️ Verified purchase indicators

### ✅ **Analytics**
- 📈 Review statistics
- ⭐ Average ratings
- 📊 Rating distribution
- 📋 Comprehensive reporting

## API Endpoints

### **Main Course Review Endpoints**

#### Get Course Reviews
```http
GET /api/courses/{courseId}/reviews
```
**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Reviews per page
- `sortBy` (default: createdAt) - Sort field
- `sortOrder` (default: desc) - Sort order
- `minRating` - Minimum rating filter
- `maxRating` - Maximum rating filter

#### Add Course Review
```http
POST /api/courses/{courseId}/reviews
```
**Request Body:**
```json
{
  "title": "Excellent course with great content!", // Optional
  "content": "This course provided comprehensive coverage of the subject matter. The instructor was knowledgeable and the examples were practical and relevant to real-world scenarios.",
  "rating": 5,
  "isAnonymous": false
}
```

### **Additional Review Management Endpoints**

#### Get Specific Review
```http
GET /api/reviews/{reviewId}
```

#### Update Review
```http
PUT /api/reviews/{reviewId}
```
**Request Body:**
```json
{
  "title": "Updated title", // Optional
  "content": "Updated content",
  "rating": 4,
  "reason": "Fixed typos and added more details"
}
```

#### Example Review Without Title
```json
{
  "content": "This course was really helpful for understanding the concepts. The examples were practical and easy to follow.",
  "rating": 4,
  "isAnonymous": false
}
```

#### Delete Review
```http
DELETE /api/reviews/{reviewId}
```

#### Mark Review as Helpful/Unhelpful
```http
POST /api/reviews/{reviewId}/helpful
```
**Request Body:**
```json
{
  "action": "helpful" // or "unhelpful" or "remove"
}
```

#### Report Review
```http
POST /api/reviews/{reviewId}/report
```
**Request Body:**
```json
{
  "reason": "spam", // spam, inappropriate, fake, offensive, other
  "description": "This review appears to be spam"
}
```

#### Get User Reviews
```http
GET /api/reviews/user/{userId}?page=1&limit=10
```

#### Get Review Statistics
```http
GET /api/reviews/course/{courseId}/stats
```

## Response Examples

### Course Reviews Response
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Outstanding course - highly recommended!",
        "content": "This course exceeded my expectations. The content was well-structured...",
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

### Review Statistics Response
```json
{
  "success": true,
  "message": "Review statistics retrieved successfully",
  "data": {
    "totalReviews": 127,
    "averageRating": 4.3,
    "ratingDistribution": {
      "1": 2,
      "2": 5,
      "3": 18,
      "4": 45,
      "5": 57
    },
    "verifiedReviews": 89,
    "approvedReviews": 127,
    "pendingReviews": 3,
    "reportedReviews": 1
  }
}
```

## Database Schema

### Review Model Fields
- **Core**: courseId, userId, title, content, rating
- **Author Info**: name, email, photo (populated)
- **Course Info**: title, instructor, category (populated)
- **Status**: isApproved, isVerifiedPurchase, isAnonymous, isDeleted
- **Engagement**: helpfulVotes[], unhelpfulVotes[], helpfulCount, unhelpfulCount
- **Moderation**: isReported, reportCount, reports[]
- **History**: isEdited, editHistory[]
- **Timestamps**: createdAt, updatedAt

### Key Features
- **Unique Constraint**: One review per user per course
- **Indexes**: Optimized for course queries, user queries, and rating sorts
- **Population**: Automatic author and course information population
- **Soft Delete**: Reviews are marked as deleted, not permanently removed

## Validation Rules

### Review Creation
- **Title**: 10-200 characters, optional
- **Content**: 50-2000 characters, required
- **Rating**: 1-5 integer, required
- **Anonymous**: Boolean, optional (default: false)

### Review Updates
- Same validation as creation for modified fields
- Edit reason optional (max 200 characters)
- Reviews require re-approval after editing

## Security & Permissions

### Authentication Required
- Creating reviews
- Editing own reviews
- Deleting own reviews
- Marking reviews as helpful/unhelpful
- Reporting reviews

### Public Access
- Reading approved reviews
- Viewing review statistics
- Accessing review details

### Admin/Moderator Functions
- Approve/reject reviews
- Delete any review
- View reported reviews
- Access moderation tools

## Integration Notes

### Course Integration
- Reviews are linked to courses via `courseId`
- Course information is automatically populated
- Review stats can update course ratings

### User Integration
- User information is automatically populated
- Anonymous reviews hide user details
- User review history is tracked

### Authentication
- Uses JWT tokens from auth middleware
- Fallback userId for testing purposes
- Proper permission checking for modifications

## Error Handling

### Common Error Responses
- **400**: Validation errors, duplicate reviews
- **401**: Authentication required
- **404**: Course/review not found
- **500**: Internal server errors

### User-Friendly Messages
- Clear validation error messages
- Helpful error descriptions
- Consistent error response format

## Performance Optimizations

### Database Indexes
- `courseId + isApproved + isDeleted` for course review queries
- `userId + isDeleted` for user review queries
- `rating` for rating-based sorting
- `helpfulCount` for popularity sorting

### Query Optimizations
- Pagination to limit response sizes
- Selective field population
- Efficient aggregation for statistics

This review system provides a complete solution for course feedback management with enterprise-level features for user engagement, content moderation, and analytics! 🎉