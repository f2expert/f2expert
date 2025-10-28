import React, { useState, useEffect } from 'react';
import { Edit3, User, Phone, MapPin, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';

import { trainerManagementApiService, type Trainer, type UpdateTrainerData } from '../../../services/trainerManagementApi';

interface EditTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer;
  onTrainerUpdated: () => void;
}

type FormStep = 'personal' | 'contact' | 'professional' | 'emergency';

const EditTrainerModal: React.FC<EditTrainerModalProps> = ({
  isOpen,
  onClose,
  trainer,
  onTrainerUpdated,
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateTrainerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
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
    },
    specializations: [],
    qualifications: [],
    expertise: [],
    certifications: [],
    experience: 0,
    bio: '',
    isActive: true
  });

  // Temporary state for array inputs
  const [tempSpecialization, setTempSpecialization] = useState('');
  const [tempQualification, setTempQualification] = useState('');
  const [tempExpertise, setTempExpertise] = useState('');
  const [tempCertification, setTempCertification] = useState('');

  const steps = [
    { key: 'personal', title: 'Personal Info', icon: User },
    { key: 'contact', title: 'Contact & Address', icon: MapPin },
    { key: 'professional', title: 'Professional Info', icon: GraduationCap },
    { key: 'emergency', title: 'Emergency Contact', icon: Phone }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  // Initialize form data with trainer data
  useEffect(() => {
    if (trainer) {
      setFormData({
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        email: trainer.email,
        phone: trainer.phone,
        dateOfBirth: trainer.dateOfBirth,
        gender: trainer.gender,
        address: { ...trainer.address },
        emergencyContact: { ...trainer.emergencyContact },
        specializations: [...trainer.specializations],
        qualifications: [...trainer.qualifications],
        expertise: [...trainer.expertise],
        certifications: [...trainer.certifications],
        experience: trainer.experience,
        bio: trainer.bio || '',
        isActive: trainer.isActive
      });
    }
  }, [trainer]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UpdateTrainerData] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addArrayItem = (field: 'specializations' | 'qualifications' | 'expertise' | 'certifications', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: 'specializations' | 'qualifications' | 'expertise' | 'certifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case 'personal':
        return !!(formData.firstName && formData.lastName && formData.email && formData.dateOfBirth);
      case 'contact':
        return !!(formData.phone && formData.address?.city && formData.address?.state);
      case 'professional':
        return (formData.specializations?.length || 0) > 0 && (formData.experience || 0) >= 0;
      case 'emergency':
        return !!(formData.emergencyContact?.name && formData.emergencyContact?.phone && formData.emergencyContact?.relationship);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
      setCurrentStep(steps[nextIndex].key as FormStep);
    }
  };

  const handlePrev = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex].key as FormStep);
  };

  const handleSubmit = async () => {
    if (!validateStep('emergency')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await trainerManagementApiService.updateTrainer(trainer._id, formData);
      onTrainerUpdated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trainer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('personal');
    setError(null);
    setTempSpecialization('');
    setTempQualification('');
    setTempExpertise('');
    setTempCertification('');
    onClose();
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      {/* Status Toggle */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.isActive === true}
              onChange={() => handleInputChange('isActive', true)}
              className="mr-2"
            />
            <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm">Active</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="inactive"
              checked={formData.isActive === false}
              onChange={() => handleInputChange('isActive', false)}
              className="mr-2"
            />
            <XCircle className="h-4 w-4 text-red-600 mr-1" />
            <span className="text-sm">Inactive</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Brief professional bio"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <Input
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter phone number"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <Input
          value={formData.address?.street || ''}
          onChange={(e) => handleInputChange('address.street', e.target.value)}
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <Input
            value={formData.address?.city || ''}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            placeholder="Enter city"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <Input
            value={formData.address?.state || ''}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
            placeholder="Enter state"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Input
            value={formData.address?.country || ''}
            onChange={(e) => handleInputChange('address.country', e.target.value)}
            placeholder="Enter country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <Input
            value={formData.address?.zipCode || ''}
            onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
            placeholder="Enter ZIP code"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <Input
          type="number"
          min="0"
          max="50"
          value={formData.experience || 0}
          onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
          placeholder="Enter years of experience"
          required
        />
      </div>

      {/* Specializations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specializations * (At least one required)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tempSpecialization}
            onChange={(e) => setTempSpecialization(e.target.value)}
            placeholder="e.g., React, Node.js, Python"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem('specializations', tempSpecialization);
                setTempSpecialization('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addArrayItem('specializations', tempSpecialization);
              setTempSpecialization('');
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.specializations || []).map((spec, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {spec}
              <button
                onClick={() => removeArrayItem('specializations', index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Qualifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Qualifications
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tempQualification}
            onChange={(e) => setTempQualification(e.target.value)}
            placeholder="e.g., B.Tech Computer Science, M.Tech"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem('qualifications', tempQualification);
                setTempQualification('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addArrayItem('qualifications', tempQualification);
              setTempQualification('');
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.qualifications || []).map((qual, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {qual}
              <button
                onClick={() => removeArrayItem('qualifications', index)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Expertise */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Areas of Expertise
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tempExpertise}
            onChange={(e) => setTempExpertise(e.target.value)}
            placeholder="e.g., Full Stack Development, System Design"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem('expertise', tempExpertise);
                setTempExpertise('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addArrayItem('expertise', tempExpertise);
              setTempExpertise('');
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.expertise || []).map((exp, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {exp}
              <button
                onClick={() => removeArrayItem('expertise', index)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Certifications
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tempCertification}
            onChange={(e) => setTempCertification(e.target.value)}
            placeholder="e.g., AWS Certified Developer, Google Cloud Professional"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayItem('certifications', tempCertification);
                setTempCertification('');
              }
            }}
          />
          <Button
            type="button"
            onClick={() => {
              addArrayItem('certifications', tempCertification);
              setTempCertification('');
            }}
            size="sm"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.certifications || []).map((cert, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              {cert}
              <button
                onClick={() => removeArrayItem('certifications', index)}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmergencyContact = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name *
          </label>
          <Input
            value={formData.emergencyContact?.name || ''}
            onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
            placeholder="Enter contact name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship *
          </label>
          <select
            value={formData.emergencyContact?.relationship || ''}
            onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select relationship</option>
            <option value="Spouse">Spouse</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Child">Child</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <Input
          value={formData.emergencyContact?.phone || ''}
          onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
          placeholder="Enter emergency contact phone"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email (Optional)
        </label>
        <Input
          type="email"
          value={formData.emergencyContact?.email || ''}
          onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
          placeholder="Enter emergency contact email"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalInfo();
      case 'contact':
        return renderContactInfo();
      case 'professional':
        return renderProfessionalInfo();
      case 'emergency':
        return renderEmergencyContact();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <Edit3 className="mr-2 h-5 w-5" />
            Edit Trainer: {trainer.firstName} {trainer.lastName}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === currentStep;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              
              {currentStepIndex === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(currentStep)}
                >
                  {loading ? 'Updating...' : 'Update Trainer'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditTrainerModal };