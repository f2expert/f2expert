import React, { useState } from 'react';
import { FormInput } from '../../atoms/FormInput';
import { Button } from '../../atoms/Button';
import { cn } from '../../../lib/utils';

export interface QuickConnectFormData {
  userName: string;
  email: string;
  contact: string;
  description: string;
}

export interface QuickConnectProps {
  title?: string;
  onSubmit?: (data: QuickConnectFormData) => void;
  className?: string;
  buttonText?: string;
}

export const QuickConnect: React.FC<QuickConnectProps> = ({
  title = "Quick Connect",
  onSubmit,
  className = '',
  buttonText = "Apply"
}) => {
  const [formData, setFormData] = useState<QuickConnectFormData>({
    userName: '',
    email: '',
    contact: '',
    description: ''
  });

  const handleInputChange = (field: keyof QuickConnectFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    // Reset form after submission
    setFormData({
      userName: '',
      email: '',
      contact: '',
      description: ''
    });
  };

  return (
    <div className={cn('', className)}>
      <h2 className="text-lg text-gray-300 py-2 mb-4 font-semibold">
        {title}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FormInput
            type="text"
            placeholder="User Name"
            value={formData.userName}
            onChange={handleInputChange('userName')}
            required
            name="userName"
          />
        </div>
        
       {/* <div>
          <FormInput
            type="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            name="email"
          />
        </div>*/}
        
        <div>
          <FormInput
            type="tel"
            placeholder="Contact No."
            value={formData.contact}
            onChange={handleInputChange('contact')}
            required
            name="contact"
          />
        </div>
        
       {/**  <div>
          <FormInput
            type="textarea"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            rows={3}
            name="description"
          />
        </div>*/}
        
        <div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm transition-colors duration-200"
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuickConnect;