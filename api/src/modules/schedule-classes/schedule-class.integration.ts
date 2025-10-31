import { ScheduleClassModel } from "./schedule-class.model"
import { CourseModel } from "../course/course.model"
import { UserModel } from "../users/user.model"
import { EnrollmentModel } from "../enrollments/enrollment.model"
import * as ScheduleClassService from "./schedule-class.service"

/**
 * Integration helpers to connect schedule classes with existing systems
 */

// Auto-enroll students from course enrollments
export const autoEnrollFromCourse = async (classId: string): Promise<void> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  // Get all active enrollments for this course
  const courseEnrollments = await EnrollmentModel
    .find({ 
      courseId: scheduleClass.courseId, 
      status: 'active' 
    })
    .populate('userId', '_id')

  // Enroll each student in the class
  for (const enrollment of courseEnrollments) {
    try {
      await ScheduleClassService.enrollStudentInClass(
        classId, 
        enrollment.userId.toString(), 
        'enrolled'
      )
    } catch (error) {
      // Continue with next student if enrollment fails
      console.warn(`Failed to auto-enroll student ${enrollment.userId}: ${error}`)
    }
  }
}

// Sync class attendance with course progress
export const syncAttendanceWithProgress = async (classId: string): Promise<void> => {
  const scheduleClass = await ScheduleClassModel
    .findById(classId)
    .populate('attendance.studentId', '_id')

  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  // Update enrollment progress based on attendance
  for (const attendance of scheduleClass.attendance) {
    if (attendance.status === 'present' || attendance.status === 'late') {
      try {
        await EnrollmentModel.findOneAndUpdate(
          { 
            courseId: scheduleClass.courseId,
            userId: attendance.studentId,
            status: 'active'
          },
          { 
            $inc: { 
              'progress.completedLessons': 1,
              'progress.totalHoursSpent': scheduleClass.duration / 60
            },
            lastAccessedAt: new Date()
          }
        )
      } catch (error) {
        console.warn(`Failed to update progress for student ${attendance.studentId}: ${error}`)
      }
    }
  }
}

// Get class statistics for course dashboard
export const getClassStatistics = async (courseId: string) => {
  const stats = await ScheduleClassModel.aggregate([
    { $match: { courseId: courseId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalStudents: { $sum: "$currentEnrollments" },
        avgAttendance: { $avg: { $size: "$attendance" } }
      }
    }
  ])

  const totalClasses = await ScheduleClassModel.countDocuments({ courseId })
  const upcomingClasses = await ScheduleClassModel.countDocuments({
    courseId,
    status: 'scheduled',
    scheduledDate: { $gte: new Date() }
  })

  return {
    totalClasses,
    upcomingClasses,
    statusBreakdown: stats,
    totalEnrollments: stats.reduce((sum, stat) => sum + stat.totalStudents, 0)
  }
}

// Get instructor schedule conflicts
export const getInstructorConflicts = async (instructorId: string, startDate: Date, endDate: Date) => {
  return ScheduleClassModel.find({
    instructorId,
    scheduledDate: { $gte: startDate, $lte: endDate },
    status: { $nin: ['cancelled', 'completed'] }
  })
  .sort({ scheduledDate: 1, startTime: 1 })
  .populate('courseId', 'title')
}

// Get venue availability
export const getVenueAvailability = async (venue: string, date: Date) => {
  const bookedSlots = await ScheduleClassModel.find({
    venue,
    scheduledDate: date,
    status: { $nin: ['cancelled'] }
  })
  .select('startTime endTime className')
  .sort({ startTime: 1 })

  return {
    date,
    venue,
    bookedSlots
  }
}

// Generate class attendance report for multiple classes
export const generateBulkAttendanceReport = async (classIds: string[]) => {
  const reports = []

  for (const classId of classIds) {
    try {
      const report = await ScheduleClassService.getAttendanceReport(classId)
      reports.push(report)
    } catch (error) {
      console.warn(`Failed to generate report for class ${classId}: ${error}`)
    }
  }

  // Calculate overall statistics
  const overallStats = reports.reduce((acc, report) => {
    acc.totalClasses++
    acc.totalEnrolled += report.summary.totalEnrolled
    acc.totalPresent += report.summary.present
    acc.totalAbsent += report.summary.absent
    acc.totalLate += report.summary.late
    acc.totalExcused += report.summary.excused
    return acc
  }, {
    totalClasses: 0,
    totalEnrolled: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalExcused: 0
  })

  return {
    reports,
    overallStats,
    attendanceRate: overallStats.totalEnrolled > 0 
      ? (overallStats.totalPresent / overallStats.totalEnrolled) * 100 
      : 0
  }
}

// Create recurring classes based on pattern
export const createRecurringClasses = async (baseClassId: string, endDate: Date) => {
  const baseClass = await ScheduleClassModel.findById(baseClassId)
  if (!baseClass || !baseClass.isRecurring || !baseClass.recurringPattern) {
    throw new Error("Base class not found or not configured for recurrence")
  }

  const { type, interval, daysOfWeek } = baseClass.recurringPattern
  const createdClasses = []
  let currentDate = new Date(baseClass.scheduledDate)

  while (currentDate <= endDate) {
    // Calculate next occurrence based on pattern
    switch (type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval)
        break
      case 'weekly':
        if (daysOfWeek && daysOfWeek.length > 0) {
          // For weekly patterns with specific days
          let nextDay = currentDate.getDay()
          let found = false
          
          for (let i = 1; i <= 7; i++) {
            nextDay = (nextDay + 1) % 7
            if (daysOfWeek.includes(nextDay)) {
              currentDate.setDate(currentDate.getDate() + i)
              found = true
              break
            }
          }
          
          if (!found) {
            currentDate.setDate(currentDate.getDate() + 7 * interval)
          }
        } else {
          currentDate.setDate(currentDate.getDate() + 7 * interval)
        }
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval)
        break
    }

    if (currentDate <= endDate) {
      // Create new class
      const baseObj = baseClass.toObject()
      const newClassData = {
        courseId: baseObj.courseId.toString(),
        instructorId: baseObj.instructorId.toString(),
        className: baseObj.className,
        description: baseObj.description,
        scheduledDate: new Date(currentDate),
        startTime: baseObj.startTime,
        endTime: baseObj.endTime,
        venue: baseObj.venue,
        address: baseObj.address,
        capacity: baseObj.capacity,
        status: 'scheduled' as const,
        isRecurring: baseObj.isRecurring,
        recurringPattern: baseObj.recurringPattern,
        maxEnrollments: baseObj.maxEnrollments,
        classNotes: baseObj.classNotes,
        summary: baseObj.summary,
        objectives: baseObj.objectives,
        prerequisites: baseObj.prerequisites,
        requiredMaterials: baseObj.requiredMaterials,
        classPrice: baseObj.classPrice,
        currency: baseObj.currency,
        tags: baseObj.tags,
        createdBy: baseObj.createdBy.toString()
      }

      try {
        const newClass = await ScheduleClassService.createScheduleClass(newClassData)
        createdClasses.push(newClass)
      } catch (error) {
        console.warn(`Failed to create recurring class for ${currentDate}: ${error}`)
      }
    }
  }

  return createdClasses
}

// Notify students of upcoming classes
export const notifyUpcomingClasses = async (hoursBeforeClass: number = 24) => {
  const cutoffTime = new Date()
  cutoffTime.setHours(cutoffTime.getHours() + hoursBeforeClass)

  const upcomingClasses = await ScheduleClassModel
    .find({
      scheduledDate: { 
        $gte: new Date(), 
        $lte: cutoffTime 
      },
      status: 'scheduled'
    })
    .populate('courseId', 'title')
    .populate('instructorId', 'firstName lastName')
    .populate('enrolledStudents.studentId', 'firstName lastName email')

  const notifications = []

  for (const scheduleClass of upcomingClasses) {
    for (const enrollment of scheduleClass.enrolledStudents) {
      if (enrollment.status === 'enrolled') {
        notifications.push({
          studentId: enrollment.studentId.toString(),
          email: (enrollment.studentId as any).email,
          className: scheduleClass.className,
          courseName: (scheduleClass.courseId as any).title,
          instructorName: `${(scheduleClass.instructorId as any).firstName} ${(scheduleClass.instructorId as any).lastName}`,
          scheduledDate: scheduleClass.scheduledDate,
          startTime: scheduleClass.startTime,
          venue: scheduleClass.venue,
          address: scheduleClass.address
        })
      }
    }
  }

  return notifications
}

// Get student's class schedule
export const getStudentSchedule = async (studentId: string, startDate?: Date, endDate?: Date) => {
  const query: any = {
    'enrolledStudents.studentId': studentId,
    'enrolledStudents.status': 'enrolled'
  }

  if (startDate || endDate) {
    query.scheduledDate = {}
    if (startDate) query.scheduledDate.$gte = startDate
    if (endDate) query.scheduledDate.$lte = endDate
  }

  return ScheduleClassModel
    .find(query)
    .populate('courseId', 'title category level')
    .populate('instructorId', 'firstName lastName')
    .sort({ scheduledDate: 1, startTime: 1 })
}

// Get instructor's teaching schedule
export const getInstructorSchedule = async (instructorId: string, startDate?: Date, endDate?: Date) => {
  const query: any = { instructorId }

  if (startDate || endDate) {
    query.scheduledDate = {}
    if (startDate) query.scheduledDate.$gte = startDate
    if (endDate) query.scheduledDate.$lte = endDate
  }

  return ScheduleClassModel
    .find(query)
    .populate('courseId', 'title category level')
    .sort({ scheduledDate: 1, startTime: 1 })
}

// Calculate class revenue and payments
export const calculateClassRevenue = async (classId: string) => {
  const scheduleClass = await ScheduleClassModel
    .findById(classId)
    .populate('courseId', 'price currency')

  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  const enrolledCount = scheduleClass.enrolledStudents.filter(
    enrollment => enrollment.status === 'enrolled'
  ).length

  const classPrice = scheduleClass.classPrice || (scheduleClass.courseId as any).price || 0
  const currency = scheduleClass.currency || (scheduleClass.courseId as any).currency || 'INR'

  return {
    enrolledStudents: enrolledCount,
    pricePerStudent: classPrice,
    currency,
    totalRevenue: enrolledCount * classPrice,
    capacity: scheduleClass.capacity,
    utilizationRate: (enrolledCount / scheduleClass.capacity) * 100
  }
}