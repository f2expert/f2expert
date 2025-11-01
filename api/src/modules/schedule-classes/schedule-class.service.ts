import { ScheduleClassModel, ScheduleClassDocument } from "./schedule-class.model"
import { CourseModel } from "../course/course.model"
import { UserModel } from "../users/user.model"
import { EnrollmentModel } from "../enrollments/enrollment.model"
import mongoose from "mongoose"

export interface CreateScheduleClassData {
  courseId: string
  instructorId: string
  className: string
  description?: string
  scheduledDate: Date
  startTime: string
  endTime: string
  venue: string
  address?: any
  capacity: number
  status?: string
  isRecurring?: boolean
  recurringPattern?: any
  maxEnrollments?: number
  enrolledStudents?: any[]
  materials?: any[]
  assignments?: any[]
  announcements?: any[]
  classNotes?: string
  summary?: string
  objectives?: string[]
  prerequisites?: string[]
  requiredMaterials?: string[]
  classPrice?: number
  currency?: string
  tags?: string[]
  createdBy: string
}

export interface UpdateScheduleClassData {
  className?: string
  description?: string
  courseId?: string
  instructorId?: string
  scheduledDate?: Date
  startTime?: string
  endTime?: string
  venue?: string
  address?: any
  capacity?: number
  status?: string
  isRecurring?: boolean
  recurringPattern?: any
  maxEnrollments?: number
  classNotes?: string
  summary?: string
  objectives?: string[]
  prerequisites?: string[]
  requiredMaterials?: string[]
  classPrice?: number
  currency?: string
  tags?: string[]
  lastModifiedBy?: string
}

export interface FilterOptions {
  courseId?: string
  instructorId?: string
  status?: string
  startDate?: Date
  endDate?: Date
  venue?: string
  studentId?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AttendanceRecord {
  studentId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  checkInTime?: Date
  checkOutTime?: Date
  notes?: string
}

// Create a new scheduled class
export const createScheduleClass = async (data: CreateScheduleClassData): Promise<ScheduleClassDocument> => {
  // Validate that course exists
  const course = await CourseModel.findById(data.courseId)
  if (!course) {
    throw new Error("Course not found")
  }

  // Validate that instructor exists and has trainer role
  const instructor = await UserModel.findById(data.instructorId)
  if (!instructor) {
    throw new Error("Instructor not found")
  }
  if (instructor.role !== 'trainer') {
    throw new Error("User is not a trainer")
  }

  // Check for scheduling conflicts with the same instructor
  const conflictingClass = await checkInstructorConflict(
    data.instructorId,
    data.scheduledDate,
    data.startTime,
    data.endTime
  )
  if (conflictingClass) {
    throw new Error(`Instructor has a conflicting class: ${conflictingClass.className} at ${conflictingClass.startTime}-${conflictingClass.endTime}`)
  }

  // Check for venue conflicts
  const venueConflict = await checkVenueConflict(
    data.venue,
    data.scheduledDate,
    data.startTime,
    data.endTime
  )
  if (venueConflict) {
    throw new Error(`Venue is already booked: ${venueConflict.className} at ${venueConflict.startTime}-${venueConflict.endTime}`)
  }

  // Create the scheduled class
  const scheduleClass = new ScheduleClassModel(data)
  await scheduleClass.save()

  // Populate the created schedule class before returning
  await scheduleClass.populate('courseId', 'title description category level')
  await scheduleClass.populate('instructorId', 'firstName lastName email phone')
  await scheduleClass.populate('enrolledStudents.studentId', 'firstName lastName email phone fullName')
  await scheduleClass.populate('waitlistStudents.studentId', 'firstName lastName email phone fullName')

  return scheduleClass
}

// Get all scheduled classes with filters
export const getScheduleClasses = async (filters: FilterOptions) => {
  const {
    courseId,
    instructorId,
    status,
    startDate,
    endDate,
    venue,
    studentId,
    page = 1,
    limit = 10,
    sortBy = 'scheduledDate',
    sortOrder = 'asc'
  } = filters

  // Build query
  const query: any = {}
  
  if (courseId) query.courseId = courseId
  if (instructorId) query.instructorId = instructorId
  if (status) query.status = status
  if (venue) query.venue = new RegExp(venue, 'i')
  
  // Date range filter
  if (startDate || endDate) {
    query.scheduledDate = {}
    if (startDate) query.scheduledDate.$gte = startDate
    if (endDate) query.scheduledDate.$lte = endDate
  }

  // Student enrollment filter
  if (studentId) {
    query['enrolledStudents.studentId'] = studentId
    query['enrolledStudents.status'] = 'enrolled'
  }

  // Calculate pagination
  const skip = (page - 1) * limit
  const sortDirection = sortOrder === 'desc' ? -1 : 1

  // Execute query with population
  const [classes, total] = await Promise.all([
    ScheduleClassModel
      .find(query)
      .populate('courseId', 'title category level')
      .populate('instructorId', 'firstName lastName email')
      .populate('enrolledStudents.studentId', 'firstName lastName email fullName')
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
    ScheduleClassModel.countDocuments(query)
  ])

  return {
    classes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  }
}

// Get a scheduled class by ID
export const getScheduleClassById = async (classId: string): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel
    .findById(classId)
    .populate('courseId', 'title description category level')
    .populate('instructorId', 'firstName lastName email phone')
    .populate('enrolledStudents.studentId', 'firstName lastName email phone fullName')
    .populate('waitlistStudents.studentId', 'firstName lastName email phone fullName')
    .populate('attendance.studentId', 'firstName lastName email fullName')

  return scheduleClass
}

// Update a scheduled class
export const updateScheduleClass = async (classId: string, updateData: UpdateScheduleClassData): Promise<ScheduleClassDocument | null> => {
  // Validate courseId if provided
  if (updateData.courseId) {
    const courseExists = await CourseModel.findById(updateData.courseId)
    if (!courseExists) {
      throw new Error("Course not found")
    }
  }

  // Validate instructorId if provided
  if (updateData.instructorId) {
    const instructor = await UserModel.findById(updateData.instructorId)
    if (!instructor) {
      throw new Error("Instructor not found")
    }
    if (instructor.role !== 'trainer') {
      throw new Error("User is not a trainer")
    }
  }

  // If updating schedule time or instructor, check for conflicts
  if (updateData.scheduledDate || updateData.startTime || updateData.endTime || updateData.instructorId) {
    const existingClass = await ScheduleClassModel.findById(classId)
    if (!existingClass) {
      throw new Error("Scheduled class not found")
    }

    const scheduledDate = updateData.scheduledDate || existingClass.scheduledDate
    const startTime = updateData.startTime || existingClass.startTime
    const endTime = updateData.endTime || existingClass.endTime
    const instructorToCheck = updateData.instructorId || existingClass.instructorId

    // Check instructor conflicts (exclude current class)
    const instructorConflict = await ScheduleClassModel.findOne({
      _id: { $ne: classId },
      instructorId: instructorToCheck,
      scheduledDate: scheduledDate,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gte: startTime }
        },
        {
          startTime: { $lte: endTime },
          endTime: { $gte: endTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    })

    if (instructorConflict) {
      throw new Error("Instructor has a conflicting class at the updated time")
    }

    // Check venue conflicts (exclude current class)
    const venueToCheck = updateData.venue || existingClass.venue
    const venueConflict = await ScheduleClassModel.findOne({
      _id: { $ne: classId },
      venue: venueToCheck,
      scheduledDate: scheduledDate,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gte: startTime }
        },
        {
          startTime: { $lte: endTime },
          endTime: { $gte: endTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    })

    if (venueConflict) {
      throw new Error("Venue is already booked at the updated time")
    }
  }

  const updatedClass = await ScheduleClassModel
    .findByIdAndUpdate(classId, updateData, { new: true, runValidators: true })
    .populate('courseId', 'title category level')
    .populate('instructorId', 'firstName lastName email')
    .populate('enrolledStudents.studentId', 'firstName lastName email phone fullName')
    .populate('waitlistStudents.studentId', 'firstName lastName email phone fullName')

  return updatedClass
}

// Delete a scheduled class
export const deleteScheduleClass = async (classId: string): Promise<boolean> => {
  const result = await ScheduleClassModel.findByIdAndDelete(classId)
  return !!result
}

// Enroll a student in a scheduled class
export const enrollStudentInClass = async (classId: string, studentId: string, status: 'enrolled' | 'waitlist' = 'enrolled'): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  // Check if student exists
  const student = await UserModel.findById(studentId)
  if (!student) {
    throw new Error("Student not found")
  }
  if (student.role !== 'student') {
    throw new Error("User is not a student")
  }

  // Check if student is already enrolled
  const existingEnrollment = scheduleClass.enrolledStudents.find(
    enrollment => enrollment.studentId.toString() === studentId
  )
  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this class")
  }

  // Check capacity and determine enrollment status
  const currentEnrolled = scheduleClass.enrolledStudents.filter(
    enrollment => enrollment.status === 'enrolled'
  ).length

  let enrollmentStatus = status
  if (status === 'enrolled' && currentEnrolled >= scheduleClass.maxEnrollments) {
    enrollmentStatus = 'waitlist'
  }

  // Add student to appropriate list
  if (enrollmentStatus === 'enrolled') {
    scheduleClass.enrolledStudents.push({
      studentId: new mongoose.Types.ObjectId(studentId),
      enrollmentDate: new Date(),
      status: 'enrolled'
    } as any)
  } else {
    const waitlistPosition = scheduleClass.waitlistStudents.length + 1
    scheduleClass.waitlistStudents.push({
      studentId: new mongoose.Types.ObjectId(studentId),
      waitlistDate: new Date(),
      position: waitlistPosition
    } as any)
  }

  await scheduleClass.save()
  return scheduleClass
}

// Remove a student from a scheduled class
export const removeStudentFromClass = async (classId: string, studentId: string): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  // Remove from enrolled students
  scheduleClass.enrolledStudents = scheduleClass.enrolledStudents.filter(
    enrollment => enrollment.studentId.toString() !== studentId
  )

  // Remove from waitlist
  scheduleClass.waitlistStudents = scheduleClass.waitlistStudents.filter(
    waitlist => waitlist.studentId.toString() !== studentId
  )

  // Move first waitlisted student to enrolled if space available
  const currentEnrolled = scheduleClass.enrolledStudents.filter(
    enrollment => enrollment.status === 'enrolled'
  ).length

  if (currentEnrolled < scheduleClass.maxEnrollments && scheduleClass.waitlistStudents.length > 0) {
    const firstWaitlisted = scheduleClass.waitlistStudents.shift()
    if (firstWaitlisted) {
      scheduleClass.enrolledStudents.push({
        studentId: firstWaitlisted.studentId,
        enrollmentDate: new Date(),
        status: 'enrolled'
      } as any)

      // Update positions for remaining waitlisted students
      scheduleClass.waitlistStudents.forEach((waitlist, index) => {
        waitlist.position = index + 1
      })
    }
  }

  await scheduleClass.save()
  return scheduleClass
}

// Mark attendance for a student
export const markAttendance = async (classId: string, attendanceData: AttendanceRecord): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  // Check if student is enrolled
  const isEnrolled = scheduleClass.enrolledStudents.some(
    enrollment => enrollment.studentId.toString() === attendanceData.studentId && enrollment.status === 'enrolled'
  )
  if (!isEnrolled) {
    throw new Error("Student is not enrolled in this class")
  }

  // Remove existing attendance record for this student
  scheduleClass.attendance = scheduleClass.attendance.filter(
    attendance => attendance.studentId.toString() !== attendanceData.studentId
  )

  // Add new attendance record
  scheduleClass.attendance.push({
    studentId: new mongoose.Types.ObjectId(attendanceData.studentId),
    status: attendanceData.status,
    checkInTime: attendanceData.checkInTime,
    checkOutTime: attendanceData.checkOutTime,
    notes: attendanceData.notes
  } as any)

  await scheduleClass.save()
  return scheduleClass
}

// Mark bulk attendance
export const markBulkAttendance = async (classId: string, attendanceRecords: AttendanceRecord[]): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  // Validate all students are enrolled
  for (const record of attendanceRecords) {
    const isEnrolled = scheduleClass.enrolledStudents.some(
      enrollment => enrollment.studentId.toString() === record.studentId && enrollment.status === 'enrolled'
    )
    if (!isEnrolled) {
      throw new Error(`Student ${record.studentId} is not enrolled in this class`)
    }
  }

  // Clear existing attendance
  scheduleClass.attendance = []

  // Add all attendance records
  for (const record of attendanceRecords) {
    scheduleClass.attendance.push({
      studentId: new mongoose.Types.ObjectId(record.studentId),
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      notes: record.notes
    } as any)
  }

  await scheduleClass.save()
  return scheduleClass
}

// Add material to a class
export const addMaterial = async (classId: string, materialData: any): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  scheduleClass.materials.push(materialData)
  await scheduleClass.save()
  return scheduleClass
}

// Add assignment to a class
export const addAssignment = async (classId: string, assignmentData: any): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  scheduleClass.assignments.push(assignmentData)
  await scheduleClass.save()
  return scheduleClass
}

// Add announcement to a class
export const addAnnouncement = async (classId: string, announcementData: any): Promise<ScheduleClassDocument | null> => {
  const scheduleClass = await ScheduleClassModel.findById(classId)
  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  scheduleClass.announcements.push({
    message: announcementData.message,
    createdAt: new Date(),
    isUrgent: announcementData.isUrgent || false,
    readBy: []
  })
  await scheduleClass.save()
  return scheduleClass
}

// Get classes by instructor
export const getClassesByInstructor = async (instructorId: string, filters?: Partial<FilterOptions>) => {
  return getScheduleClasses({
    ...filters,
    instructorId
  })
}

// Get classes by student
export const getClassesByStudent = async (studentId: string, filters?: Partial<FilterOptions>) => {
  return getScheduleClasses({
    ...filters,
    studentId
  })
}

// Get attendance report for a class
export const getAttendanceReport = async (classId: string) => {
  const scheduleClass = await ScheduleClassModel
    .findById(classId)
    .populate('enrolledStudents.studentId', 'firstName lastName email fullName')
    .populate('attendance.studentId', 'firstName lastName email fullName')

  if (!scheduleClass) {
    throw new Error("Scheduled class not found")
  }

  const enrolledStudents = scheduleClass.enrolledStudents.filter(
    enrollment => enrollment.status === 'enrolled'
  )

  const attendanceReport = enrolledStudents.map(enrollment => {
    const attendance = scheduleClass.attendance.find(
      att => att.studentId.toString() === enrollment.studentId.toString()
    )

    return {
      student: enrollment.studentId,
      enrollmentDate: enrollment.enrollmentDate,
      attendance: attendance || { status: 'absent' }
    }
  })

  const summary = {
    totalEnrolled: enrolledStudents.length,
    present: scheduleClass.attendance.filter(att => att.status === 'present').length,
    absent: enrolledStudents.length - scheduleClass.attendance.length,
    late: scheduleClass.attendance.filter(att => att.status === 'late').length,
    excused: scheduleClass.attendance.filter(att => att.status === 'excused').length
  }

  return {
    class: scheduleClass,
    attendanceReport,
    summary
  }
}

// Helper function to check instructor conflicts
const checkInstructorConflict = async (instructorId: string, date: Date, startTime: string, endTime: string) => {
  return ScheduleClassModel.findOne({
    instructorId,
    scheduledDate: date,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      {
        startTime: { $lte: startTime },
        endTime: { $gte: startTime }
      },
      {
        startTime: { $lte: endTime },
        endTime: { $gte: endTime }
      },
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      }
    ]
  })
}

// Helper function to check venue conflicts
const checkVenueConflict = async (venue: string, date: Date, startTime: string, endTime: string) => {
  return ScheduleClassModel.findOne({
    venue,
    scheduledDate: date,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      {
        startTime: { $lte: startTime },
        endTime: { $gte: startTime }
      },
      {
        startTime: { $lte: endTime },
        endTime: { $gte: endTime }
      },
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      }
    ]
  })
}