import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '../../components/atoms';
import { Separator } from '../../components/atoms/Separator';
import { 
  CardStackIcon, 
  CalendarIcon, 
  DownloadIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ClockIcon 
} from '@radix-ui/react-icons';

interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
  method: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

export const FeeDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'billing'>('current');

  // Mock data - in a real app, this would come from an API
  const currentSubscription: Subscription = {
    id: 'sub_001',
    plan: 'Premium Learning',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    amount: 99.99,
    billingCycle: 'yearly',
    features: [
      'Access to all courses',
      'Priority support',
      'Downloadable resources',
      'Certificate generation',
      'Progress tracking',
      'Mobile app access'
    ]
  };

  const paymentHistory: PaymentRecord[] = [
    {
      id: 'pay_001',
      date: '2024-01-15',
      description: 'Premium Learning - Annual Subscription',
      amount: 99.99,
      status: 'paid',
      method: 'Credit Card ****1234',
      invoiceUrl: '/invoices/inv_001.pdf'
    },
    {
      id: 'pay_002',
      date: '2023-12-10',
      description: 'React Masterclass Course',
      amount: 49.99,
      status: 'paid',
      method: 'UPI',
      invoiceUrl: '/invoices/inv_002.pdf'
    },
    {
      id: 'pay_003',
      date: '2023-11-05',
      description: 'TypeScript Fundamentals',
      amount: 29.99,
      status: 'paid',
      method: 'Credit Card ****1234',
      invoiceUrl: '/invoices/inv_003.pdf'
    },
    {
      id: 'pay_004',
      date: '2023-10-20',
      description: 'Node.js Advanced',
      amount: 39.99,
      status: 'failed',
      method: 'Credit Card ****5678'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'active':
        return <CheckCircledIcon className="h-4 w-4 text-green-600" />;
      case 'failed':
      case 'expired':
        return <CrossCircledIcon className="h-4 w-4 text-red-600" />;
      case 'pending':
      case 'cancelled':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      paid: 'default',
      active: 'default',
      pending: 'secondary',
      cancelled: 'secondary',
      failed: 'destructive',
      expired: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderCurrentSubscription = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CardStackIcon className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Your active subscription details and benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{currentSubscription.plan}</h3>
              <p className="text-gray-600">
                {formatCurrency(currentSubscription.amount)} / {currentSubscription.billingCycle}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(currentSubscription.status)}
                {getStatusBadge(currentSubscription.status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Next billing date</p>
              <p className="font-medium">{formatDate(currentSubscription.endDate)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Plan Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentSubscription.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircledIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Manage Subscription</Button>
            <Button variant="outline">Change Plan</Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
          <CardDescription>Your learning activity this billing period.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Courses Accessed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">45</div>
              <div className="text-sm text-gray-600">Hours Watched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600">Certificates Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            View all your past transactions and download invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment.status)}
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(payment.date)} • {payment.method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    {getStatusBadge(payment.status)}
                  </div>
                  {payment.invoiceUrl && payment.status === 'paid' && (
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods and billing information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CardStackIcon className="h-8 w-8 text-gray-400" />
              <div>
                <h4 className="font-medium">Credit Card</h4>
                <p className="text-sm text-gray-600">**** **** **** 1234</p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Remove</Button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            Add New Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Update your billing information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                defaultValue="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                defaultValue="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              defaultValue="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                defaultValue="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md" 
                defaultValue="10001"
              />
            </div>
          </div>
          <Button>Update Billing Address</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fee Details</h1>
        <p className="text-gray-600 mt-2">Manage your subscription, view payment history, and update billing information.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'current' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Current Plan
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'billing' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Billing Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'current' && renderCurrentSubscription()}
      {activeTab === 'history' && renderPaymentHistory()}
      {activeTab === 'billing' && renderBillingSettings()}
    </div>
  );
};

export default FeeDetails;