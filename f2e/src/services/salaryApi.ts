// Salary Management API Service

// API Base URL
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// Salary interfaces
export interface EmployeeInfo {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  employeeCode: string;
}

export interface PayPeriod {
  month: number;
  year: number;
  startDate: string;
  endDate: string;
}

export interface Allowances {
  hra: number;
  transport: number;
  medical: number;
  performance: number;
  other: number;
}

export interface Deductions {
  tax: number;
  pf: number;
  esi: number;
  advance: number;
  other: number;
  loan: number;
}

export interface ClassInfo {
  assigned: number;
  completed: number;
  hourlyRate: number;
  totalHours: number;
  earnings: number;
  completionRate: number;
}

export interface PaymentInfo {
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  method: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
}

export interface CreatedBy {
  id: string;
  name: string;
}

export interface SalaryStructure {
  id: string;
  employeeId: EmployeeInfo;
  payPeriod: PayPeriod;
  basicSalary: number;
  allowances: Allowances;
  deductions: Deductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  classInfo: ClassInfo;
  paymentInfo: PaymentInfo;
  approvedBy?: CreatedBy | null;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  
  // Legacy fields for backward compatibility
  _id?: string;
  trainerId?: string;
  trainerName?: string;
  trainerEmail?: string;
  status?: 'pending' | 'processed' | 'paid' | 'cancelled';
  paymentMode?: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
  paymentDetails?: {
    bankAccount?: string;
    transactionId?: string;
    paymentDate?: string;
    reference?: string;
  };
  processedBy?: string;
  remarks?: string;
}

export interface SalaryFilters {
  employeeId?: string;
  month?: number;
  year?: number;
  status?: string;
  paymentMode?: string;
  search?: string;
}

export interface CreateSalaryData {
  employeeId: string;
  payPeriod: {
    month: number;
    year: number;
  };
  basicSalary: number;
  allowances: Allowances;
  deductions: Deductions;
  paymentMode: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
  remarks?: string;
}

export interface UpdateSalaryData extends Partial<CreateSalaryData> {
  status?: 'pending' | 'processed' | 'paid' | 'cancelled';
  paymentDetails?: {
    bankAccount?: string;
    transactionId?: string;
    paymentDate?: string;
    reference?: string;
  };
  approvedBy?: string;
  processedBy?: string;
}

export interface SalaryStats {
  totalSalariesThisMonth: number;
  totalPayoutThisMonth: number;
  pendingSalaries: number;
  processedSalaries: number;
  paidSalaries: number;
  averageSalary: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SalariesResponse {
  success: boolean;
  message: string;
  data: {
    salaries: SalaryStructure[];
    pagination: Pagination;
  };
}

class SalaryApiService {
  private baseUrl = '/salary';

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Salary API Request URL:', url);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Trainer Salary API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Calculate salary totals
  private calculateSalaryTotals(basicSalary: number, allowances: Allowances, deductions: Deductions) {
    const totalAllowances = Object.values(allowances).reduce((sum: number, val: number) => sum + (val || 0), 0);
    const totalDeductions = Object.values(deductions).reduce((sum: number, val: number) => sum + (val || 0), 0);
    const grossSalary = basicSalary + totalAllowances;
    const netSalary = grossSalary - totalDeductions;
    
    return {
      grossSalary,
      totalDeductions,
      netSalary
    };
  }

  // Get all salaries with filtering
  async getSalaries(filters?: SalaryFilters): Promise<{
    salaries: SalaryStructure[];
    totalCount: number;
  }> {
    try {
      const params = new URLSearchParams();

      if (filters?.employeeId) params.append('employeeId', filters.employeeId);
      if (filters?.month) params.append('month', filters.month.toString());
      if (filters?.year) params.append('year', filters.year.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.paymentMode) params.append('paymentMode', filters.paymentMode);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const endpoint = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      const result = await this.makeRequest<SalariesResponse>(endpoint);
      
      return {
        salaries: (result.data?.salaries || []).map(mapSalaryForLegacy),
        totalCount: result.data?.pagination?.totalCount || 0
      };
    } catch (error) {
      console.error('Failed to fetch salaries from API:', error);
      console.log('Falling back to mock data...');
      return this.getMockSalaries(filters);
    }
  }

  // Get salary by ID
  async getSalaryById(salaryId: string): Promise<SalaryStructure> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStructure;
      }>(`${this.baseUrl}/${salaryId}`);
      
      return result.data;
    } catch (error) {
      console.error('Failed to fetch salary:', error);
      throw error;
    }
  }

  // Create new salary record
  async createSalary(salaryData: CreateSalaryData): Promise<SalaryStructure> {
    try {
      // Calculate totals before sending
      const totals = this.calculateSalaryTotals(
        salaryData.basicSalary,
        salaryData.allowances,
        salaryData.deductions
      );

      const fullSalaryData = {
        ...salaryData,
        ...totals,
        payPeriod: {
          ...salaryData.payPeriod,
          startDate: new Date(salaryData.payPeriod.year, salaryData.payPeriod.month - 1, 1).toISOString(),
          endDate: new Date(salaryData.payPeriod.year, salaryData.payPeriod.month, 0).toISOString(),
        },
        status: 'pending' as const
      };

      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStructure;
      }>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(fullSalaryData),
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to create salary:', error);
      throw error;
    }
  }

  // Update salary record
  async updateSalary(salaryId: string, updateData: UpdateSalaryData): Promise<SalaryStructure> {
    try {
      // Recalculate totals if salary components changed
      let calculatedData = { ...updateData };
      if (updateData.basicSalary || updateData.allowances || updateData.deductions) {
        const currentSalary = await this.getSalaryById(salaryId);
        const totals = this.calculateSalaryTotals(
          updateData.basicSalary || currentSalary.basicSalary,
          { ...currentSalary.allowances, ...updateData.allowances },
          { ...currentSalary.deductions, ...updateData.deductions }
        );
        calculatedData = { ...updateData, ...totals };
      }

      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStructure;
      }>(`${this.baseUrl}/${salaryId}`, {
        method: 'PUT',
        body: JSON.stringify(calculatedData),
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to update salary:', error);
      throw error;
    }
  }

  // Delete salary record
  async deleteSalary(salaryId: string): Promise<void> {
    try {
      await this.makeRequest<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/${salaryId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete salary:', error);
      throw error;
    }
  }

  // Get salary statistics
  async getSalaryStats(): Promise<SalaryStats> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStats;
      }>(`${this.baseUrl}/stats`);
      
      return result.data;
    } catch (error) {
      console.error('Failed to fetch salary stats:', error);
      return this.getMockSalaryStats();
    }
  }

  // Get salary structures for all trainers
  async getSalaryStructures(): Promise<SalaryStructure[]> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStructure[];
      }>('/salary-structures');
      
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch salary structures:', error);
      return this.getMockSalaryStructures();
    }
  }

  // Process salary (approve and generate payslip)
  async processSalary(salaryId: string, processedBy: string): Promise<SalaryStructure> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStructure;
      }>(`${this.baseUrl}/${salaryId}/process`, {
        method: 'POST',
        body: JSON.stringify({ processedBy }),
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to process salary:', error);
      throw error;
    }
  }

  // Mark salary as paid
  async markSalaryAsPaid(salaryId: string, paymentDetails: Record<string, string>): Promise<SalaryStructure> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: SalaryStructure;
      }>(`${this.baseUrl}/${salaryId}/pay`, {
        method: 'POST',
        body: JSON.stringify({
          status: 'paid',
          paymentDetails: {
            ...paymentDetails,
            paymentDate: new Date().toISOString()
          }
        }),
      });
      
      return result.data;
    } catch (error) {
      console.error('Failed to mark salary as paid:', error);
      throw error;
    }
  }

  // Generate payslip PDF
  async generatePayslip(salaryId: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.baseUrl}/${salaryId}/payslip`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate payslip: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to generate payslip:', error);
      throw error;
    }
  }

  // Mock data for fallback
  private getMockSalaries(filters?: SalaryFilters): Promise<{
    salaries: SalaryStructure[];
    totalCount: number;
  }> {
    const mockSalaries: SalaryStructure[] = [
      {
        id: '1',
        employeeId: {
          id: 'EMP001',
          firstName: 'John',
          lastName: 'Smith',
          fullName: 'John Smith',
          email: 'john.smith@example.com',
          employeeCode: 'TR001'
        },
        payPeriod: {
          month: 10,
          year: 2024,
          startDate: '2024-10-01T00:00:00.000Z',
          endDate: '2024-10-31T23:59:59.000Z'
        },
        basicSalary: 50000,
        allowances: {
          hra: 15000,
          transport: 3000,
          medical: 2000,
          performance: 5000,
          other: 1000
        },
        deductions: {
          tax: 8000,
          pf: 6000,
          esi: 750,
          advance: 2000,
          other: 500,
          loan: 0
        },
        grossSalary: 76000,
        totalDeductions: 17250,
        netSalary: 58750,
        classInfo: {
          assigned: 5,
          completed: 4,
          hourlyRate: 500,
          totalHours: 20,
          earnings: 10000,
          completionRate: 80
        },
        paymentInfo: {
          status: 'processed',
          method: 'bank_transfer'
        },
        approvedBy: {
          id: 'HR001',
          name: 'HR Manager'
        },
        createdBy: {
          id: 'ADM001',
          name: 'Payroll Admin'
        },
        createdAt: '2024-10-25T10:00:00.000Z',
        updatedAt: '2024-10-26T14:30:00.000Z',
        // Legacy fields for backward compatibility
        _id: '1',
        trainerId: 'TR001',
        trainerName: 'John Smith',
        trainerEmail: 'john.smith@example.com',
        status: 'processed',
        paymentMode: 'bank_transfer',
        paymentDetails: {
          bankAccount: '****1234',
          transactionId: 'TXN001234567',
          reference: 'SAL-OCT-2024-001'
        },
        processedBy: 'Payroll Admin',
        remarks: 'Regular monthly salary'
      },
      {
        id: '2',
        employeeId: {
          id: 'EMP002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          employeeCode: 'TR002'
        },
        payPeriod: {
          month: 10,
          year: 2024,
          startDate: '2024-10-01T00:00:00.000Z',
          endDate: '2024-10-31T23:59:59.000Z'
        },
        basicSalary: 55000,
        allowances: {
          hra: 16500,
          transport: 3000,
          medical: 2500,
          performance: 7000,
          other: 1000
        },
        deductions: {
          tax: 9000,
          pf: 6600,
          esi: 825,
          advance: 0,
          other: 0,
          loan: 0
        },
        grossSalary: 85000,
        totalDeductions: 16425,
        netSalary: 68575,
        classInfo: {
          assigned: 8,
          completed: 7,
          hourlyRate: 600,
          totalHours: 35,
          earnings: 21000,
          completionRate: 87.5
        },
        paymentInfo: {
          status: 'pending',
          method: 'bank_transfer'
        },
        approvedBy: null,
        createdBy: {
          id: 'ADM001',
          name: 'Payroll Admin'
        },
        createdAt: '2024-10-25T11:00:00.000Z',
        updatedAt: '2024-10-25T11:00:00.000Z',
        // Legacy fields for backward compatibility
        _id: '2',
        trainerId: 'TR002',
        trainerName: 'Sarah Johnson',
        trainerEmail: 'sarah.johnson@example.com',
        status: 'pending',
        paymentMode: 'bank_transfer',
        remarks: 'Performance bonus included'
      }
    ];

    // Apply filters
    let filtered = mockSalaries;
    if (filters?.status) {
      filtered = filtered.filter(s => s.paymentInfo.status === filters.status);
    }
    if (filters?.employeeId) {
      filtered = filtered.filter(s => s.employeeId.id === filters.employeeId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.employeeId.fullName.toLowerCase().includes(search) ||
        s.employeeId.email.toLowerCase().includes(search) ||
        s.employeeId.employeeCode.toLowerCase().includes(search) ||
        (s.trainerName && s.trainerName.toLowerCase().includes(search)) ||
        (s.trainerEmail && s.trainerEmail.toLowerCase().includes(search)) ||
        (s.trainerId && s.trainerId.toLowerCase().includes(search))
      );
    }

    return Promise.resolve({
      salaries: filtered,
      totalCount: filtered.length
    });
  }

  private getMockSalaryStats(): SalaryStats {
    return {
      totalSalariesThisMonth: 25,
      totalPayoutThisMonth: 1250000,
      pendingSalaries: 5,
      processedSalaries: 15,
      paidSalaries: 5,
      averageSalary: 50000
    };
  }

  private getMockSalaryStructures(): SalaryStructure[] {
    return [
      {
        id: '1',
        employeeId: {
          id: 'EMP001',
          firstName: 'John',
          lastName: 'Smith',
          fullName: 'John Smith',
          email: 'john.smith@example.com',
          employeeCode: 'TR001'
        },
        payPeriod: {
          month: 1,
          year: 2024,
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-01-31T23:59:59.000Z'
        },
        basicSalary: 50000,
        allowances: {
          hra: 15000,
          transport: 3000,
          medical: 2000,
          performance: 5000,
          other: 1000
        },
        deductions: {
          tax: 8000,
          pf: 6000,
          esi: 750,
          advance: 0,
          other: 0,
          loan: 0
        },
        grossSalary: 76000,
        totalDeductions: 14750,
        netSalary: 61250,
        classInfo: {
          assigned: 3,
          completed: 3,
          hourlyRate: 500,
          totalHours: 15,
          earnings: 7500,
          completionRate: 100
        },
        paymentInfo: {
          status: 'processed',
          method: 'bank_transfer'
        },
        approvedBy: {
          id: 'HR001',
          name: 'HR Manager'
        },
        createdBy: {
          id: 'ADM001',
          name: 'System Admin'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        // Legacy fields for backward compatibility
        _id: '1',
        trainerId: 'TR001',
        trainerName: 'John Smith',
        trainerEmail: 'john.smith@example.com',
        status: 'processed',
        paymentMode: 'bank_transfer'
      }
    ];
  }
}

// Type alias for backward compatibility
export type TrainerSalary = SalaryStructure;

// Utility function to ensure backward compatibility
export const mapSalaryForLegacy = (salary: SalaryStructure): SalaryStructure => {
  return {
    ...salary,
    // Ensure legacy fields are available
    _id: salary._id || salary.id,
    trainerId: salary.trainerId || salary.employeeId.employeeCode,
    trainerName: salary.trainerName || salary.employeeId.fullName,
    trainerEmail: salary.trainerEmail || salary.employeeId.email,
    status: salary.status || salary.paymentInfo.status,
    paymentMode: salary.paymentMode || salary.paymentInfo.method,
  };
};

export const salaryApiService = new SalaryApiService();
export const trainerSalaryApiService = new SalaryApiService(); // Legacy export for backward compatibility