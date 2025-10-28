import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Filter,
  Download,
  Upload,
  Search,
  Edit3,
  Eye,
  UserX,
  MoreVertical,
  XCircle,
  Clock,
  Trash2,
  Mail
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

// Import Trainer API Service
import { 
  trainerManagementApiService, 
  type Trainer, 
  type TrainerFilters
} from '../../services/trainerManagementApi';

// Import Modal Components
import { 
  AddTrainerModal,
  EditTrainerModal, 
  ViewTrainerModal,
  DeleteTrainerModal
} from '../../components/molecules';

const TrainerManagement: React.FC = () => {
  // State for trainers data
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  // Filter states
  const [filters, setFilters] = useState<TrainerFilters>({
    status: '',
    gender: '',
    experience: '',
    search: ''
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'experience' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection states
  const [selectedTrainers, setSelectedTrainers] = useState<string[]>([]);

  // Load trainers on component mount
  useEffect(() => {
    loadTrainers();
  }, []);

  // Clear selections when filters change
  useEffect(() => {
    setSelectedTrainers([]);
  }, [filters]);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await trainerManagementApiService.getTrainers();
      setTrainers(result.trainers);
    } catch (err) {
      console.error('Failed to load trainers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search trainers
  const filteredTrainers = useMemo(() => {
    const filtered = trainers.filter((trainer) => {
      // Status filter (using isActive boolean)
      if (filters.status === 'active' && !trainer.isActive) return false;
      if (filters.status === 'inactive' && trainer.isActive) return false;

      // Gender filter
      if (filters.gender && trainer.gender !== filters.gender) return false;

      // Experience filter
      if (filters.experience) {
        const expYears = trainer.experience;
        switch (filters.experience) {
          case 'junior': if (expYears >= 3) return false; break;
          case 'mid': if (expYears < 3 || expYears >= 7) return false; break;
          case 'senior': if (expYears < 7) return false; break;
        }
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const fullName = `${trainer.firstName} ${trainer.lastName}`.toLowerCase();
        return (
          fullName.includes(searchTerm) ||
          trainer.trainerId.toLowerCase().includes(searchTerm) ||
          trainer.email.toLowerCase().includes(searchTerm) ||
          trainer.phone.includes(searchTerm)
        );
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinedDate).getTime();
          bValue = new Date(b.joinedDate).getTime();
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'status':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        default:
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [trainers, filters, sortBy, sortOrder]);

  // Modal handlers
  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setIsAddModalOpen(true);
  };

  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsEditModalOpen(true);
  };

  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsViewModalOpen(true);
  };

  const handleDeleteTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsDeleteModalOpen(true);
  };

  // Handle trainer operations
  const handleTrainerAdded = () => {
    loadTrainers();
    setIsAddModalOpen(false);
    setSelectedTrainers([]);
  };

  const handleTrainerUpdated = () => {
    loadTrainers();
    setIsEditModalOpen(false);
    // Remove updated trainer from selection if it was deactivated
    setSelectedTrainers(prevSelected => 
      prevSelected.filter(id => 
        trainers.find(t => t._id === id && t.isActive) !== undefined
      )
    );
  };

  const handleTrainerDeleted = () => {
    loadTrainers();
    setIsDeleteModalOpen(false);
    // Remove deleted trainer from selection
    setSelectedTrainers(prevSelected => 
      prevSelected.filter(id => 
        trainers.find(t => t._id === id && t.isActive) !== undefined
      )
    );
  };

  // Selection handlers
  const handleSelectTrainer = (trainerId: string) => {
    setSelectedTrainers(prev => 
      prev.includes(trainerId) 
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrainers.length === filteredTrainers.length) {
      setSelectedTrainers([]);
    } else {
      setSelectedTrainers(filteredTrainers.map(t => t._id));
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedTrainers.length === 0) return;
    // TODO: Implement bulk delete modal
    console.log('Bulk delete for trainers:', selectedTrainers);
  };

  // Clear filters
  // Export handlers (placeholder)
  const handleExport = () => {
    console.log('Export trainers data');
    // TODO: Implement export functionality
  };

  const handleImport = () => {
    console.log('Import trainers data');
    // TODO: Implement import functionality
  };

  // Format experience display
  const formatExperience = (years: number) => {
    if (years === 0) return 'Fresher';
    if (years === 1) return '1 year';
    return `${years} years`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trainers...</p>
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
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">Error: {error}</span>
          </div>
          <Button 
            onClick={loadTrainers} 
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor training staff</p>
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
          <Button onClick={handleAddTrainer}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Trainer
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
              placeholder="Search trainers by name, email, ID, or phone..."
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
              setSortBy(field as 'name' | 'joinDate' | 'experience' | 'status');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="joinDate-desc">Newest First</option>
            <option value="joinDate-asc">Oldest First</option>
            <option value="experience-desc">High Experience</option>
            <option value="experience-asc">Low Experience</option>
            <option value="status-desc">Active First</option>
            <option value="status-asc">Inactive First</option>
          </select>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Experience</option>
              <option value="junior">Junior (0-3y)</option>
              <option value="mid">Mid (3-7y)</option>
              <option value="senior">Senior (7y+)</option>
            </select>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedTrainers.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedTrainers.length} trainer(s) selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Send Email
              </Button>
              <Button variant="outline" size="sm">Update Status</Button>
              <Button variant="outline" size="sm">Export Selected</Button>
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

      {/* Trainers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTrainers.length === filteredTrainers.length && filteredTrainers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trainer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specializations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrainers.map((trainer) => (
                <tr key={trainer._id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTrainers.includes(trainer._id)}
                      onChange={() => handleSelectTrainer(trainer._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex">                      
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {trainer.firstName} {trainer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trainer.trainerId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{trainer.email}</div>
                    <div className="text-sm text-gray-500">{trainer.phone}</div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {trainer.specializations.slice(0, 2).map((spec, index) => (
                        <BadgeComponent key={index} variant="outline" className="text-xs">
                          {spec}
                        </BadgeComponent>
                      ))}
                      {trainer.specializations.length > 2 && (
                        <BadgeComponent variant="outline" className="text-xs">
                          +{trainer.specializations.length - 2} more
                        </BadgeComponent>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {formatExperience(trainer.experience)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewTrainer(trainer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTrainer(trainer)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Trainer
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTrainer(trainer)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredTrainers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trainers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {trainers.length === 0 
                  ? "Get started by adding your first trainer."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {trainers.length === 0 && (
                <div className="mt-6">
                  <Button onClick={handleAddTrainer}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Trainer
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Pagination would go here */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {filteredTrainers.length} of {trainers.length} trainers
          </p>
          <div className="flex space-x-2">
            {/* Pagination controls would go here */}
          </div>
        </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddTrainerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onTrainerAdded={handleTrainerAdded}
        />
      )}

      {isEditModalOpen && selectedTrainer && (
        <EditTrainerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          trainer={selectedTrainer}
          onTrainerUpdated={handleTrainerUpdated}
        />
      )}

      {isViewModalOpen && selectedTrainer && (
        <ViewTrainerModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          trainer={selectedTrainer}
        />
      )}

      {isDeleteModalOpen && selectedTrainer && (
        <DeleteTrainerModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          trainer={selectedTrainer}
          onTrainerDeleted={handleTrainerDeleted}
        />
      )}
    </div>
  );
};

export default TrainerManagement;