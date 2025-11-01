import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  Plus,
  Filter,
  Download,
  Upload,
  Search,
  Edit3,
  Eye,
  Archive,
  MoreVertical,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Trash2,
  Mail,
  Settings,
  CalendarDays,
  User,
  BookOpen,
  UserCheck,
  FileText,
  ClipboardCheck,
  PenTool,
  Megaphone,
  GraduationCap,
  CheckCircle,
  Pin,
  AlertCircle,
  Upload as UploadIcon,
  FileDown,
  MessageSquare
} from 'lucide-react';

// Radix UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/atoms/DropdownMenu';

import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge as BadgeComponent } from '../../components/atoms/Badge';

// Import Class Management Modals
import { ViewClassModal, EditClassModal, DeleteClassModal, AddClassModal, EnrollStudentModal, UploadMaterialModal, MarkAttendanceModal, CreateAssignmentModal, PostAnnouncementModal } from '../../components/molecules';

// Import Class Management API Service
import { 
  classManagementApiService, 
  type ClassManagement as Class, 
  type ClassFilters
} from '../../services';

const ClassManagement: React.FC = () => {
  // State for classes data
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<ClassFilters>({
    search: '',
    courseId: '',
    instructorId: '',
    status: '',
    venue: '',
    priceRange: '',
    dateRange: undefined
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'className' | 'scheduledDate' | 'classPrice' | 'currentEnrollments' | 'createdAt'>('scheduledDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection states
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Tab navigation states
  const [activeTab, setActiveTab] = useState<'classes' | 'enrollments' | 'materials' | 'attendance' | 'assignments' | 'announcements'>('classes');

  // Module data states - now using selectedClass properties directly

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEnrollStudentModalOpen, setIsEnrollStudentModalOpen] = useState(false);
  const [isUploadMaterialModalOpen, setIsUploadMaterialModalOpen] = useState(false);
  const [isMarkAttendanceModalOpen, setIsMarkAttendanceModalOpen] = useState(false);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  const [isPostAnnouncementModalOpen, setIsPostAnnouncementModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await classManagementApiService.getClasses(filters);
      setClasses(result.classes);
    } catch (err) {
      console.error('Failed to load classes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  }, [filters]);



  // Handle tab change - just switch tabs, data is already loaded
  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    // No need to load data again, it's already loaded when class was selected
  };

  // Load classes on component mount
  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  // Clear selections when filters change
  useEffect(() => {
    setSelectedClasses([]);
  }, [filters]);

  // Filter and search classes
  const filteredClasses = useMemo(() => {
    const filtered = [...classes];

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'className':
          aValue = a.className.toLowerCase();
          bValue = b.className.toLowerCase();
          break;
        case 'scheduledDate':
          aValue = new Date(a.scheduledDate).getTime();
          bValue = new Date(b.scheduledDate).getTime();
          break;
        case 'classPrice':
          aValue = a.classPrice;
          bValue = b.classPrice;
          break;
        case 'currentEnrollments':
          aValue = a.currentEnrollments || 0;
          bValue = b.currentEnrollments || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = new Date(a.scheduledDate).getTime();
          bValue = new Date(b.scheduledDate).getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [classes, sortBy, sortOrder]);

  // Modal handlers
  const handleAddClass = () => {
    setSelectedClass(null);
    setIsAddModalOpen(true);
  };

  const handleEditClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsEditModalOpen(true);
  };

  const handleViewClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsViewModalOpen(true);
  };

  const handleDeleteClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDeleteModalOpen(true);
  };

  // Enrollment handlers
  const handleEnrollStudent = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    setIsEnrollStudentModalOpen(true);
  };

  const handleEnrollmentSuccess = () => {
    // Reload classes data to get updated enrollment information
    loadClasses();
    setIsEnrollStudentModalOpen(false);
  };

  // Material handlers
  const handleUploadMaterial = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    setIsUploadMaterialModalOpen(true);
  };

  const handleMaterialUploaded = async () => {
    // Reload complete class data to get updated materials
    if (selectedClass?._id) {
      try {
        const updatedClassData = await classManagementApiService.getClassById(selectedClass._id);
        if (updatedClassData) {
          setSelectedClass(updatedClassData);
        }
      } catch (error) {
        console.error('Error reloading class data:', error);
      }
    }
    setIsUploadMaterialModalOpen(false);
  };

  // Attendance handlers
  const handleMarkAttendance = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    setIsMarkAttendanceModalOpen(true);
  };

  const handleAttendanceMarked = async () => {
    // Reload complete class data to get updated attendance
    if (selectedClass?._id) {
      try {
        const updatedClassData = await classManagementApiService.getClassById(selectedClass._id);
        if (updatedClassData) {
          setSelectedClass(updatedClassData);
        }
      } catch (error) {
        console.error('Error reloading class data:', error);
      }
    }
    setIsMarkAttendanceModalOpen(false);
  };

  // Assignment handlers
  const handleCreateAssignment = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    setIsCreateAssignmentModalOpen(true);
  };

  const handleAssignmentCreated = async () => {
    // Reload complete class data to get updated assignments
    if (selectedClass?._id) {
      try {
        const updatedClassData = await classManagementApiService.getClassById(selectedClass._id);
        if (updatedClassData) {
          setSelectedClass(updatedClassData);
        }
      } catch (error) {
        console.error('Error reloading class data:', error);
      }
    }
    setIsCreateAssignmentModalOpen(false);
  };

  // Announcement handlers
  const handlePostAnnouncement = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    setIsPostAnnouncementModalOpen(true);
  };

  const handleAnnouncementPosted = async () => {
    // Reload complete class data to get updated announcements
    if (selectedClass?._id) {
      try {
        const updatedClassData = await classManagementApiService.getClassById(selectedClass._id);
        if (updatedClassData) {
          setSelectedClass(updatedClassData);
        }
      } catch (error) {
        console.error('Error reloading class data:', error);
      }
    }
    setIsPostAnnouncementModalOpen(false);
  };

  // Selection handlers
  const handleSelectClass = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === filteredClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(filteredClasses.map(c => c._id));
    }
  };

  // Bulk operations
  const handleBulkCancel = () => {
    console.log('Bulk cancel classes:', selectedClasses);
    // TODO: Implement bulk cancel
  };

  const handleBulkReschedule = () => {
    console.log('Bulk reschedule classes:', selectedClasses);
    // TODO: Implement bulk reschedule
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete classes:', selectedClasses);
    // TODO: Implement bulk delete
  };

  // Export/Import handlers
  const handleExport = () => {
    console.log('Export classes data');
    // TODO: Implement export functionality
  };

  const handleImport = () => {
    console.log('Import classes data');
    // TODO: Implement import functionality
  };

  // Utility functions
  const getEnrollmentCount = (classItem: Class) => {
    // Use currentEnrollments if available, otherwise count enrolled students
    if (classItem.currentEnrollments !== undefined) {
      return classItem.currentEnrollments;
    }
    if (classItem.enrolledStudents) {
      return classItem.enrolledStudents.filter(student => student.status === 'enrolled').length;
    }
    return 0;
  };

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (price === 0) return 'Free';
    return `${currency === 'INR' ? '₹' : currency}${price}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading classes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Archive className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">Error: {error}</span>
          </div>
          <Button 
            onClick={loadClasses} 
            className="mt-3"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Tab configuration
  const getEnrollmentTabCount = () => {
    if (selectedClass?.enrolledStudents) return selectedClass.enrolledStudents.length;
    return 0;
  };

  const tabs = [
    { id: 'classes' as const, label: 'Classes', icon: BookOpen, count: classes.length },
    { id: 'enrollments' as const, label: 'Enrollments', icon: UserCheck, count: getEnrollmentTabCount() },
    { id: 'materials' as const, label: 'Materials', icon: FileText, count: selectedClass?.materials?.length || 0 },
    { id: 'attendance' as const, label: 'Attendance', icon: ClipboardCheck, count: selectedClass?.attendance?.length || 0 },
    { id: 'assignments' as const, label: 'Assignments', icon: PenTool, count: selectedClass?.assignments?.length || 0 },
    { id: 'announcements' as const, label: 'Announcements', icon: Megaphone, count: selectedClass?.announcements?.length || 0 }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive class scheduling and management system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddClass}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Class
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="mb-6">
        <div className="flex space-x-0 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Class Selector for Module Tabs */}
      {activeTab !== 'classes' && (
        <Card className="p-4 mb-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select Class:</label>
              <select
                value={selectedClass?._id || ''}
                onChange={async (e) => {
                  const classId = e.target.value;
                  if (classId) {
                    try {
                      // Load complete class data with embedded modules using the single API call
                      const classDetails = await classManagementApiService.getClassById(classId);
                      if (classDetails) {
                        console.log('Loaded class with embedded data:', classDetails);
                        setSelectedClass(classDetails);                       
                      }
                    } catch (error) {
                      console.error('Error loading class data:', error);
                      // Fallback to basic class selection
                      const classItem = classes.find(c => c._id === classId);
                      setSelectedClass(classItem || null);
                      // Module data cleared via selectedClass state
                    }
                  } else {
                    setSelectedClass(null);
                    // Module data cleared via selectedClass state
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a class...</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className} - {formatDate(classItem.scheduledDate)}
                  </option>
                ))}
              </select>
            </div>
            {selectedClass && (
              <div className="text-sm text-gray-600">
                Managing: <span className="font-medium">{selectedClass.className}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tab Content */}
      {activeTab === 'classes' && (
        <>
          {/* Search and Filters */}
          <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search classes by name, course, instructor, or venue..."
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
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
              setSortBy(field as 'className' | 'scheduledDate' | 'classPrice' | 'currentEnrollments' | 'createdAt');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="scheduledDate-asc">Date (Earliest First)</option>
            <option value="scheduledDate-desc">Date (Latest First)</option>
            <option value="className-asc">Class Name (A-Z)</option>
            <option value="className-desc">Class Name (Z-A)</option>
            <option value="classPrice-asc">Price (Low to High)</option>
            <option value="classPrice-desc">Price (High to Low)</option>
            <option value="currentEnrollments-desc">Most Popular</option>
            <option value="currentEnrollments-asc">Least Popular</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
          </select>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="text"
              placeholder="Venue"
              value={filters.venue || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, venue: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              value={filters.priceRange || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="under-500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="over-1000">Over ₹1000</option>
            </select>

            <input
              type="date"
              placeholder="Start Date"
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { 
                  start: e.target.value, 
                  end: prev.dateRange?.end || '' 
                } 
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="End Date"
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { 
                  start: prev.dateRange?.start || '', 
                  end: e.target.value 
                } 
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedClasses.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedClasses.length} class(es) selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkReschedule}>
                <CalendarDays className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Notify Students
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkCancel}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Settings className="h-4 w-4 mr-1" />
                Cancel Classes
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Classes Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedClasses.length === filteredClasses.length && filteredClasses.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Details
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue & Capacity
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price & Enrollment
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((classItem) => (
                <tr key={classItem._id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(classItem._id)}
                      onChange={() => handleSelectClass(classItem._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-start">                      
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                          {classItem.className}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {classItem.courseName || 'Course'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <User className="h-3 w-3 mr-1" />
                          {classItem.instructorName || 'Instructor'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(classItem.scheduledDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                      </span>
                    </div>
                    <BadgeComponent 
                      variant="outline" 
                      className={`text-xs mt-2 ${getStatusColor(classItem.status || 'scheduled')}`}
                    >
                      {classItem.status || 'Scheduled'}
                    </BadgeComponent>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{classItem.venue}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {classItem.address.city}, {classItem.address.state}
                    </div>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {getEnrollmentCount(classItem)}/{classItem.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(classItem.classPrice, classItem.currency)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Max: {classItem.maxEnrollments} students
                    </div>
                    {classItem.isRecurring && (
                      <BadgeComponent variant="outline" className="text-xs mt-1 bg-purple-50 text-purple-700">
                        Recurring
                      </BadgeComponent>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewClass(classItem)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClass(classItem)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Class
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Enrollments
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClass(classItem)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Cancel Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {classes.length === 0 
                  ? "Get started by scheduling your first class."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {classes.length === 0 && (
                <div className="mt-6">
                  <Button onClick={handleAddClass}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Class
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {filteredClasses.length} of {classes.length} classes
            </p>
            <div className="flex space-x-2">
              {/* Pagination controls would go here */}
            </div>
          </div>
        </>
      )}

      {/* Enrollments Tab */}
      {activeTab === 'enrollments' && (
        <Card className="p-6">
          {!selectedClass ? (
            <div className="text-center py-12">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Enrollment Management</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a class above to manage student enrollments and track payment status.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Enrollments for {selectedClass.className}
                </h3>
                <Button onClick={handleEnrollStudent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll Student
                </Button>
              </div>
              
              {/* Display enrolled students from class data */}
              {!selectedClass.enrolledStudents || selectedClass.enrolledStudents.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No enrollments found for this class.</p>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Enrolled Students ({selectedClass.enrolledStudents.length})</h4>
                  <div className="space-y-4">
                    {selectedClass.enrolledStudents.map((enrollment) => (
                      <div key={enrollment._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{enrollment.studentId.email}</p>
                            <p className="text-xs text-gray-400">
                              Enrolled: {formatDate(enrollment.enrollmentDate.split('T')[0])}
                            </p>
                          </div>
                          <div className="text-right">
                            <BadgeComponent 
                              variant={enrollment.status === 'enrolled' ? 'default' : 'secondary'}
                            >
                              {enrollment.status}
                            </BadgeComponent>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <Card className="p-6">
          {!selectedClass ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Class Materials</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a class above to manage course materials and resources.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Materials for {selectedClass.className}
                </h3>
                <div className="space-x-2">
                  <Button onClick={handleUploadMaterial}>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload Material
                  </Button>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </div>

              {selectedClass?.materials?.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No materials uploaded for this class.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedClass?.materials?.map((material, index) => (
                    <div key={`material-${index}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="h-5 w-5 text-blue-500 mt-1" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{material.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{material.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{material.fileType}</span>
                        <span className={material.isRequired ? 'text-red-500 font-medium' : 'text-gray-400'}>
                          {material.isRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="p-6">
          {!selectedClass ? (
            <div className="text-center py-12">
              <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Attendance Tracking</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a class above to track student attendance and generate reports.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Attendance for {selectedClass.className}
                </h3>
                <div className="space-x-2">
                  <Button onClick={handleMarkAttendance}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {selectedClass?.attendance?.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardCheck className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No attendance records found for this class.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedClass?.attendance?.map((record, index) => (
                    <div key={`attendance-${index}`} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Student: {record.studentId}</h4>
                          <p className="text-sm text-gray-500">
                            Status: <span className={`font-medium ${
                              record.status === 'present' ? 'text-green-600' : 
                              record.status === 'late' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          {record.checkInTime && (
                            <p className="text-xs text-gray-500">
                              Check In: {record.checkInTime}
                            </p>
                          )}
                          {record.checkOutTime && (
                            <p className="text-xs text-gray-500">
                              Check Out: {record.checkOutTime}
                            </p>
                          )}
                          {record.notes && (
                            <p className="text-xs text-gray-600 mt-1">
                              Notes: {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <Card className="p-6">
          {!selectedClass ? (
            <div className="text-center py-12">
              <PenTool className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Assignment Management</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a class above to create assignments and manage student submissions.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Assignments for {selectedClass.className}
                </h3>
                <div className="space-x-2">
                  <Button onClick={handleCreateAssignment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                  <Button variant="outline">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Grade Submissions
                  </Button>
                </div>
              </div>

              {selectedClass?.assignments?.length === 0 ? (
                <div className="text-center py-8">
                  <PenTool className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No assignments created for this class.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedClass?.assignments?.map((assignment, index) => (
                    <div key={`assignment-${index}`} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                            <span>Students Submitted: {assignment.submittedStudents?.length || 0}</span>
                            <span className={assignment.isCompleted ? 'text-green-600' : 'text-yellow-600'}>
                              {assignment.isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BadgeComponent 
                            variant={assignment.isCompleted ? 'default' : 'secondary'}
                          >
                            {assignment.isCompleted ? 'Completed' : 'Pending'}
                          </BadgeComponent>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View Submissions</DropdownMenuItem>
                              <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <Card className="p-6">
          {!selectedClass ? (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Class Announcements</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a class above to post announcements and communicate with students.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Announcements for {selectedClass.className}
                </h3>
                <div className="space-x-2">
                  <Button onClick={handlePostAnnouncement}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Post Announcement
                  </Button>
                  <Button variant="outline">
                    <Pin className="h-4 w-4 mr-2" />
                    Manage Pinned
                  </Button>
                </div>
              </div>

              {selectedClass?.announcements?.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No announcements posted for this class.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedClass?.announcements?.map((announcement, index) => (
                    <div key={`announcement-${index}`} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">Announcement</h4>
                          {announcement.isUrgent && (
                            <BadgeComponent variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </BadgeComponent>
                          )}
                          <BadgeComponent variant="outline">
                            {formatDate(announcement.createdAt)}
                          </BadgeComponent>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{announcement.message}</p>
                      
                      {announcement.readBy && announcement.readBy.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Read by {announcement.readBy.length} student(s)</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Posted: {formatDate(announcement.createdAt.split('T')[0])}</span>
                        <span>Read by: {announcement.readBy.length} students</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Modals */}
      {isViewModalOpen && selectedClass && (
        <ViewClassModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          class={selectedClass}
        />
      )}

      {isEditModalOpen && selectedClass && (
        <EditClassModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          class={selectedClass}
          onClassUpdated={loadClasses}
        />
      )}

      {isDeleteModalOpen && selectedClass && (
        <DeleteClassModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          class={selectedClass}
          onClassDeleted={loadClasses}
        />
      )}

      {isAddModalOpen && (
        <AddClassModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onClassAdded={loadClasses}
        />
      )}

      {/* Enroll Student Modal */}
      {isEnrollStudentModalOpen && selectedClass && (
        <EnrollStudentModal
          isOpen={isEnrollStudentModalOpen}
          onClose={() => setIsEnrollStudentModalOpen(false)}
          class={selectedClass}
          onEnrollmentSuccess={handleEnrollmentSuccess}
        />
      )}

      {/* Upload Material Modal */}
      {isUploadMaterialModalOpen && selectedClass && (
        <UploadMaterialModal
          isOpen={isUploadMaterialModalOpen}
          onClose={() => setIsUploadMaterialModalOpen(false)}
          class={selectedClass}
          onMaterialUploaded={handleMaterialUploaded}
        />
      )}

      {/* Mark Attendance Modal */}
      {isMarkAttendanceModalOpen && selectedClass && (
        <MarkAttendanceModal
          isOpen={isMarkAttendanceModalOpen}
          onClose={() => setIsMarkAttendanceModalOpen(false)}
          class={selectedClass}
          onAttendanceMarked={handleAttendanceMarked}
        />
      )}

      {/* Create Assignment Modal */}
      {isCreateAssignmentModalOpen && selectedClass && (
        <CreateAssignmentModal
          isOpen={isCreateAssignmentModalOpen}
          onClose={() => setIsCreateAssignmentModalOpen(false)}
          class={selectedClass}
          onAssignmentCreated={handleAssignmentCreated}
        />
      )}

      {/* Post Announcement Modal */}
      {isPostAnnouncementModalOpen && selectedClass && (
        <PostAnnouncementModal
          isOpen={isPostAnnouncementModalOpen}
          onClose={() => setIsPostAnnouncementModalOpen(false)}
          class={selectedClass}
          onAnnouncementPosted={handleAnnouncementPosted}
        />
      )}
    </div>
  );
};

export default ClassManagement;