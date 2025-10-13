import { TestimonialModel } from "./testimonial.model"
import { 
  ICreateTestimonialRequest, 
  IUpdateTestimonialRequest,
  IApprovalRequest,
  ITestimonialQuery 
} from "./testimonial.types"
import mongoose from 'mongoose'

export class TestimonialService {
  
  // Create a new testimonial
  static async createTestimonial(data: ICreateTestimonialRequest) {
    const testimonial = new TestimonialModel(data)
    return testimonial.save()
  }

  // Get all testimonials with filtering
  static async getAllTestimonials(query: ITestimonialQuery = {}) {
    const {
      isApproved,
      isActive,
      isFeatured,
      course,
      rating,
      minRating,
      tags,
      limit = 20,
      page = 1,
      sortBy = 'date',
      sortOrder = 'desc'
    } = query

    // Build filter object
    const filter: any = {}
    
    if (isApproved !== undefined) filter.isApproved = isApproved
    if (isActive !== undefined) filter.isActive = isActive
    if (isFeatured !== undefined) filter.isFeatured = isFeatured
    if (course) filter.course = { $regex: course, $options: 'i' }
    if (rating) filter.rating = rating
    if (minRating) filter.rating = { $gte: minRating }
    if (tags && Array.isArray(tags)) {
      const tagArray = tags.map((tag: string) => tag.trim().toLowerCase())
      filter.tags = { $in: tagArray }
    }

    // Build sort object
    let sortObj: any = {}
    switch (sortBy) {
      case 'rating':
        sortObj.rating = sortOrder === 'desc' ? -1 : 1
        break
      case 'course':
        sortObj.course = sortOrder === 'desc' ? -1 : 1
        break
      case 'date':
      default:
        sortObj.submittedDate = sortOrder === 'desc' ? -1 : 1
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Execute query with pagination
    const testimonials = await TestimonialModel
      .find(filter)
      .populate('approvedBy', 'firstName lastName email')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await TestimonialModel.countDocuments(filter)
    
    return {
      testimonials,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  }

  // Get testimonial by ID
  static async getTestimonialById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID format')
    }
    
    return TestimonialModel
      .findById(id)
      .populate('approvedBy', 'firstName lastName email')
  }

  // Update testimonial
  static async updateTestimonial(id: string, data: IUpdateTestimonialRequest) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID format')
    }

    const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'firstName lastName email')
    
    return updatedTestimonial
  }

  // Delete testimonial
  static async deleteTestimonial(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID format')
    }
    
    return TestimonialModel.findByIdAndDelete(id)
  }

  // Approve or reject testimonial
  static async updateApprovalStatus(id: string, data: IApprovalRequest) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID format')
    }

    const updateData: any = {
      isApproved: data.isApproved
    }

    if (data.isApproved) {
      updateData.approvedDate = new Date()
      if (data.approvedBy) {
        updateData.approvedBy = data.approvedBy
      }
    } else {
      updateData.approvedDate = null
      updateData.approvedBy = null
    }

    const testimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'firstName lastName email')
    
    return testimonial
  }

  // Get featured testimonials
  static async getFeaturedTestimonials(limit: number = 6) {
    return TestimonialModel
      .find({ 
        isApproved: true, 
        isActive: true, 
        isFeatured: true 
      })
      .populate('approvedBy', 'firstName lastName email')
      .sort({ approvedDate: -1 })
      .limit(limit)
  }

  // Get testimonials by course
  static async getTestimonialsByCourse(course: string, limit: number = 10) {
    return TestimonialModel
      .find({ 
        course: { $regex: course, $options: 'i' },
        isApproved: true, 
        isActive: true 
      })
      .populate('approvedBy', 'firstName lastName email')
      .sort({ rating: -1, approvedDate: -1 })
      .limit(limit)
  }

  // Get testimonials by rating
  static async getTestimonialsByRating(minRating: number = 4, limit: number = 10) {
    return TestimonialModel
      .find({ 
        rating: { $gte: minRating },
        isApproved: true, 
        isActive: true 
      })
      .populate('approvedBy', 'firstName lastName email')
      .sort({ rating: -1, approvedDate: -1 })
      .limit(limit)
  }

  // Get testimonial statistics
  static async getTestimonialStats() {
    const stats = await TestimonialModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$isApproved', false] }, 1, 0] }
          },
          featured: {
            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
          },
          avgRating: { $avg: '$rating' }
        }
      }
    ])

    const ratingBreakdown = await TestimonialModel.aggregate([
      {
        $match: { isApproved: true, isActive: true }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ])

    const courseBreakdown = await TestimonialModel.aggregate([
      {
        $match: { isApproved: true, isActive: true }
      },
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ])

    return {
      overview: stats[0] || {
        total: 0,
        approved: 0,
        pending: 0,
        featured: 0,
        avgRating: 0
      },
      ratingBreakdown,
      courseBreakdown
    }
  }

  // Search testimonials
  static async searchTestimonials(searchTerm: string, limit: number = 20) {
    return TestimonialModel
      .find({
        $and: [
          { isApproved: true, isActive: true },
          {
            $or: [
              { studentName: { $regex: searchTerm, $options: 'i' } },
              { title: { $regex: searchTerm, $options: 'i' } },
              { content: { $regex: searchTerm, $options: 'i' } },
              { course: { $regex: searchTerm, $options: 'i' } },
              { currentCompany: { $regex: searchTerm, $options: 'i' } },
              { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ]
          }
        ]
      })
      .populate('approvedBy', 'firstName lastName email')
      .sort({ rating: -1, approvedDate: -1 })
      .limit(limit)
  }

  // Toggle featured status
  static async toggleFeatured(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid testimonial ID format')
    }

    const testimonial = await TestimonialModel.findById(id)
    if (!testimonial) {
      throw new Error('Testimonial not found')
    }

    if (!testimonial.isApproved) {
      throw new Error('Cannot feature unapproved testimonial')
    }

    testimonial.isFeatured = !testimonial.isFeatured
    return testimonial.save()
  }
}