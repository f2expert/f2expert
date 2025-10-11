import React from 'react';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'body' | 'caption' | 'code';
  className?: string;
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body', 
  className = '',
  as 
}) => {
  const Component = as || getDefaultElement(variant);
  
  const variantClasses = {
    heading: 'text-5xl leading-tight mb-4 font-bold',
    body: 'text-base leading-relaxed',
    caption: 'text-gray-400 text-sm',
    code: 'bg-gray-800 rounded px-1 py-0.5 font-mono text-sm'
  };
  
  const textClasses = `m-0 ${variantClasses[variant]} ${className}`;
  
  return (
    <Component className={textClasses}>
      {children}
    </Component>
  );
};

function getDefaultElement(variant: string): React.ElementType {
  switch (variant) {
    case 'heading':
      return 'h1';
    case 'code':
      return 'code';
    case 'caption':
      return 'p';
    default:
      return 'p';
  }
}

export default Text;