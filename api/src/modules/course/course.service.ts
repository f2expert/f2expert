import { CourseModel } from "./course.model"
import { CourseDTO, CourseFilters, CourseSortOptions } from "./course.types"

export const getAllCourses = async () => {
  return CourseModel.find({ isPublished: true }).populate('instructor', 'name email')
}

export const getLimitedCourses = async (limit: number) => {
  return CourseModel.find({ isPublished: true }).limit(limit).sort({ createdAt: -1 })
}

export const getCourseById = async (id: string) => {
  return CourseModel.findById(id).populate('instructor', 'name email')
}

export const getCoursesWithFilters = async (filters: CourseFilters, sort: CourseSortOptions, page: number = 1, limit: number = 10) => {
  const query: any = { isPublished: true }
  
  // Build filter query
  if (filters.category) query.category = filters.category
  if (filters.level) query.level = filters.level
  if (filters.technologies && filters.technologies.length > 0) {
    query.technologies = { $in: filters.technologies }
  }
  if (filters.priceRange) {
    query.price = {
      $gte: filters.priceRange.min,
      $lte: filters.priceRange.max
    }
  }
  if (filters.rating) query.rating = { $gte: filters.rating }
  if (filters.mode) query.mode = filters.mode
  if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured
  if (filters.hasProjects !== undefined) query.hasProjects = filters.hasProjects
  if (filters.certificateProvided !== undefined) query.certificateProvided = filters.certificateProvided

  // Build sort options
  const sortOptions: any = {}
  sortOptions[sort.field] = sort.order === 'asc' ? 1 : -1

  const skip = (page - 1) * limit
  
  const [courses, total] = await Promise.all([
    CourseModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('instructor', 'name email'),
    CourseModel.countDocuments(query)
  ])

  return {
    courses,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCourses: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  }
}

export const getFeaturedCourses = async (limit: number = 6) => {
  return CourseModel.find({ 
    isPublished: true, 
    isFeatured: true 
  })
  .sort({ rating: -1, totalStudents: -1 })
  .limit(limit)
  .populate('instructor', 'name email')
}

export const getCoursesByCategory = async (category: string, limit?: number) => {
  const query = CourseModel.find({ 
    isPublished: true, 
    category 
  }).sort({ rating: -1 })
  
  if (limit) query.limit(limit)
  
  return query.populate('instructor', 'name email')
}

export const getCoursesByTechnology = async (technology: string, limit?: number) => {
  const query = CourseModel.find({ 
    isPublished: true, 
    technologies: { $in: [technology] }
  }).sort({ rating: -1 })
  
  if (limit) query.limit(limit)
  
  return query.populate('instructor', 'name email')
}

export const getPopularCourses = async (limit: number = 10) => {
  return CourseModel.find({ isPublished: true })
    .sort({ totalStudents: -1, rating: -1 })
    .limit(limit)
    .populate('instructor', 'name email')
}

export const searchCourses = async (searchTerm: string, limit: number = 20) => {
  return CourseModel.find({
    isPublished: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { shortDescription: { $regex: searchTerm, $options: 'i' } },
      { technologies: { $in: [new RegExp(searchTerm, 'i')] } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  })
  .sort({ rating: -1, totalStudents: -1 })
  .limit(limit)
  .populate('instructor', 'name email')
}

export const createCourse = async (payload: CourseDTO) => {
  return CourseModel.create(payload)
}

export const updateCourse = async (id: string, payload: Partial<CourseDTO>) => {
  return CourseModel.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteCourse = async (id: string) => {
  return CourseModel.findByIdAndDelete(id)
}

export const updateCourseRating = async (courseId: string, newRating: number) => {
  return CourseModel.findByIdAndUpdate(
    courseId, 
    { rating: newRating }, 
    { new: true }
  )
}

export const incrementStudentCount = async (courseId: string) => {
  return CourseModel.findByIdAndUpdate(
    courseId,
    { $inc: { totalStudents: 1 } },
    { new: true }
  )
}

export const getCourseStatistics = async () => {
  const stats = await CourseModel.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        averageRating: { $avg: '$rating' },
        totalStudents: { $sum: '$totalStudents' },
        categoryCounts: { 
          $push: '$category'
        }
      }
    }
  ])
  
  return stats[0] || {
    totalCourses: 0,
    averagePrice: 0,
    averageRating: 0,
    totalStudents: 0
  }
}
