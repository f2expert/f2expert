import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';

export interface LogoProps {
  src?: string;
  alt?: string;
  text?: string;
  href?: string;
  to?: string;
  className?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  src, 
  alt = 'Logo', 
  text,
  href, 
  to = '/',
  className = '', 
  animated = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto'
  };

  const logoClasses = cn(
    'transition-all duration-300',
    animated ? 'animate-spin-slow' : '',
    alt.toLowerCase().includes('react') ? 'hover:drop-shadow-[0_0_2em_#61dafbaa]' : 'hover:drop-shadow-[0_0_2em_#646cffaa]',
    src ? sizeClasses[size] : 'text-xl font-bold text-white',
    className
  );
  
  const logoContent = src ? (
    <img src={src} className={logoClasses} alt={alt} />
  ) : (
    <span className={logoClasses}>{text || alt}</span>
  );
  
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {logoContent}
      </a>
    );
  }
  
  if (to) {
    return (
      <Link to={to}>
        {logoContent}
      </Link>
    );
  }
  
  return logoContent;
};

export default Logo;