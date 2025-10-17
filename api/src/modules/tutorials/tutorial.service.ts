import { TutorialModel } from "./tutorial.model"
import { TutorialDTO, TutorialFilters, TutorialSortOptions, TutorialStats } from "./tutorial.types"

export const getAllTutorials = async () => {
  return TutorialModel.find({ isPublished: true })
    //.populate('relatedCourses', 'title category level')
    //.populate('relatedTutorials', 'title category level')
    .sort({ createdAt: -1 })
}

export const getLimitedTutorials = async (limit: number) => {
  return TutorialModel.find({ isPublished: true })
    .limit(limit)
    .sort({ createdAt: -1 })
    .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const getTutorialById = async (id: string) => {
  return TutorialModel.findById(id)
    .populate('relatedCourses', 'title category level price')
    .populate('relatedTutorials', 'title category level estimatedReadTime')
}

export const getTutorialsWithFilters = async (
  filters: TutorialFilters, 
  sort: TutorialSortOptions, 
  page: number = 1, 
  limit: number = 10,
  searchTerm?: string
) => {
  const query: any = { isPublished: true }
  
  // Build filter query
  if (filters.category) query.category = filters.category
  if (filters.level) query.level = filters.level
  if (filters.tutorialType) query.tutorialType = filters.tutorialType
  if (filters.technologies && filters.technologies.length > 0) {
    query.technologies = { $in: filters.technologies }
  }
  if (filters.difficulty) query.difficulty = filters.difficulty
  if (filters.rating) query.rating = { $gte: filters.rating }
  if (filters.estimatedReadTime) {
    query.estimatedReadTime = {}
    if (filters.estimatedReadTime.min) query.estimatedReadTime.$gte = filters.estimatedReadTime.min
    if (filters.estimatedReadTime.max) query.estimatedReadTime.$lte = filters.estimatedReadTime.max
  }
  if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured
  if (filters.isPremium !== undefined) query.isPremium = filters.isPremium
  if (filters.dateRange) {
    query.createdAt = {
      $gte: filters.dateRange.startDate,
      $lte: filters.dateRange.endDate
    }
  }

  // Add text search if provided
  if (searchTerm) {
    query.$text = { $search: searchTerm }
  }

  // Build sort options
  const sortOptions: any = {}
  sortOptions[sort.field] = sort.order === 'asc' ? 1 : -1

  const skip = (page - 1) * limit
  
  const [tutorials, total] = await Promise.all([
    TutorialModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('relatedCourses', 'title category level')
      .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews totalLikes thumbnailUrl videoUrl videoDuration createdAt publishedAt'),
    TutorialModel.countDocuments(query)
  ])

  return {
    tutorials,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTutorials: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  }
}

export const getFeaturedTutorials = async (limit: number = 6) => {
  return TutorialModel.find({ 
    isPublished: true, 
    isFeatured: true 
  })
  .sort({ rating: -1, totalViews: -1 })
  .limit(limit)
  .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const getTutorialsByCategory = async (category: string, limit?: number) => {
  const query = TutorialModel.find({ 
    isPublished: true, 
    category 
  }).sort({ rating: -1, totalViews: -1 })
  
  if (limit) query.limit(limit)
  
  return query.select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const getTutorialsByTechnology = async (technology: string, limit?: number) => {
  const query = TutorialModel.find({ 
    isPublished: true, 
    technologies: { $in: [technology] }
  }).sort({ rating: -1, totalViews: -1 })
  
  if (limit) query.limit(limit)
  
  return query.select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const getTutorialsByType = async (tutorialType: string, limit?: number) => {
  const query = TutorialModel.find({ 
    isPublished: true, 
    tutorialType 
  }).sort({ rating: -1, totalViews: -1 })
  
  if (limit) query.limit(limit)
  
  return query.select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const getPopularTutorials = async (limit: number = 10) => {
  return TutorialModel.find({ isPublished: true })
    .sort({ totalViews: -1, totalLikes: -1, rating: -1 })
    .limit(limit)
    .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews totalLikes thumbnailUrl videoUrl videoDuration')
}

export const getLatestTutorials = async (limit: number = 10) => {
  return TutorialModel.find({ isPublished: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration publishedAt')
}

export const searchTutorials = async (searchTerm: string, limit: number = 20) => {
  return TutorialModel.find({
    isPublished: true,
    $text: { $search: searchTerm }
  })
  .sort({ score: { $meta: 'textScore' }, rating: -1, totalViews: -1 })
  .limit(limit)
  .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const getRelatedTutorials = async (tutorialId: string, category: string, technologies: string[], limit: number = 5) => {
  return TutorialModel.find({
    _id: { $ne: tutorialId },
    isPublished: true,
    $or: [
      { category: category },
      { technologies: { $in: technologies } }
    ]
  })
  .sort({ rating: -1, totalViews: -1 })
  .limit(limit)
  .select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration')
}

export const createTutorial = async (payload: TutorialDTO) => {
  // Set default values for optional fields that are required in the model
  const tutorialData = {
    ...payload,
    shortDescription: payload.shortDescription || payload.description.substring(0, 200),
    learningObjectives: payload.learningObjectives || [`Learn ${payload.technologies.join(', ')}`],
    prerequisites: payload.prerequisites || [],
    authorBio: payload.authorBio || '',
    subCategory: payload.subCategory || '',
    steps: payload.steps || [],
    codeExamples: payload.codeExamples || [],
    resources: payload.resources || [],
    tags: payload.tags || payload.technologies.map(tech => tech.toLowerCase()),
    difficulty: payload.difficulty || 2,
    rating: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    isPublished: payload.isPublished || false,
    isFeatured: false,
    isPremium: false,
    language: payload.language || 'English',
    seoTitle: payload.seoTitle || payload.title,
    seoDescription: payload.seoDescription || payload.description.substring(0, 160),
    seoKeywords: payload.seoKeywords || payload.technologies
  }
  
  return TutorialModel.create(tutorialData)
}

export const updateTutorial = async (id: string, payload: Partial<TutorialDTO>) => {
  return TutorialModel.findByIdAndUpdate(id, payload, { new: true })
}

export const deleteTutorial = async (id: string) => {
  return TutorialModel.findByIdAndDelete(id)
}

export const incrementTutorialViews = async (tutorialId: string) => {
  return TutorialModel.findByIdAndUpdate(
    tutorialId,
    { $inc: { totalViews: 1 } },
    { new: true }
  )
}

export const incrementTutorialLikes = async (tutorialId: string) => {
  return TutorialModel.findByIdAndUpdate(
    tutorialId,
    { $inc: { totalLikes: 1 } },
    { new: true }
  )
}

export const decrementTutorialLikes = async (tutorialId: string) => {
  return TutorialModel.findByIdAndUpdate(
    tutorialId,
    { $inc: { totalLikes: -1 } },
    { new: true }
  )
}

export const updateTutorialRating = async (tutorialId: string, newRating: number) => {
  return TutorialModel.findByIdAndUpdate(
    tutorialId, 
    { rating: newRating }, 
    { new: true }
  )
}

export const getTutorialStatistics = async (): Promise<TutorialStats> => {
  const stats = await TutorialModel.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: null,
        totalTutorials: { $sum: 1 },
        totalViews: { $sum: '$totalViews' },
        averageRating: { $avg: '$rating' },
        categories: { $push: '$category' },
        levels: { $push: '$level' },
        types: { $push: '$tutorialType' },
        allTechnologies: { $push: '$technologies' }
      }
    }
  ])

  if (!stats.length) {
    return {
      totalTutorials: 0,
      totalViews: 0,
      averageRating: 0,
      categoryDistribution: {},
      levelDistribution: {},
      typeDistribution: {},
      topTechnologies: []
    }
  }

  const data = stats[0]

  // Calculate distributions
  const categoryDistribution = data.categories.reduce((acc: any, category: string) => {
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const levelDistribution = data.levels.reduce((acc: any, level: string) => {
    acc[level] = (acc[level] || 0) + 1
    return acc
  }, {})

  const typeDistribution = data.types.reduce((acc: any, type: string) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Flatten technologies and count
  const allTechnologies = data.allTechnologies.flat()
  const techCounts = allTechnologies.reduce((acc: any, tech: string) => {
    acc[tech] = (acc[tech] || 0) + 1
    return acc
  }, {})

  const topTechnologies = Object.entries(techCounts)
    .map(([technology, count]) => ({ technology, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalTutorials: data.totalTutorials,
    totalViews: data.totalViews,
    averageRating: data.averageRating,
    categoryDistribution,
    levelDistribution,
    typeDistribution,
    topTechnologies
  }
}

export const getTutorialsByAuthor = async (author: string, limit?: number) => {
  const query = TutorialModel.find({ 
    isPublished: true, 
    author 
  }).sort({ createdAt: -1 })
  
  if (limit) query.limit(limit)
  
  return query.select('title shortDescription author category level technologies estimatedReadTime tutorialType difficulty rating totalViews thumbnailUrl videoUrl videoDuration publishedAt')
}

