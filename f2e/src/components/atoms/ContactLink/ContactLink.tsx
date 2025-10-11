import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';

export interface ContactLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}

export const ContactLink: React.FC<ContactLinkProps> = ({
  href,
  children,
  className = '',
  icon
}) => {
  return (
    <Link
      to={href}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200',
        className
      )}
    >
      {icon && <i className={`fa-solid ${icon} text-xs`}></i>}
      {children}
    </Link>
  );
};

export default ContactLink;