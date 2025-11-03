export { courseApiService, type CourseDetails, type CoursesResponse } from './courseApi';
export { trainerApiService, type Trainer, type TrainersResponse } from './trainerApi';
export { tutorialApiService, type Tutorial, type TutorialsResponse, type TutorialFilters } from './tutorialApi';
export { authApiService, type LoginCredentials, type LoginResponse, type AuthUser } from './authApi';
export { menuApiService, type MenuItem, type MenuResponse } from './menuApi';
export { 
  paymentApiService, 
  type PaymentMethod, 
  type PaymentIntent, 
  type PaymentHistory,
  type CreatePaymentIntentRequest,
  type CreatePaymentIntentResponse,
  type ProcessPaymentRequest,
  type ProcessPaymentResponse,
  type RefundRequest,
  type RefundResponse,
  PAYMENT_CONFIG
} from './paymentApi';
export {
  enrollmentApiService,
  type EnrollmentDetails,
  type EnrollmentsResponse,
  type EnrollmentFilters,
  type EnrollmentStats
} from './enrollmentApi';
export {
  studentManagementApiService,
  type Student,
  type StudentStats,
  type StudentFilters,
  type CreateStudentData,
  type UpdateStudentData,
  type AttendanceRecord,
  type BulkOperation,
  type PaymentRecord
} from './studentManagementApi';
export {
  trainerManagementApiService,
  type Trainer as TrainerManagement,
  type TrainerStats,
  type TrainerFilters,
  type CreateTrainerData,
  type UpdateTrainerData
} from './trainerManagementApi';
export {
  courseManagementApiService,
  type Course as CourseManagement,
  type CourseStats,
  type CourseFilters,
  type CreateCourseData,
  type UpdateCourseData
} from './courseManagementApi';
export {
  classManagementApiService,
  type ClassManagement,
  type ClassFilters,
  type CreateClassRequest,
  type UpdateClassRequest,
  type ClassesResponse,
  type Address,
  type RecurringPattern,
  type ClassEnrollment,
  type EnrolledStudent,
  type CreateEnrollmentRequest,
  type ClassMaterial,
  type CreateMaterialRequest,
  type AttendanceRecord as ClassAttendanceRecord,
  type StudentAttendance,
  type MarkAttendanceRequest,
  type ClassAssignment,
  type AssignmentSubmission,
  type CreateAssignmentRequest,
  type SubmitAssignmentRequest,
  type GradeAssignmentRequest,
  type ClassAnnouncement,
  type AnnouncementAttachment,
  type CreateAnnouncementRequest,
  type ApiAttendanceRecord,
  type ApiMaterial,
  type ApiAssignment,
  type ApiAnnouncement,
  ApiResponseTransformer
} from './classManagementApiService';
export {
  salaryApiService,
  trainerSalaryApiService,
  mapSalaryForLegacy,
  type SalaryStructure,
  type TrainerSalary, // Backward compatibility alias
  type EmployeeInfo,
  type PayPeriod,
  type Allowances,
  type Deductions,
  type ClassInfo,
  type PaymentInfo,
  type CreatedBy,
  type CreateSalaryData,
  type UpdateSalaryData,
  type SalaryFilters,
  type SalaryStats,
  type SalariesResponse,
  type Pagination
} from './salaryApi';