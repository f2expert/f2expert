import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { X, Save, User, Phone, MapPin, Users, AlertCircle } from 'lucide-react';
import type { CreateStudentData } from '../../../services';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: CreateStudentData) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateStudentData>({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Demo@12345',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    role: 'student',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;

      case 2: // Address Information
        if (!formData.address.street.trim()) newErrors.addressStreet = 'Street address is required';
        if (!formData.address.city.trim()) newErrors.addressCity = 'City is required';
        if (!formData.address.state.trim()) newErrors.addressState = 'State is required';
        if (!formData.address.zipCode.trim()) newErrors.addressZipCode = 'ZIP code is required';
        break;

      case 3: // Emergency Contact
        if (!formData.emergencyContact.name.trim()) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.emergencyContact.relationship.trim()) newErrors.emergencyRelationship = 'Relationship is required';
        if (!formData.emergencyContact.phone.trim()) {
          newErrors.emergencyPhone = 'Emergency contact phone is required';
        } else if (!/^[+]?[\d\s-()]+$/.test(formData.emergencyContact.phone)) {
          newErrors.emergencyPhone = 'Please enter a valid phone number';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Clear API error when successfully moving to next step
      setApiError('');
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    // Clear API error when moving back to make corrections
    setApiError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        // Clear any previous API errors
        setApiError('');
        
        // Call the API through the parent component
        await onSave(formData);
        
        // If we get here, the API call was successful
        // Show success message briefly, then close modal
        setSuccessMessage('Student added successfully!');
        
        // Close the modal after a brief delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } catch (error) {
        console.error('Failed to save student:', error);
        
        // Set user-friendly error message
        if (error instanceof Error) {
          // Check for specific error types
          if (error.message.includes('email')) {
            setApiError('Email address is already in use. Please use a different email.');
          } else if (error.message.includes('phone')) {
            setApiError('Phone number is already in use. Please use a different phone number.');
          } else if (error.message.includes('network')) {
            setApiError('Network error. Please check your connection and try again.');
          } else if (error.message.includes('validation')) {
            setApiError('Please check your input data and try again.');
          } else {
            setApiError(error.message || 'Failed to add student. Please try again.');
          }
        } else {
          setApiError('An unexpected error occurred. Please try again.');
        }
      }
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
        password: 'Demo@12345',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      role: 'student',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      }
    });
    setErrors({});
    setApiError('');
    setSuccessMessage('');
    setCurrentStep(1);
    onClose();
  };

  const updateFormData = (field: string, value: string | string[]) => {
    // Clear API error when user starts typing to correct input
    if (apiError) {
      setApiError('');
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateStudentData] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
            ${currentStep > index + 1 
              ? 'bg-green-500 text-white' 
              : currentStep === index + 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }
          `}>
            {currentStep > index + 1 ? '✓' : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${
              currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="Enter first name"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            placeholder="Enter last name"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter email address"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="+91-9876543210"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            className={errors.dateOfBirth ? 'border-red-500' : ''}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData('gender', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.gender}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Address Information</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <Input
            type="text"
            value={formData.address.street}
            onChange={(e) => updateFormData('address.street', e.target.value)}
            placeholder="Enter street address"
            className={errors.addressStreet ? 'border-red-500' : ''}
          />
          {errors.addressStreet && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.addressStreet}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <Input
              type="text"
              value={formData.address.city}
              onChange={(e) => updateFormData('address.city', e.target.value)}
              placeholder="Enter city"
              className={errors.addressCity ? 'border-red-500' : ''}
            />
            {errors.addressCity && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.addressCity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <Input
              type="text"
              value={formData.address.state}
              onChange={(e) => updateFormData('address.state', e.target.value)}
              placeholder="Enter state"
              className={errors.addressState ? 'border-red-500' : ''}
            />
            {errors.addressState && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.addressState}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Input
              type="text"
              value={formData.address.country}
              onChange={(e) => updateFormData('address.country', e.target.value)}
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <Input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => updateFormData('address.zipCode', e.target.value)}
              placeholder="Enter ZIP code"
              className={errors.addressZipCode ? 'border-red-500' : ''}
            />
            {errors.addressZipCode && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.addressZipCode}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmergencyContact = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name *
          </label>
          <Input
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) => updateFormData('emergencyContact.name', e.target.value)}
            placeholder="Enter emergency contact name"
            className={errors.emergencyName ? 'border-red-500' : ''}
          />
          {errors.emergencyName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.emergencyName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship *
          </label>
          <select
            value={formData.emergencyContact.relationship}
            onChange={(e) => updateFormData('emergencyContact.relationship', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.emergencyRelationship ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Spouse">Spouse</option>
            <option value="Sibling">Sibling</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
          {errors.emergencyRelationship && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.emergencyRelationship}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <Input
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) => updateFormData('emergencyContact.phone', e.target.value)}
            placeholder="+91-9876543210"
            className={errors.emergencyPhone ? 'border-red-500' : ''}
          />
          {errors.emergencyPhone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.emergencyPhone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address (Optional)
          </label>
          <Input
            type="email"
            value={formData.emergencyContact.email || ''}
            onChange={(e) => updateFormData('emergencyContact.email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Review Information</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Address</h4>
          <div className="text-sm text-gray-600">
            <p>{formData.address.street}</p>
            <p>{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
            <p>{formData.address.country}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {formData.emergencyContact.name}</p>
            <p><strong>Relationship:</strong> {formData.emergencyContact.relationship}</p>
            <p><strong>Phone:</strong> {formData.emergencyContact.phone}</p>
            {formData.emergencyContact.email && (
              <p><strong>Email:</strong> {formData.emergencyContact.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderAddressInfo();
      case 3:
        return renderEmergencyContact();
      case 4:
        return renderReview();
      default:
        return renderPersonalInfo();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information';
      case 2:
        return 'Address Information';
      case 3:
        return 'Emergency Contact';
      case 4:
        return 'Review & Submit';
      default:
        return 'Add New Student';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Add New Student - {getStepTitle()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* API Error Display */}
        {apiError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">
                  Error Adding Student
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {apiError}
                </p>
              </div>
              <button
                onClick={() => setApiError('')}
                className="text-red-400 hover:text-red-600"
                title="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Success Message Display */}
        {successMessage && (
          <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 text-green-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="py-6">
          {renderStepIndicator()}
          {renderCurrentStep()}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || !!successMessage}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} disabled={!!successMessage}>
                Cancel
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={!!successMessage}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !!successMessage}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Student
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;