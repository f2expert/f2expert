import React from 'react';
import { ContactLink } from '../../atoms/ContactLink';
import { cn } from '../../../lib/utils';

export interface ContactItem {
  href: string;
  label: string;
  icon?: string;
  value: string;
}

export interface ContactInfoProps {
  contactItems?: ContactItem[];
  className?: string;
  direction?: 'horizontal' | 'vertical';
  alignment?: 'left' | 'center' | 'right';
}

const defaultContactItems: ContactItem[] = [
  { 
    href: "tel:+919990012545", 
    label: "Phone", 
    icon: "fa-phone",
    value: "CALL: +91 9990012545" 
  },
  { 
    href: "mailto:info@f2expert.com", 
    label: "Email", 
    icon: "fa-envelope",
    value: "EMAIL: info@f2expert.com" 
  },
];

export const ContactInfo: React.FC<ContactInfoProps> = ({
  contactItems = defaultContactItems,
  className = '',
  direction = 'horizontal',
  alignment = 'right'
}) => {
  const directionClasses = {
    horizontal: 'flex-col md:flex-row md:items-center md:gap-6',
    vertical: 'flex-col gap-2'
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div className={cn(
      'hidden md:flex',
      directionClasses[direction],
      alignmentClasses[alignment],
      'text-sm',
      className
    )}>
      {contactItems.map((contact, index) => (
        <ContactLink
          key={index}
          href={contact.href}
          icon={contact.icon}
        >
          {contact.value}
        </ContactLink>
      ))}
    </div>
  );
};

export default ContactInfo;