import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { X, User, Phone, MapPin, Calendar, BookOpen, CreditCard, Users } from 'lucide-react';
import type { Student } from '../../../services';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  student: Student | null;
}

export const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  student
}) => {
  if (!student) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Student Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-600">Student ID: {student.studentId}</p>
                <span className={`inline-flex px-3 py-1 mt-2 text-sm font-semibold rounded-full ${getStatusColor(student.isActive ? 'active' : 'inactive')}`}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Enrolled on</p>
              <p className="font-medium">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500 mt-2">Last updated</p>
              <p className="font-medium">{new Date(student.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium">{student.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium">{student.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{student.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Address</h3>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="font-medium">{student.address.street}</p>
                  <p className="text-gray-600">
                    {student.address.city}, {student.address.state} {student.address.zipCode}
                  </p>
                  <p className="text-gray-600">{student.address.country}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                </div>
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{student.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">{student.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{student.emergencyContact.phone}</p>
                  </div>
                  {student.emergencyContact.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{student.emergencyContact.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic & Financial Information */}
            <div className="space-y-6">
              {/* Courses */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Enrolled Courses</h3>
                </div>
                <div className="space-y-3">
                  {student.courses.length > 0 ? (
                    student.courses.map((course, index) => (
                      <div key={index} className="bg-white border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                            <p className="text-sm text-gray-500">
                              Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                course.status === 'enrolled' ? 'bg-blue-100 text-blue-800' :
                                course.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {course.status}
                              </span>
                              {course.grade && (
                                <span className="text-sm font-medium text-gray-700">
                                  Grade: {course.grade}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Attendance</p>
                            <p className={`font-bold ${getAttendanceColor(course.attendance)}`}>
                              {course.attendance}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                      <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No courses enrolled</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance Summary */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Attendance Summary</h3>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{student.attendance.totalClasses}</p>
                      <p className="text-sm text-gray-500">Total Classes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{student.attendance.attendedClasses}</p>
                      <p className="text-sm text-gray-500">Attended</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-center">
                    <p className={`text-3xl font-bold ${getAttendanceColor(student.attendance.attendancePercentage)}`}>
                      {student.attendance.attendancePercentage}%
                    </p>
                    <p className="text-sm text-gray-500">Overall Attendance</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Financial Information</h3>
                </div>
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Total Fees Paid</p>
                    <p className="font-bold text-green-600">₹{student.totalFeesPaid.toLocaleString()}</p>
                  </div>
                  {student.pendingFees > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Pending Fees</p>
                      <p className="font-bold text-red-600">₹{student.pendingFees.toLocaleString()}</p>
                    </div>
                  )}
                  {student.lastPaymentDate && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Last Payment</p>
                      <p className="font-medium">{new Date(student.lastPaymentDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">Total Amount</p>
                      <p className="font-bold text-blue-600">
                        ₹{(student.totalFeesPaid + student.pendingFees).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={onEdit} className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Edit Student
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentModal;