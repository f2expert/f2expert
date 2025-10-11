import React from 'react';
import { FooterLink } from '../../atoms/FooterLink';
import { Logo } from '../../atoms/Logo';
import { cn } from '../../../lib/utils';
import f2expertLogo from '../../../assets/f2expert.jpg';

export interface CompanyInfoProps {
  logoSrc?: string;
  logoAlt?: string;
  description?: string;
  email?: string;
  phone?: string;
  className?: string;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({
  logoSrc = f2expertLogo,
  logoAlt = "F2Expert Training Center",
  description = "F2Expert Training Center is a leading provider of professional training and development programs, offering a wide range of courses to help individuals and organizations achieve their goals.",
  email = "info@f2expert.com",
  phone = "+919990012545",
  className = ''
}) => {
  return (
    <div className={cn('sm:w-full md:w-[48%] lg:w-[23%]', className)}>
      {/* Company Logo */}
      <div className="mb-3">
        <Logo
          src={logoSrc}
          alt={logoAlt}
          size="md"
          className="h-12 w-auto"
        />
      </div>
      
      {/* Company Description */}
      <p className="text-sm text-gray-200 mb-4 leading-relaxed">
        {description}
      </p>
      
      {/* Contact Information */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white mb-3">Get In Touch</h3>
        
        <div className="space-y-2">
          <FooterLink 
            href={`mailto:${email}`} 
            className="block text-sm text-gray-200 hover:text-white"
            external
          >
            <i className="fa-solid fa-envelope mr-2"></i>
            {email}
          </FooterLink>
          
          <FooterLink 
            href={`tel:${phone}`} 
            className="block text-sm text-gray-200 hover:text-white"
            external
          >
            <i className="fa-solid fa-phone mr-2"></i>
            {phone}
          </FooterLink>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;