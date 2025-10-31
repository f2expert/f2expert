import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Filter,
  Download,
  Upload,
  Search,
  Edit3,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Calendar,
  RefreshCw
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
import { Badge } from '../../components/atoms/Badge';
import { Input } from '../../components/atoms/Input';

// Import Trainer Salary API Service
import { 
  trainerSalaryApiService, 
  type TrainerSalary, 
  type SalaryFilters, 
  type SalaryStats 
} from '../../services/trainerSalaryApi';

// Import Modal Components
import { 
  AddSalaryModal,
  EditSalaryModal, 
  ViewSalaryModal,
  DeleteSalaryModal,
  ProcessSalaryModal
} from '../../components/molecules';

const SalaryManagement: React.FC = () => {
  // State for salary data
  const [salaries, setSalaries] = useState<TrainerSalary[]>([]);
  const [stats, setStats] = useState<SalaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<TrainerSalary | null>(null);

  // Filter states
  const [filters, setFilters] = useState<SalaryFilters>({
    status: '',
    trainerId: '',
    month: undefined,
    year: undefined,
    paymentMode: '',
    search: ''
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'trainerName' | 'payPeriod' | 'netSalary' | 'status'>('trainerName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Selection states
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);

  const loadSalaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await trainerSalaryApiService.getSalaries(filters);
      setSalaries(result.salaries);
    } catch (err) {
      console.error('Failed to load salaries:', err);
      setError(err instanceof Error ? err.message : 'Failed to load salaries');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await trainerSalaryApiService.getSalaryStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load salary stats:', err);
    }
  }, []);

  // Reload data
  const refreshData = async () => {
    await Promise.all([loadSalaries(), loadStats()]);
  };

  // Load salaries on component mount
  useEffect(() => {
    loadSalaries();
    loadStats();
  }, [loadSalaries, loadStats]);

  // Clear selections when filters change
  useEffect(() => {
    setSelectedSalaries([]);
  }, [filters]);

  // Update filters when search term changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  // Filter and search salaries
  const filteredSalaries = useMemo(() => {
    const filtered = salaries.filter((salary) => {
      // Status filter
      if (filters.status && salary.status !== filters.status) return false;

      // Trainer filter
      if (filters.trainerId && salary.trainerId !== filters.trainerId) return false;

      // Month filter
      if (filters.month && salary.payPeriod.month !== filters.month) return false;

      // Year filter
      if (filters.year && salary.payPeriod.year !== filters.year) return false;

      // Payment mode filter
      if (filters.paymentMode && salary.paymentMode !== filters.paymentMode) return false;

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          salary.trainerName.toLowerCase().includes(searchTerm) ||
          salary.trainerEmail.toLowerCase().includes(searchTerm) ||
          salary.trainerId.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'trainerName':
          aValue = a.trainerName.toLowerCase();
          bValue = b.trainerName.toLowerCase();
          break;
        case 'payPeriod':
          aValue = `${a.payPeriod.year}-${a.payPeriod.month.toString().padStart(2, '0')}`;
          bValue = `${b.payPeriod.year}-${b.payPeriod.month.toString().padStart(2, '0')}`;
          break;
        case 'netSalary':
          aValue = a.netSalary;
          bValue = b.netSalary;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [salaries, filters, sortBy, sortOrder]);

  // Handle filter changes
  const handleFilterChange = (key: keyof SalaryFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      trainerId: '',
      month: undefined,
      year: undefined,
      paymentMode: '',
      search: ''
    });
    setSearchTerm('');
  };

  // Selection handlers
  const handleSelectSalary = (salaryId: string) => {
    setSelectedSalaries(prev => 
      prev.includes(salaryId) 
        ? prev.filter(id => id !== salaryId)
        : [...prev, salaryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSalaries.length === filteredSalaries.length) {
      setSelectedSalaries([]);
    } else {
      setSelectedSalaries(filteredSalaries.map(s => s._id));
    }
  };

  // Modal handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (salary: TrainerSalary) => {
    setSelectedSalary(salary);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedSalary(null);
    setIsEditModalOpen(false);
  };

  const openViewModal = (salary: TrainerSalary) => {
    setSelectedSalary(salary);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedSalary(null);
    setIsViewModalOpen(false);
  };

  const openDeleteModal = (salary: TrainerSalary) => {
    setSelectedSalary(salary);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedSalary(null);
    setIsDeleteModalOpen(false);
  };

  const openProcessModal = (salary: TrainerSalary) => {
    setSelectedSalary(salary);
    setIsProcessModalOpen(true);
  };
  const closeProcessModal = () => {
    setSelectedSalary(null);
    setIsProcessModalOpen(false);
  };

  // Action handlers
  const handleSalaryCreated = () => {
    refreshData();
    closeAddModal();
  };

  const handleSalaryUpdated = () => {
    refreshData();
    closeEditModal();
  };

  const handleSalaryDeleted = () => {
    refreshData();
    closeDeleteModal();
  };

  const handleSalaryProcessed = () => {
    refreshData();
    closeProcessModal();
  };

  // Generate payslip
  const handleGeneratePayslip = async (salary: TrainerSalary) => {
    try {
      const blob = await trainerSalaryApiService.generatePayslip(salary._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${salary.trainerName}-${salary.payPeriod.month}-${salary.payPeriod.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to generate payslip:', error);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary', icon: Clock },
      processed: { variant: 'default', icon: CheckCircle },
      paid: { variant: 'success', icon: CheckCircle },
      cancelled: { variant: 'destructive', icon: AlertCircle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"} className="flex items-center gap-1">
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Current date for filters
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Salaries</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </Card>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Salary Management</h1>
            <p className="text-gray-600">Manage trainer salaries, payroll, and compensation</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Salary
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Salaries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSalariesThisMonth}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Payout</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPayoutThisMonth)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingSalaries}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Average Salary</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageSalary)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by trainer name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
                setSortBy(field as 'trainerName' | 'payPeriod' | 'netSalary' | 'status');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="trainerName-asc">Name (A-Z)</option>
              <option value="trainerName-desc">Name (Z-A)</option>
              <option value="payPeriod-desc">Newest Period</option>
              <option value="payPeriod-asc">Oldest Period</option>
              <option value="netSalary-desc">Highest Salary</option>
              <option value="netSalary-asc">Lowest Salary</option>
              <option value="status-asc">Status (A-Z)</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filters.month || ''}
                onChange={(e) => handleFilterChange('month', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleDateString('en-IN', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select
                value={filters.year || ''}
                onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {Array.from({ length: 3 }, (_, i) => (
                  <option key={currentYear - i} value={currentYear - i}>
                    {currentYear - i}
                  </option>
                ))}
              </select>

              <select
                value={filters.paymentMode || ''}
                onChange={(e) => handleFilterChange('paymentMode', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Payment Modes</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="upi">UPI</option>
              </select>

              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </Card>

        {/* Bulk Actions */}
        {selectedSalaries.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                {selectedSalaries.length} salary record(s) selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  Bulk Process
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Salary Records Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSalaries.length === filteredSalaries.length && filteredSalaries.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trainer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSalaries.includes(salary._id)}
                        onChange={() => handleSelectSalary(salary._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{salary.trainerName}</div>
                        <div className="text-sm text-gray-500">{salary.trainerEmail}</div>
                        <div className="text-xs text-gray-400">ID: {salary.trainerId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar size={14} />
                        {new Date(2024, salary.payPeriod.month - 1).toLocaleDateString('en-IN', { month: 'short' })} {salary.payPeriod.year}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(salary.basicSalary)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(salary.grossSalary)}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-green-600">
                      {formatCurrency(salary.netSalary)}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(salary.status)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2"> 
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openViewModal(salary)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {salary.status === 'pending' && (
                              <DropdownMenuItem onClick={() => openEditModal(salary)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Salary
                              </DropdownMenuItem>
                            )}
                            {salary.status === 'pending' && (                              
                              <DropdownMenuItem onClick={() => openProcessModal(salary)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Process Salary
                              </DropdownMenuItem>
                            )}
                            {(salary.status === 'processed' || salary.status === 'paid') && (
                              <DropdownMenuItem onClick={() => handleGeneratePayslip(salary)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download Payslip
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => openDeleteModal(salary)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSalaries.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No salary records found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.values(filters).some(f => f !== '' && f !== undefined) 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by generating salary records for trainers'
                }
              </p>
              <Button onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" />
                Generate First Salary
              </Button>
            </div>
          )}
        </Card>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {filteredSalaries.length} of {salaries.length} salary records
          </p>
          <div className="flex space-x-2">
            {/* Pagination controls would go here */}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSalaryModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSuccess={handleSalaryCreated}
      />

      {selectedSalary && (
        <>
          <EditSalaryModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSuccess={handleSalaryUpdated}
            salary={selectedSalary}
          />

          <ViewSalaryModal
            isOpen={isViewModalOpen}
            onClose={closeViewModal}
            salary={selectedSalary}
          />

          <DeleteSalaryModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onSuccess={handleSalaryDeleted}
            salary={selectedSalary}
          />

          <ProcessSalaryModal
            isOpen={isProcessModalOpen}
            onClose={closeProcessModal}
            onSuccess={handleSalaryProcessed}
            salary={selectedSalary}
          />
        </>
      )}

      <div className="py-2" />
    </div>
  );
};

export default SalaryManagement;