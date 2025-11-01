import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, XCircle, AlertCircle, User, Save } from 'lucide-react';

// Radix UI Components
import { Dialog } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge as BadgeComponent } from '../../atoms/Badge';

// API and Types
import { 
  classManagementApiService, 
  type ClassManagement as Class,
  type StudentAttendance,
} from '../../../services';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: Class;
  onAttendanceMarked: () => void;
}

interface StudentRecord extends StudentAttendance {
  studentEmail?: string;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  onClose,
  class: classData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [sessionDate, setSessionDate] = useState('');
  const [sessionNumber, setSessionNumber] = useState(1);
  const [notes, setNotes] = useState('');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  
  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Mock enrolled students - in real app, this would come from enrollment API
      const mockEnrolledStudents: StudentRecord[] = classData?.enrolledStudents?.map(student => ({
          studentId: student.studentId._id,
          studentName: `${student.studentId.firstName} ${student.studentId.lastName}`,
          studentEmail: student.studentId.email,
          status: 'absent',
          checkInTime: '',
          checkOutTime: '',
          notes: ''
      })) || [];

      const today = new Date().toISOString().split('T')[0];
      setSessionDate(today);
      setSessionNumber(1);
      setNotes('');
      setStudents(mockEnrolledStudents);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  // Handle attendance status change for a student
  const handleStatusChange = (studentId: string, status: StudentAttendance['status']) => {
    setStudents(prev => prev.map(student => 
      student.studentId === studentId 
        ? { 
            ...student, 
            status,
            // Auto-fill check-in time for present/late students
            checkInTime: (status === 'present' || status === 'late') && !student.checkInTime
              ? new Date().toISOString()
              : student.checkInTime
          }
        : student
    ));
  };

  // Handle check-in time change for a student
  const handleCheckInTimeChange = (studentId: string, checkInTime: string) => {
    setStudents(prev => prev.map(student => 
      student.studentId === studentId 
        ? { ...student, checkInTime }
        : student
    ));
  };
  
  // Handle check-out time change for a student
  const handleCheckOutTimeChange = (studentId: string, checkOutTime: string) => {
    setStudents(prev => prev.map(student => 
      student.studentId === studentId 
        ? { ...student, checkOutTime }
        : student
    ));
  };

  // Handle student notes change
  const handleStudentNotesChange = (studentId: string, notes: string) => {
    setStudents(prev => prev.map(student => 
      student.studentId === studentId 
        ? { ...student, notes }
        : student
    ));
  };

  // Mark attendance with real API integration
  const handleMarkAttendance = async () => {
    if (!sessionDate || students.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare attendance data for API call
      const attendanceData: StudentAttendance[] = students.map(student => ({
          studentId: student.studentId,
          status: student.status,
          checkInTime: student.checkInTime || undefined,
          checkOutTime: student.checkOutTime || undefined,
          notes: student.notes || undefined
        }));

      // For demonstration, we'll use the mock API method
      // In real implementation, this would call the attendance API endpoint
      await classManagementApiService.markAttendance(attendanceData, classData._id);

      // However, let's also demonstrate the real API call
      setSuccess('Attendance marked successfully!');
      onClose();

    } catch (err) {
      console.error('Error marking attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  // Get attendance summary
  const getAttendanceSummary = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    const excused = students.filter(s => s.status === 'excused').length;
    
    return { present, absent, late, excused, total: students.length };
  };

  const summary = getAttendanceSummary();

  // Get status color and icon
  const getStatusDisplay = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', label: 'Present' };
      case 'absent':
        return { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Absent' };
      case 'late':
        return { icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Late' };
      case 'excused':
        return { icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Excused' };
      default:
        return { icon: User, color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Not Set' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
              <p className="text-sm text-gray-600 mt-1">
                {classData.className} - Session {sessionNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-150px)]">
            {/* Session Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Date *
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Number
                </label>
                <input
                  type="number"
                  value={sessionNumber}
                  onChange={(e) => setSessionNumber(Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Students
                </label>
                <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">
                  {students.length} enrolled
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{summary.present}</div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{summary.absent}</div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.late}</div>
                <div className="text-sm text-yellow-700">Late</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.excused}</div>
                <div className="text-sm text-blue-700">Excused</div>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Student Attendance</h3>
              
              {students.map((student) => {
                const statusDisplay = getStatusDisplay(student.status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <div key={student.studentId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.studentName}</p>
                          <p className="text-sm text-gray-500">{student.studentEmail}</p>
                        </div>
                      </div>
                      
                      <BadgeComponent className={statusDisplay.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusDisplay.label}
                      </BadgeComponent>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Attendance Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={student.status}
                          onChange={(e) => handleStatusChange(student.studentId, e.target.value as StudentAttendance['status'])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </div>
                      
                      {/* Check-in Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-in Time
                        </label>
                        <input
                          type="time"
                          value={student.checkInTime ? new Date(student.checkInTime).toTimeString().substring(0, 5) : ''}
                          onChange={(e) => {
                            const time = e.target.value;
                            if (time) {
                              const today = new Date().toISOString().split('T')[0];
                              const fullDateTime = `${today}T${time}:00Z`;
                              handleCheckInTimeChange(student.studentId, fullDateTime);
                            } else {
                              handleCheckInTimeChange(student.studentId, '');
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          disabled={student.status === 'absent'}
                        />
                      </div>

                      {/* Check-out Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Check-out Time
                        </label>
                        <input
                          type="time"
                          value={student.checkOutTime ? new Date(student.checkOutTime).toTimeString().substring(0, 5) : ''}
                          onChange={(e) => {
                            const time = e.target.value;
                            if (time) {
                              const today = new Date().toISOString().split('T')[0];
                              const fullDateTime = `${today}T${time}:00Z`;
                              handleCheckOutTimeChange(student.studentId, fullDateTime);
                            } else {
                              handleCheckOutTimeChange(student.studentId, '');
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          disabled={student.status === 'absent'}
                        />
                      </div>
                      
                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={student.notes || ''}
                          onChange={(e) => handleStudentNotesChange(student.studentId, e.target.value)}
                          placeholder="Optional notes..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Session Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this session..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-1 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkAttendance}
              disabled={loading || !sessionDate}
              className="flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Marking...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Mark Attendance
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default MarkAttendanceModal;