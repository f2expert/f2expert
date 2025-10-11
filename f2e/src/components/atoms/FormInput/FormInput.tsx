import React from 'react';
import { cn } from '../../../lib/utils';

export interface FormInputProps {
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  rows?: number;
  required?: boolean;
  name?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  rows = 3,
  required = false,
  name
}) => {
  const baseClasses = 'w-full p-2 rounded-sm text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  if (type === 'textarea') {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn(baseClasses, 'resize-vertical min-h-[80px]', className)}
        rows={rows}
        required={required}
        name={name}
      />
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={cn(baseClasses, className)}
      required={required}
      name={name}
    />
  );
};

export default FormInput;