import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';

export interface FooterLinkProps {
  href?: string;
  to?: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  to,
  children,
  className = '',
  external = false
}) => {
  const linkClasses = cn(
    'text-white hover:text-gray-300 transition-colors duration-200',
    className
  );

  if (external || href) {
    return (
      <a
        href={href || to}
        className={linkClasses}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={linkClasses}>
        {children}
      </Link>
    );
  }

  return <span className={linkClasses}>{children}</span>;
};

export default FooterLink;