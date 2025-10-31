// Trainer Salary Management API Service

// API Base URL
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// Salary interfaces
export interface TrainerSalary {
  _id: string;
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  employeeId?: string;
  payPeriod: {
    startDate: string;
    endDate: string;
    month: number;
    year: number;
  };
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    performance: number;
    other: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    advance: number;
    other: number;
  };
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  paymentMode: 'bank_transfer' | 'cash' | 'cheque' | 'upi';
  paymentDetails?: {
    bankAccount?: string;
    transactionId?: string;
    paymentDate?: string;
    reference?: string;
  };
  approvedBy?: string;
  processedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryStructure {
  _id: string;
  trainerId: string;
  trainerName: string;
  designation: string;
  department: string;
  joinDate: string;
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    performance: number;
    other: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    advance: number;
    other: number;
  };
  ctc: number;
  effectiveFrom: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryFilters {
  trainerId?: string;
  month?: number;
  year?: number;
  status?: string;
  paymentMode?: string;
  search?: string;
}

export interface CreateSalaryData {
  trainerId: string;
  payPeriod: {
    month: number;
    year: number;
  };
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    performance: number;
    other: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    advance: number;
    other: number;
  };
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

class TrainerSalaryApiService {
  private baseUrl = '/trainer-salaries';

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Trainer Salary API Request URL:', url);
    
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
  private calculateSalaryTotals(basicSalary: number, allowances: Record<string, number>, deductions: Record<string, number>) {
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
    salaries: TrainerSalary[];
    totalCount: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.trainerId) params.append('trainerId', filters.trainerId);
      if (filters?.month) params.append('month', filters.month.toString());
      if (filters?.year) params.append('year', filters.year.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.paymentMode) params.append('paymentMode', filters.paymentMode);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const endpoint = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      const result = await this.makeRequest<{
        success: boolean;
        data: TrainerSalary[];
        totalCount: number;
      }>(endpoint);
      
      return {
        salaries: result.data || [],
        totalCount: result.totalCount || 0
      };
    } catch (error) {
      console.error('Failed to fetch salaries from API:', error);
      console.log('Falling back to mock data...');
      return this.getMockSalaries(filters);
    }
  }

  // Get salary by ID
  async getSalaryById(salaryId: string): Promise<TrainerSalary> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: TrainerSalary;
      }>(`${this.baseUrl}/${salaryId}`);
      
      return result.data;
    } catch (error) {
      console.error('Failed to fetch salary:', error);
      throw error;
    }
  }

  // Create new salary record
  async createSalary(salaryData: CreateSalaryData): Promise<TrainerSalary> {
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
        data: TrainerSalary;
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
  async updateSalary(salaryId: string, updateData: UpdateSalaryData): Promise<TrainerSalary> {
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
        data: TrainerSalary;
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
  async processSalary(salaryId: string, processedBy: string): Promise<TrainerSalary> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: TrainerSalary;
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
  async markSalaryAsPaid(salaryId: string, paymentDetails: Record<string, string>): Promise<TrainerSalary> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        data: TrainerSalary;
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
    salaries: TrainerSalary[];
    totalCount: number;
  }> {
    const mockSalaries: TrainerSalary[] = [
      {
        _id: '1',
        trainerId: 'TR001',
        trainerName: 'John Smith',
        trainerEmail: 'john.smith@example.com',
        employeeId: 'EMP001',
        payPeriod: {
          startDate: '2024-10-01',
          endDate: '2024-10-31',
          month: 10,
          year: 2024
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
          pf: 6000,
          esi: 750,
          tax: 8000,
          advance: 2000,
          other: 500
        },
        grossSalary: 76000,
        totalDeductions: 17250,
        netSalary: 58750,
        status: 'processed',
        paymentMode: 'bank_transfer',
        paymentDetails: {
          bankAccount: '****1234',
          transactionId: 'TXN001234567',
          reference: 'SAL-OCT-2024-001'
        },
        approvedBy: 'HR Manager',
        processedBy: 'Payroll Admin',
        remarks: 'Regular monthly salary',
        createdAt: '2024-10-25T10:00:00Z',
        updatedAt: '2024-10-26T14:30:00Z'
      },
      {
        _id: '2',
        trainerId: 'TR002',
        trainerName: 'Sarah Johnson',
        trainerEmail: 'sarah.johnson@example.com',
        employeeId: 'EMP002',
        payPeriod: {
          startDate: '2024-10-01',
          endDate: '2024-10-31',
          month: 10,
          year: 2024
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
          pf: 6600,
          esi: 825,
          tax: 9000,
          advance: 0,
          other: 0
        },
        grossSalary: 85000,
        totalDeductions: 16425,
        netSalary: 68575,
        status: 'pending',
        paymentMode: 'bank_transfer',
        remarks: 'Performance bonus included',
        createdAt: '2024-10-25T11:00:00Z',
        updatedAt: '2024-10-25T11:00:00Z'
      }
    ];

    // Apply filters
    let filtered = mockSalaries;
    if (filters?.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    if (filters?.trainerId) {
      filtered = filtered.filter(s => s.trainerId === filters.trainerId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.trainerName.toLowerCase().includes(search) ||
        s.trainerEmail.toLowerCase().includes(search) ||
        s.trainerId.toLowerCase().includes(search)
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
        _id: '1',
        trainerId: 'TR001',
        trainerName: 'John Smith',
        designation: 'Senior Trainer',
        department: 'Technology',
        joinDate: '2023-01-15',
        basicSalary: 50000,
        allowances: {
          hra: 15000,
          transport: 3000,
          medical: 2000,
          performance: 5000,
          other: 1000
        },
        deductions: {
          pf: 6000,
          esi: 750,
          tax: 8000,
          advance: 0,
          other: 0
        },
        ctc: 76000,
        effectiveFrom: '2024-01-01',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
  }
}

export const trainerSalaryApiService = new TrainerSalaryApiService();