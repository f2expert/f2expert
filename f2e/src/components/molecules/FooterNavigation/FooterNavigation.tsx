import React from 'react';
import { FooterLink } from '../../atoms/FooterLink';
import { cn } from '../../../lib/utils';

export interface FooterNavItem {
  to?: string;
  href?: string;
  label: string;
  external?: boolean;
}

export interface FooterNavigationProps {
  title?: string;
  navItems?: FooterNavItem[];
  className?: string;
}

const defaultNavItems: FooterNavItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/courses", label: "Courses" },
  { to: "/trainings", label: "Trainings" },
  { to: "/tutorials", label: "Tutorials" },
];

export const FooterNavigation: React.FC<FooterNavigationProps> = ({
  title = "Company",
  navItems = defaultNavItems,
  className = ''
}) => {
  return (
    <div className={cn('', className)}>
      <h2 className="text-lg text-gray-300 py-2 mb-4 font-semibold">
        {title}
      </h2>
      
      <ul className="space-y-2">
        {navItems.map((item, index) => (
          <li key={index} className="py-1">
            <FooterLink
              to={item.to}
              href={item.href}
              external={item.external}
              className="text-sm text-gray-200 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNavigation;