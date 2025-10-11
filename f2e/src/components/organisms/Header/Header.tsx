import React from 'react';
import { TopBar } from '../TopBar';
import { MainHeader } from '../MainHeader';
import { type SocialMediaItem } from '../../molecules/SocialBar';
import { type ContactItem } from '../../molecules/ContactInfo';
import { type MenuItem } from '../../molecules/Navigation';
import { cn } from '../../../lib/utils';
import f2expertLogo from '../../../assets/f2expert.jpg';

export interface HeaderProps {
  // TopBar props
  socialLinks?: SocialMediaItem[];
  contactItems?: ContactItem[];
  showTopBar?: boolean;
  showSocial?: boolean;
  showContact?: boolean;
  
  // MainHeader props
  logoSrc?: string;
  logoText?: string;
  logoHref?: string;
  logoTo?: string;
  menuItems?: MenuItem[];
  logoSize?: 'sm' | 'md' | 'lg';
  
  // General props
  className?: string;
  topBarClassName?: string;
  mainHeaderClassName?: string;
}



export const Header: React.FC<HeaderProps> = ({ 
  // TopBar props
  socialLinks,
  contactItems,
  showTopBar = true,
  showSocial = true,
  showContact = true,
  
  // MainHeader props
  logoSrc = f2expertLogo,
  logoText = "F2Expert",
  logoHref,
  logoTo = "/",
  menuItems,
  logoSize = 'lg',
  
  // General props
  className = '',
  topBarClassName = '',
  mainHeaderClassName = ''
}) => {
  return (
    <header className={cn('w-full', className)}>
      {/* Top Bar with Social Media and Contact Info */}
      {showTopBar && (
        <TopBar
          socialLinks={socialLinks}
          contactItems={contactItems}
          showSocial={showSocial}
          showContact={showContact}
          className={topBarClassName}
        />
      )}
      
      {/* Main Header with Logo and Navigation */}
      <MainHeader
        logoSrc={logoSrc}
        logoText={logoText}
        logoHref={logoHref}
        logoTo={logoTo}
        menuItems={menuItems}
        logoSize={logoSize}
        className={mainHeaderClassName}
      />
    </header>
  );
};

export default Header;