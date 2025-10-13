# User Management System - Enhanced for IT Training Institute

## Overview
The user management system has been completely redesigned to support the three distinct user roles in your IT training institute: **Admin**, **Trainer**, and **Student**. This comprehensive update includes enhanced data models, validation, and role-specific functionality.

## Key Enhancements

### 1. Enhanced User Model
- **Comprehensive User Schema**: Updated from basic fields to include 40+ fields
- **Role-Specific Information**: Dedicated data structures for admin, trainer, and student roles
- **Professional Contact Information**: Address, phone, emergency contacts
- **Security Features**: Email verification, password reset tokens, enhanced password policies

### 2. Three User Types Support

#### **Admin Users**
- Employee ID generation (format: AD24001, AD24002, etc.)
- Department assignment
- Permission management system
- Access level controls (super_admin, admin, manager)
- Administrative oversight capabilities

#### **Trainer Users**
- Employee ID generation (format: TR24001, TR24002, etc.)
- Department and specialization tracking
- Experience and qualification management
- Certification system with expiry dates
- Expertise areas and hourly rate settings
- Professional development tracking

#### **Student Users**
- Student ID generation (format: STU20240001, STU20240002, etc.)
- Enrollment date tracking
- Emergency contact information
- Education level and background
- Career goals and previous experience
- Learning progress tracking capabilities

### 3. Advanced Features

#### **Comprehensive Profile Management**
```typescript
// Personal Information
- firstName, lastName (replaces single 'name' field)
- email (with uniqueness validation)
- phone number with international format support
- date of birth and gender
- profile avatar and bio
- complete address information

// Security & Verification
- Enhanced password requirements (8+ chars, uppercase, lowercase, number)
- Email verification system
- Phone verification (optional)
- Password reset tokens with expiry
- Last login tracking
```

#### **Role-Based Data Structure**
```typescript
// Student-Specific Data
studentInfo: {
  studentId: "STU20240001",
  enrollmentDate: Date,
  emergencyContact: {
    name: "Parent/Guardian Name",
    phone: "+91-9876543210",
    relationship: "Father/Mother/etc"
  },
  educationLevel: "bachelor" | "master" | "phd" | etc,
  previousExperience: "IT background description",
  careerGoals: "Career objectives"
}

// Trainer-Specific Data
trainerInfo: {
  employeeId: "TR24001",
  department: "Web Development",
  specializations: ["JavaScript", "React", "Node.js"],
  experience: 5, // years
  qualifications: ["B.Tech CS", "AWS Certified"],
  certifications: [{
    name: "AWS Solutions Architect",
    issuedBy: "Amazon",
    issuedDate: Date,
    expiryDate: Date,
    certificateUrl: "https://..."
  }],
  expertise: ["Frontend", "Backend", "DevOps"],
  hourlyRate: 2000
}

// Admin-Specific Data
adminInfo: {
  employeeId: "AD24001",
  department: "Administration",
  permissions: ["user_management", "course_management"],
  accessLevel: "admin" | "super_admin" | "manager"
}
```

### 4. Enhanced API Endpoints

#### **Core User Management**
```
GET    /users                    - List all users (with role/status filtering)
POST   /users                    - Create new user (admin/trainer/student)
GET    /users/{id}               - Get user details
PUT    /users/{id}               - Update user profile
DELETE /users/{id}               - Delete user

GET    /users/search?q=term      - Search users by name/email
GET    /users/stats              - Get user statistics by role
```

#### **Role-Specific Operations**
```
PUT    /users/{id}/student-info  - Update student-specific information
PUT    /users/{id}/trainer-info  - Update trainer-specific information  
PUT    /users/{id}/admin-info    - Update admin-specific information
```

#### **Security Operations**
```
POST   /users/{id}/change-password - Change user password
```

### 5. Comprehensive Validation System

#### **User Creation Validation**
- **Name**: First and last name required (1-50 characters each)
- **Email**: Valid email format, uniqueness checked
- **Password**: Minimum 8 characters with complexity requirements
- **Phone**: International format validation
- **Role**: Must be admin/trainer/student
- **Address**: Optional but validated when provided

#### **Role-Specific Validation**
- **Student Info**: Emergency contact validation, education level enum
- **Trainer Info**: Experience range (0-50 years), certification date validation
- **Admin Info**: Permission array validation, access level enum

### 6. Smart ID Generation System

#### **Automatic ID Assignment**
```typescript
// Student IDs: Year + Sequential Number
STU20240001, STU20240002, STU20240003...

// Trainer Employee IDs: Prefix + Year + Sequential
TR24001, TR24002, TR24003...

// Admin Employee IDs: Prefix + Year + Sequential  
AD24001, AD24002, AD24003...
```

### 7. Advanced Service Layer Features

#### **User Statistics & Analytics**
```typescript
getUserStats(): {
  totalUsers: number,
  activeUsers: number,
  inactiveUsers: number,
  roleBreakdown: [
    { _id: "student", count: 150, active: 145 },
    { _id: "trainer", count: 25, active: 25 },
    { _id: "admin", count: 5, active: 5 }
  ]
}
```

#### **Advanced Search & Filtering**
- Search by name, email across all users
- Filter by role (admin/trainer/student)
- Filter by active/inactive status
- Pagination support with limits

#### **Security Features**
- Password hashing with bcrypt (12 rounds)
- Email uniqueness validation
- MongoDB ObjectId validation
- Circular reference prevention
- Input sanitization

### 8. Database Optimizations

#### **Performance Indexes**
```typescript
// Optimized database queries with indexes on:
- email (unique)
- role (for filtering)
- studentInfo.studentId (unique, sparse)
- trainerInfo.employeeId (unique, sparse)
- adminInfo.employeeId (unique, sparse)
- isActive (for status filtering)
- createdAt (for sorting)
```

#### **Virtual Fields**
```typescript
// Auto-computed fields available on all user objects:
- fullName: "firstName + lastName"
- roleDisplay: "Capitalized role name"
```

### 9. Enhanced Error Handling
- Comprehensive error messages for validation failures
- Specific error handling for duplicate emails
- Role-based operation validation
- MongoDB ObjectId format validation
- Meaningful error responses for frontend integration

## Usage Examples

### Creating Users by Role

#### **Create Student**
```json
POST /users
{
  "firstName": "Rahul",
  "lastName": "Kumar", 
  "email": "rahul.kumar@example.com",
  "password": "SecurePass123",
  "phone": "+91-9876543210",
  "role": "student",
  "dateOfBirth": "2000-05-15",
  "address": {
    "street": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka", 
    "country": "India",
    "zipCode": "560001"
  }
}

// Auto-generated response includes:
// - studentInfo.studentId: "STU20240001"
// - studentInfo.enrollmentDate: current date
```

#### **Create Trainer**
```json
POST /users
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya.sharma@company.com",
  "password": "TrainerPass123",
  "role": "trainer",
  "phone": "+91-9876543211"
}

// Auto-generated response includes:
// - trainerInfo.employeeId: "TR24001"
```

### Updating Role-Specific Information

#### **Update Student Info**
```json
PUT /users/{studentId}/student-info
{
  "emergencyContact": {
    "name": "Rajesh Kumar",
    "phone": "+91-9876543212", 
    "relationship": "Father"
  },
  "educationLevel": "bachelor",
  "previousExperience": "Basic HTML/CSS knowledge",
  "careerGoals": "Become a full-stack developer"
}
```

#### **Update Trainer Info**
```json
PUT /users/{trainerId}/trainer-info
{
  "department": "Full Stack Development",
  "specializations": ["React", "Node.js", "MongoDB"],
  "experience": 5,
  "certifications": [{
    "name": "MongoDB Certified Developer",
    "issuedBy": "MongoDB Inc.",
    "issuedDate": "2024-01-15",
    "expiryDate": "2027-01-15",
    "certificateUrl": "https://university.mongodb.com/..."
  }],
  "expertise": ["Frontend", "Backend", "Database Design"],
  "hourlyRate": 2500
}
```

## Benefits for IT Training Institute

1. **Complete User Lifecycle Management**: From enrollment to graduation/employment
2. **Role-Based Access Control**: Different permissions and data for each user type
3. **Professional ID System**: Organized identification for students and staff
4. **Comprehensive Profiles**: Complete information for better institute management
5. **Search & Analytics**: Easy user discovery and statistical insights
6. **Security Compliance**: Enterprise-grade password and data security
7. **Scalable Architecture**: Designed to handle growing user base
8. **API-First Design**: Ready for frontend integration and mobile apps

## API Documentation
All endpoints are fully documented in Swagger/OpenAPI format and available at `/api-docs` when the server is running. The documentation includes:
- Complete request/response schemas
- Validation rules and error responses
- Interactive API testing
- Role-specific endpoint documentation
- Example requests and responses for each user type

This enhanced user management system provides a solid foundation for managing all stakeholders in your IT training institute with role-appropriate features and comprehensive data tracking.