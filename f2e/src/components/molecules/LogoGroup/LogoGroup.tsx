import React from 'react';
import { Logo } from '../../atoms/Logo';
import reactLogo from '../../../assets/react.svg';
import viteLogo from '/vite.svg';

export interface LogoGroupProps {
  className?: string;
}

export const LogoGroup: React.FC<LogoGroupProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center gap-8 mb-8 ${className}`}>
      <Logo 
        src={viteLogo} 
        alt="Vite logo" 
        href="https://vite.dev"
      />
      <Logo 
        src={reactLogo} 
        alt="React logo" 
        href="https://react.dev"
        animated={true}
      />
    </div>
  );
};

export default LogoGroup;