import React, { useState, useEffect } from 'react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { AddStudentModal } from '../../components/molecules/AddStudentModal';
import { EditStudentModal } from '../../components/molecules/EditStudentModal';
import { ViewStudentModal } from '../../components/molecules/ViewStudentModal';
import { DeleteStudentModal } from '../../components/molecules/DeleteStudentModal';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  UserCheck, 
  Download,
  Upload,
  Eye
} from 'lucide-react';
import { studentManagementApiService, type CreateStudentData, type UpdateStudentData } from '../../services';

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  enrollmentDate: string;
  isActive: boolean;
  courses: {
    courseId: string;
    courseName: string;
    enrollmentDate: string;
    status: 'enrolled' | 'completed' | 'dropped';
    attendance: number;
    grade?: string;
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  totalFeesPaid: number;
  pendingFees: number;
  lastPaymentDate?: string;
  attendance: {
    totalClasses: number;
    attendedClasses: number;
    attendancePercentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  status: string;
  course: string;
  gender: string;
  city: string;
  enrollmentYear: string;
}

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    course: 'all',
    gender: 'all',
    city: 'all',
    enrollmentYear: 'all'
  });

  const [sortBy, setSortBy] = useState<'name' | 'enrollmentDate' | 'attendance' | 'fees'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        console.log('Fetching students from API...');
        
        // Call the actual API to get students with role=student
        const result = await studentManagementApiService.getStudents();
        
        console.log('Students loaded successfully:', result);
        
        // Set the students from the API response
        setStudents(result.students || []);
        setFilteredStudents(result.students || []);
      } catch (error) {
        console.error('Failed to load students from API:', error);
        
        // Fallback to empty array if API fails
        setStudents([]);
        setFilteredStudents([]);
        
        // Optionally show an error message to the user
        // You could add a toast notification here
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Function to refresh students list
  const refreshStudents = async () => {
    try {
      console.log('Refreshing students list...');
      const result = await studentManagementApiService.getStudents();
      setStudents(result.students || []);
      setFilteredStudents(result.students || []);
    } catch (error) {
      console.error('Failed to refresh students:', error);
    }
  };

  useEffect(() => {
    const filtered = students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);

      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' && student.isActive) || 
        (filters.status === 'inactive' && !student.isActive);
      const matchesGender = filters.gender === 'all' || student.gender === filters.gender;
      const matchesCity = filters.city === 'all' || (student.address && student.address.city === filters.city);
      
      const enrollmentYear = new Date(student.enrollmentDate).getFullYear().toString();
      const matchesYear = filters.enrollmentYear === 'all' || enrollmentYear === filters.enrollmentYear;
      
      const matchesCourse = filters.course === 'all' || 
        (student.courses && student.courses.some(course => course.courseId === filters.course));

      return matchesSearch && matchesStatus && matchesGender && matchesCity && matchesYear && matchesCourse;
    });

    // Sort students
    filtered.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      
      switch (sortBy) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
          break;
        case 'enrollmentDate':
          aVal = new Date(a.enrollmentDate).getTime();
          bVal = new Date(b.enrollmentDate).getTime();
          break;
        case 'attendance':
          aVal = a.attendance.attendancePercentage;
          bVal = b.attendance.attendancePercentage;
          break;
        case 'fees':
          aVal = a.pendingFees;
          bVal = b.pendingFees;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, filters, sortBy, sortOrder]);

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s._id));
    }
  };

  const uniqueCities = [...new Set(students.map(s => s.address.city))];
  const uniqueCourses = [...new Set(students.flatMap(s => s.courses.map(c => ({ id: c.courseId, name: c.courseName }))))];
  const uniqueYears = [...new Set(students.map(s => new Date(s.enrollmentDate).getFullYear().toString()))];

  const handleAddStudent = async (studentData: CreateStudentData) => {
    setIsAddingStudent(true);
    try {
        console.log('Adding student:', studentData);
      // Call the API to create a new student
      const newStudent = await studentManagementApiService.createStudent(studentData);
      
      console.log('Student added successfully:', newStudent);
      
      // Refresh the students list to get the latest data from the server
      await refreshStudents();
    } catch (error) {
      console.error('Failed to add student:', error);
      
      // For development, add mock student if API fails
      const mockNewStudent: Student = {
        _id: `mock-${Date.now()}`,
        studentId: `STU${String(students.length + 1).padStart(3, '0')}`,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        password: "demo@12345",
        phone: studentData.phone,
        dateOfBirth: studentData.dateOfBirth,
        gender: studentData.gender,
        address: studentData.address,
        enrollmentDate: new Date().toISOString().split('T')[0],
        isActive: true,
        courses: [],
        emergencyContact: studentData.emergencyContact,
        totalFeesPaid: 0,
        pendingFees: 0,
        attendance: {
          totalClasses: 0,
          attendedClasses: 0,
          attendancePercentage: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setStudents(prevStudents => [...prevStudents, mockNewStudent]);
      console.log('Added mock student:', mockNewStudent);
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleEditStudent = async (studentId: string, updateData: UpdateStudentData) => {
    setIsEditingStudent(true);
    try {
      // Call the API to update the student
      const updatedStudent = await studentManagementApiService.updateStudent(studentId, updateData);
      
      console.log('Student updated successfully:', updatedStudent);
      
      // Refresh the students list to get the latest data from the server
      await refreshStudents();
    } catch (error) {
      console.error('Failed to update student:', error);
      
      // For development, update mock student if API fails
      setStudents(prevStudents => 
        prevStudents.map(student => {
          if (student._id === studentId) {
            return {
              ...student,
              ...updateData,
              updatedAt: new Date().toISOString()
            } as Student;
          }
          return student;
        })
      );
      console.log('Updated mock student with ID:', studentId);
    } finally {
      setIsEditingStudent(false);
    }
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const openViewModal = (student: Student) => {
    setViewingStudent(student);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setViewingStudent(null);
    setShowViewModal(false);
  };

  const handleViewToEdit = () => {
    if (viewingStudent) {
      closeViewModal();
      openEditModal(viewingStudent);
    }
  };

  const handleActivateStudent = async (student: Student) => {
    try {
      // Update student status to active
      const updateData: UpdateStudentData = {
        isActive: true
      };
      
      await studentManagementApiService.updateStudent(student._id, updateData);
      
      // Refresh the students list to get the latest data from the server
      await refreshStudents();
      
      console.log('Student activated successfully:', student.firstName, student.lastName);
    } catch (error) {
      console.error('Failed to activate student:', error);
      // Still update status for development
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s._id === student._id 
            ? { ...s, isActive: true, updatedAt: new Date().toISOString() }
            : s
        )
      );
    }
  };

  const closeEditModal = () => {
    setEditingStudent(null);
    setShowEditModal(false);
  };

  // Delete handlers
  const openDeleteModal = (student: Student) => {
    setDeletingStudent(student);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeletingStudent(null);
    setShowDeleteModal(false);
  };

  const openBulkDeleteModal = () => {
    setShowBulkDeleteModal(true);
  };

  const closeBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;

    setIsDeletingStudent(true);
    try {
      await studentManagementApiService.softDeleteStudent(deletingStudent._id);
      
      console.log('Student soft deleted successfully');
      
      // Refresh the students list to get the latest data from the server
      await refreshStudents();
      
      // If the student was selected, remove from selection
      setSelectedStudents(prevSelected => 
        prevSelected.filter(id => id !== deletingStudent._id)
      );
      
      console.log('Student deactivated successfully:', deletingStudent.firstName, deletingStudent.lastName);
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to deactivate student:', error);
      // Still update status for development (since API might not be available)
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === deletingStudent._id 
            ? { ...student, status: 'inactive' as const, updatedAt: new Date().toISOString() }
            : student
        )
      );
      setSelectedStudents(prevSelected => 
        prevSelected.filter(id => id !== deletingStudent._id)
      );
      closeDeleteModal();
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;

    setIsDeletingMultiple(true);
    try {
      const result = await studentManagementApiService.softDeleteMultipleStudents(selectedStudents);
      
      // Update successfully deactivated students status in local state
      const successfulStudents = result.successful;
      const successfulIds = successfulStudents.map(student => student._id);
      
      setStudents(prevStudents => 
        prevStudents.map(student => 
          successfulIds.includes(student._id)
            ? { ...student, status: 'inactive' as const, updatedAt: new Date().toISOString() }
            : student
        )
      );
      
      // Clear selection
      setSelectedStudents([]);
      
      console.log(`Successfully deactivated ${successfulIds.length} students`);
      if (result.failed.length > 0) {
        console.warn(`Failed to deactivate ${result.failed.length} students:`, result.failed);
      }
      
      closeBulkDeleteModal();
    } catch (error) {
      console.error('Failed to deactivate students:', error);
      // Still update status for development
      setStudents(prevStudents => 
        prevStudents.map(student => 
          selectedStudents.includes(student._id)
            ? { ...student, status: 'inactive' as const, updatedAt: new Date().toISOString() }
            : student
        )
      );
      setSelectedStudents([]);
      closeBulkDeleteModal();
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
            <p className="text-gray-600">Manage offline class students and their progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => {}}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search students by name, email, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'enrollmentDate' | 'attendance' | 'fees');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="enrollmentDate-desc">Newest First</option>
              <option value="enrollmentDate-asc">Oldest First</option>
              <option value="attendance-desc">High Attendance</option>
              <option value="attendance-asc">Low Attendance</option>
              <option value="fees-desc">High Pending Fees</option>
              <option value="fees-asc">Low Pending Fees</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </select>

              <select
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>

              <select
                value={filters.enrollmentYear}
                onChange={(e) => setFilters({...filters, enrollmentYear: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </Card>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                {selectedStudents.length} student(s) selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Send Email</Button>
                <Button variant="outline" size="sm">Mark Attendance</Button>
                <Button variant="outline" size="sm">Update Status</Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={openBulkDeleteModal}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Deactivate Selected
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Students Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr 
                    key={student._id} 
                    className={`hover:bg-gray-50 ${
                      !student.isActive 
                        ? 'bg-gray-50 opacity-75' 
                        : ''
                    }`}
                  >
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleSelectStudent(student._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex">                        
                        <div className="">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>                            
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {student.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {student.courses[0]?.courseName || 'No Course'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.isActive)}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`text-sm font-medium ${getAttendanceColor(student.attendance.attendancePercentage)}`}>
                        {student.attendance.attendancePercentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.attendance.attendedClasses}/{student.attendance.totalClasses} classes
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        Paid: ₹{student.totalFeesPaid.toLocaleString()}
                      </div>
                      {student.pendingFees > 0 && (
                        <div className="text-sm text-red-600">
                          Pending: ₹{student.pendingFees.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(student)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Student"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {!student.isActive ? (
                          <button
                            onClick={() => handleActivateStudent(student)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate Student"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openDeleteModal(student)}
                            className="text-red-600 hover:text-red-900"
                            title="Deactivate Student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.values(filters).some(f => f !== 'all') 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first student'
                }
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          )}
        </Card>

        {/* Pagination would go here */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex space-x-2">
            {/* Pagination controls would go here */}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddStudent}
        isLoading={isAddingStudent}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={handleEditStudent}
        student={editingStudent}
        isLoading={isEditingStudent}
      />

      {/* View Student Modal */}
      <ViewStudentModal
        isOpen={showViewModal}
        onClose={closeViewModal}
        onEdit={handleViewToEdit}
        student={viewingStudent}
      />

      {/* Delete Single Student Modal */}
      <DeleteStudentModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteStudent}
        isLoading={isDeletingStudent}
        studentName={deletingStudent ? `${deletingStudent.firstName} ${deletingStudent.lastName}` : ''}
        isMultiple={false}
      />

      {/* Delete Multiple Students Modal */}
      <DeleteStudentModal
        isOpen={showBulkDeleteModal}
        onClose={closeBulkDeleteModal}
        onConfirm={handleBulkDelete}
        isLoading={isDeletingMultiple}
        studentIds={selectedStudents}
        isMultiple={true}
      />
      <div className="py-2" />
    </div>
  );
};

export default StudentManagement;