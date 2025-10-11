import React from 'react';
import { SocialBar, type SocialMediaItem } from '../../molecules/SocialBar';
import { ContactInfo, type ContactItem } from '../../molecules/ContactInfo';
import { cn } from '../../../lib/utils';

export interface TopBarProps {
  socialLinks?: SocialMediaItem[];
  contactItems?: ContactItem[];
  className?: string;
  socialAlignment?: 'left' | 'center' | 'right';
  contactAlignment?: 'left' | 'center' | 'right';
  showSocial?: boolean;
  showContact?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  socialLinks,
  contactItems,
  className = '',
  socialAlignment = 'left',
  contactAlignment = 'right',
  showSocial = true,
  showContact = true
}) => {
  return (
    <div className={cn(
      'social bg-gray-50 border-b text-gray-700 px-5',
      className
    )}>
      <div className="mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* Social Icons */}
        {showSocial && (
          <SocialBar
            socialLinks={socialLinks}
            alignment={socialAlignment}
            className="sm:justify-start"
          />
        )}

        {/* Contact Info */}
        {showContact && (
          <ContactInfo
            contactItems={contactItems}
            alignment={contactAlignment}
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;