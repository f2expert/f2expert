import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';
import { type SocialMediaItem } from '../../molecules/SocialBar';
import { type ContactItem } from '../../molecules/ContactInfo';
import { type MenuItem } from '../../molecules/Navigation';
import { cn } from '../../../lib/utils';
import f2expertLogo from '../../../assets/f2expert.jpg';

export interface PublicProps {
  children?: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  // Header specific props
  socialLinks?: SocialMediaItem[];
  contactItems?: ContactItem[];
  showTopBar?: boolean;
  showSocial?: boolean;
  showContact?: boolean;
  logoSrc?: string;
  logoText?: string;
  menuItems?: MenuItem[];
}

export const Public: React.FC<PublicProps> = ({
  children,
  className = '',
  showHeader = true,
  showFooter = true,
  // Header props
  socialLinks,
  contactItems,
  showTopBar = true,
  showSocial = true,
  showContact = true,
  logoSrc = f2expertLogo,
  logoText = "F2Expert",
  menuItems,
}) => {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {showHeader && (
        <Header
          socialLinks={socialLinks}
          contactItems={contactItems}
          showTopBar={showTopBar}
          showSocial={showSocial}
          showContact={showContact}
          logoSrc={logoSrc}
          logoText={logoText}
          menuItems={menuItems}
        />
      )}

      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>

      {showFooter && (
        <Footer
          companyName="F2Export"
          showCompanyInfo={true}
          showNavigation={true}
          showQuickConnect={true}
          showTrainingCenter={true}
          showSocial={true}
          showCopyright={true}
          socialLinks={socialLinks}
          contactEmail="info@f2export.com"
          contactPhone="+1 (555) 123-4567"
        />
      )}
    </div>
  );
};

export default Public;